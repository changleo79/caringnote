import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import bcrypt from "bcryptjs"

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { email, password, name, phone, role, careCenterId } = body

    // 이메일 중복 확인
    const existingUser = await prisma.user.findUnique({
      where: { email },
    })

    if (existingUser) {
      return NextResponse.json(
        { error: "이미 등록된 이메일입니다." },
        { status: 400 }
      )
    }

    // 요양원 확인 (일반 회원인 경우)
    if (role === "FAMILY" && careCenterId) {
      const careCenter = await prisma.careCenter.findUnique({
        where: { id: careCenterId },
      })

      if (!careCenter) {
        return NextResponse.json(
          { error: "존재하지 않는 요양원입니다." },
          { status: 400 }
        )
      }
    }

    // 비밀번호 해싱
    const hashedPassword = await bcrypt.hash(password, 10)

    // 사용자 생성
    const user = await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        name,
        phone,
        role,
        careCenterId: role === "FAMILY" ? careCenterId : null,
      },
    })

    return NextResponse.json(
      { message: "회원가입 성공", userId: user.id },
      { status: 201 }
    )
  } catch (error: any) {
    console.error("Signup error:", error)
    return NextResponse.json(
      { error: "회원가입 중 오류가 발생했습니다." },
      { status: 500 }
    )
  }
}

