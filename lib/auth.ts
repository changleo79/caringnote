import { NextAuthOptions } from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import bcrypt from "bcryptjs"
import { prisma } from "./prisma"

// 환경 변수 검증
if (!process.env.NEXTAUTH_SECRET) {
  console.warn("⚠️ NEXTAUTH_SECRET이 설정되지 않았습니다. 프로덕션에서는 필수입니다.")
}

export const authOptions: NextAuthOptions = {
  secret: process.env.NEXTAUTH_SECRET || "development-secret-change-in-production-please-set-nexauth-secret",
  debug: process.env.NODE_ENV === 'development',
  trustHost: true, // Vercel에서 자동으로 호스트 신뢰
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
          return null
        }
      },
    }),
  ],
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id
        token.role = user.role
        token.careCenterId = (user as any).careCenterId
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
}

