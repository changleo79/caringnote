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
      const list = await prisma.visitRequest.findMany({
        where: { resident: { careCenterId: auth.user.careCenterId! } },
        include: {
          resident: { select: { id: true, name: true, roomNumber: true } },
          user: { select: { id: true, name: true, phone: true } },
        },
        orderBy: { visitAt: "asc" },
        take: 50,
      })
      return NextResponse.json(list)
    }

    const list = await prisma.visitRequest.findMany({
      where: { userId: auth.user.id },
      include: { resident: { select: { id: true, name: true } } },
      orderBy: { visitAt: "desc" },
    })
    return NextResponse.json(list)
  } catch (error) {
    console.error("GET visits", error)
    return NextResponse.json({ error: "조회 실패" }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const auth = await requireSession()
    if (auth.error || !auth.user) {
      return NextResponse.json({ error: auth.error }, { status: auth.status })
    }
    const { residentId, visitAt, visitors, notes } = await req.json()
    if (!residentId || !visitAt) {
      return NextResponse.json({ error: "어르신과 방문 시간이 필요합니다." }, { status: 400 })
    }

    const access = await canAccessResident(auth.user, residentId)
    if (!access.ok && !isStaff(auth.user.role)) {
      return NextResponse.json({ error: access.reason }, { status: 403 })
    }

    const visit = await prisma.visitRequest.create({
      data: {
        residentId,
        userId: auth.user.id,
        visitAt: new Date(visitAt),
        visitors: visitors || null,
        notes: notes || null,
      },
    })
    return NextResponse.json(visit, { status: 201 })
  } catch (error) {
    console.error("POST visits", error)
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
    const visit = await prisma.visitRequest.update({
      where: { id },
      data: { status },
    })
    return NextResponse.json(visit)
  } catch (error) {
    return NextResponse.json({ error: "처리 실패" }, { status: 500 })
  }
}
