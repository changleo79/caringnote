import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { isStaff, requireSession, requireStaff } from "@/lib/access"

export const dynamic = "force-dynamic"

export async function GET() {
  try {
    const auth = await requireSession()
    if (auth.error || !auth.user) {
      return NextResponse.json({ error: auth.error }, { status: auth.status })
    }

    let careCenterId = auth.user.careCenterId
    if (!careCenterId) {
      const link = await prisma.residentFamily.findFirst({
        where: { userId: auth.user.id, isApproved: true },
        include: { resident: { select: { careCenterId: true } } },
      })
      careCenterId = link?.resident.careCenterId || null
    }
    if (!careCenterId) return NextResponse.json([])

    const list = await prisma.announcement.findMany({
      where: { careCenterId },
      orderBy: { createdAt: "desc" },
      take: 30,
    })
    return NextResponse.json(list)
  } catch (error) {
    console.error("GET announcements", error)
    return NextResponse.json({ error: "조회 실패" }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const auth = await requireStaff()
    if (auth.error || !auth.user) {
      return NextResponse.json({ error: auth.error }, { status: auth.status })
    }
    const { title, content, images, isUrgent } = await req.json()
    if (!title?.trim() || !content?.trim()) {
      return NextResponse.json({ error: "제목과 내용이 필요합니다." }, { status: 400 })
    }

    const item = await prisma.announcement.create({
      data: {
        title: title.trim(),
        content: content.trim(),
        images: images ? JSON.stringify(images) : null,
        isUrgent: Boolean(isUrgent),
        careCenterId: auth.user.careCenterId!,
        authorId: auth.user.id,
      },
    })

    const families = await prisma.user.findMany({
      where: { careCenterId: auth.user.careCenterId!, role: "FAMILY" },
      select: { id: true },
    })
    if (families.length) {
      await prisma.notification.createMany({
        data: families.map((f) => ({
          userId: f.id,
          type: "Announcement",
          title: isUrgent ? `[긴급] ${title}` : title,
          content: content.slice(0, 100),
          relatedId: item.id,
          relatedType: "Announcement",
        })),
      })
    }

    return NextResponse.json(item, { status: 201 })
  } catch (error) {
    console.error("POST announcements", error)
    return NextResponse.json({ error: "작성 실패" }, { status: 500 })
  }
}
