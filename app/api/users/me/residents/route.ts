import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

// 내가 연결된 입소자 목록 조회
export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session) {
      return NextResponse.json(
        { error: "인증이 필요합니다." },
        { status: 401 }
      )
    }

    // FAMILY만 사용 가능
    if (session.user.role !== "FAMILY") {
      return NextResponse.json(
        { error: "가족 회원만 사용할 수 있습니다." },
        { status: 403 }
      )
    }

    // 연결된 입소자 목록 조회
    const residentFamilies = await prisma.residentFamily.findMany({
      where: {
        userId: session.user.id!,
        isApproved: true,
      },
      include: {
        resident: {
          include: {
            careCenter: {
              select: {
                id: true,
                name: true,
                address: true,
              },
            },
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    })

    const residents = residentFamilies.map(rf => ({
      ...rf.resident,
      relationship: rf.relationship,
      connectedAt: rf.createdAt,
    }))

    return NextResponse.json(residents)
  } catch (error: any) {
    console.error("Error fetching user residents:", error)
    return NextResponse.json(
      { error: "연결된 입소자 목록을 불러오는데 실패했습니다." },
      { status: 500 }
    )
  }
}

