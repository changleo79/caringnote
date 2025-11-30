import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

// 알림 목록 조회
export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session || !session.user.id) {
      return NextResponse.json(
        { error: "인증이 필요합니다." },
        { status: 401 }
      )
    }

    const searchParams = req.nextUrl.searchParams
    const isRead = searchParams.get("isRead") // "true" or "false" or null (전체)
    const limit = parseInt(searchParams.get("limit") || "50")

    const whereClause: any = {
      userId: session.user.id,
    }

    if (isRead === "true" || isRead === "false") {
      whereClause.isRead = isRead === "true"
    }

    const notifications = await prisma.notification.findMany({
      where: whereClause,
      orderBy: {
        createdAt: "desc",
      },
      take: limit,
    })

    // 읽지 않은 알림 개수
    const unreadCount = await prisma.notification.count({
      where: {
        userId: session.user.id,
        isRead: false,
      },
    })

    return NextResponse.json({
      notifications,
      unreadCount,
    })
  } catch (error: any) {
    console.error("Error fetching notifications:", error)
    return NextResponse.json(
      { error: "알림 목록을 불러오는데 실패했습니다." },
      { status: 500 }
    )
  }
}

