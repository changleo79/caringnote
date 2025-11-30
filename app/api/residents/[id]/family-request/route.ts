import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

// 가족-입소자 연결 요청 생성
export async function POST(
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

    // FAMILY만 연결 요청 가능
    if (session.user.role !== "FAMILY") {
      return NextResponse.json(
        { error: "가족 회원만 연결 요청을 할 수 있습니다." },
        { status: 403 }
      )
    }

    const body = await req.json()
    const { relationship } = body

    if (!relationship) {
      return NextResponse.json(
        { error: "관계를 선택해주세요." },
        { status: 400 }
      )
    }

    // 입소자 존재 확인
    const resident = await prisma.resident.findUnique({
      where: { id: params.id },
    })

    if (!resident) {
      return NextResponse.json(
        { error: "입소자를 찾을 수 없습니다." },
        { status: 404 }
      )
    }

    // 이미 연결 요청이 있는지 확인
    const existingRequest = await prisma.residentFamily.findFirst({
      where: {
        residentId: params.id,
        userId: session.user.id!,
      },
    })

    if (existingRequest) {
      if (existingRequest.isApproved) {
        return NextResponse.json(
          { error: "이미 연결되어 있습니다." },
          { status: 400 }
        )
      } else {
        return NextResponse.json(
          { error: "이미 연결 요청이 있습니다. 승인을 기다려주세요." },
          { status: 400 }
        )
      }
    }

    // 연결 요청 생성 (승인 대기 상태)
    const residentFamily = await prisma.residentFamily.create({
      data: {
        residentId: params.id,
        userId: session.user.id!,
        relationship,
        isApproved: false, // CAREGIVER 승인 필요
      },
      include: {
        resident: {
          select: {
            id: true,
            name: true,
          },
        },
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    })

    return NextResponse.json({
      message: "연결 요청이 생성되었습니다. 요양원 직원의 승인을 기다려주세요.",
      residentFamily,
    }, { status: 201 })
  } catch (error: any) {
    console.error("Error creating family request:", error)
    return NextResponse.json(
      { error: "연결 요청 생성에 실패했습니다." },
      { status: 500 }
    )
  }
}

