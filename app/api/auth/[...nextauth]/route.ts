import NextAuth from "next-auth"
import { authOptions } from "@/lib/auth"

// 환경 변수 확인
if (!process.env.NEXTAUTH_SECRET) {
  console.warn("⚠️ NEXTAUTH_SECRET이 설정되지 않았습니다. 프로덕션에서는 필수입니다.")
}

const handler = NextAuth(authOptions)

export { handler as GET, handler as POST }
