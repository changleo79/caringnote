import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

// 의료 기록 목록 조회
export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session) {
      return NextResponse.json(
        { error: "인증이 필요합니다." },
        { status: 401 }
      )
    }

    const searchParams = req.nextUrl.searchParams
    const residentId = searchParams.get("residentId")

    let where: any = {}
    
    if (session.user.careCenterId) {
      where.resident = {
        careCenterId: session.user.careCenterId,
      }
    }
    
    if (residentId) {
      where.residentId = residentId
    }

    const records = await prisma.medicalRecord.findMany({
      where,
      include: {
        resident: {
          select: {
            id: true,
            name: true,
          },
        },
        createdBy: {
          select: {
            id: true,
            name: true,
          },
        },
      },
      orderBy: {
        recordDate: "desc",
      },
      take: 100,
    })

    return NextResponse.json(records.map(record => ({
      ...record,
      attachments: record.attachments ? JSON.parse(record.attachments) : [],
    })))
  } catch (error: any) {
    console.error("Error fetching medical records:", error)
    return NextResponse.json(
      { error: "의료 기록을 불러오는데 실패했습니다." },
      { status: 500 }
    )
  }
}

// 의료 기록 작성
export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session) {
      return NextResponse.json(
        { error: "인증이 필요합니다." },
        { status: 401 }
      )
    }

    const body = await req.json()
    const { title, content, recordDate, category, residentId, attachments } = body

    if (!title || !residentId || !recordDate) {
      return NextResponse.json(
        { error: "제목, 입소자, 기록 날짜는 필수입니다." },
        { status: 400 }
      )
    }

    // 첨부파일 배열을 JSON 문자열로 변환
    const attachmentsJson = attachments && Array.isArray(attachments) 
      ? JSON.stringify(attachments) 
      : null

    const record = await prisma.medicalRecord.create({
      data: {
        title,
        content: content || null,
        recordDate: new Date(recordDate),
        category: category || "Other",
        residentId,
        createdById: session.user.id!,
        attachments: attachmentsJson,
      },
      include: {
        resident: {
          select: {
            id: true,
            name: true,
          },
        },
        createdBy: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    })

    return NextResponse.json({
      ...record,
      attachments: record.attachments ? JSON.parse(record.attachments) : [],
    }, { status: 201 })
  } catch (error: any) {
    console.error("Error creating medical record:", error)
    return NextResponse.json(
      { error: "의료 기록 작성에 실패했습니다." },
      { status: 500 }
    )
  }
}

