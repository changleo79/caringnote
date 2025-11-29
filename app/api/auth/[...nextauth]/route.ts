import NextAuth from "next-auth"
import { authOptions } from "@/lib/auth"

const handler = NextAuth(authOptions)

export { handler as GET, handler as POST }

// 에러 핸들링을 위한 래퍼 (개발 환경)
if (process.env.NODE_ENV === 'development') {
  const originalHandler = handler
  handler.get = async (req, res) => {
    try {
      return await originalHandler.get(req, res)
    } catch (error: any) {
      console.error("NextAuth GET 오류:", error)
      return res.status(500).json({ error: "서버 오류가 발생했습니다", details: error.message })
    }
  }
  handler.post = async (req, res) => {
    try {
      return await originalHandler.post(req, res)
    } catch (error: any) {
      console.error("NextAuth POST 오류:", error)
      return res.status(500).json({ error: "서버 오류가 발생했습니다", details: error.message })
    }
  }
}
