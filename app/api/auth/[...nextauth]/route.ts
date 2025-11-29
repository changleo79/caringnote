import NextAuth from "next-auth"
import { authOptions } from "@/lib/auth"

// 환경 변수 확인
if (!process.env.NEXTAUTH_SECRET) {
  console.error("⚠️ 경고: NEXTAUTH_SECRET이 설정되지 않았습니다. 프로덕션에서는 필수입니다.")
}

try {
  const handler = NextAuth(authOptions)
  export { handler as GET, handler as POST }
} catch (error: any) {
  console.error("❌ NextAuth 초기화 오류:", error)
  // 에러가 발생해도 기본 핸들러는 내보냄
  const handler = NextAuth(authOptions)
  export { handler as GET, handler as POST }
}
