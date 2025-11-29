import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

// 상품 목록 조회
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
    const category = searchParams.get("category")

    let where: any = {}
    
    // 요양원별 상품 또는 공통 상품
    if (session.user.careCenterId) {
      where.OR = [
        { careCenterId: session.user.careCenterId },
        { careCenterId: null }, // 공통 상품
      ]
    } else {
      where.careCenterId = null
    }
    
    if (category) {
      where.category = category
    }

    const products = await prisma.product.findMany({
      where,
      orderBy: {
        createdAt: "desc",
      },
      take: 100,
    })

    return NextResponse.json(products)
  } catch (error: any) {
    console.error("Error fetching products:", error)
    return NextResponse.json(
      { error: "상품 목록을 불러오는데 실패했습니다." },
      { status: 500 }
    )
  }
}

