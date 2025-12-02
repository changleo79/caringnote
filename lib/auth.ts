import { NextAuthOptions } from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import bcrypt from "bcryptjs"
import { prisma } from "./prisma"

// 환경 변수 검증 및 안전한 처리
const getAuthSecret = (): string => {
  const secret = process.env.NEXTAUTH_SECRET
  
  if (!secret) {
    if (process.env.NODE_ENV === 'production') {
      // 프로덕션에서는 반드시 필요 - 하지만 앱이 크래시되지 않도록 경고만
      console.error('❌ [중요] NEXTAUTH_SECRET이 설정되지 않았습니다!')
      console.error('❌ Vercel Settings → Environment Variables에서 NEXTAUTH_SECRET을 설정하세요.')
      console.error('❌ 생성 방법: https://generate-secret.vercel.app/32')
      // 프로덕션에서는 임시 secret 사용 (보안 경고와 함께)
      return 'TEMPORARY-SECRET-PLEASE-SET-NEXTAUTH-SECRET-IN-VERCEL'
    }
    // 개발 환경에서는 임시 secret 허용
    return 'dev-secret-change-in-production'
  }
  
  return secret
}

const getAuthUrl = (): string | undefined => {
  return process.env.NEXTAUTH_URL || process.env.VERCEL_URL 
    ? `https://${process.env.VERCEL_URL}` 
    : undefined
}

export const authOptions: NextAuthOptions = {
  secret: getAuthSecret(),
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "이메일", type: "email" },
        password: { label: "비밀번호", type: "password" },
      },
      async authorize(credentials) {
        try {
          if (!credentials?.email || !credentials?.password) {
            console.error("❌ 이메일 또는 비밀번호가 제공되지 않음")
            return null
          }

          const user = await prisma.user.findUnique({
            where: { email: credentials.email },
            include: { careCenter: true },
          })

          if (!user) {
            console.error(`❌ 사용자를 찾을 수 없음: ${credentials.email}`)
            return null
          }

          if (!user.password) {
            console.error(`❌ 사용자 비밀번호가 없음: ${credentials.email}`)
            return null
          }

          const isPasswordValid = await bcrypt.compare(
            credentials.password,
            user.password
          )

          if (!isPasswordValid) {
            console.error(`❌ 비밀번호 불일치: ${credentials.email}`)
            return null
          }

          console.log(`✅ 로그인 성공: ${user.email}`)
          return {
            id: user.id,
            email: user.email,
            name: user.name,
            role: user.role,
            careCenterId: user.careCenterId,
          }
        } catch (error: any) {
          console.error("❌ authorize 오류:", error)
          
          // 데이터베이스 연결 오류인 경우
          if (error.code === 'P1001' || error.message?.includes('connect')) {
            console.error("❌ 데이터베이스 연결 오류가 발생했습니다.")
          }
          
          return null
        }
      },
    }),
  ],
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async jwt({ token, user, trigger }) {
      // 로그인 시 또는 세션 업데이트 트리거 시
      if (user) {
        token.id = user.id
        token.role = user.role
        token.careCenterId = (user as any).careCenterId
      }
      
      // 세션 업데이트 트리거 시 데이터베이스에서 최신 정보 조회
      if (trigger === "update" && token.id) {
        try {
          const dbUser = await prisma.user.findUnique({
            where: { id: token.id as string },
            select: { careCenterId: true, role: true },
          })
          if (dbUser) {
            token.careCenterId = dbUser.careCenterId
            token.role = dbUser.role
          }
        } catch (error) {
          console.error("JWT callback에서 사용자 정보 조회 실패:", error)
        }
      }
      
      return token
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string
        session.user.role = token.role as string
        session.user.careCenterId = token.careCenterId as string | null
      }
      return session
    },
  },
  pages: {
    signIn: "/auth/login",
    signOut: "/auth/login",
  },
  // 디버그 모드 활성화 (문제 진단용)
  debug: process.env.NODE_ENV === 'development',
}
