import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET() {
  try {
    const careCenters = await prisma.careCenter.findMany({
      select: {
        id: true,
        name: true,
        address: true,
        phone: true,
      },
      orderBy: {
        name: "asc",
      },
    })

    return NextResponse.json(careCenters)
  } catch (error) {
    console.error("Error fetching care centers:", error)
    return NextResponse.json(
      { error: "요양원 목록을 불러오는 중 오류가 발생했습니다." },
      { status: 500 }
    )
  }
}

