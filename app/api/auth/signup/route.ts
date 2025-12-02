import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import bcrypt from "bcryptjs"

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { email, password, name, phone, role, careCenterId } = body

    console.log("📝 회원가입 요청:", { email, name, role, careCenterId })

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
    let existingUser
    try {
      existingUser = await prisma.user.findUnique({
        where: { email },
      })
    } catch (dbError: any) {
      console.error("❌ 데이터베이스 오류 (사용자 조회):", dbError)
      
      // Prisma 연결 오류 코드 처리
      if (dbError.code === 'P1001' || dbError.code === 'P1000') {
        return NextResponse.json(
          { 
            error: "데이터베이스 연결 오류가 발생했습니다.",
            hint: "데이터베이스 서버에 연결할 수 없습니다. DATABASE_URL을 확인하세요.",
            code: dbError.code
          },
          { status: 503 }
        )
      }

      return NextResponse.json(
        { 
          error: "데이터베이스 오류가 발생했습니다.",
          hint: "잠시 후 다시 시도해주세요.",
          code: dbError.code,
          message: process.env.NODE_ENV === 'development' ? dbError.message : undefined
        },
        { status: 500 }
      )
    }

    if (existingUser) {
      return NextResponse.json(
        { error: "이미 등록된 이메일입니다." },
        { status: 400 }
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

      let careCenter
      try {
        careCenter = await prisma.careCenter.findUnique({
          where: { id: careCenterId },
        })
        console.log("🏥 요양원 조회 결과:", careCenter ? `존재: ${careCenter.name}` : "존재하지 않음")
      } catch (dbError: any) {
        console.error("❌ 데이터베이스 오류 (요양원 조회):", dbError)
        
        if (dbError.code === 'P1001' || dbError.code === 'P1000') {
          return NextResponse.json(
            { 
              error: "데이터베이스 연결 오류가 발생했습니다.",
              hint: "요양원 정보를 확인하는 중 오류가 발생했습니다.",
              code: dbError.code
            },
            { status: 503 }
          )
        }

        return NextResponse.json(
          { 
            error: "요양원 정보를 확인하는 중 오류가 발생했습니다.",
            hint: "잠시 후 다시 시도해주세요.",
            code: dbError.code,
            message: process.env.NODE_ENV === 'development' ? dbError.message : undefined
          },
          { status: 500 }
        )
      }

      if (!careCenter) {
        console.error("❌ 요양원을 찾을 수 없음:", careCenterId)
        
        // 요양원 목록 확인 (디버깅용)
        try {
          const allCareCenters = await prisma.careCenter.findMany({
            select: { id: true, name: true },
            take: 5
          })
          console.log("📋 현재 등록된 요양원 목록:", allCareCenters)
        } catch (e) {
          console.error("요양원 목록 조회 실패:", e)
        }
        
        return NextResponse.json(
          { 
            error: "존재하지 않는 요양원입니다.",
            hint: "요양원을 다시 선택해주세요. 요양원이 없다면 먼저 등록해주세요."
          },
          { status: 400 }
        )
      }
    }

    // 비밀번호 해싱
    let hashedPassword: string
    try {
      hashedPassword = await bcrypt.hash(password, 10)
    } catch (hashError) {
      console.error("❌ 비밀번호 해싱 오류:", hashError)
      return NextResponse.json(
        { error: "비밀번호 처리 중 오류가 발생했습니다." },
        { status: 500 }
      )
    }

    // 사용자 생성
    try {
      console.log("👤 사용자 생성 시도:", { email, name, role, careCenterId: role === "FAMILY" ? careCenterId : null })
      
      let finalCareCenterId = role === "FAMILY" ? careCenterId : null
      
      // CAREGIVER인 경우 자동으로 요양원 생성
      if (role === "CAREGIVER") {
        try {
          // 사용자 ID를 careCenterId로 사용하여 요양원 생성
          const newCareCenterId = `carecenter_${Date.now()}_${Math.random().toString(36).substring(7)}`
          
          const newCareCenter = await prisma.careCenter.create({
            data: {
              id: newCareCenterId,
              name: "", // 빈 이름으로 생성 (나중에 수정)
              address: "", // 빈 주소로 생성 (나중에 수정)
            },
          })
          
          finalCareCenterId = newCareCenter.id
          console.log("✅ 요양원 자동 생성 성공:", finalCareCenterId)
        } catch (careCenterError: any) {
          console.error("❌ 요양원 생성 오류:", careCenterError)
          // 요양원 생성 실패해도 사용자는 생성 (나중에 수정 가능)
        }
      }
      
      const user = await prisma.user.create({
        data: {
          email,
          password: hashedPassword,
          name,
          phone: phone || null,
          role: role || "FAMILY",
          careCenterId: finalCareCenterId,
        },
      })

      console.log("✅ 사용자 생성 성공:", user.id, "careCenterId:", user.careCenterId)

      return NextResponse.json(
        { 
          message: "회원가입 성공", 
          userId: user.id,
          email: user.email,
          name: user.name,
          careCenterId: user.careCenterId,
        },
        { status: 201 }
      )
    } catch (createError: any) {
      console.error("❌ 사용자 생성 오류:", createError)
      console.error("오류 상세:", {
        code: createError.code,
        message: createError.message,
        meta: createError.meta
      })
      
      // Prisma 에러 코드별 처리
      if (createError.code === 'P2002') {
        return NextResponse.json(
          { error: "이미 등록된 이메일입니다." },
          { status: 400 }
        )
      }

      if (createError.code === 'P1001' || createError.code === 'P1000') {
        return NextResponse.json(
          { 
            error: "데이터베이스 연결 오류가 발생했습니다.",
            hint: "데이터베이스에 연결할 수 없습니다.",
            code: createError.code
          },
          { status: 503 }
        )
      }

      // 외래 키 제약 조건 위반 (요양원이 존재하지 않음)
      if (createError.code === 'P2003') {
        return NextResponse.json(
          { 
            error: "요양원 정보가 유효하지 않습니다.",
            hint: "선택하신 요양원을 찾을 수 없습니다. 다시 선택해주세요."
          },
          { status: 400 }
        )
      }

      if (createError.code === 'P2025') {
        return NextResponse.json(
          { error: "관련 데이터를 찾을 수 없습니다." },
          { status: 400 }
        )
      }

      return NextResponse.json(
        { 
          error: "회원가입 처리 중 오류가 발생했습니다.",
          hint: "잠시 후 다시 시도해주세요.",
          code: createError.code,
          message: process.env.NODE_ENV === 'development' ? createError.message : undefined
        },
        { status: 500 }
      )
    }
  } catch (error: any) {
    console.error("❌ 회원가입 전체 오류:", error)
    
    // JSON 파싱 오류
    if (error instanceof SyntaxError) {
      return NextResponse.json(
        { error: "잘못된 요청 형식입니다." },
        { status: 400 }
      )
    }

    // Prisma 클라이언트가 초기화되지 않은 경우
    if (!prisma || typeof prisma.user === 'undefined') {
      console.error("❌ Prisma 클라이언트가 초기화되지 않음")
      return NextResponse.json(
        { 
          error: "데이터베이스 연결 오류가 발생했습니다.",
          hint: "DATABASE_URL 환경 변수를 확인하거나 관리자에게 문의하세요."
        },
        { status: 503 }
      )
    }

    return NextResponse.json(
      { 
        error: "회원가입 중 오류가 발생했습니다.",
        hint: "잠시 후 다시 시도해주세요.",
        message: process.env.NODE_ENV === 'development' ? error.message : undefined
      },
      { status: 500 }
    )
  }
}
