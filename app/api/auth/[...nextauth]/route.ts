import NextAuth from "next-auth"
import { authOptions } from "@/lib/auth"

// NextAuth 핸들러 - 직접 export
const handler = NextAuth(authOptions)

export { handler as GET, handler as POST }
