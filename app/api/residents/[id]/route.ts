import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { canAccessResident, isStaff, requireSession, requireStaff, writeAuditLog } from "@/lib/access"

export const dynamic = "force-dynamic"

export async function GET(_req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const auth = await requireSession()
    if (auth.error || !auth.user) {
      return NextResponse.json({ error: auth.error }, { status: auth.status })
    }

    const access = await canAccessResident(auth.user, params.id)
    if (!access.ok) {
      return NextResponse.json({ error: access.reason }, { status: 403 })
    }

    const resident = await prisma.resident.findUnique({
      where: { id: params.id },
      include: {
        careCenter: { select: { id: true, name: true, phone: true } },
        families: {
          include: {
            user: { select: { id: true, name: true, email: true, phone: true } },
          },
        },
        emergencyContacts: { orderBy: { priority: "asc" } },
        medications: { where: { active: true } },
      },
    })

    return NextResponse.json(resident)
  } catch (error) {
    console.error("GET /api/residents/[id]", error)
    return NextResponse.json({ error: "조회 실패" }, { status: 500 })
  }
}

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const auth = await requireStaff()
    if (auth.error || !auth.user) {
      return NextResponse.json({ error: auth.error }, { status: auth.status })
    }

    const access = await canAccessResident(auth.user, params.id)
    if (!access.ok) {
      return NextResponse.json({ error: access.reason }, { status: 403 })
    }

    const body = await req.json()
    const resident = await prisma.resident.update({
      where: { id: params.id },
      data: {
        name: body.name?.trim(),
        birthDate: body.birthDate ? new Date(body.birthDate) : undefined,
        gender: body.gender,
        roomNumber: body.roomNumber,
        photoUrl: body.photoUrl,
        notes: body.notes,
        statusChip: body.statusChip,
      },
    })

    await writeAuditLog({
      action: "resident.update",
      userId: auth.user.id,
      careCenterId: auth.user.careCenterId,
      entityType: "Resident",
      entityId: resident.id,
    })

    return NextResponse.json(resident)
  } catch (error) {
    console.error("PATCH /api/residents/[id]", error)
    return NextResponse.json({ error: "수정 실패" }, { status: 500 })
  }
}

export async function DELETE(_req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const auth = await requireStaff()
    if (auth.error || !auth.user) {
      return NextResponse.json({ error: auth.error }, { status: auth.status })
    }
    if (!isStaff(auth.user.role)) {
      return NextResponse.json({ error: "권한 없음" }, { status: 403 })
    }

    const access = await canAccessResident(auth.user, params.id)
    if (!access.ok) {
      return NextResponse.json({ error: access.reason }, { status: 403 })
    }

    await prisma.resident.delete({ where: { id: params.id } })
    await writeAuditLog({
      action: "resident.delete",
      userId: auth.user.id,
      careCenterId: auth.user.careCenterId,
      entityType: "Resident",
      entityId: params.id,
    })
    return NextResponse.json({ ok: true })
  } catch (error) {
    console.error("DELETE /api/residents/[id]", error)
    return NextResponse.json({ error: "삭제 실패" }, { status: 500 })
  }
}
