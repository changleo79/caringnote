"use client"

import { useSession, signOut } from "next-auth/react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import Logo from "@/components/brand/Logo"
import {
  Home,
  Heart,
  LogOut,
  Menu,
  X,
  Users,
  NotebookPen,
  Package,
  MoreHorizontal,
  Camera,
  ClipboardList,
  CalendarDays,
  Building2,
  ShoppingBag,
  User,
} from "lucide-react"
import { useEffect, useState } from "react"
import NotificationBell from "@/components/notifications/NotificationBell"

const familyTabs = [
  { href: "/dashboard", label: "홈", icon: Home },
  { href: "/reports", label: "소식", icon: NotebookPen },
  { href: "/medical", label: "건강", icon: Heart },
  { href: "/more", label: "더보기", icon: MoreHorizontal },
]

const staffTabs = [
  { href: "/reports/write", label: "작성", icon: NotebookPen },
  { href: "/residents", label: "어르신", icon: Users },
  { href: "/dashboard", label: "홈", icon: Home },
]

const familyMore = [
  { href: "/visits", label: "면회", icon: CalendarDays },
  { href: "/requests", label: "물품 요청", icon: Package },
  { href: "/residents/family-requests", label: "가족 연결", icon: Users },
  { href: "/shop", label: "쇼핑", icon: ShoppingBag },
  { href: "/profile", label: "설정", icon: User },
]

const staffMore = [
  { href: "/community", label: "앨범", icon: Camera },
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

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const { data: session } = useSession()
  const pathname = usePathname()
  const [menuOpen, setMenuOpen] = useState(false)
  const isStaff = session?.user?.role === "CAREGIVER" || session?.user?.role === "ADMIN"
  const tabs = isStaff ? staffTabs : familyTabs
  const moreItems = isStaff ? staffMore : familyMore
  const isMorePage =
    moreItems.some((i) => pathname === i.href || pathname?.startsWith(i.href + "/")) &&
    !tabs.some((t) => t.href !== "/more" && (pathname === t.href || pathname?.startsWith(t.href + "/")))

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

  const isActive = (href: string) => {
    if (href === "/more") return isMorePage || pathname === "/more"
    if (href === "/dashboard") return pathname === "/dashboard"
    return pathname === href || pathname?.startsWith(href + "/")
  }

  return (
    <div className="min-h-screen bg-[var(--sn-bg)]">
      <header className="safe-area-top sticky top-0 z-50 border-b border-[var(--sn-line)] bg-[var(--sn-bg)]/90 backdrop-blur-md">
        <div className="mx-auto flex h-14 max-w-3xl items-center justify-between px-4 sm:px-6">
          <Logo size="sm" href="/dashboard" />
          <div className="flex items-center gap-1">
            <NotificationBell />
            <button
              onClick={() => signOut({ callbackUrl: "/" })}
              className="rounded-xl p-2.5 text-[var(--sn-ink-muted)] hover:bg-[var(--sn-accent-soft)] hover:text-[var(--sn-accent-hover)]"
              aria-label="로그아웃"
            >
              <LogOut className="h-5 w-5" />
            </button>
            <button
              onClick={() => setMenuOpen((v) => !v)}
              className="rounded-xl p-2.5 text-[var(--sn-ink-muted)] hover:bg-[var(--sn-accent-soft)] md:hidden"
              aria-label="메뉴"
            >
              {menuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>

        {menuOpen && (
          <nav className="border-t border-[var(--sn-line)] px-4 py-3 md:hidden">
            {moreItems.map((item) => {
              const Icon = item.icon
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMenuOpen(false)}
                  className={isActive(item.href) ? "nav-item-active" : "nav-item-inactive"}
                >
                  <Icon className="h-5 w-5" />
                  {item.label}
                </Link>
              )
            })}
          </nav>
        )}
      </header>

      <div className="mx-auto flex max-w-5xl">
        <aside className="sticky top-14 hidden min-h-[calc(100vh-3.5rem)] w-52 shrink-0 border-r border-[var(--sn-line)] md:block">
          <nav className="space-y-1 p-3">
            {[...tabs.filter((t) => t.href !== "/more"), ...moreItems].map((item) => {
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

        <main className="min-w-0 flex-1 pb-24 md:pb-10">{children}</main>
      </div>

      <nav className="safe-area-bottom fixed bottom-0 left-0 right-0 z-50 border-t border-[var(--sn-line)] bg-[var(--sn-bg)]/95 backdrop-blur-md md:hidden">
        <div className="flex h-16 items-stretch justify-around px-1">
          {tabs.map((item) => {
            const Icon = item.icon
            const active = isActive(item.href)
            const href = item.href === "/more" ? (isStaff ? "/community" : "/visits") : item.href
            return (
              <Link
                key={item.label}
                href={href}
                className={cn(
                  "flex flex-1 flex-col items-center justify-center gap-0.5 text-[11px] font-medium touch-manipulation",
                  active ? "text-[var(--sn-accent)]" : "text-[var(--sn-ink-faint)]"
                )}
              >
                <Icon className="h-5 w-5" strokeWidth={active ? 2.25 : 1.75} />
                {item.label}
              </Link>
            )
          })}
        </div>
      </nav>

      {isStaff && pathname !== "/reports/write" && (
        <Link href="/reports/write" className="staff-fab md:hidden" aria-label="알림장 쓰기">
          <NotebookPen className="h-7 w-7" />
        </Link>
      )}
    </div>
  )
}
