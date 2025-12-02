import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

// 알림 목록 조회
export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session) {
      return NextResponse.json(
        { error: "인증이 필요합니다." },
        { status: 401 }
      )
    }

    const searchParams = req.nextUrl.searchParams
    const isRead = searchParams.get("isRead")
    const limit = parseInt(searchParams.get("limit") || "50")
    const offset = parseInt(searchParams.get("offset") || "0")

    const where: any = {
      userId: session.user.id!,
    }

    if (isRead !== null && isRead !== undefined) {
      where.isRead = isRead === "true"
    }

    const [notifications, totalCount] = await Promise.all([
      prisma.notification.findMany({
        where,
        orderBy: {
          createdAt: "desc",
        },
        take: limit,
        skip: offset,
      }),
      prisma.notification.count({ where }),
    ])

    return NextResponse.json({
      notifications,
      totalCount,
      unreadCount: await prisma.notification.count({
        where: {
          userId: session.user.id!,
          isRead: false,
        },
      }),
    })
  } catch (error: any) {
    console.error("Error fetching notifications:", error)
    return NextResponse.json(
      { error: "알림을 불러오는데 실패했습니다." },
      { status: 500 }
    )
  }
}

