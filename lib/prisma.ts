import { PrismaClient } from '@prisma/client'

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

const prismaClientSingleton = () => {
  // DATABASE_URL이 없으면 오류 메시지와 함께 예외 발생
  if (!process.env.DATABASE_URL) {
    console.error('⚠️ DATABASE_URL 환경 변수가 설정되지 않았습니다.')
    throw new Error('DATABASE_URL environment variable is not set')
  }

  return new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['error', 'warn'] : ['error'],
    errorFormat: 'pretty',
  })
}

let prisma: PrismaClient

try {
  prisma = globalForPrisma.prisma ?? prismaClientSingleton()
  
  if (process.env.NODE_ENV !== 'production') {
    globalForPrisma.prisma = prisma
  }
} catch (error) {
  console.error('❌ Prisma 클라이언트 초기화 실패:', error)
  // 개발 환경에서만 에러를 throw
  if (process.env.NODE_ENV === 'development') {
    throw error
  }
  // 프로덕션에서는 빈 객체로 fallback (런타임 오류 방지)
  prisma = {} as PrismaClient
}

export { prisma }
