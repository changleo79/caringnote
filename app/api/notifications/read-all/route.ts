import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

// 모든 알림 읽음 처리
export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session) {
      return NextResponse.json(
        { error: "인증이 필요합니다." },
        { status: 401 }
      )
    }

    const result = await prisma.notification.updateMany({
      where: {
        userId: session.user.id!,
        isRead: false,
      },
      data: {
        isRead: true,
      },
    })

    return NextResponse.json({
      message: "모든 알림이 읽음 처리되었습니다.",
      count: result.count,
    })
  } catch (error: any) {
    console.error("Error marking all notifications as read:", error)
    return NextResponse.json(
      { error: "알림 읽음 처리에 실패했습니다." },
      { status: 500 }
    )
  }
}

