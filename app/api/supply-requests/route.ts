import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { canAccessResident, isStaff, requireSession, requireStaff } from "@/lib/access"

export const dynamic = "force-dynamic"

export async function GET() {
  try {
    const auth = await requireSession()
    if (auth.error || !auth.user) {
      return NextResponse.json({ error: auth.error }, { status: auth.status })
    }

    if (isStaff(auth.user.role)) {
      const list = await prisma.supplyRequest.findMany({
        where: { resident: { careCenterId: auth.user.careCenterId! } },
        include: {
          resident: { select: { id: true, name: true } },
          user: { select: { id: true, name: true } },
        },
        orderBy: { createdAt: "desc" },
        take: 50,
      })
      return NextResponse.json(list)
    }

    const list = await prisma.supplyRequest.findMany({
      where: { userId: auth.user.id },
      include: { resident: { select: { id: true, name: true } } },
      orderBy: { createdAt: "desc" },
    })
    return NextResponse.json(list)
  } catch (error) {
    return NextResponse.json({ error: "조회 실패" }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const auth = await requireSession()
    if (auth.error || !auth.user) {
      return NextResponse.json({ error: auth.error }, { status: auth.status })
    }
    const { residentId, itemName, quantity, notes } = await req.json()
    if (!residentId || !itemName) {
      return NextResponse.json({ error: "어르신과 품목이 필요합니다." }, { status: 400 })
    }
    const access = await canAccessResident(auth.user, residentId)
    if (!access.ok) {
      return NextResponse.json({ error: access.reason }, { status: 403 })
    }

    const item = await prisma.supplyRequest.create({
      data: {
        residentId,
        userId: auth.user.id,
        itemName,
        quantity: quantity || 1,
        notes: notes || null,
      },
    })
    return NextResponse.json(item, { status: 201 })
  } catch (error) {
    return NextResponse.json({ error: "요청 실패" }, { status: 500 })
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const auth = await requireStaff()
    if (auth.error || !auth.user) {
      return NextResponse.json({ error: auth.error }, { status: auth.status })
    }
    const { id, status } = await req.json()
    const item = await prisma.supplyRequest.update({ where: { id }, data: { status } })
    return NextResponse.json(item)
  } catch {
    return NextResponse.json({ error: "처리 실패" }, { status: 500 })
  }
}
