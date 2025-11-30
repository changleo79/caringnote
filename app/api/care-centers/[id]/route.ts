import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

// 요양원 정보 조회
export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)

    if (!session || !session.user.id) {
      return NextResponse.json(
        { error: "인증이 필요합니다." },
        { status: 401 }
      )
    }

    const careCenterId = params.id

    // 요양원 정보 조회
    const careCenter = await prisma.careCenter.findUnique({
      where: { id: careCenterId },
      select: {
        id: true,
        name: true,
        address: true,
        phone: true,
        email: true,
        description: true,
        logoUrl: true,
        createdAt: true,
        updatedAt: true,
      },
    })

    if (!careCenter) {
      return NextResponse.json(
        { error: "요양원을 찾을 수 없습니다." },
        { status: 404 }
      )
    }

    // 권한 확인
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: {
        role: true,
        careCenterId: true,
      },
    })

    if (!user) {
      return NextResponse.json(
        { error: "사용자를 찾을 수 없습니다." },
        { status: 404 }
      )
    }

    // ADMIN은 모든 요양원 정보 조회 가능
    if (user.role === "ADMIN") {
      return NextResponse.json(careCenter)
    }

    // CAREGIVER는 자신이 속한 요양원만 조회 가능
    if (user.role === "CAREGIVER") {
      if (user.careCenterId !== careCenterId) {
        return NextResponse.json(
          { error: "요양원 정보에 접근할 권한이 없습니다." },
          { status: 403 }
        )
      }
      return NextResponse.json(careCenter)
    }

    // FAMILY는 연결된 입소자의 요양원 정보 조회 가능
    if (user.role === "FAMILY") {
      const residentFamily = await prisma.residentFamily.findFirst({
        where: {
          userId: session.user.id,
          isApproved: true,
          resident: {
            careCenterId: careCenterId,
          },
        },
      })

      if (!residentFamily) {
        return NextResponse.json(
          { error: "요양원 정보에 접근할 권한이 없습니다." },
          { status: 403 }
        )
      }

      return NextResponse.json(careCenter)
    }

    return NextResponse.json(
      { error: "권한이 없습니다." },
      { status: 403 }
    )
  } catch (error: any) {
    console.error("Error fetching care center:", error)
    return NextResponse.json(
      { error: "요양원 정보를 불러오는데 실패했습니다." },
      { status: 500 }
    )
  }
}

// 요양원 정보 수정
export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)

    if (!session || !session.user.id) {
      return NextResponse.json(
        { error: "인증이 필요합니다." },
        { status: 401 }
      )
    }

    const careCenterId = params.id
    const body = await req.json()
    const { name, address, phone, email, description, logoUrl } = body

    // 권한 확인
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: {
        role: true,
        careCenterId: true,
      },
    })

    if (!user) {
      return NextResponse.json(
        { error: "사용자를 찾을 수 없습니다." },
        { status: 404 }
      )
    }

    // ADMIN 또는 해당 요양원의 CAREGIVER만 수정 가능
    if (user.role === "FAMILY") {
      return NextResponse.json(
        { error: "요양원 정보를 수정할 권한이 없습니다." },
        { status: 403 }
      )
    }

    if (user.role === "CAREGIVER" && user.careCenterId !== careCenterId) {
      return NextResponse.json(
        { error: "요양원 정보를 수정할 권한이 없습니다." },
        { status: 403 }
      )
    }

    // 요양원 존재 확인
    const existingCareCenter = await prisma.careCenter.findUnique({
      where: { id: careCenterId },
    })

    if (!existingCareCenter) {
      return NextResponse.json(
        { error: "요양원을 찾을 수 없습니다." },
        { status: 404 }
      )
    }

    // 업데이트할 데이터 구성
    const updateData: any = {}
    if (name !== undefined && name.trim() !== "") {
      updateData.name = name.trim()
    }
    if (address !== undefined && address.trim() !== "") {
      updateData.address = address.trim()
    }
    if (phone !== undefined) {
      updateData.phone = phone?.trim() || null
    }
    if (email !== undefined) {
      updateData.email = email?.trim() || null
    }
    if (description !== undefined) {
      updateData.description = description?.trim() || null
    }
    if (logoUrl !== undefined) {
      updateData.logoUrl = logoUrl?.trim() || null
    }

    // 필수 필드 검증
    if (updateData.name === "" || updateData.address === "") {
      return NextResponse.json(
        { error: "요양원 이름과 주소는 필수입니다." },
        { status: 400 }
      )
    }

    // 데이터가 없으면 오류
    if (Object.keys(updateData).length === 0) {
      return NextResponse.json(
        { error: "수정할 정보가 없습니다." },
        { status: 400 }
      )
    }

    // 요양원 정보 업데이트
    const updatedCareCenter = await prisma.careCenter.update({
      where: { id: careCenterId },
      data: updateData,
      select: {
        id: true,
        name: true,
        address: true,
        phone: true,
        email: true,
        description: true,
        logoUrl: true,
        updatedAt: true,
      },
    })

    return NextResponse.json({
      message: "요양원 정보가 수정되었습니다.",
      careCenter: updatedCareCenter,
    })
  } catch (error: any) {
    console.error("Error updating care center:", error)

    if (error.code === "P2025") {
      return NextResponse.json(
        { error: "요양원을 찾을 수 없습니다." },
        { status: 404 }
      )
    }

    return NextResponse.json(
      { error: "요양원 정보 수정에 실패했습니다." },
      { status: 500 }
    )
  }
}

