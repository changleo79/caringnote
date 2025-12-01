"use client"

import { useSession, signOut } from "next-auth/react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import Logo from "@/components/brand/Logo"
import {
  Home,
  Camera,
  Heart,
  ShoppingBag,
  LogOut,
  User,
  Bell,
  Menu,
  X,
} from "lucide-react"
import { useState } from "react"

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const { data: session } = useSession()
  const pathname = usePathname()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const navItems = [
    { href: "/dashboard", label: "홈", icon: Home },
    { href: "/community", label: "커뮤니티", icon: Camera },
    { href: "/medical", label: "의료 정보", icon: Heart },
    { href: "/shop", label: "쇼핑몰", icon: ShoppingBag },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-neutral-50 via-primary-50/20 to-neutral-50">
      {/* 상단 네비게이션 - 프리미엄 느낌 */}
      <header className="bg-white/90 backdrop-blur-2xl border-b border-white/40 sticky top-0 z-50 shadow-app-lg">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-20">
            <Logo variant="default" size="md" href="/dashboard" />
            
            <div className="flex items-center gap-3">
              {/* 알림 */}
              <button className="relative p-3 text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100 rounded-2xl transition-all duration-300 hover:scale-110">
                <Bell className="w-5 h-5" />
                <span className="absolute top-2 right-2 w-2.5 h-2.5 bg-gradient-to-r from-red-500 to-pink-500 rounded-full border-2 border-white"></span>
              </button>

              {/* 사용자 메뉴 */}
              <div className="flex items-center gap-3">
                <div className="hidden sm:flex items-center gap-3 text-sm text-neutral-700 px-4 py-2 bg-neutral-50 rounded-2xl">
                  <div className="w-10 h-10 bg-gradient-to-br from-primary-500 via-primary-600 to-accent-500 rounded-2xl flex items-center justify-center shadow-lg shadow-primary-500/30">
                    <User className="w-5 h-5 text-white" />
                  </div>
                  <span className="font-bold">{session?.user?.name}</span>
                </div>
                <button
                  onClick={() => signOut({ callbackUrl: "/" })}
                  className="p-3 text-neutral-600 hover:text-red-600 hover:bg-red-50 rounded-2xl transition-all duration-300 hover:scale-110"
                  title="로그아웃"
                >
                  <LogOut className="w-5 h-5" />
                </button>
              </div>

              {/* 모바일 메뉴 버튼 */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="md:hidden p-3 text-neutral-600 hover:bg-neutral-100 rounded-2xl transition-all duration-300"
              >
                {mobileMenuOpen ? (
                  <X className="w-6 h-6" />
                ) : (
                  <Menu className="w-6 h-6" />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* 모바일 메뉴 (드롭다운) - 앱다운 느낌 */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-neutral-100 bg-white/95 backdrop-blur-xl">
            <nav className="container mx-auto px-4 py-3 space-y-2">
              {navItems.map((item) => {
                const Icon = item.icon
                const isActive = pathname === item.href || pathname?.startsWith(item.href + "/")
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={cn(
                      "flex items-center gap-4 px-5 py-4 rounded-2xl transition-all duration-300",
                      isActive
                        ? "bg-gradient-to-r from-primary-50 to-primary-100 text-primary-700 font-bold shadow-md shadow-primary-100/50"
                        : "text-neutral-600 hover:bg-neutral-50 hover:scale-[1.02]"
                    )}
                  >
                    <Icon className={cn("w-6 h-6", isActive && "scale-110")} />
                    <span className="text-base">{item.label}</span>
                  </Link>
                )
              })}
            </nav>
          </div>
        )}
      </header>

      {/* 하단 네비게이션 (모바일) - 앱다운 느낌 */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-xl border-t border-neutral-100 md:hidden z-50 shadow-app-xl">
        <div className="flex justify-around items-center h-20 safe-area-inset-bottom px-2">
          {navItems.map((item) => {
            const Icon = item.icon
            const isActive = pathname === item.href || pathname?.startsWith(item.href + "/")
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex flex-col items-center justify-center flex-1 h-full transition-all duration-300",
                  isActive
                    ? "text-primary-600"
                    : "text-neutral-400 hover:text-neutral-600"
                )}
              >
                <div className={cn(
                  "p-3 rounded-2xl transition-all duration-300 mb-1",
                  isActive 
                    ? "bg-gradient-to-br from-primary-500 to-primary-600 shadow-lg shadow-primary-500/30 scale-110" 
                    : "hover:bg-neutral-100"
                )}>
                  <Icon className={cn("w-6 h-6", isActive && "text-white")} />
                </div>
                <span className={cn(
                  "text-xs font-semibold",
                  isActive && "text-primary-600"
                )}>
                  {item.label}
                </span>
              </Link>
            )
          })}
        </div>
      </nav>

      {/* 사이드바 (데스크톱) - 프리미엄 느낌 */}
      <div className="hidden md:flex">
        <aside className="w-80 bg-gradient-to-b from-white/90 via-primary-50/20 to-white/90 backdrop-blur-2xl border-r-2 border-primary-200/30 min-h-[calc(100vh-80px)] sticky top-20 shadow-xl shadow-primary-100/30">
          <nav className="p-6 space-y-3">
            {navItems.map((item) => {
              const Icon = item.icon
              const isActive = pathname === item.href || pathname?.startsWith(item.href + "/")
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "flex items-center gap-4 px-6 py-5 rounded-2xl transition-all duration-500 group relative overflow-hidden",
                    isActive
                      ? "bg-gradient-to-r from-primary-500 via-primary-600 to-primary-700 text-white font-black shadow-2xl shadow-primary-500/40 scale-[1.02]"
                      : "text-neutral-600 hover:bg-white/80 hover:text-neutral-900 hover:scale-[1.01] hover:shadow-lg"
                  )}
                >
                  {isActive && (
                    <div className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 animate-shimmer"></div>
                  )}
                  <Icon className={cn(
                    "w-6 h-6 transition-transform duration-500 relative z-10",
                    isActive && "scale-110"
                  )} />
                  <span className="text-base relative z-10">{item.label}</span>
                </Link>
              )
            })}
          </nav>
        </aside>

        {/* 메인 컨텐츠 */}
        <main className="flex-1 pb-6">
          {children}
        </main>
      </div>

      {/* 모바일 메인 컨텐츠 */}
      <main className="md:hidden pb-20">
        {children}
      </main>
    </div>
  )
}
