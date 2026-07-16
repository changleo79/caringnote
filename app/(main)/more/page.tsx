"use client"

import { useSession, signOut } from "next-auth/react"
import Link from "next/link"
import {
  BarChart3,
  Building2,
  CalendarDays,
  ChevronRight,
  Heart,
  LogOut,
  Megaphone,
  Package,
  RefreshCw,
  Settings2,
  ShoppingBag,
  Users,
  Utensils,
} from "lucide-react"
import { PageHeader } from "@/components/calm/PageHeader"

const familyItems = [
  { href: "/visits", label: "면회 일정", description: "방문을 예약하고 확인해요", icon: CalendarDays },
  { href: "/requests", label: "물품 요청", description: "필요한 물품을 시설에 전해요", icon: Package },
  { href: "/residents/family-requests", label: "가족 연결", description: "부모님과 가족 계정을 연결해요", icon: Users },
  { href: "/shop", label: "쇼핑", description: "필요한 생필품을 주문해요", icon: ShoppingBag },
]

const staffItems = [
  { href: "/menu", label: "식단", description: "오늘 식단 작성과 확인", icon: Utensils },
  { href: "/announcements", label: "공지", description: "가족에게 시설 소식 전달", icon: Megaphone },
  { href: "/handover", label: "인수인계", description: "다음 근무자에게 전달", icon: RefreshCw },
  { href: "/care-ops", label: "케어 Ops", description: "투약과 케어플랜 확인", icon: Heart },
  { href: "/residents/family-requests", label: "가족 승인", description: "새 연결 요청 처리", icon: Users },
  { href: "/reports/stats", label: "소통 리포트", description: "월별 기록과 열람 현황", icon: BarChart3 },
  { href: "/care-center/edit", label: "시설 정보", description: "공개 시설 정보 관리", icon: Building2 },
]

export default function MorePage() {
  const { data: session } = useSession()
  const isStaff = session?.user?.role === "CAREGIVER" || session?.user?.role === "ADMIN"
  const items = isStaff ? staffItems : familyItems

  return (
    <div className="mx-auto max-w-2xl">
      <PageHeader
        eyebrow={isStaff ? "업무 도구" : undefined}
        title={isStaff ? "오늘의 업무" : "더보기"}
        description={isStaff ? "자주 쓰는 운영 기능을 한곳에 모았습니다." : "필요한 서비스와 설정"}
      />

      <div className="grid gap-3 sm:grid-cols-2">
        {items.map((item) => {
          const Icon = item.icon
          return (
            <Link
              key={item.href}
              href={item.href}
              className="card-interactive flex min-h-[108px] items-center gap-4 p-4"
            >
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-[var(--sn-radius)] bg-[var(--sn-accent-soft)] text-[var(--sn-accent)]">
                <Icon className="h-5 w-5" />
              </span>
              <span className="min-w-0 flex-1">
                <span className="block font-semibold text-[var(--sn-ink)]">{item.label}</span>
                <span className="mt-1 block text-sm leading-snug text-[var(--sn-ink-muted)]">
                  {item.description}
                </span>
              </span>
              <ChevronRight className="h-4 w-4 shrink-0 text-[var(--sn-ink-faint)]" />
            </Link>
          )
        })}
      </div>

      <div className="mt-10 border-t border-[var(--sn-line)] pt-6">
        <Link href="/profile" className="status-row">
          <span className="flex items-center gap-3">
            <Settings2 className="h-5 w-5 text-[var(--sn-ink-muted)]" />
            <span className="font-medium">내 설정</span>
          </span>
          <ChevronRight className="h-4 w-4 text-[var(--sn-ink-faint)]" />
        </Link>
        <button
          type="button"
          onClick={() => signOut({ callbackUrl: "/" })}
          className="status-row w-full text-left text-[var(--sn-caution)]"
        >
          <span className="flex items-center gap-3">
            <LogOut className="h-5 w-5" />
            <span className="font-medium">로그아웃</span>
          </span>
        </button>
      </div>
    </div>
  )
}
