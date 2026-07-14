import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export const dynamic = "force-dynamic"

/** 시설 공개 홈페이지 */
export async function GET(_req: Request, { params }: { params: { slug: string } }) {
  try {
    const center = await prisma.careCenter.findUnique({
      where: { homepageSlug: params.slug },
      select: {
        id: true,
        name: true,
        address: true,
        phone: true,
        email: true,
        description: true,
        logoUrl: true,
      },
    })
    if (!center) {
      return NextResponse.json({ error: "시설을 찾을 수 없습니다." }, { status: 404 })
    }

    const [announcements, albums] = await Promise.all([
      prisma.announcement.findMany({
        where: { careCenterId: center.id },
        orderBy: { createdAt: "desc" },
        take: 5,
        select: { id: true, title: true, content: true, createdAt: true, isUrgent: true },
      }),
      prisma.post.findMany({
        where: {
          careCenterId: center.id,
          category: { in: ["Album", "Daily", "Event"] },
          images: { not: null },
        },
        orderBy: { createdAt: "desc" },
        take: 12,
        select: { id: true, title: true, images: true, createdAt: true },
      }),
    ])

    return NextResponse.json({ center, announcements, albums })
  } catch {
    return NextResponse.json({ error: "조회 실패" }, { status: 500 })
  }
}
