import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { canAccessResident, isStaff, requireSession, requireStaff } from "@/lib/access"

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

    const plans = await prisma.carePlan.findMany({
      where: { residentId },
      include: { author: { select: { name: true } } },
      orderBy: { updatedAt: "desc" },
    })
    return NextResponse.json(plans)
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
    const { residentId, title, content } = await req.json()
    if (!residentId || !title || !content) {
      return NextResponse.json({ error: "필수값 누락" }, { status: 400 })
    }
    const access = await canAccessResident(auth.user, residentId)
    if (!access.ok) return NextResponse.json({ error: access.reason }, { status: 403 })

    const plan = await prisma.carePlan.create({
      data: {
        residentId,
        title,
        content,
        careCenterId: auth.user.careCenterId!,
        authorId: auth.user.id,
      },
    })
    return NextResponse.json(plan, { status: 201 })
  } catch {
    return NextResponse.json({ error: "저장 실패" }, { status: 500 })
  }
}
