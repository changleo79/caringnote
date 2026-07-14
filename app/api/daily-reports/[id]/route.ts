import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { canAccessResident, requireSession } from "@/lib/access"

export const dynamic = "force-dynamic"

export async function GET(_req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const auth = await requireSession()
    if (auth.error || !auth.user) {
      return NextResponse.json({ error: auth.error }, { status: auth.status })
    }

    const report = await prisma.dailyReport.findUnique({
      where: { id: params.id },
      include: {
        resident: true,
        author: { select: { id: true, name: true } },
        reactions: { include: { user: { select: { id: true, name: true } } } },
      },
    })
    if (!report || report.isDraft) {
      return NextResponse.json({ error: "알림장을 찾을 수 없습니다." }, { status: 404 })
    }

    const access = await canAccessResident(auth.user, report.residentId)
    if (!access.ok) {
      return NextResponse.json({ error: access.reason }, { status: 403 })
    }

    // 가족이 처음 읽으면 readAt 기록
    if (auth.user.role === "FAMILY" && !report.readAt) {
      await prisma.dailyReport.update({
        where: { id: report.id },
        data: { readAt: new Date() },
      })
      report.readAt = new Date()
    }

    return NextResponse.json(report)
  } catch (error) {
    console.error("GET daily-reports/[id]", error)
    return NextResponse.json({ error: "조회 실패" }, { status: 500 })
  }
}
