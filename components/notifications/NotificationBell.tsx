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
      className="relative p-2.5 text-neutral-500 hover:text-neutral-800 hover:bg-neutral-100 rounded-xl transition-colors"
      title="알림"
      aria-label="알림"
    >
      <Bell className="w-5 h-5" />
      {unreadCount > 0 && (
        <span className="absolute top-1.5 right-1.5 min-w-[18px] h-[18px] px-1 bg-red-500 rounded-full border-2 border-white text-white text-[10px] font-bold flex items-center justify-center">
          {unreadCount > 99 ? "99+" : unreadCount}
        </span>
      )}
    </button>
  )
}

