"use client"

import { useEffect, useState } from "react"
import { useSession } from "next-auth/react"
import { redirect } from "next/navigation"
import { Bell, Check, CheckCheck, Trash2, X } from "lucide-react"
import toast from "react-hot-toast"
import { NotificationType } from "@prisma/client"
import Link from "next/link"

interface Notification {
  id: string
  type: NotificationType
  title: string
  content: string | null
  relatedId: string | null
  relatedType: string | null
  isRead: boolean
  createdAt: string
}

export default function NotificationsPage() {
  const { data: session, status } = useSession()
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [unreadCount, setUnreadCount] = useState(0)
  const [isLoading, setIsLoading] = useState(true)
  const [filter, setFilter] = useState<"all" | "unread">("all")

  useEffect(() => {
    if (status === "unauthenticated") {
      redirect("/auth/login")
    }
  }, [status])

  const loadNotifications = async () => {
    try {
      setIsLoading(true)
      const params = new URLSearchParams()
      if (filter === "unread") {
        params.append("isRead", "false")
      }
      params.append("limit", "100")

      const res = await fetch(`/api/notifications?${params.toString()}`)
      if (res.ok) {
        const data = await res.json()
        setNotifications(data.notifications || [])
        setUnreadCount(data.unreadCount || 0)
      } else {
        toast.error("알림을 불러오는데 실패했습니다.")
      }
    } catch (error) {
      console.error("알림 로드 오류:", error)
      toast.error("알림을 불러오는 중 오류가 발생했습니다.")
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    if (session) {
      loadNotifications()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [session, filter])

  const markAsRead = async (id: string) => {
    try {
      const res = await fetch(`/api/notifications/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isRead: true }),
      })

      if (res.ok) {
        setNotifications((prev) =>
          prev.map((n) => (n.id === id ? { ...n, isRead: true } : n))
        )
        setUnreadCount((prev) => Math.max(0, prev - 1))
      }
    } catch (error) {
      console.error("알림 읽음 처리 오류:", error)
    }
  }

  const markAllAsRead = async () => {
    try {
      const res = await fetch("/api/notifications/read-all", {
        method: "POST",
      })

      if (res.ok) {
        setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })))
        setUnreadCount(0)
        toast.success("모든 알림이 읽음 처리되었습니다.")
      }
    } catch (error) {
      console.error("전체 읽음 처리 오류:", error)
      toast.error("읽음 처리에 실패했습니다.")
    }
  }

  const deleteNotification = async (id: string) => {
    try {
      const res = await fetch(`/api/notifications/${id}`, {
        method: "DELETE",
      })

      if (res.ok) {
        setNotifications((prev) => prev.filter((n) => n.id !== id))
        toast.success("알림이 삭제되었습니다.")
      }
    } catch (error) {
      console.error("알림 삭제 오류:", error)
      toast.error("알림 삭제에 실패했습니다.")
    }
  }

  const getNotificationLink = (notification: Notification) => {
    if (notification.relatedType === "Post" && notification.relatedId) {
      return `/community/${notification.relatedId}`
    }
    if (notification.relatedType === "MedicalRecord" && notification.relatedId) {
      return `/medical/${notification.relatedId}`
    }
    return null
  }

  const getNotificationIcon = (type: NotificationType) => {
    switch (type) {
      case "PostCreated":
        return "📸"
      case "CommentCreated":
        return "💬"
      case "PostLiked":
        return "❤️"
      case "MedicalRecordCreated":
      case "MedicalRecordUpdated":
        return "🏥"
      case "OrderCreated":
      case "OrderStatusChanged":
        return "🛒"
      case "FamilyRequest":
      case "FamilyApproved":
      case "FamilyRejected":
        return "👨‍👩‍👧‍👦"
      case "Announcement":
        return "📢"
      default:
        return "🔔"
    }
  }

  if (status === "loading" || isLoading) {
    return (
    <><div className="container mx-auto px-4 py-8 max-w-4xl">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
          </div>
        </div>
      </>
  )
  }

  return (
    <><div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-5xl md:text-6xl font-black text-neutral-900 mb-2 tracking-tighter">
                알림
              </h1>
              <p className="text-lg text-neutral-600 font-semibold">
                중요한 소식을 놓치지 마세요
              </p>
            </div>
            {unreadCount > 0 && (
              <button
                onClick={markAllAsRead}
                className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-primary-500 to-primary-600 text-white rounded-2xl font-bold shadow-lg hover:shadow-xl transition-all hover:scale-105"
              >
                <CheckCheck className="w-5 h-5" />
                모두 읽음
              </button>
            )}
          </div>

          {/* 필터 */}
          <div className="flex gap-3">
            <button
              onClick={() => setFilter("all")}
              className={`px-6 py-2 rounded-xl font-bold transition-all ${
                filter === "all"
                  ? "bg-gradient-to-r from-primary-500 to-primary-600 text-white shadow-lg"
                  : "bg-white text-neutral-600 hover:bg-neutral-50"
              }`}
            >
              전체
            </button>
            <button
              onClick={() => setFilter("unread")}
              className={`px-6 py-2 rounded-xl font-bold transition-all relative ${
                filter === "unread"
                  ? "bg-gradient-to-r from-primary-500 to-primary-600 text-white shadow-lg"
                  : "bg-white text-neutral-600 hover:bg-neutral-50"
              }`}
            >
              읽지 않음
              {unreadCount > 0 && (
                <span className="ml-2 px-2 py-0.5 bg-red-500 text-white text-xs rounded-full">
                  {unreadCount}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* 알림 목록 */}
        {notifications.length === 0 ? (
          <div className="bg-gradient-to-br from-white via-blue-50/40 to-white rounded-3xl shadow-3d border-2 border-blue-200/50 p-16 text-center">
            <div className="w-24 h-24 bg-gradient-to-br from-amber-100 to-orange-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Bell className="w-12 h-12 text-amber-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-3">
              알림이 없습니다
            </h2>
            <p className="text-gray-600 mb-8 max-w-md mx-auto">
              새로운 알림이 도착하면 여기에 표시됩니다
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {notifications.map((notification) => {
              const link = getNotificationLink(notification)
              const NotificationContent = (
                <div
                  className={`bg-gradient-to-br from-white via-blue-50/40 to-white rounded-3xl p-6 shadow-3d border-2 ${
                    notification.isRead
                      ? "border-blue-200/30 opacity-75"
                      : "border-blue-300/60"
                  } transition-all hover:shadow-xl hover:scale-[1.02]`}
                >
                  <div className="flex items-start gap-4">
                    <div className="text-4xl">{getNotificationIcon(notification.type)}</div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-4 mb-2">
                        <h3
                          className={`font-bold text-lg ${
                            notification.isRead ? "text-neutral-600" : "text-neutral-900"
                          }`}
                        >
                          {notification.title}
                        </h3>
                        {!notification.isRead && (
                          <span className="w-3 h-3 bg-gradient-to-r from-red-500 to-pink-500 rounded-full flex-shrink-0 mt-2"></span>
                        )}
                      </div>
                      {notification.content && (
                        <p className="text-neutral-600 mb-3 line-clamp-2">
                          {notification.content}
                        </p>
                      )}
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-neutral-500">
                          {new Date(notification.createdAt).toLocaleString("ko-KR")}
                        </span>
                        <div className="flex items-center gap-2">
                          {!notification.isRead && (
                            <button
                              onClick={(e) => {
                                e.stopPropagation()
                                markAsRead(notification.id)
                              }}
                              className="p-2 text-neutral-600 hover:text-primary-600 hover:bg-primary-50 rounded-xl transition-all"
                              title="읽음 처리"
                            >
                              <Check className="w-4 h-4" />
                            </button>
                          )}
                          <button
                            onClick={(e) => {
                              e.stopPropagation()
                              deleteNotification(notification.id)
                            }}
                            className="p-2 text-neutral-600 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all"
                            title="삭제"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )

              if (link) {
                return (
                  <Link key={notification.id} href={link}>
                    {NotificationContent}
                  </Link>
                )
              }

              return <div key={notification.id}>{NotificationContent}</div>
            })}
          </div>
        )}
      </div>
    </>
  )
}
