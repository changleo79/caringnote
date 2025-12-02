import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

// 요양원 정보 조회
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> | { id: string } }
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

    // Next.js 13+ params 처리
    const resolvedParams = await Promise.resolve(params)
    const paramId = resolvedParams.id

    // careCenterId가 있으면 사용, 없으면 params.id 사용 (새 요양원 생성용)
    // 하지만 params.id가 사용자 ID와 다를 수 있으므로, 항상 session.user.careCenterId 우선
    let careCenterId = session.user.careCenterId || paramId || session.user.id

    // 권한 체크: careCenterId가 있고 params.id가 다르면 권한 없음
    // 단, careCenterId가 없을 때는 새로 생성하는 것이므로 허용
    if (session.user.careCenterId && paramId && session.user.careCenterId !== paramId) {
      console.log("권한 체크 실패:", { userCareCenterId: session.user.careCenterId, paramId })
      return NextResponse.json(
        { error: "권한이 없습니다." },
        { status: 403 }
      )
    }

    console.log("요양원 조회 시도:", { 
      careCenterId, 
      userId: session.user.id, 
      hasCareCenterId: !!session.user.careCenterId,
      paramId 
    })

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
      console.log("요양원이 없음 - 빈 데이터 반환 (정상), careCenterId:", careCenterId)
      // 빈 요양원 데이터 반환 (저장 시 자동 생성됨)
      // 200 OK로 반환하여 에러가 아님을 명확히 함
      return NextResponse.json({
        id: careCenterId,
        name: "",
        address: "",
        phone: "",
        email: "",
        description: "",
        logoUrl: "",
        isEmpty: true, // 빈 데이터임을 표시
      })
    } else {
      console.log("요양원 조회 성공:", careCenter.id)
    }

    return NextResponse.json(careCenter)
  } catch (error: any) {
    console.error("Error fetching care center:", error)
    return NextResponse.json(
      { error: "요양원 정보를 불러오는데 실패했습니다.", details: process.env.NODE_ENV === 'development' ? error.message : undefined },
      { status: 500 }
    )
  }
}

// 요양원 정보 수정
export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> | { id: string } }
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

    // Next.js 13+ params 처리
    const resolvedParams = await Promise.resolve(params)
    const paramId = resolvedParams.id

    // careCenterId 결정: 세션에 있으면 사용, 없으면 paramId 또는 사용자 ID
    let careCenterId = session.user.careCenterId || paramId || session.user.id

    // 권한 체크: careCenterId가 있고 paramId가 다르면 권한 없음
    // 단, careCenterId가 없을 때는 새로 생성하는 것이므로 허용
    if (session.user.careCenterId && paramId && session.user.careCenterId !== paramId) {
      console.log("권한 체크 실패:", { userCareCenterId: session.user.careCenterId, paramId })
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

    console.log("요양원 수정 시도:", { 
      careCenterId, 
      userId: session.user.id, 
      hasCareCenterId: !!session.user.careCenterId, 
      paramId,
      name, 
      address 
    })

    // 요양원이 존재하는지 확인
    let careCenter = await prisma.careCenter.findUnique({
      where: { id: careCenterId },
    })

    let updatedCareCenter
    let shouldUpdateUserCareCenterId = false

    // 요양원이 없으면 생성
    if (!careCenter) {
      console.log("요양원이 없어서 생성 시도:", careCenterId)
      
      try {
        // create를 사용하여 새로 생성
        updatedCareCenter = await prisma.careCenter.create({
          data: {
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

        console.log("요양원 생성 성공:", updatedCareCenter.id)

        // 사용자의 careCenterId 업데이트 (없을 경우만)
        if (!session.user.careCenterId) {
          shouldUpdateUserCareCenterId = true
        }
      } catch (createError: any) {
        console.error("요양원 생성 오류:", createError)
        
        // P2002: Unique constraint failed - 이미 존재할 수 있음
        if (createError.code === "P2002") {
          console.log("요양원이 이미 존재함, 업데이트로 진행")
          // 다시 조회해서 업데이트
          careCenter = await prisma.careCenter.findUnique({
            where: { id: careCenterId },
          })
          if (careCenter) {
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
            console.log("요양원 업데이트 성공 (이미 존재했던 경우)")
          } else {
            throw createError
          }
        } else {
          throw createError
        }
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

    // 사용자의 careCenterId 업데이트 (필요한 경우)
    if (shouldUpdateUserCareCenterId) {
      try {
        await prisma.user.update({
          where: { id: session.user.id },
          data: { careCenterId: careCenterId },
        })
        console.log("사용자 careCenterId 업데이트 완료:", careCenterId)
      } catch (updateError: any) {
        console.error("사용자 careCenterId 업데이트 오류:", updateError)
        // 사용자 업데이트 실패해도 요양원은 생성되었으므로 계속 진행
      }
    }

    return NextResponse.json({
      message: "요양원 정보가 수정되었습니다.",
      careCenter: updatedCareCenter,
      careCenterId: updatedCareCenter.id, // 클라이언트에서 세션 갱신에 사용
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

    if (error.code === "P2002") {
      return NextResponse.json(
        { error: "요양원 ID가 이미 사용 중입니다." },
        { status: 409 }
      )
    }

    return NextResponse.json(
      { 
        error: "요양원 정보 수정에 실패했습니다.",
        details: process.env.NODE_ENV === 'development' ? error.message : undefined
      },
      { status: 500 }
    )
  }
}

