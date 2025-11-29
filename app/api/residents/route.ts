import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

// 입소자 목록 조회
export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session) {
      return NextResponse.json(
        { error: "인증이 필요합니다." },
        { status: 401 }
      )
    }

    if (!session.user.careCenterId) {
      return NextResponse.json(
        { error: "요양원 정보가 필요합니다." },
        { status: 400 }
      )
    }

    const residents = await prisma.resident.findMany({
      where: {
        careCenterId: session.user.careCenterId,
      },
      select: {
        id: true,
        name: true,
        roomNumber: true,
        photoUrl: true,
      },
      orderBy: {
        name: "asc",
      },
    })

    return NextResponse.json(residents)
  } catch (error: any) {
    console.error("Error fetching residents:", error)
    return NextResponse.json(
      { error: "입소자 목록을 불러오는데 실패했습니다." },
      { status: 500 }
    )
  }
}

