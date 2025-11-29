import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET() {
  try {
    console.log("🏥 요양원 목록 조회 시작...")
    
    const careCenters = await prisma.careCenter.findMany({
      select: {
        id: true,
        name: true,
        address: true,
        phone: true,
      },
      orderBy: {
        name: "asc",
      },
    })

    console.log(`✅ 요양원 목록 조회 완료: ${careCenters.length}개`)

    // 요양원이 없으면 빈 배열 반환 (오류 아님)
    return NextResponse.json(careCenters || [])
  } catch (error: any) {
    console.error("❌ Error fetching care centers:", error)
    console.error("Error code:", error.code)
    console.error("Error message:", error.message)
    
    // 데이터베이스 연결 오류인 경우
    if (error.code === 'P1001' || error.code === 'P1000' || error.message?.includes('connect')) {
      return NextResponse.json(
        { 
          error: "데이터베이스 연결 오류가 발생했습니다.",
          careCenters: [],
          code: error.code
        },
        { status: 500 }
      )
    }

    // Prisma 오류인 경우
    if (error.code?.startsWith('P')) {
      return NextResponse.json(
        { 
          error: "데이터베이스 오류가 발생했습니다.",
          careCenters: [],
          code: error.code,
          message: process.env.NODE_ENV === 'development' ? error.message : undefined
        },
        { status: 500 }
      )
    }

    // 오류 발생 시 빈 배열 반환 (페이지는 정상 작동)
    return NextResponse.json(
      { 
        error: "요양원 목록을 불러오는 중 오류가 발생했습니다.",
        careCenters: [],
        message: process.env.NODE_ENV === 'development' ? error.message : undefined
      },
      { status: 500 }
    )
  }
}
