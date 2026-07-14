import { NextRequest, NextResponse } from "next/server"
import { randomBytes } from "crypto"
import { prisma } from "@/lib/prisma"
import {
  getApprovedResidentIds,
  isStaff,
  requireSession,
  requireStaff,
  writeAuditLog,
} from "@/lib/access"
import { buildMagicUrl, sendDailyReportAlimtalk } from "@/lib/kakao"

export const dynamic = "force-dynamic"

export async function GET(req: NextRequest) {
  try {
    const auth = await requireSession()
    if (auth.error || !auth.user) {
      return NextResponse.json({ error: auth.error }, { status: auth.status })
    }

    const { searchParams } = new URL(req.url)
    const residentId = searchParams.get("residentId")
    const unpublished = searchParams.get("missing") === "1"
    const date = searchParams.get("date")

    if (isStaff(auth.user.role)) {
      if (!auth.user.careCenterId) {
        return NextResponse.json({ error: "요양원 필요" }, { status: 400 })
      }

      if (unpublished && date) {
        const day = new Date(date)
        const next = new Date(day)
        next.setDate(next.getDate() + 1)
        const written = await prisma.dailyReport.findMany({
          where: {
            careCenterId: auth.user.careCenterId,
            isDraft: false,
            publishedAt: { gte: day, lt: next },
          },
          select: { residentId: true },
        })
        const writtenIds = new Set(written.map((w) => w.residentId))
        const residents = await prisma.resident.findMany({
          where: { careCenterId: auth.user.careCenterId },
          select: { id: true, name: true, roomNumber: true, photoUrl: true },
          orderBy: { name: "asc" },
        })
        return NextResponse.json(residents.filter((r) => !writtenIds.has(r.id)))
      }

      const reports = await prisma.dailyReport.findMany({
        where: {
          careCenterId: auth.user.careCenterId,
          ...(residentId ? { residentId } : {}),
          isDraft: false,
        },
        include: {
          resident: { select: { id: true, name: true, photoUrl: true, roomNumber: true } },
          author: { select: { id: true, name: true } },
          reactions: true,
        },
        orderBy: { publishedAt: "desc" },
        take: 50,
      })
      return NextResponse.json(reports)
    }

    const ids = await getApprovedResidentIds(auth.user.id)
    const reports = await prisma.dailyReport.findMany({
      where: {
        residentId: residentId ? residentId : { in: ids },
        isDraft: false,
        publishedAt: { not: null },
      },
      include: {
        resident: { select: { id: true, name: true, photoUrl: true } },
        author: { select: { id: true, name: true } },
        reactions: true,
      },
      orderBy: { publishedAt: "desc" },
      take: 50,
    })
    return NextResponse.json(reports)
  } catch (error) {
    console.error("GET daily-reports", error)
    return NextResponse.json({ error: "조회 실패" }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const auth = await requireStaff()
    if (auth.error || !auth.user) {
      return NextResponse.json({ error: auth.error }, { status: auth.status })
    }

    const body = await req.json()
    const { residentId, content, images, moodChip, chips, isDraft } = body
    if (!residentId) {
      return NextResponse.json({ error: "어르신을 선택하세요." }, { status: 400 })
    }

    const resident = await prisma.resident.findFirst({
      where: { id: residentId, careCenterId: auth.user.careCenterId! },
    })
    if (!resident) {
      return NextResponse.json({ error: "어르신을 찾을 수 없습니다." }, { status: 404 })
    }

    const draft = Boolean(isDraft)
    const magicToken = draft ? null : randomBytes(24).toString("hex")

    const report = await prisma.dailyReport.create({
      data: {
        residentId,
        careCenterId: auth.user.careCenterId!,
        authorId: auth.user.id,
        content: content || null,
        images: images ? JSON.stringify(images) : null,
        moodChip: moodChip || "OK",
        chips: chips ? JSON.stringify(chips) : null,
        isDraft: draft,
        publishedAt: draft ? null : new Date(),
        magicToken,
      },
      include: {
        resident: { select: { id: true, name: true } },
      },
    })

    if (!draft) {
      await prisma.resident.update({
        where: { id: residentId },
        data: { statusChip: moodChip || "OK" },
      })

      const families = await prisma.residentFamily.findMany({
        where: { residentId, isApproved: true },
        include: { user: { select: { id: true, phone: true } } },
      })
      if (families.length) {
        await prisma.notification.createMany({
          data: families.map((f) => ({
            userId: f.userId,
            type: "DailyReport",
            title: `${resident.name} 어르신의 오늘 소식`,
            content: content?.slice(0, 80) || "오늘의 알림장이 도착했습니다.",
            relatedId: report.id,
            relatedType: "DailyReport",
          })),
        })

        if (magicToken) {
          const magicUrl = buildMagicUrl(magicToken)
          for (const f of families) {
            await sendDailyReportAlimtalk({
              toPhone: f.user.phone,
              residentName: resident.name,
              summary: content?.slice(0, 60) || "오늘의 알림장",
              magicUrl,
            })
          }
          await prisma.dailyReport.update({
            where: { id: report.id },
            data: { kakaoSentAt: new Date() },
          })
        }
      }
    }

    await writeAuditLog({
      action: draft ? "dailyReport.draft" : "dailyReport.publish",
      userId: auth.user.id,
      careCenterId: auth.user.careCenterId,
      entityType: "DailyReport",
      entityId: report.id,
    })

    return NextResponse.json(report, { status: 201 })
  } catch (error) {
    console.error("POST daily-reports", error)
    return NextResponse.json({ error: "작성 실패" }, { status: 500 })
  }
}
