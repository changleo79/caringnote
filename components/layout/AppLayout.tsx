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
} from "lucide-react"
import { useState } from "react"
import NotificationBell from "@/components/notifications/NotificationBell"

const navItems = [
  { href: "/dashboard", label: "홈", icon: Home },
  { href: "/community", label: "일상", icon: Camera },
  { href: "/medical", label: "의료", icon: Heart },
  { href: "/shop", label: "쇼핑", icon: ShoppingBag },
]

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const { data: session } = useSession()
  const pathname = usePathname()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const isActive = (href: string) =>
    pathname === href || pathname?.startsWith(href + "/")

  const caregiverExtra = session?.user?.role === "CAREGIVER"
    ? [{ href: "/care-center/edit", label: "요양원", icon: Building2 }]
    : []

  const allNavItems = [...navItems, ...caregiverExtra]

  return (
    <div className="min-h-screen bg-warm-50">
      {/* Top Header */}
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
                title="로그아웃"
                aria-label="로그아웃"
              >
                <LogOut className="w-5 h-5" />
              </button>

              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="md:hidden p-2.5 text-neutral-600 hover:bg-neutral-100 rounded-xl transition-colors"
                aria-label="메뉴"
              >
                {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile dropdown menu */}
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
        {/* Desktop Sidebar */}
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

        {/* Main Content */}
        <main className="flex-1 min-w-0 pb-24 md:pb-8">
          {children}
        </main>
      </div>

      {/* Mobile Bottom Nav */}
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
                <div className={cn(
                  "p-2 rounded-xl transition-colors",
                  active && "bg-brand-50"
                )}>
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
    </div>
  )
}
