"use client"

import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import AppLayout from "@/components/layout/AppLayout"
import toast from "react-hot-toast"
import { Bell, Trash2, Check, CheckCheck, AlertCircle, Heart, MessageCircle, ShoppingBag, Users, X } from "lucide-react"
import { formatDate } from "@/lib/utils"
import Link from "next/link"

const notificationIcons: Record<string, any> = {
  PostCreated: MessageCircle,
  CommentCreated: MessageCircle,
  MedicalRecordCreated: Heart,
  OrderCreated: ShoppingBag,
  OrderStatusChanged: ShoppingBag,
  FamilyRequest: Users,
  FamilyApproved: Users,
  FamilyRejected: Users,
  Other: AlertCircle,
}

const notificationColors: Record<string, string> = {
  PostCreated: "bg-blue-100 text-blue-600",
  CommentCreated: "bg-green-100 text-green-600",
  MedicalRecordCreated: "bg-red-100 text-red-600",
  OrderCreated: "bg-purple-100 text-purple-600",
  OrderStatusChanged: "bg-orange-100 text-orange-600",
  FamilyRequest: "bg-primary-100 text-primary-600",
  FamilyApproved: "bg-green-100 text-green-600",
  FamilyRejected: "bg-gray-100 text-gray-600",
  Other: "bg-gray-100 text-gray-600",
}

export default function NotificationsPage() {
  const { data: session } = useSession()
  const [notifications, setNotifications] = useState<any[]>([])
  const [unreadCount, setUnreadCount] = useState(0)
  const [isLoading, setIsLoading] = useState(true)
  const [filter, setFilter] = useState<"all" | "unread">("all")

  useEffect(() => {
    if (session) {
      loadNotifications()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [session, filter])

  const loadNotifications = async () => {
    setIsLoading(true)
    try {
      const url = filter === "unread" 
        ? "/api/notifications?isRead=false"
        : "/api/notifications"
      
      const res = await fetch(url)
      const data = await res.json()

      if (res.ok) {
        setNotifications(data.notifications || [])
        setUnreadCount(data.unreadCount || 0)
      } else {
        toast.error(data.error || "알림을 불러오는데 실패했습니다.")
      }
    } catch (error) {
      console.error("Error loading notifications:", error)
      toast.error("알림을 불러오는 중 오류가 발생했습니다.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleMarkAsRead = async (notificationId: string) => {
    try {
      const res = await fetch(`/api/notifications/${notificationId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isRead: true }),
      })

      if (res.ok) {
        setNotifications(prev =>
          prev.map(n => n.id === notificationId ? { ...n, isRead: true } : n)
        )
        setUnreadCount(prev => Math.max(0, prev - 1))
      }
    } catch (error) {
      console.error("Error marking notification as read:", error)
    }
  }

  const handleMarkAllAsRead = async () => {
    try {
      const unreadNotifications = notifications.filter(n => !n.isRead)
      
      await Promise.all(
        unreadNotifications.map(n =>
          fetch(`/api/notifications/${n.id}`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ isRead: true }),
          })
        )
      )

      setNotifications(prev =>
        prev.map(n => ({ ...n, isRead: true }))
      )
      setUnreadCount(0)
      toast.success("모든 알림을 읽음 처리했습니다.")
    } catch (error) {
      console.error("Error marking all as read:", error)
      toast.error("알림 읽음 처리 중 오류가 발생했습니다.")
    }
  }

  const handleDelete = async (notificationId: string) => {
    if (!confirm("알림을 삭제하시겠습니까?")) {
      return
    }

    try {
      const res = await fetch(`/api/notifications/${notificationId}`, {
        method: "DELETE",
      })

      if (res.ok) {
        const notification = notifications.find(n => n.id === notificationId)
        if (notification && !notification.isRead) {
          setUnreadCount(prev => Math.max(0, prev - 1))
        }
        setNotifications(prev => prev.filter(n => n.id !== notificationId))
        toast.success("알림이 삭제되었습니다.")
      }
    } catch (error) {
      console.error("Error deleting notification:", error)
      toast.error("알림 삭제 중 오류가 발생했습니다.")
    }
  }

  if (!session) {
    return null
  }

  const filteredNotifications = filter === "unread"
    ? notifications.filter(n => !n.isRead)
    : notifications

  return (
    <AppLayout>
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
              알림
            </h1>
            <p className="text-gray-600">
              {unreadCount > 0 && (
                <span className="text-primary-600 font-semibold">
                  읽지 않은 알림 {unreadCount}개
                </span>
              )}
            </p>
          </div>
          {unreadCount > 0 && (
            <button
              onClick={handleMarkAllAsRead}
              className="px-4 py-2 bg-primary-600 text-white rounded-lg text-sm font-bold hover:bg-primary-700 transition-colors inline-flex items-center gap-2"
            >
              <CheckCheck className="w-4 h-4" />
              모두 읽음
            </button>
          )}
        </div>

        {/* 필터 */}
        <div className="mb-6 flex gap-2">
          <button
            onClick={() => setFilter("all")}
            className={`px-4 py-2 rounded-lg text-sm font-bold transition-colors ${
              filter === "all"
                ? "bg-primary-600 text-white"
                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
            }`}
          >
            전체
          </button>
          <button
            onClick={() => setFilter("unread")}
            className={`px-4 py-2 rounded-lg text-sm font-bold transition-colors inline-flex items-center gap-2 ${
              filter === "unread"
                ? "bg-primary-600 text-white"
                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
            }`}
          >
            읽지 않음
            {unreadCount > 0 && (
              <span className="bg-white text-primary-600 px-2 py-0.5 rounded-full text-xs">
                {unreadCount}
              </span>
            )}
          </button>
        </div>

        {/* 알림 목록 */}
        {isLoading ? (
          <div className="bg-white rounded-3xl shadow-soft border border-gray-100 p-12">
            <div className="text-center py-16">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
              <p className="mt-4 text-gray-600">알림을 불러오는 중...</p>
            </div>
          </div>
        ) : filteredNotifications.length > 0 ? (
          <div className="space-y-3">
            {filteredNotifications.map((notification) => {
              const Icon = notificationIcons[notification.type] || AlertCircle
              const colorClass = notificationColors[notification.type] || notificationColors.Other

              return (
                <div
                  key={notification.id}
                  className={`bg-white rounded-2xl shadow-soft border border-gray-100 p-5 hover:shadow-md transition-all ${
                    !notification.isRead ? "border-primary-200 bg-primary-50/30" : ""
                  }`}
                >
                  <div className="flex items-start gap-4">
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${colorClass}`}>
                      <Icon className="w-6 h-6" />
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-4 mb-2">
                        <div className="flex-1">
                          <h3 className={`font-bold text-gray-900 mb-1 ${!notification.isRead ? "text-primary-700" : ""}`}>
                            {notification.title}
                          </h3>
                          {notification.content && (
                            <p className="text-sm text-gray-600 mb-2">{notification.content}</p>
                          )}
                          <p className="text-xs text-gray-500">{formatDate(notification.createdAt)}</p>
                        </div>

                        {!notification.isRead && (
                          <div className="w-2 h-2 bg-primary-600 rounded-full flex-shrink-0 mt-1"></div>
                        )}
                      </div>

                      <div className="flex items-center gap-2 mt-3">
                        {!notification.isRead && (
                          <button
                            onClick={() => handleMarkAsRead(notification.id)}
                            className="px-3 py-1.5 bg-gray-100 text-gray-700 rounded-lg text-xs font-bold hover:bg-gray-200 transition-colors inline-flex items-center gap-1"
                          >
                            <Check className="w-3 h-3" />
                            읽음
                          </button>
                        )}
                        <button
                          onClick={() => handleDelete(notification.id)}
                          className="px-3 py-1.5 bg-red-50 text-red-600 rounded-lg text-xs font-bold hover:bg-red-100 transition-colors inline-flex items-center gap-1"
                        >
                          <Trash2 className="w-3 h-3" />
                          삭제
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        ) : (
          <div className="bg-white rounded-3xl shadow-soft border border-gray-100 p-12 text-center">
            <div className="w-24 h-24 bg-gradient-to-br from-primary-100 to-accent-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Bell className="w-12 h-12 text-primary-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-3">
              알림이 없습니다
            </h2>
            <p className="text-gray-600">
              {filter === "unread" ? "읽지 않은 알림이 없습니다." : "알림 내역이 없습니다."}
            </p>
          </div>
        )}
      </div>
    </AppLayout>
  )
}
