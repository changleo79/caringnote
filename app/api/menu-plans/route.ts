import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { isStaff, requireSession, requireStaff } from "@/lib/access"

export const dynamic = "force-dynamic"

export async function GET(req: NextRequest) {
  try {
    const auth = await requireSession()
    if (auth.error || !auth.user) {
      return NextResponse.json({ error: auth.error }, { status: auth.status })
    }

    let careCenterId = auth.user.careCenterId
    if (!careCenterId && !isStaff(auth.user.role)) {
      const link = await prisma.residentFamily.findFirst({
        where: { userId: auth.user.id, isApproved: true },
        include: { resident: { select: { careCenterId: true } } },
      })
      careCenterId = link?.resident.careCenterId || null
    }
    if (!careCenterId) {
      return NextResponse.json([])
    }

    const dateParam = new URL(req.url).searchParams.get("date")
    const day = dateParam ? new Date(dateParam) : new Date()
    day.setHours(0, 0, 0, 0)

    const plan = await prisma.menuPlan.findUnique({
      where: { careCenterId_date: { careCenterId, date: day } },
    })
    return NextResponse.json(plan)
  } catch (error) {
    console.error("GET menu", error)
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
    const day = new Date(body.date || new Date())
    day.setHours(0, 0, 0, 0)

    const plan = await prisma.menuPlan.upsert({
      where: {
        careCenterId_date: { careCenterId: auth.user.careCenterId!, date: day },
      },
      create: {
        careCenterId: auth.user.careCenterId!,
        date: day,
        breakfast: body.breakfast || null,
        lunch: body.lunch || null,
        dinner: body.dinner || null,
        snack: body.snack || null,
      },
      update: {
        breakfast: body.breakfast,
        lunch: body.lunch,
        dinner: body.dinner,
        snack: body.snack,
      },
    })
    return NextResponse.json(plan)
  } catch (error) {
    console.error("POST menu", error)
    return NextResponse.json({ error: "저장 실패" }, { status: 500 })
  }
}
