import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { requireSession } from "@/lib/access"
import bcrypt from "bcryptjs"

export const dynamic = "force-dynamic"

export async function GET() {
  const auth = await requireSession()
  if (auth.error || !auth.user) {
    return NextResponse.json({ error: auth.error }, { status: auth.status })
  }

  const user = await prisma.user.findUnique({
    where: { id: auth.user.id },
    select: {
      id: true,
      name: true,
      email: true,
      phone: true,
      role: true,
      fontScale: true,
      staffMode: true,
      careCenterId: true,
      careCenter: { select: { id: true, name: true, homepageSlug: true } },
    },
  })
  return NextResponse.json(user)
}

export async function PATCH(req: NextRequest) {
  const auth = await requireSession()
  if (auth.error || !auth.user) {
    return NextResponse.json({ error: auth.error }, { status: auth.status })
  }

  const body = await req.json()
  const data: Record<string, unknown> = {}

  if (body.fontScale != null) {
    const scale = Number(body.fontScale)
    if (![1, 2, 3].includes(scale)) {
      return NextResponse.json({ error: "글자 크기는 1–3만 가능합니다." }, { status: 400 })
    }
    data.fontScale = scale
  }
  if (typeof body.staffMode === "boolean") data.staffMode = body.staffMode
  if (typeof body.phone === "string") data.phone = body.phone
  if (typeof body.pin === "string" && body.pin.length >= 4) {
    data.pinHash = await bcrypt.hash(body.pin, 10)
  }

  const user = await prisma.user.update({
    where: { id: auth.user.id },
    data,
    select: { id: true, fontScale: true, staffMode: true, phone: true },
  })
  return NextResponse.json(user)
}
