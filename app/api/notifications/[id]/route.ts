import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

// 알림 읽음 처리
export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session || !session.user.id) {
      return NextResponse.json(
        { error: "인증이 필요합니다." },
        { status: 401 }
      )
    }

    const body = await req.json()
    const { isRead } = body

    // 알림 존재 확인 및 권한 확인
    const notification = await prisma.notification.findUnique({
      where: { id: params.id },
    })

    if (!notification) {
      return NextResponse.json(
        { error: "알림을 찾을 수 없습니다." },
        { status: 404 }
      )
    }

    if (notification.userId !== session.user.id) {
      return NextResponse.json(
        { error: "접근 권한이 없습니다." },
        { status: 403 }
      )
    }

    // 알림 읽음 처리
    const updated = await prisma.notification.update({
      where: { id: params.id },
      data: {
        isRead: isRead !== undefined ? isRead : true,
      },
    })

    return NextResponse.json({
      message: "알림이 업데이트되었습니다.",
      notification: updated,
    })
  } catch (error: any) {
    console.error("Error updating notification:", error)
    return NextResponse.json(
      { error: "알림 업데이트에 실패했습니다." },
      { status: 500 }
    )
  }
}

// 알림 삭제
export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session || !session.user.id) {
      return NextResponse.json(
        { error: "인증이 필요합니다." },
        { status: 401 }
      )
    }

    // 알림 존재 확인 및 권한 확인
    const notification = await prisma.notification.findUnique({
      where: { id: params.id },
    })

    if (!notification) {
      return NextResponse.json(
        { error: "알림을 찾을 수 없습니다." },
        { status: 404 }
      )
    }

    if (notification.userId !== session.user.id) {
      return NextResponse.json(
        { error: "접근 권한이 없습니다." },
        { status: 403 }
      )
    }

    await prisma.notification.delete({
      where: { id: params.id },
    })

    return NextResponse.json({
      message: "알림이 삭제되었습니다.",
    })
  } catch (error: any) {
    console.error("Error deleting notification:", error)
    return NextResponse.json(
      { error: "알림 삭제에 실패했습니다." },
      { status: 500 }
    )
  }
}

