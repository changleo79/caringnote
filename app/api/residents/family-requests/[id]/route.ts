import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { createNotification } from "@/lib/notifications"

// 가족-입소자 연결 요청 승인/거부
export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session) {
      return NextResponse.json(
        { error: "인증이 필요합니다." },
        { status: 401 }
      )
    }

    // CAREGIVER 또는 ADMIN만 승인 가능
    if (session.user.role !== "CAREGIVER" && session.user.role !== "ADMIN") {
      return NextResponse.json(
        { error: "연결 요청 승인은 요양원 직원만 가능합니다." },
        { status: 403 }
      )
    }

    const body = await req.json()
    const { action } = body // "approve" or "reject"

    if (action !== "approve" && action !== "reject") {
      return NextResponse.json(
        { error: "올바른 action을 지정해주세요 (approve/reject)." },
        { status: 400 }
      )
    }

    // 연결 요청 조회
    const request = await prisma.residentFamily.findUnique({
      where: { id: params.id },
      include: {
        resident: {
          select: {
            id: true,
            name: true,
            careCenterId: true,
          },
        },
      },
    })

    if (!request) {
      return NextResponse.json(
        { error: "연결 요청을 찾을 수 없습니다." },
        { status: 404 }
      )
    }

    // 권한 확인 (소속 요양원의 입소자인지)
    if (session.user.careCenterId !== request.resident.careCenterId) {
      return NextResponse.json(
        { error: "접근 권한이 없습니다." },
        { status: 403 }
      )
    }

    if (action === "approve") {
      // 승인
      const updated = await prisma.residentFamily.update({
        where: { id: params.id },
        data: {
          isApproved: true,
          approvedById: session.user.id!,
          approvedAt: new Date(),
        },
        include: {
          resident: {
            select: {
              id: true,
              name: true,
            },
          },
          user: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
        },
      })

      // 가족 회원에게 승인 알림
      try {
        await createNotification({
          userId: updated.userId,
          type: "FamilyApproved",
          title: `${updated.resident.name}님과의 연결이 승인되었습니다`,
          content: `${updated.resident.name}님의 정보를 확인할 수 있습니다.`,
          relatedId: updated.residentId,
          relatedType: "Resident",
        })
      } catch (error) {
        console.error("Error creating notification:", error)
      }

      return NextResponse.json({
        message: "연결 요청이 승인되었습니다.",
        residentFamily: updated,
      })
    } else {
      // 거부 (삭제)
      await prisma.residentFamily.delete({
        where: { id: params.id },
      })

      return NextResponse.json({
        message: "연결 요청이 거부되었습니다.",
      })
    }
  } catch (error: any) {
    console.error("Error updating family request:", error)
    return NextResponse.json(
      { error: "연결 요청 처리에 실패했습니다." },
      { status: 500 }
    )
  }
}

