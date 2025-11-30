import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

// 입소자 상세 조회
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

    const resident = await prisma.resident.findUnique({
      where: { id: params.id },
      include: {
        careCenter: {
          select: {
            id: true,
            name: true,
            address: true,
          },
        },
      },
    })

    if (!resident) {
      return NextResponse.json(
        { error: "입소자를 찾을 수 없습니다." },
        { status: 404 }
      )
    }

    // 권한 확인
    if (session.user.role === "FAMILY") {
      // FAMILY는 연결된 입소자만 조회 가능
      const residentFamily = await prisma.residentFamily.findFirst({
        where: {
          residentId: params.id,
          userId: session.user.id!,
          isApproved: true,
        },
      })

      if (!residentFamily) {
        return NextResponse.json(
          { error: "접근 권한이 없습니다." },
          { status: 403 }
        )
      }
    } else if (session.user.careCenterId !== resident.careCenterId) {
      // CAREGIVER는 소속 요양원의 입소자만 조회 가능
      return NextResponse.json(
        { error: "접근 권한이 없습니다." },
        { status: 403 }
      )
    }

    return NextResponse.json(resident)
  } catch (error: any) {
    console.error("Error fetching resident:", error)
    return NextResponse.json(
      { error: "입소자 정보를 불러오는데 실패했습니다." },
      { status: 500 }
    )
  }
}

// 입소자 수정 (CAREGIVER만)
export async function PATCH(
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

    // CAREGIVER 또는 ADMIN만 입소자 수정 가능
    if (session.user.role !== "CAREGIVER" && session.user.role !== "ADMIN") {
      return NextResponse.json(
        { error: "입소자 수정은 요양원 직원만 가능합니다." },
        { status: 403 }
      )
    }

    // 입소자 존재 확인 및 권한 확인
    const existingResident = await prisma.resident.findUnique({
      where: { id: params.id },
    })

    if (!existingResident) {
      return NextResponse.json(
        { error: "입소자를 찾을 수 없습니다." },
        { status: 404 }
      )
    }

    if (session.user.careCenterId !== existingResident.careCenterId) {
      return NextResponse.json(
        { error: "접근 권한이 없습니다." },
        { status: 403 }
      )
    }

    const body = await req.json()
    const { name, birthDate, gender, roomNumber, photoUrl } = body

    const updateData: any = {}
    if (name !== undefined) updateData.name = name
    if (birthDate !== undefined) updateData.birthDate = birthDate ? new Date(birthDate) : null
    if (gender !== undefined) updateData.gender = gender || null
    if (roomNumber !== undefined) updateData.roomNumber = roomNumber || null
    if (photoUrl !== undefined) updateData.photoUrl = photoUrl || null

    const resident = await prisma.resident.update({
      where: { id: params.id },
      data: updateData,
    })

    return NextResponse.json({
      message: "입소자 정보가 수정되었습니다.",
      resident,
    })
  } catch (error: any) {
    console.error("Error updating resident:", error)
    return NextResponse.json(
      { error: "입소자 수정에 실패했습니다." },
      { status: 500 }
    )
  }
}

// 입소자 삭제 (CAREGIVER만, 가족 승인 필요 시)
export async function DELETE(
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

    // CAREGIVER 또는 ADMIN만 입소자 삭제 가능
    if (session.user.role !== "CAREGIVER" && session.user.role !== "ADMIN") {
      return NextResponse.json(
        { error: "입소자 삭제는 요양원 직원만 가능합니다." },
        { status: 403 }
      )
    }

    // 입소자 존재 확인 및 권한 확인
    const existingResident = await prisma.resident.findUnique({
      where: { id: params.id },
      include: {
        residentFamilies: {
          where: { isApproved: true },
        },
      },
    })

    if (!existingResident) {
      return NextResponse.json(
        { error: "입소자를 찾을 수 없습니다." },
        { status: 404 }
      )
    }

    if (session.user.careCenterId !== existingResident.careCenterId) {
      return NextResponse.json(
        { error: "접근 권한이 없습니다." },
        { status: 403 }
      )
    }

    // 연결된 가족이 있으면 삭제 불가 (향후 승인 시스템 추가 가능)
    if (existingResident.residentFamilies.length > 0) {
      return NextResponse.json(
        { error: "연결된 가족이 있어 삭제할 수 없습니다. 먼저 모든 연결을 해제해주세요." },
        { status: 400 }
      )
    }

    await prisma.resident.delete({
      where: { id: params.id },
    })

    return NextResponse.json({
      message: "입소자가 삭제되었습니다.",
    })
  } catch (error: any) {
    console.error("Error deleting resident:", error)
    
    // 외래 키 제약 조건 오류
    if (error.code === 'P2003') {
      return NextResponse.json(
        { error: "연결된 데이터가 있어 삭제할 수 없습니다." },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { error: "입소자 삭제에 실패했습니다." },
      { status: 500 }
    )
  }
}

