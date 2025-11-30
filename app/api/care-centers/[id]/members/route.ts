import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

// 요양원 회원 목록 조회
export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session) {
      return NextResponse.json(
        { error: "인증이 필요합니다." },
        { status: 401 }
      )
    }

    // CAREGIVER 또는 ADMIN만 조회 가능
    if (session.user.role !== "CAREGIVER" && session.user.role !== "ADMIN") {
      return NextResponse.json(
        { error: "회원 목록 조회는 요양원 직원만 가능합니다." },
        { status: 403 }
      )
    }

    // 소속 요양원 확인
    if (session.user.careCenterId !== params.id) {
      return NextResponse.json(
        { error: "접근 권한이 없습니다." },
        { status: 403 }
      )
    }

    const searchParams = req.nextUrl.searchParams
    const role = searchParams.get("role") // "FAMILY" 또는 "CAREGIVER"

    const whereClause: any = {
      careCenterId: params.id,
    }

    if (role === "FAMILY" || role === "CAREGIVER") {
      whereClause.role = role
    }

    const members = await prisma.user.findMany({
      where: whereClause,
      select: {
        id: true,
        email: true,
        name: true,
        phone: true,
        role: true,
        avatarUrl: true,
        createdAt: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    })

    return NextResponse.json(members)
  } catch (error: any) {
    console.error("Error fetching care center members:", error)
    return NextResponse.json(
      { error: "회원 목록을 불러오는데 실패했습니다." },
      { status: 500 }
    )
  }
}

