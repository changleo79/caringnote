import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import bcrypt from "bcryptjs"

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { email, password, name, phone, role, careCenterId } = body

    // 필수 필드 검증
    if (!email || !password || !name) {
      return NextResponse.json(
        { error: "이메일, 비밀번호, 이름은 필수입니다." },
        { status: 400 }
      )
    }

    // 이메일 형식 검증
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: "올바른 이메일 형식이 아닙니다." },
        { status: 400 }
      )
    }

    // 비밀번호 길이 검증
    if (password.length < 6) {
      return NextResponse.json(
        { error: "비밀번호는 최소 6자 이상이어야 합니다." },
        { status: 400 }
      )
    }

    // 이메일 중복 확인
    try {
      const existingUser = await prisma.user.findUnique({
        where: { email },
      })

      if (existingUser) {
        return NextResponse.json(
          { error: "이미 등록된 이메일입니다." },
          { status: 400 }
        )
      }
    } catch (dbError) {
      console.error("Database error (find user):", dbError)
      return NextResponse.json(
        { error: "데이터베이스 연결 오류가 발생했습니다." },
        { status: 500 }
      )
    }

    // 요양원 확인 (일반 회원인 경우)
    if (role === "FAMILY") {
      if (!careCenterId) {
        return NextResponse.json(
          { error: "가족 회원은 요양원을 선택해야 합니다." },
          { status: 400 }
        )
      }

      try {
        const careCenter = await prisma.careCenter.findUnique({
          where: { id: careCenterId },
        })

        if (!careCenter) {
          return NextResponse.json(
            { error: "존재하지 않는 요양원입니다." },
            { status: 400 }
          )
        }
      } catch (dbError) {
        console.error("Database error (find care center):", dbError)
        return NextResponse.json(
          { error: "요양원 정보를 확인하는 중 오류가 발생했습니다." },
          { status: 500 }
        )
      }
    }

    // 비밀번호 해싱
    let hashedPassword: string
    try {
      hashedPassword = await bcrypt.hash(password, 10)
    } catch (hashError) {
      console.error("Password hashing error:", hashError)
      return NextResponse.json(
        { error: "비밀번호 처리 중 오류가 발생했습니다." },
        { status: 500 }
      )
    }

    // 사용자 생성
    try {
      const user = await prisma.user.create({
        data: {
          email,
          password: hashedPassword,
          name,
          phone: phone || null,
          role: role || "FAMILY",
          careCenterId: role === "FAMILY" ? careCenterId : null,
        },
      })

      return NextResponse.json(
        { 
          message: "회원가입 성공", 
          userId: user.id,
          email: user.email,
          name: user.name,
        },
        { status: 201 }
      )
    } catch (createError: any) {
      console.error("User creation error:", createError)
      
      // Prisma 에러 상세 처리
      if (createError.code === 'P2002') {
        return NextResponse.json(
          { error: "이미 등록된 이메일입니다." },
          { status: 400 }
        )
      }

      return NextResponse.json(
        { error: "회원가입 처리 중 오류가 발생했습니다." },
        { status: 500 }
      )
    }
  } catch (error: any) {
    console.error("Signup error:", error)
    
    // JSON 파싱 오류
    if (error instanceof SyntaxError) {
      return NextResponse.json(
        { error: "잘못된 요청 형식입니다." },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { 
        error: "회원가입 중 오류가 발생했습니다.",
        details: process.env.NODE_ENV === 'development' ? error.message : undefined
      },
      { status: 500 }
    )
  }
}
