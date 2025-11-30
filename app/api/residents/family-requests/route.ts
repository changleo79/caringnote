import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

// 가족-입소자 연결 요청 목록 조회
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

    const careCenterId = session.user.careCenterId

    // CAREGIVER는 승인 대기 중인 요청 목록 조회
    if (session.user.role === "CAREGIVER" || session.user.role === "ADMIN") {
      const requests = await prisma.residentFamily.findMany({
        where: {
          isApproved: false,
          resident: {
            careCenterId: careCenterId,
          },
        },
        include: {
          resident: {
            select: {
              id: true,
              name: true,
              roomNumber: true,
            },
          },
          user: {
            select: {
              id: true,
              name: true,
              email: true,
              phone: true,
            },
          },
        },
        orderBy: {
          createdAt: "desc",
        },
      })

      return NextResponse.json(requests)
    }

    // FAMILY는 자신의 요청 목록 조회
    if (session.user.role === "FAMILY") {
      const requests = await prisma.residentFamily.findMany({
        where: {
          userId: session.user.id!,
        },
        include: {
          resident: {
            select: {
              id: true,
              name: true,
              roomNumber: true,
              careCenter: {
                select: {
                  id: true,
                  name: true,
                },
              },
            },
          },
        },
        orderBy: {
          createdAt: "desc",
        },
      })

      return NextResponse.json(requests)
    }

    return NextResponse.json([])
  } catch (error: any) {
    console.error("Error fetching family requests:", error)
    return NextResponse.json(
      { error: "연결 요청 목록을 불러오는데 실패했습니다." },
      { status: 500 }
    )
  }
}

