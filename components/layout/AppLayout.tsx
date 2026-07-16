"use client"

import { useSession } from "next-auth/react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import Logo from "@/components/brand/Logo"
import {
  BarChart3,
  Building2,
  Camera,
  CalendarDays,
  Grid2X2,
  Heart,
  Home,
  Megaphone,
  NotebookPen,
  Package,
  RefreshCw,
  Settings2,
  ShoppingBag,
  User,
  Users,
  Utensils,
} from "lucide-react"
import { useEffect, useState } from "react"
import NotificationBell from "@/components/notifications/NotificationBell"

const familyTabs = [
  { href: "/dashboard", label: "홈", icon: Home },
  { href: "/reports", label: "소식", icon: NotebookPen },
  { href: "/medical", label: "건강", icon: Heart },
  { href: "/more", label: "더보기", icon: Grid2X2 },
]

const staffTabs = [
  { href: "/dashboard", label: "홈", icon: Home },
  { href: "/residents", label: "어르신", icon: Users },
  { href: "/reports/write", label: "작성", icon: NotebookPen, primary: true },
  { href: "/community", label: "앨범", icon: Camera },
  { href: "/more", label: "업무", icon: Grid2X2 },
]

const familyMore = [
  { href: "/visits", label: "면회", icon: CalendarDays },
  { href: "/requests", label: "물품 요청", icon: Package },
  { href: "/residents/family-requests", label: "가족 연결", icon: Users },
  { href: "/shop", label: "쇼핑", icon: ShoppingBag },
  { href: "/profile", label: "설정", icon: Settings2 },
]

const staffMore = [
  { href: "/menu", label: "식단", icon: Utensils },
  { href: "/announcements", label: "공지", icon: Megaphone },
  { href: "/handover", label: "인수인계", icon: RefreshCw },
  { href: "/care-ops", label: "케어 Ops", icon: Heart },
  { href: "/reports/stats", label: "리포트", icon: BarChart3 },
  { href: "/residents/family-requests", label: "가족 승인", icon: Users },
  { href: "/care-center/edit", label: "시설 정보", icon: Building2 },
  { href: "/profile", label: "설정", icon: Settings2 },
]

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const { data: session } = useSession()
  const pathname = usePathname()
  const [prefersStaffMode, setPrefersStaffMode] = useState(false)
  const isStaff = session?.user?.role === "CAREGIVER" || session?.user?.role === "ADMIN"
  const tabs = isStaff ? staffTabs : familyTabs
  const moreItems = isStaff ? staffMore : familyMore
  const isMorePage =
    pathname === "/more" ||
    (moreItems.some((item) => pathname === item.href || pathname?.startsWith(`${item.href}/`)) &&
      !tabs.some(
        (tab) =>
          tab.href !== "/more" &&
          (pathname === tab.href || pathname?.startsWith(`${tab.href}/`))
      ))

  useEffect(() => {
    document.documentElement.classList.toggle(
      "staff-mode",
      Boolean(isStaff || prefersStaffMode)
    )
    return () => document.documentElement.classList.remove("staff-mode")
  }, [isStaff, prefersStaffMode])

  useEffect(() => {
    fetch("/api/profile")
      .then((response) => (response.ok ? response.json() : null))
      .then((profile) => {
        if (!profile) return
        setPrefersStaffMode(Boolean(profile.staffMode))
        document.documentElement.classList.remove("font-scale-2", "font-scale-3")
        if (profile.fontScale === 2) document.documentElement.classList.add("font-scale-2")
        if (profile.fontScale === 3) document.documentElement.classList.add("font-scale-3")
      })
      .catch(() => {})
  }, [session?.user?.id])

  const isActive = (href: string) => {
    if (href === "/more") return isMorePage
    if (href === "/dashboard") return pathname === href
    return pathname === href || pathname?.startsWith(`${href}/`)
  }

  return (
    <div className="min-h-screen bg-[var(--sn-bg)]">
      <header className="safe-area-top sticky top-0 z-50 border-b border-[var(--sn-line)] bg-[var(--sn-bg)]">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
          <Logo size="sm" href="/dashboard" />
          <div className="flex items-center gap-1">
            <NotificationBell />
            <Link
              href="/profile"
              className="flex h-11 w-11 items-center justify-center rounded-full text-[var(--sn-ink-muted)] hover:bg-[var(--sn-surface-muted)]"
              aria-label="내 설정"
            >
              <User className="h-5 w-5" />
            </Link>
          </div>
        </div>
      </header>

      <div className="mx-auto flex max-w-6xl">
        <aside className="sticky top-16 hidden h-[calc(100vh-4rem)] w-56 shrink-0 border-r border-[var(--sn-line)] md:block">
          <nav className="space-y-1 p-4" aria-label="주요 메뉴">
            {[...tabs.filter((tab) => tab.href !== "/more"), ...moreItems].map((item) => {
              const Icon = item.icon
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={isActive(item.href) ? "nav-item-active" : "nav-item-inactive"}
                >
                  <Icon className="h-5 w-5" />
                  {item.label}
                </Link>
              )
            })}
          </nav>
        </aside>

        <main className="min-w-0 flex-1 pb-24 md:pb-8">
          <div className="page-shell-wide">{children}</div>
        </main>
      </div>

      <nav
        className="safe-area-bottom fixed inset-x-0 bottom-0 z-50 border-t border-[var(--sn-line)] bg-[var(--sn-surface)] md:hidden"
        aria-label="하단 메뉴"
      >
        <div className="mx-auto flex h-[4.5rem] max-w-xl items-stretch px-1">
          {tabs.map((item) => {
            const Icon = item.icon
            const active = isActive(item.href)
            const primary = Boolean("primary" in item && item.primary)
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "relative isolate flex flex-1 flex-col items-center justify-center gap-1 text-xs font-medium",
                  primary &&
                    "my-2 rounded-[var(--sn-radius)] bg-[var(--sn-accent)] text-white",
                  !primary &&
                    (active ? "text-[var(--sn-ink)]" : "text-[var(--sn-ink-faint)]")
                )}
                aria-current={active ? "page" : undefined}
              >
                <Icon className="h-5 w-5" strokeWidth={active ? 2.2 : 1.7} />
                {item.label}
              </Link>
            )
          })}
        </div>
      </nav>
    </div>
  )
}
