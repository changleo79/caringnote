import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { canAccessResident, requireSession } from "@/lib/access"

export const dynamic = "force-dynamic"

/** Care Timeline: 알림장·의료·식단·면회 통합 */
export async function GET(_req: Request, { params }: { params: { residentId: string } }) {
  try {
    const auth = await requireSession()
    if (auth.error || !auth.user) {
      return NextResponse.json({ error: auth.error }, { status: auth.status })
    }

    const access = await canAccessResident(auth.user, params.residentId)
    if (!access.ok) {
      return NextResponse.json({ error: access.reason }, { status: 403 })
    }

    const resident = await prisma.resident.findUnique({
      where: { id: params.residentId },
      select: {
        id: true,
        name: true,
        photoUrl: true,
        statusChip: true,
        roomNumber: true,
        careCenterId: true,
      },
    })
    if (!resident) return NextResponse.json({ error: "없음" }, { status: 404 })

    const [reports, medical, visits, vitals, todayMenu] = await Promise.all([
      prisma.dailyReport.findMany({
        where: { residentId: params.residentId, isDraft: false },
        orderBy: { publishedAt: "desc" },
        take: 20,
        include: { author: { select: { name: true } }, reactions: true },
      }),
      prisma.medicalRecord.findMany({
        where: { residentId: params.residentId },
        orderBy: { recordDate: "desc" },
        take: 10,
      }),
      prisma.visitRequest.findMany({
        where: { residentId: params.residentId },
        orderBy: { visitAt: "desc" },
        take: 5,
      }),
      prisma.vitalSign.findMany({
        where: { residentId: params.residentId },
        orderBy: { recordedAt: "desc" },
        take: 10,
      }),
      prisma.menuPlan.findFirst({
        where: {
          careCenterId: resident.careCenterId,
          date: {
            gte: new Date(new Date().setHours(0, 0, 0, 0)),
            lt: new Date(new Date().setHours(24, 0, 0, 0)),
          },
        },
      }),
    ])

    const items = [
      ...reports.map((r) => ({
        type: "report" as const,
        id: r.id,
        at: r.publishedAt || r.createdAt,
        title: "오늘의 알림장",
        content: r.content,
        moodChip: r.moodChip,
        images: r.images,
        meta: r,
      })),
      ...medical.map((m) => ({
        type: "medical" as const,
        id: m.id,
        at: m.recordDate,
        title: m.title,
        content: m.plainExplain || m.content,
        meta: m,
      })),
      ...visits.map((v) => ({
        type: "visit" as const,
        id: v.id,
        at: v.visitAt,
        title: "면회",
        content: v.notes || v.visitors || v.status,
        meta: v,
      })),
      ...vitals.map((v) => ({
        type: "vital" as const,
        id: v.id,
        at: v.recordedAt,
        title: v.type,
        content: `${v.value}${v.unit || ""}`,
        meta: v,
      })),
    ].sort((a, b) => +new Date(b.at) - +new Date(a.at))

    return NextResponse.json({ resident, todayMenu, items })
  } catch (error) {
    console.error("timeline", error)
    return NextResponse.json({ error: "타임라인 조회 실패" }, { status: 500 })
  }
}
