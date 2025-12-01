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
    
    if (!session) {
      return NextResponse.json(
        { error: "인증이 필요합니다." },
        { status: 401 }
      )
    }

    // 요양원 직원만 자신의 요양원 정보를 조회할 수 있음
    if (session.user.role !== "CAREGIVER" || !session.user.careCenterId) {
      return NextResponse.json(
        { error: "요양원 직원만 접근할 수 있습니다." },
        { status: 403 }
      )
    }

    // 자신의 요양원만 조회 가능
    if (session.user.careCenterId !== params.id) {
      return NextResponse.json(
        { error: "권한이 없습니다." },
        { status: 403 }
      )
    }

    const careCenter = await prisma.careCenter.findUnique({
      where: { id: params.id },
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

    if (!careCenter) {
      return NextResponse.json(
        { error: "요양원을 찾을 수 없습니다." },
        { status: 404 }
      )
    }

    return NextResponse.json(careCenter)
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
    
    if (!session) {
      return NextResponse.json(
        { error: "인증이 필요합니다." },
        { status: 401 }
      )
    }

    // 요양원 직원만 수정 가능
    if (session.user.role !== "CAREGIVER" || !session.user.careCenterId) {
      return NextResponse.json(
        { error: "요양원 직원만 수정할 수 있습니다." },
        { status: 403 }
      )
    }

    // 자신의 요양원만 수정 가능
    if (session.user.careCenterId !== params.id) {
      return NextResponse.json(
        { error: "권한이 없습니다." },
        { status: 403 }
      )
    }

    const body = await req.json()
    const { name, address, phone, email, description, logoUrl } = body

    // 필수 필드 검증
    if (!name || !address) {
      return NextResponse.json(
        { error: "이름과 주소는 필수 항목입니다." },
        { status: 400 }
      )
    }

    // 요양원 정보 업데이트
    const updatedCareCenter = await prisma.careCenter.update({
      where: { id: params.id },
      data: {
        name,
        address,
        phone: phone || null,
        email: email || null,
        description: description || null,
        logoUrl: logoUrl || null,
      },
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

    return NextResponse.json({
      message: "요양원 정보가 수정되었습니다.",
      careCenter: updatedCareCenter,
    })
  } catch (error: any) {
    console.error("Error updating care center:", error)
    
    // Prisma 오류 처리
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

