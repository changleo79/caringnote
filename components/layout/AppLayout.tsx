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
  Menu,
  X,
  Building2,
  Users,
  NotebookPen,
  ClipboardList,
  CalendarDays,
  Package,
} from "lucide-react"
import { useEffect, useState } from "react"
import NotificationBell from "@/components/notifications/NotificationBell"

const familyNav = [
  { href: "/dashboard", label: "홈", icon: Home },
  { href: "/reports", label: "소식", icon: NotebookPen },
  { href: "/medical", label: "건강", icon: Heart },
  { href: "/requests", label: "요청", icon: Package },
]

const staffNav = [
  { href: "/dashboard", label: "홈", icon: Home },
  { href: "/reports/write", label: "작성", icon: NotebookPen },
  { href: "/residents", label: "어르신", icon: Users },
  { href: "/community", label: "앨범", icon: Camera },
]

const quietHoursNote =
  "밤 22시–아침 7시에는 알림을 모아 아침에 보여 드립니다 (Quiet hours)."

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const { data: session } = useSession()
  const pathname = usePathname()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const isStaff = session?.user?.role === "CAREGIVER" || session?.user?.role === "ADMIN"

  useEffect(() => {
    document.documentElement.classList.toggle("staff-mode", Boolean(isStaff))
    return () => document.documentElement.classList.remove("staff-mode")
  }, [isStaff])

  useEffect(() => {
    fetch("/api/profile")
      .then((r) => (r.ok ? r.json() : null))
      .then((d) => {
        if (!d?.fontScale) return
        document.documentElement.classList.remove("font-scale-2", "font-scale-3")
        if (d.fontScale === 2) document.documentElement.classList.add("font-scale-2")
        if (d.fontScale === 3) document.documentElement.classList.add("font-scale-3")
      })
      .catch(() => {})
  }, [session?.user?.id])

  const isActive = (href: string) =>
    pathname === href || pathname?.startsWith(href + "/")

  const navItems = isStaff ? staffNav : familyNav
  const extra = isStaff
    ? [
        { href: "/menu", label: "식단", icon: ClipboardList },
        { href: "/announcements", label: "공지", icon: CalendarDays },
        { href: "/handover", label: "인수인계", icon: ClipboardList },
        { href: "/care-ops", label: "케어Ops", icon: Heart },
        { href: "/reports/stats", label: "리포트", icon: ClipboardList },
        { href: "/residents/family-requests", label: "가족승인", icon: Users },
        { href: "/care-center/edit", label: "요양원", icon: Building2 },
        { href: "/profile", label: "설정", icon: User },
        { href: "/shop", label: "쇼핑", icon: ShoppingBag },
      ]
    : [
        { href: "/visits", label: "면회", icon: CalendarDays },
        { href: "/shop", label: "쇼핑", icon: ShoppingBag },
        { href: "/residents/family-requests", label: "연결", icon: Users },
        { href: "/profile", label: "설정", icon: User },
      ]

  const allNavItems = [...navItems, ...extra]

  return (
    <div className="min-h-screen bg-warm-50">
      <header className="bg-white border-b border-neutral-200/80 sticky top-0 z-50 safe-area-top">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between h-16">
            <Logo variant="default" size="sm" href="/dashboard" />

            <div className="flex items-center gap-2">
              <NotificationBell />
              <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-neutral-50">
                <div className="w-8 h-8 bg-brand-100 rounded-lg flex items-center justify-center">
                  <User className="w-4 h-4 text-brand-600" />
                </div>
                <span className="text-body font-medium text-neutral-700 max-w-[120px] truncate">
                  {session?.user?.name}
                </span>
              </div>
              <button
                onClick={() => signOut({ callbackUrl: "/" })}
                className="p-2.5 text-neutral-500 hover:text-red-600 hover:bg-red-50 rounded-xl transition-colors"
                aria-label="로그아웃"
              >
                <LogOut className="w-5 h-5" />
              </button>
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="md:hidden p-2.5 text-neutral-600 hover:bg-neutral-100 rounded-xl"
                aria-label="메뉴"
              >
                {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>

        {mobileMenuOpen && (
          <div className="md:hidden border-t border-neutral-100 bg-white">
            <nav className="max-w-7xl mx-auto px-4 py-3 space-y-1">
              {allNavItems.map((item) => {
                const Icon = item.icon
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={isActive(item.href) ? "nav-item-active" : "nav-item-inactive"}
                  >
                    <Icon className="w-5 h-5" />
                    {item.label}
                  </Link>
                )
              })}
            </nav>
          </div>
        )}
      </header>

      <div className="flex max-w-7xl mx-auto">
        <aside className="hidden md:block w-56 flex-shrink-0 border-r border-neutral-200/80 min-h-[calc(100vh-4rem)] sticky top-16 bg-white">
          <nav className="p-4 space-y-1">
            {allNavItems.map((item) => {
              const Icon = item.icon
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={isActive(item.href) ? "nav-item-active" : "nav-item-inactive"}
                >
                  <Icon className="w-5 h-5" />
                  {item.label}
                </Link>
              )
            })}
          </nav>
        </aside>

        <main className="flex-1 min-w-0 pb-24 md:pb-8">{children}</main>
      </div>

      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-neutral-200/80 md:hidden z-50 safe-area-bottom">
        <div className="flex justify-around items-center h-16 px-2">
          {navItems.map((item) => {
            const Icon = item.icon
            const active = isActive(item.href)
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex flex-col items-center justify-center flex-1 h-full gap-0.5 transition-colors touch-manipulation",
                  active ? "text-brand-600" : "text-neutral-400"
                )}
              >
                <div className={cn("p-2 rounded-xl", active && "bg-brand-50")}>
                  <Icon className="w-5 h-5" />
                </div>
                <span className={cn("text-[11px] font-medium", active && "font-semibold")}>
                  {item.label}
                </span>
              </Link>
            )
          })}
        </div>
      </nav>

      {isStaff && pathname !== "/reports/write" && (
        <Link href="/reports/write" className="staff-fab md:hidden" aria-label="알림장 쓰기">
          <NotebookPen className="w-7 h-7" />
        </Link>
      )}

      {!isStaff && (
        <p className="sr-only" aria-live="polite">
          {quietHoursNote}
        </p>
      )}
    </div>
  )
}
