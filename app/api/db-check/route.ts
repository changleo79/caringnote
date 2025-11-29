import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

// 데이터베이스 연결 상태 및 환경 변수 확인 API
export async function GET() {
  const checks = {
    timestamp: new Date().toISOString(),
    env: {
      DATABASE_URL: process.env.DATABASE_URL ? "설정됨 (***)" : "❌ 설정 안 됨",
      POSTGRES_PRISMA_URL: process.env.POSTGRES_PRISMA_URL ? "설정됨 (***)" : "설정 안 됨",
      POSTGRES_URL: process.env.POSTGRES_URL ? "설정됨 (***)" : "설정 안 됨",
      NODE_ENV: process.env.NODE_ENV || "설정 안 됨",
    },
    connection: {
      status: "확인 중...",
      error: null as string | null,
    },
    tables: {
      CareCenter: 0,
      User: 0,
    },
  }

  // 데이터베이스 연결 테스트
  try {
    await prisma.$connect()
    checks.connection.status = "✅ 연결 성공"
    
    // 테이블 데이터 확인
    try {
      const careCenterCount = await prisma.careCenter.count()
      checks.tables.CareCenter = careCenterCount
    } catch (e: any) {
      checks.tables.CareCenter = -1
      console.error("CareCenter 테이블 오류:", e.message)
    }

    try {
      const userCount = await prisma.user.count()
      checks.tables.User = userCount
    } catch (e: any) {
      checks.tables.User = -1
      console.error("User 테이블 오류:", e.message)
    }

    await prisma.$disconnect()
  } catch (error: any) {
    checks.connection.status = "❌ 연결 실패"
    checks.connection.error = error.message || String(error)
    
    if (error.code) {
      checks.connection.error += ` (코드: ${error.code})`
    }
  }

  // 결과 반환
  return NextResponse.json(checks, {
    status: checks.connection.status.includes("성공") ? 200 : 503,
  })
}

