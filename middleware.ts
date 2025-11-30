import { withAuth } from "next-auth/middleware"
import { NextResponse } from "next/server"

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token
    const pathname = req.nextUrl.pathname

    // 역할 기반 접근 제어
    const userRole = token?.role as string | undefined

    // CAREGIVER/ADMIN 전용 페이지
    if (pathname.startsWith("/residents/new") || 
        pathname.startsWith("/residents/") && pathname.includes("/edit")) {
      if (userRole !== "CAREGIVER" && userRole !== "ADMIN") {
        return NextResponse.redirect(new URL("/dashboard", req.url))
      }
    }

    // CAREGIVER/ADMIN 전용 페이지
    if (pathname.startsWith("/care-center/members")) {
      if (userRole !== "CAREGIVER" && userRole !== "ADMIN") {
        return NextResponse.redirect(new URL("/dashboard", req.url))
      }
    }

    return NextResponse.next()
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        const pathname = req.nextUrl.pathname

        // 인증이 필요한 경로들
        const protectedPaths = [
          "/dashboard",
          "/community",
          "/medical",
          "/shop",
          "/profile",
          "/residents",
          "/care-center",
          "/notifications",
        ]

        const requiresAuth = protectedPaths.some(path => 
          pathname.startsWith(path)
        )

        if (requiresAuth) {
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
    "/profile/:path*",
    "/residents/:path*",
    "/care-center/:path*",
    "/notifications/:path*",
  ],
}

