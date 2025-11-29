import { NextResponse } from "next/server"
import { exec } from "child_process"
import { promisify } from "util"

const execAsync = promisify(exec)

// 프로덕션에서는 보안을 위해 비활성화
export async function POST(req: Request) {
  // 보안: 프로덕션에서는 비활성화 (필요시 환경 변수로 제어)
  if (process.env.NODE_ENV === 'production' && !process.env.ALLOW_MIGRATE) {
    return NextResponse.json(
      { error: "프로덕션 환경에서는 마이그레이션을 직접 실행할 수 없습니다. 로컬에서 실행하세요." },
      { status: 403 }
    )
  }

  try {
    // Prisma db push 실행 (마이그레이션 없이 테이블 생성)
    const { stdout, stderr } = await execAsync('npx prisma db push --skip-generate --accept-data-loss')

    return NextResponse.json({
      success: true,
      message: "테이블 생성 완료",
      stdout,
      stderr: stderr || null,
    })
  } catch (error: any) {
    console.error("Migration error:", error)
    return NextResponse.json(
      {
        error: "마이그레이션 실행 중 오류가 발생했습니다.",
        details: error.message,
        stdout: error.stdout,
        stderr: error.stderr,
      },
      { status: 500 }
    )
  }
}

// GET으로도 실행 가능 (간단 확인용)
export async function GET() {
  return NextResponse.json({
    message: "마이그레이션 API. POST 요청으로 실행하세요.",
    note: "프로덕션에서는 ALLOW_MIGRATE 환경 변수가 필요합니다."
  })
}

