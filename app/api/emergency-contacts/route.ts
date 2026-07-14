import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { canAccessResident, requireSession, requireStaff, writeAuditLog } from "@/lib/access"

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

    const contacts = await prisma.emergencyContact.findMany({
      where: { residentId },
      orderBy: { priority: "asc" },
    })
    return NextResponse.json(contacts)
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
    const { residentId, name, phone, relation, priority } = await req.json()
    if (!residentId || !name || !phone) {
      return NextResponse.json({ error: "이름·전화는 필수입니다." }, { status: 400 })
    }
    const access = await canAccessResident(auth.user, residentId)
    if (!access.ok) return NextResponse.json({ error: access.reason }, { status: 403 })

    const contact = await prisma.emergencyContact.create({
      data: {
        residentId,
        name,
        phone,
        relation: relation || null,
        priority: Number(priority) || 1,
      },
    })
    await writeAuditLog({
      action: "emergencyContact.create",
      userId: auth.user.id,
      careCenterId: auth.user.careCenterId,
      entityType: "EmergencyContact",
      entityId: contact.id,
    })
    return NextResponse.json(contact, { status: 201 })
  } catch {
    return NextResponse.json({ error: "저장 실패" }, { status: 500 })
  }
}
