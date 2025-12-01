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
    if (session.user.role !== "CAREGIVER") {
      return NextResponse.json(
        { error: "요양원 직원만 접근할 수 있습니다." },
        { status: 403 }
      )
    }

    // careCenterId가 있으면 사용, 없으면 params.id 사용 (새 요양원 생성용)
    let careCenterId = session.user.careCenterId || params.id

    // 자신의 요양원만 조회 가능
    if (session.user.careCenterId && session.user.careCenterId !== params.id) {
      return NextResponse.json(
        { error: "권한이 없습니다." },
        { status: 403 }
      )
    }

    console.log("요양원 조회 시도:", { careCenterId, userId: session.user.id, hasCareCenterId: !!session.user.careCenterId })

    let careCenter = await prisma.careCenter.findUnique({
      where: { id: careCenterId },
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

    // 요양원이 없으면 빈 데이터 반환 (저장 시 생성됨)
    if (!careCenter) {
      console.log("요양원이 없음 - 빈 데이터 반환")
      // 빈 요양원 데이터 반환 (저장 시 자동 생성됨)
      return NextResponse.json({
        id: careCenterId,
        name: "",
        address: "",
        phone: "",
        email: "",
        description: "",
        logoUrl: "",
      })
    } else {
      console.log("요양원 조회 성공:", careCenter.id)
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
    if (session.user.role !== "CAREGIVER") {
      return NextResponse.json(
        { error: "요양원 직원만 수정할 수 있습니다." },
        { status: 403 }
      )
    }

    // careCenterId가 있으면 사용, 없으면 params.id 사용
    let careCenterId = session.user.careCenterId || params.id

    // 자신의 요양원만 수정 가능
    if (session.user.careCenterId && session.user.careCenterId !== params.id) {
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

    console.log("요양원 수정 시도:", { careCenterId, userId: session.user.id, hasCareCenterId: !!session.user.careCenterId, name, address })

    // 요양원이 존재하는지 확인
    let careCenter = await prisma.careCenter.findUnique({
      where: { id: careCenterId },
    })

    let updatedCareCenter

    // 요양원이 없으면 생성 (upsert 사용)
    if (!careCenter) {
      console.log("요양원이 없어서 생성 시도:", careCenterId)
      
      try {
        // upsert를 사용하여 생성 또는 업데이트
        updatedCareCenter = await prisma.careCenter.upsert({
          where: { id: careCenterId },
          update: {
            name,
            address,
            phone: phone || null,
            email: email || null,
            description: description || null,
            logoUrl: logoUrl || null,
          },
          create: {
            id: careCenterId,
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

        console.log("요양원 생성/업데이트 성공:", updatedCareCenter.id)

        // 사용자의 careCenterId 업데이트 (없을 경우만)
        if (!session.user.careCenterId) {
          await prisma.user.update({
            where: { id: session.user.id },
            data: { careCenterId: careCenterId },
          })
          console.log("사용자 careCenterId 업데이트 완료")
        }
      } catch (createError: any) {
        console.error("요양원 생성 오류:", createError)
        throw createError
      }
    } else {
      // 요양원이 있으면 업데이트
      console.log("요양원 업데이트 시도:", careCenter.id)
      updatedCareCenter = await prisma.careCenter.update({
        where: { id: careCenterId },
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
      console.log("요양원 업데이트 성공")
    }

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

