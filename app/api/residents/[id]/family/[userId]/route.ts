import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

// 가족-입소자 연결 해제
export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string; userId: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session) {
      return NextResponse.json(
        { error: "인증이 필요합니다." },
        { status: 401 }
      )
    }

    // 본인이거나 CAREGIVER/ADMIN만 연결 해제 가능
    const isOwner = session.user.id === params.userId
    const isCaregiver = session.user.role === "CAREGIVER" || session.user.role === "ADMIN"

    if (!isOwner && !isCaregiver) {
      return NextResponse.json(
        { error: "연결 해제 권한이 없습니다." },
        { status: 403 }
      )
    }

    // 연결 조회 및 권한 확인
    const connection = await prisma.residentFamily.findFirst({
      where: {
        residentId: params.id,
        userId: params.userId,
      },
      include: {
        resident: {
          select: {
            careCenterId: true,
          },
        },
      },
    })

    if (!connection) {
      return NextResponse.json(
        { error: "연결을 찾을 수 없습니다." },
        { status: 404 }
      )
    }

    // CAREGIVER는 소속 요양원의 입소자만 해제 가능
    if (isCaregiver && session.user.careCenterId !== connection.resident.careCenterId) {
      return NextResponse.json(
        { error: "접근 권한이 없습니다." },
        { status: 403 }
      )
    }

    // 연결 해제
    await prisma.residentFamily.delete({
      where: {
        id: connection.id,
      },
    })

    return NextResponse.json({
      message: "연결이 해제되었습니다.",
    })
  } catch (error: any) {
    console.error("Error deleting family connection:", error)
    return NextResponse.json(
      { error: "연결 해제에 실패했습니다." },
      { status: 500 }
    )
  }
}

