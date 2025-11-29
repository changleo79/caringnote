import NextAuth from "next-auth"
import { authOptions } from "@/lib/auth"
import { NextResponse } from "next/server"

// NextAuth 핸들러 생성
const handler = NextAuth(authOptions)

// 에러 핸들링 강화
export async function GET(req: Request) {
  try {
    return await handler(req)
  } catch (error: any) {
    console.error("❌ NextAuth GET 오류:", error)
    
    // 환경 변수 오류 체크
    if (error.message?.includes('secret') || error.message?.includes('NEXTAUTH_SECRET')) {
      return NextResponse.json(
        { 
          error: "서버 구성 오류",
          message: "NEXTAUTH_SECRET 환경 변수가 설정되지 않았습니다.",
          hint: "Vercel Settings → Environment Variables에서 NEXTAUTH_SECRET을 설정하세요.",
          helpUrl: "https://generate-secret.vercel.app/32"
        },
        { status: 500 }
      )
    }
    
    return NextResponse.json(
      { error: "인증 오류가 발생했습니다.", details: error.message },
      { status: 500 }
    )
  }
}

export async function POST(req: Request) {
  try {
    return await handler(req)
  } catch (error: any) {
    console.error("❌ NextAuth POST 오류:", error)
    
    // 환경 변수 오류 체크
    if (error.message?.includes('secret') || error.message?.includes('NEXTAUTH_SECRET')) {
      return NextResponse.json(
        { 
          error: "서버 구성 오류",
          message: "NEXTAUTH_SECRET 환경 변수가 설정되지 않았습니다.",
          hint: "Vercel Settings → Environment Variables에서 NEXTAUTH_SECRET을 설정하세요.",
          helpUrl: "https://generate-secret.vercel.app/32"
        },
        { status: 500 }
      )
    }
    
    return NextResponse.json(
      { error: "인증 오류가 발생했습니다.", details: error.message },
      { status: 500 }
    )
  }
}
