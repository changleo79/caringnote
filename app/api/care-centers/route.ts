import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET() {
  try {
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

    // 요양원이 없으면 빈 배열 반환 (오류 아님)
    return NextResponse.json(careCenters || [])
  } catch (error: any) {
    console.error("Error fetching care centers:", error)
    
    // 데이터베이스 연결 오류인 경우
    if (error.code === 'P1001' || error.message?.includes('connect')) {
      return NextResponse.json(
        { 
          error: "데이터베이스 연결 오류가 발생했습니다.",
          careCenters: [] 
        },
        { status: 500 }
      )
    }

    // 오류 발생 시 빈 배열 반환 (페이지는 정상 작동)
    return NextResponse.json([])
  }
}
