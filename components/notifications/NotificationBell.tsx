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
      className="relative p-3 text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100 rounded-2xl transition-all duration-300 hover:scale-110"
      title="알림"
    >
      <Bell className="w-5 h-5" />
      {unreadCount > 0 && (
        <span className="absolute top-2 right-2 min-w-[20px] h-5 px-1.5 bg-gradient-to-r from-red-500 to-pink-500 rounded-full border-2 border-white text-white text-xs font-black flex items-center justify-center">
          {unreadCount > 99 ? "99+" : unreadCount}
        </span>
      )}
    </button>
  )
}

