import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { requireStaff } from "@/lib/access"

export const dynamic = "force-dynamic"

export async function GET() {
  try {
    const auth = await requireStaff()
    if (auth.error || !auth.user) {
      return NextResponse.json({ error: auth.error }, { status: auth.status })
    }
    const notes = await prisma.handoverNote.findMany({
      where: { careCenterId: auth.user.careCenterId! },
      include: { author: { select: { id: true, name: true } } },
      orderBy: { createdAt: "desc" },
      take: 30,
    })
    return NextResponse.json(notes)
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
    const { content, shift } = await req.json()
    if (!content?.trim()) {
      return NextResponse.json({ error: "내용이 필요합니다." }, { status: 400 })
    }
    const note = await prisma.handoverNote.create({
      data: {
        content: content.trim(),
        shift: shift || null,
        careCenterId: auth.user.careCenterId!,
        authorId: auth.user.id,
      },
    })
    return NextResponse.json(note, { status: 201 })
  } catch {
    return NextResponse.json({ error: "저장 실패" }, { status: 500 })
  }
}
