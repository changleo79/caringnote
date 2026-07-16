"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Bell } from "lucide-react"
import { useSession } from "next-auth/react"

export default function NotificationBell() {
  const { data: session } = useSession()
  const router = useRouter()
  const [unreadCount, setUnreadCount] = useState(0)

  useEffect(() => {
    if (!session) return

    // 알림 개수 조회
    const fetchUnreadCount = async () => {
      try {
        const res = await fetch("/api/notifications?isRead=false&limit=0")
        if (res.ok) {
          const data = await res.json()
          setUnreadCount(data.unreadCount || 0)
        }
      } catch (error) {
        console.error("알림 개수 조회 실패:", error)
      }
    }

    fetchUnreadCount()

    // 30초마다 알림 개수 갱신
    const interval = setInterval(fetchUnreadCount, 30000)

    return () => clearInterval(interval)
  }, [session])

  if (!session) return null

  return (
    <button
      onClick={() => router.push("/notifications")}
      className="relative flex h-11 w-11 items-center justify-center rounded-full text-[var(--sn-ink-muted)] transition-colors hover:bg-[var(--sn-surface-muted)] hover:text-[var(--sn-ink)]"
      title="알림"
      aria-label={unreadCount > 0 ? `읽지 않은 알림 ${unreadCount}개` : "알림"}
    >
      <Bell className="w-5 h-5" />
      {unreadCount > 0 && (
        <span className="absolute right-1 top-1 flex h-[18px] min-w-[18px] items-center justify-center rounded-full border-2 border-[var(--sn-bg)] bg-[var(--sn-caution)] px-1 text-[10px] font-bold text-white">
          {unreadCount > 99 ? "99+" : unreadCount}
        </span>
      )}
    </button>
  )
}

