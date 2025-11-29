import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

// 의료 기록 상세 조회
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

    const record = await prisma.medicalRecord.findUnique({
      where: { id: params.id },
      include: {
        resident: {
          select: {
            id: true,
            name: true,
            roomNumber: true,
          },
        },
        createdBy: {
          select: {
            id: true,
            name: true,
            avatarUrl: true,
          },
        },
      },
    })

    if (!record) {
      return NextResponse.json(
        { error: "의료 기록을 찾을 수 없습니다." },
        { status: 404 }
      )
    }

    return NextResponse.json({
      ...record,
      attachments: record.attachments ? JSON.parse(record.attachments) : [],
    })
  } catch (error: any) {
    console.error("Error fetching medical record:", error)
    return NextResponse.json(
      { error: "의료 기록을 불러오는데 실패했습니다." },
      { status: 500 }
    )
  }
}

