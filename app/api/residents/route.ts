import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

// 입소자 목록 조회
export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session) {
      return NextResponse.json(
        { error: "인증이 필요합니다." },
        { status: 401 }
      )
    }

    if (!session.user.careCenterId) {
      return NextResponse.json(
        { error: "요양원 정보가 필요합니다." },
        { status: 400 }
      )
    }

    // FAMILY는 연결된 입소자만, CAREGIVER는 모든 입소자
    let whereClause: any = {
      careCenterId: session.user.careCenterId,
    }

    if (session.user.role === "FAMILY") {
      // 연결된 입소자만 조회 (ResidentFamily 모델 사용)
      const residentFamilies = await prisma.residentFamily.findMany({
        where: {
          userId: session.user.id!,
          isApproved: true,
        },
        select: {
          residentId: true,
        },
      })

      const residentIds = residentFamilies.map(rf => rf.residentId)
      
      if (residentIds.length === 0) {
        return NextResponse.json([])
      }

      whereClause.id = { in: residentIds }
    }

    const residents = await prisma.resident.findMany({
      where: whereClause,
      select: {
        id: true,
        name: true,
        birthDate: true,
        gender: true,
        roomNumber: true,
        photoUrl: true,
        careCenterId: true,
        createdAt: true,
      },
      orderBy: {
        name: "asc",
      },
    })

    return NextResponse.json(residents)
  } catch (error: any) {
    console.error("Error fetching residents:", error)
    return NextResponse.json(
      { error: "입소자 목록을 불러오는데 실패했습니다." },
      { status: 500 }
    )
  }
}

// 입소자 등록 (CAREGIVER만)
export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session) {
      return NextResponse.json(
        { error: "인증이 필요합니다." },
        { status: 401 }
      )
    }

    // CAREGIVER 또는 ADMIN만 입소자 등록 가능
    if (session.user.role !== "CAREGIVER" && session.user.role !== "ADMIN") {
      return NextResponse.json(
        { error: "입소자 등록은 요양원 직원만 가능합니다." },
        { status: 403 }
      )
    }

    if (!session.user.careCenterId) {
      return NextResponse.json(
        { error: "요양원 정보가 필요합니다." },
        { status: 400 }
      )
    }

    const body = await req.json()
    const { name, birthDate, gender, roomNumber, photoUrl } = body

    if (!name) {
      return NextResponse.json(
        { error: "이름은 필수입니다." },
        { status: 400 }
      )
    }

    const resident = await prisma.resident.create({
      data: {
        name,
        birthDate: birthDate ? new Date(birthDate) : null,
        gender: gender || null,
        roomNumber: roomNumber || null,
        photoUrl: photoUrl || null,
        careCenterId: session.user.careCenterId,
      },
    })

    return NextResponse.json({
      message: "입소자가 등록되었습니다.",
      resident,
    }, { status: 201 })
  } catch (error: any) {
    console.error("Error creating resident:", error)
    return NextResponse.json(
      { error: "입소자 등록에 실패했습니다." },
      { status: 500 }
    )
  }
}

