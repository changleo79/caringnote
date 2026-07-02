import { NextAuthOptions } from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import bcrypt from "bcryptjs"
import { prisma } from "./prisma"

function getAuthSecret(): string {
  const secret = process.env.NEXTAUTH_SECRET
  if (!secret) {
    if (process.env.NODE_ENV === 'production') {
      console.error(
        '[Silver Note] NEXTAUTH_SECRET is not set. Configure it in Vercel Environment Variables.'
      )
      // 빌드 단계에서 throw하면 Vercel 배포가 실패하므로 런타임까지 임시 값 사용
      return 'TEMPORARY-SECRET-SET-NEXTAUTH-SECRET-IN-VERCEL'
    }
    return 'dev-secret-change-in-production'
  }
  return secret
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
        if (!credentials?.email || !credentials?.password) {
          return null
        }

        try {
          const user = await prisma.user.findUnique({
            where: { email: credentials.email },
            include: { careCenter: true },
          })

          if (!user?.password) {
            return null
          }

          const isPasswordValid = await bcrypt.compare(
            credentials.password,
            user.password
          )

          if (!isPasswordValid) {
            return null
          }

          return {
            id: user.id,
            email: user.email,
            name: user.name,
            role: user.role,
            careCenterId: user.careCenterId,
          }
        } catch (error) {
          console.error("Auth error:", error)
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
      if (user) {
        token.id = user.id
        token.role = user.role
        token.careCenterId = (user as { careCenterId?: string | null }).careCenterId ?? null
      }

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
          console.error("JWT update error:", error)
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
}
