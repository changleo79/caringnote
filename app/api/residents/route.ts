import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { getApprovedResidentIds, isStaff, requireSession, requireStaff, writeAuditLog } from "@/lib/access"

export const dynamic = "force-dynamic"

export async function GET() {
  try {
    const auth = await requireSession()
    if (auth.error || !auth.user) {
      return NextResponse.json({ error: auth.error }, { status: auth.status })
    }

    if (isStaff(auth.user.role)) {
      if (!auth.user.careCenterId) {
        return NextResponse.json({ error: "요양원 정보가 필요합니다." }, { status: 400 })
      }
      const residents = await prisma.resident.findMany({
        where: { careCenterId: auth.user.careCenterId },
        include: {
          families: {
            where: { isApproved: false },
            select: { id: true },
          },
          _count: { select: { dailyReports: true, families: true } },
        },
        orderBy: [{ roomNumber: "asc" }, { name: "asc" }],
      })
      return NextResponse.json(residents)
    }

    const ids = await getApprovedResidentIds(auth.user.id)
    const residents = await prisma.resident.findMany({
      where: { id: { in: ids } },
      include: {
        careCenter: { select: { id: true, name: true } },
        _count: { select: { dailyReports: true } },
      },
      orderBy: { name: "asc" },
    })
    return NextResponse.json(residents)
  } catch (error) {
    console.error("GET /api/residents", error)
    return NextResponse.json({ error: "입소자 목록을 불러오지 못했습니다." }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const auth = await requireStaff()
    if (auth.error || !auth.user) {
      return NextResponse.json({ error: auth.error }, { status: auth.status })
    }

    const body = await req.json()
    const { name, birthDate, gender, roomNumber, photoUrl, notes } = body
    if (!name?.trim()) {
      return NextResponse.json({ error: "이름은 필수입니다." }, { status: 400 })
    }

    const resident = await prisma.resident.create({
      data: {
        name: name.trim(),
        birthDate: birthDate ? new Date(birthDate) : null,
        gender: gender || null,
        roomNumber: roomNumber || null,
        photoUrl: photoUrl || null,
        notes: notes || null,
        careCenterId: auth.user.careCenterId!,
      },
    })

    await writeAuditLog({
      action: "resident.create",
      userId: auth.user.id,
      careCenterId: auth.user.careCenterId,
      entityType: "Resident",
      entityId: resident.id,
    })

    return NextResponse.json(resident, { status: 201 })
  } catch (error) {
    console.error("POST /api/residents", error)
    return NextResponse.json({ error: "어르신 등록에 실패했습니다." }, { status: 500 })
  }
}
