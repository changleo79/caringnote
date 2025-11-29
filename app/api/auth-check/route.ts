import { NextResponse } from "next/server"

// NextAuth 설정 상태 확인 API
export async function GET() {
  const status = {
    timestamp: new Date().toISOString(),
    nextAuth: {
      secret: process.env.NEXTAUTH_SECRET ? "✅ 설정됨" : "❌ 설정 안 됨",
      url: process.env.NEXTAUTH_URL || "❌ 설정 안 됨",
      status: "확인 중...",
    },
    database: {
      url: process.env.DATABASE_URL ? "✅ 설정됨" : "❌ 설정 안 됨",
    },
    recommendation: [] as string[],
  }

  // 권장사항 추가
  if (!process.env.NEXTAUTH_SECRET) {
    status.recommendation.push("NEXTAUTH_SECRET 환경 변수를 설정하세요. https://generate-secret.vercel.app/32")
  }

  if (!process.env.NEXTAUTH_URL) {
    status.recommendation.push("NEXTAUTH_URL 환경 변수를 설정하세요. https://caringnote.vercel.app")
  }

  if (!process.env.DATABASE_URL) {
    status.recommendation.push("DATABASE_URL 환경 변수를 설정하세요.")
  }

  // NextAuth 상태 판단
  if (process.env.NEXTAUTH_SECRET && process.env.NEXTAUTH_URL) {
    status.nextAuth.status = "✅ 정상"
  } else {
    status.nextAuth.status = "❌ 설정 필요"
  }

  return NextResponse.json(status, {
    status: status.nextAuth.status === "✅ 정상" ? 200 : 503,
  })
}

