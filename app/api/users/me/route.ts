import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import bcrypt from "bcryptjs"

// 내 회원정보 조회
export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session || !session.user.id) {
      return NextResponse.json(
        { error: "인증이 필요합니다." },
        { status: 401 }
      )
    }

    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: {
        id: true,
        email: true,
        name: true,
        phone: true,
        role: true,
        avatarUrl: true,
        careCenterId: true,
        careCenter: {
          select: {
            id: true,
            name: true,
            address: true,
          },
        },
        createdAt: true,
        updatedAt: true,
      },
    })

    if (!user) {
      return NextResponse.json(
        { error: "사용자를 찾을 수 없습니다." },
        { status: 404 }
      )
    }

    return NextResponse.json(user)
  } catch (error: any) {
    console.error("Error fetching user:", error)
    return NextResponse.json(
      { error: "회원정보를 불러오는데 실패했습니다." },
      { status: 500 }
    )
  }
}

// 내 회원정보 수정
export async function PATCH(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session || !session.user.id) {
      return NextResponse.json(
        { error: "인증이 필요합니다." },
        { status: 401 }
      )
    }

    const body = await req.json()
    const { name, phone, avatarUrl } = body

    // 업데이트할 데이터 구성
    const updateData: any = {}
    if (name !== undefined) updateData.name = name
    if (phone !== undefined) updateData.phone = phone || null
    if (avatarUrl !== undefined) updateData.avatarUrl = avatarUrl || null

    // 데이터가 없으면 오류
    if (Object.keys(updateData).length === 0) {
      return NextResponse.json(
        { error: "수정할 정보가 없습니다." },
        { status: 400 }
      )
    }

    const updatedUser = await prisma.user.update({
      where: { id: session.user.id },
      data: updateData,
      select: {
        id: true,
        email: true,
        name: true,
        phone: true,
        role: true,
        avatarUrl: true,
        careCenterId: true,
        careCenter: {
          select: {
            id: true,
            name: true,
            address: true,
          },
        },
        updatedAt: true,
      },
    })

    return NextResponse.json({
      message: "회원정보가 수정되었습니다.",
      user: updatedUser,
    })
  } catch (error: any) {
    console.error("Error updating user:", error)
    
    if (error.code === 'P2002') {
      return NextResponse.json(
        { error: "이미 사용 중인 정보입니다." },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { error: "회원정보 수정에 실패했습니다." },
      { status: 500 }
    )
  }
}

