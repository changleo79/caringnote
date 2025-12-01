import { withAuth } from "next-auth/middleware"
import { NextResponse } from "next/server"

export default withAuth(
  function middleware(req) {
    return NextResponse.next()
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        // /dashboard 및 하위 경로는 인증 필요
        if (req.nextUrl.pathname.startsWith("/dashboard")) {
          return !!token
        }
        if (req.nextUrl.pathname.startsWith("/community")) {
          return !!token
        }
        if (req.nextUrl.pathname.startsWith("/medical")) {
          return !!token
        }
        if (req.nextUrl.pathname.startsWith("/shop")) {
          return !!token
        }
        return true
      },
    },
  }
)

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/community/:path*",
    "/medical/:path*",
    "/shop/:path*",
  ],
}

