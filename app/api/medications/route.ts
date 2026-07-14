import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { canAccessResident, requireSession, requireStaff } from "@/lib/access"

export const dynamic = "force-dynamic"

export async function GET(req: NextRequest) {
  try {
    const auth = await requireSession()
    if (auth.error || !auth.user) {
      return NextResponse.json({ error: auth.error }, { status: auth.status })
    }
    const residentId = new URL(req.url).searchParams.get("residentId")
    if (!residentId) return NextResponse.json({ error: "residentId 필요" }, { status: 400 })
    const access = await canAccessResident(auth.user, residentId)
    if (!access.ok) return NextResponse.json({ error: access.reason }, { status: 403 })

    const meds = await prisma.medicationSchedule.findMany({
      where: { residentId, active: true },
      include: { logs: { orderBy: { givenAt: "desc" }, take: 5 } },
      orderBy: { name: "asc" },
    })
    return NextResponse.json(meds)
  } catch {
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
    if (body.action === "log") {
      const log = await prisma.medicationLog.create({
        data: {
          scheduleId: body.scheduleId,
          givenById: auth.user.id,
          administered: body.administered !== false,
          note: body.note || null,
        },
      })
      return NextResponse.json(log, { status: 201 })
    }

    const access = await canAccessResident(auth.user, body.residentId)
    if (!access.ok) return NextResponse.json({ error: access.reason }, { status: 403 })

    const med = await prisma.medicationSchedule.create({
      data: {
        residentId: body.residentId,
        name: body.name,
        dosage: body.dosage || null,
        schedule: body.schedule || null,
        notes: body.notes || null,
      },
    })
    return NextResponse.json(med, { status: 201 })
  } catch {
    return NextResponse.json({ error: "저장 실패" }, { status: 500 })
  }
}
