import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 시드 데이터 생성을 시작합니다...')

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

  console.log('✅ 요양원 데이터 생성 완료:', careCenters.length, '개')
  console.log('생성된 요양원:')
  careCenters.forEach((center) => {
    console.log(`  - ${center.name}`)
  })

  console.log('✅ 시드 데이터 생성 완료!')
}

main()
  .catch((e) => {
    console.error('❌ 시드 데이터 생성 실패:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })

