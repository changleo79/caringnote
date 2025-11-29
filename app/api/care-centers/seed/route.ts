import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

// 개발/테스트 환경에서만 사용 가능한 시드 API
export async function POST() {
  // 프로덕션에서는 비활성화
  if (process.env.NODE_ENV === 'production' && !process.env.ALLOW_SEED) {
    return NextResponse.json(
      { error: "프로덕션 환경에서는 시드 데이터를 생성할 수 없습니다." },
      { status: 403 }
    )
  }

  try {
    // 테스트용 요양원 생성
    const careCenters = await Promise.all([
      prisma.careCenter.upsert({
        where: { name: '행복 요양원' },
        update: {},
        create: {
          name: '행복 요양원',
          address: '서울특별시 강남구 테헤란로 123',
          phone: '02-1234-5678',
          email: 'info@happy-care.co.kr',
          description: '가족처럼 따뜻하게 모시는 요양원입니다.',
        },
      }),
      prisma.careCenter.upsert({
        where: { name: '사랑 요양원' },
        update: {},
        create: {
          name: '사랑 요양원',
          address: '서울특별시 서초구 서초대로 456',
          phone: '02-2345-6789',
          email: 'contact@love-care.co.kr',
          description: '진심으로 정성스럽게 돌봐드립니다.',
        },
      }),
      prisma.careCenter.upsert({
        where: { name: '평화 요양원' },
        update: {},
        create: {
          name: '평화 요양원',
          address: '서울특별시 송파구 올림픽로 789',
          phone: '02-3456-7890',
          email: 'peace@care.co.kr',
          description: '안전하고 편안한 환경을 제공합니다.',
        },
      }),
    ])

    return NextResponse.json({
      message: "시드 데이터 생성 완료",
      count: careCenters.length,
      careCenters: careCenters.map(c => ({ id: c.id, name: c.name })),
    })
  } catch (error: any) {
    console.error("Seed error:", error)
    return NextResponse.json(
      { 
        error: "시드 데이터 생성 중 오류가 발생했습니다.",
        details: process.env.NODE_ENV === 'development' ? error.message : undefined
      },
      { status: 500 }
    )
  }
}

