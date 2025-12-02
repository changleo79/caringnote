import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

// 알림 읽음 처리
export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> | { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)

    if (!session) {
      return NextResponse.json(
        { error: "인증이 필요합니다." },
        { status: 401 }
      )
    }

    const resolvedParams = await Promise.resolve(params)
    const body = await req.json()
    const { isRead } = body

    // 알림이 해당 사용자의 것인지 확인
    const notification = await prisma.notification.findFirst({
      where: {
        id: resolvedParams.id,
        userId: session.user.id!,
      },
    })

    if (!notification) {
      return NextResponse.json(
        { error: "알림을 찾을 수 없습니다." },
        { status: 404 }
      )
    }

    const updated = await prisma.notification.update({
      where: { id: resolvedParams.id },
      data: { isRead: isRead ?? true },
    })

    return NextResponse.json(updated)
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
  { params }: { params: Promise<{ id: string }> | { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)

    if (!session) {
      return NextResponse.json(
        { error: "인증이 필요합니다." },
        { status: 401 }
      )
    }

    const resolvedParams = await Promise.resolve(params)

    // 알림이 해당 사용자의 것인지 확인
    const notification = await prisma.notification.findFirst({
      where: {
        id: resolvedParams.id,
        userId: session.user.id!,
      },
    })

    if (!notification) {
      return NextResponse.json(
        { error: "알림을 찾을 수 없습니다." },
        { status: 404 }
      )
    }

    await prisma.notification.delete({
      where: { id: resolvedParams.id },
    })

    return NextResponse.json({ message: "알림이 삭제되었습니다." })
  } catch (error: any) {
    console.error("Error deleting notification:", error)
    return NextResponse.json(
      { error: "알림 삭제에 실패했습니다." },
      { status: 500 }
    )
  }
}

