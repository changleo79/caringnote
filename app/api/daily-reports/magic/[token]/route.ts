import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export const dynamic = "force-dynamic"

/** 비로그인 매직링크 열람 */
export async function GET(_req: Request, { params }: { params: { token: string } }) {
  try {
    const report = await prisma.dailyReport.findUnique({
      where: { magicToken: params.token },
      include: {
        resident: { select: { id: true, name: true, photoUrl: true, statusChip: true } },
        author: { select: { name: true } },
        careCenter: { select: { name: true } },
      },
    })

    if (!report || report.isDraft || !report.publishedAt) {
      return NextResponse.json({ error: "유효하지 않은 링크입니다." }, { status: 404 })
    }

    if (!report.readAt) {
      await prisma.dailyReport.update({
        where: { id: report.id },
        data: { readAt: new Date() },
      })
    }

    return NextResponse.json({
      id: report.id,
      content: report.content,
      images: report.images,
      moodChip: report.moodChip,
      chips: report.chips,
      publishedAt: report.publishedAt,
      resident: report.resident,
      authorName: report.author.name,
      careCenterName: report.careCenter.name,
    })
  } catch (error) {
    console.error("magic link", error)
    return NextResponse.json({ error: "열람 실패" }, { status: 500 })
  }
}
