import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { requireStaff } from "@/lib/access"

export const dynamic = "force-dynamic"

/** 공단평가용 월간 소통 리포트 JSON (PDF 대체 데이터) */
export async function GET(req: NextRequest) {
  try {
    const auth = await requireStaff()
    if (auth.error || !auth.user) {
      return NextResponse.json({ error: auth.error }, { status: auth.status })
    }

    const month = new URL(req.url).searchParams.get("month") // YYYY-MM
    const now = month ? new Date(`${month}-01`) : new Date()
    const start = new Date(now.getFullYear(), now.getMonth(), 1)
    const end = new Date(now.getFullYear(), now.getMonth() + 1, 1)
    const careCenterId = auth.user.careCenterId!

    const [reports, announcements, menus, residents, albums] = await Promise.all([
      prisma.dailyReport.findMany({
        where: {
          careCenterId,
          isDraft: false,
          publishedAt: { gte: start, lt: end },
        },
        select: { id: true, readAt: true, residentId: true, publishedAt: true },
      }),
      prisma.announcement.count({
        where: { careCenterId, createdAt: { gte: start, lt: end } },
      }),
      prisma.menuPlan.count({
        where: { careCenterId, date: { gte: start, lt: end } },
      }),
      prisma.resident.count({ where: { careCenterId } }),
      prisma.post.count({
        where: {
          careCenterId,
          category: { in: ["Daily", "Album", "Event"] },
          createdAt: { gte: start, lt: end },
        },
      }),
    ])

    const sent = reports.length
    const read = reports.filter((r) => r.readAt).length
    const uniqueResidents = new Set(reports.map((r) => r.residentId)).size

    const center = await prisma.careCenter.findUnique({
      where: { id: careCenterId },
      select: { name: true },
    })

    return NextResponse.json({
      careCenterName: center?.name,
      period: { start, end },
      summary: {
        dailyReportsSent: sent,
        dailyReportsRead: read,
        readRate: sent ? Math.round((read / sent) * 100) : 0,
        residentsCovered: uniqueResidents,
        totalResidents: residents,
        coverageRate: residents ? Math.round((uniqueResidents / residents) * 100) : 0,
        announcements,
        menuDays: menus,
        albumPosts: albums,
      },
      generatedAt: new Date().toISOString(),
      note: "건강보험공단 평가 ‘수급자 가족과의 소통’ 증빙용 월간 리포트",
    })
  } catch (error) {
    console.error("comm report", error)
    return NextResponse.json({ error: "리포트 생성 실패" }, { status: 500 })
  }
}
