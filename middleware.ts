import { withAuth } from "next-auth/middleware"
import { NextResponse } from "next/server"

export default withAuth(
  function middleware() {
    return NextResponse.next()
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        const path = req.nextUrl.pathname
        const protectedPrefixes = [
          "/dashboard",
          "/community",
          "/medical",
          "/shop",
          "/residents",
          "/reports",
          "/menu",
          "/announcements",
          "/visits",
          "/requests",
          "/handover",
          "/timeline",
          "/care-center",
          "/profile",
          "/care-ops",
          "/notifications",
        ]
        if (protectedPrefixes.some((p) => path.startsWith(p))) {
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
    "/residents/:path*",
    "/reports/:path*",
    "/menu/:path*",
    "/announcements/:path*",
    "/visits/:path*",
    "/requests/:path*",
    "/handover/:path*",
    "/timeline/:path*",
    "/care-center/:path*",
    "/profile/:path*",
    "/care-ops/:path*",
    "/notifications/:path*",
  ],
}
