import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { canAccessResident, requireSession } from "@/lib/access"

export const dynamic = "force-dynamic"

export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const auth = await requireSession()
    if (auth.error || !auth.user) {
      return NextResponse.json({ error: auth.error }, { status: auth.status })
    }

    const report = await prisma.dailyReport.findUnique({ where: { id: params.id } })
    if (!report || report.isDraft) {
      return NextResponse.json({ error: "알림장 없음" }, { status: 404 })
    }

    const access = await canAccessResident(auth.user, report.residentId)
    if (!access.ok) {
      return NextResponse.json({ error: access.reason }, { status: 403 })
    }

    const { type, note } = await req.json()
    const reactionType = type === "thanks" ? "thanks" : type === "voice" ? "voice" : "heart"

    const reaction = await prisma.reportReaction.upsert({
      where: {
        reportId_userId_type: {
          reportId: params.id,
          userId: auth.user.id,
          type: reactionType,
        },
      },
      create: {
        reportId: params.id,
        userId: auth.user.id,
        type: reactionType,
        note: note || null,
      },
      update: { note: note || null },
    })

    return NextResponse.json(reaction, { status: 201 })
  } catch (error) {
    console.error("react", error)
    return NextResponse.json({ error: "반응 실패" }, { status: 500 })
  }
}
