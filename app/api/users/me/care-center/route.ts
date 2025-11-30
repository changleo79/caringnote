import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

// 현재 사용자의 요양원 정보 조회
export async function GET() {
  try {
    const session = await getServerSession(authOptions)

    if (!session || !session.user.id) {
      return NextResponse.json(
        { error: "인증이 필요합니다." },
        { status: 401 }
      )
    }

    const userId = session.user.id

    // 사용자 정보 조회
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        role: true,
        careCenterId: true,
      },
    })

    if (!user) {
      return NextResponse.json(
        { error: "사용자를 찾을 수 없습니다." },
        { status: 404 }
      )
    }

    let careCenterId: string | null = null

    // ADMIN/CAREGIVER: 직접 연결된 요양원
    if (user.role === "ADMIN" || user.role === "CAREGIVER") {
      careCenterId = user.careCenterId
    }

    // FAMILY: 연결된 입소자의 요양원
    if (user.role === "FAMILY") {
      const residentFamily = await prisma.residentFamily.findFirst({
        where: {
          userId: userId,
          isApproved: true,
        },
        include: {
          resident: {
            select: {
              careCenterId: true,
            },
          },
        },
        orderBy: {
          createdAt: "desc",
        },
      })

      if (residentFamily) {
        careCenterId = residentFamily.resident.careCenterId
      }
    }

    // 요양원 ID가 없으면 null 반환 (오류 아님)
    if (!careCenterId) {
      return NextResponse.json({
        careCenter: null,
        careCenterId: null,
      })
    }

    // 요양원 정보 조회
    const careCenter = await prisma.careCenter.findUnique({
      where: { id: careCenterId },
      select: {
        id: true,
        name: true,
        address: true,
        phone: true,
        email: true,
        description: true,
        logoUrl: true,
        createdAt: true,
        updatedAt: true,
      },
    })

    if (!careCenter) {
      return NextResponse.json({
        careCenter: null,
        careCenterId: null,
      })
    }

    return NextResponse.json({
      careCenter,
      careCenterId,
    })
  } catch (error: any) {
    console.error("Error fetching user care center:", error)
    return NextResponse.json(
      { error: "요양원 정보를 불러오는데 실패했습니다." },
      { status: 500 }
    )
  }
}

