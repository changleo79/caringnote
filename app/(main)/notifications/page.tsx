"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";
import { Check, CheckCheck, Trash2 } from "lucide-react";
import toast from "react-hot-toast";
import { NotificationType } from "@prisma/client";
import Link from "next/link";
import { PageHeader } from "@/components/calm/PageHeader";
import { EmptyState } from "@/components/calm/EmptyState";

interface Notification {
  id: string;
  type: NotificationType;
  title: string;
  content: string | null;
  relatedId: string | null;
  relatedType: string | null;
  isRead: boolean;
  createdAt: string;
}

export default function NotificationsPage() {
  const { data: session, status } = useSession();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState<"all" | "unread">("all");

  useEffect(() => {
    if (status === "unauthenticated") redirect("/auth/login");
  }, [status]);

  const loadNotifications = async () => {
    try {
      setIsLoading(true);
      const params = new URLSearchParams();
      if (filter === "unread") params.append("isRead", "false");
      params.append("limit", "100");

      const res = await fetch(`/api/notifications?${params.toString()}`);
      if (res.ok) {
        const data = await res.json();
        setNotifications(data.notifications || []);
        setUnreadCount(data.unreadCount || 0);
      } else {
        toast.error("알림을 불러오는데 실패했습니다.");
      }
    } catch {
      toast.error("알림을 불러오는 중 오류가 발생했습니다.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (session) loadNotifications();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [session, filter]);

  const markAsRead = async (id: string) => {
    try {
      const res = await fetch(`/api/notifications/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isRead: true }),
      });
      if (res.ok) {
        setNotifications((prev) =>
          prev.map((n) => (n.id === id ? { ...n, isRead: true } : n))
        );
        setUnreadCount((prev) => Math.max(0, prev - 1));
      }
    } catch {
      /* ignore */
    }
  };

  const markAllAsRead = async () => {
    try {
      const res = await fetch("/api/notifications/read-all", { method: "POST" });
      if (res.ok) {
        setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
        setUnreadCount(0);
        toast.success("모든 알림이 읽음 처리되었습니다.");
      }
    } catch {
      toast.error("읽음 처리에 실패했습니다.");
    }
  };

  const deleteNotification = async (id: string) => {
    try {
      const res = await fetch(`/api/notifications/${id}`, { method: "DELETE" });
      if (res.ok) {
        setNotifications((prev) => prev.filter((n) => n.id !== id));
        toast.success("알림이 삭제되었습니다.");
      }
    } catch {
      toast.error("알림 삭제에 실패했습니다.");
    }
  };

  const getNotificationLink = (notification: Notification) => {
    if (notification.relatedType === "Post" && notification.relatedId) {
      return `/community/${notification.relatedId}`;
    }
    if (notification.relatedType === "MedicalRecord" && notification.relatedId) {
      return `/medical/${notification.relatedId}`;
    }
    return null;
  };

  if (status === "loading" || isLoading) {
    return (
      <div className="mx-auto max-w-xl py-16 text-center text-[var(--sn-ink-muted)]">
        불러오는 중…
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-xl">
      <PageHeader
        title="알림"
        description={unreadCount > 0 ? `읽지 않음 ${unreadCount}` : "중요한 소식을 모았습니다"}
        action={
          unreadCount > 0 ? (
            <button type="button" onClick={markAllAsRead} className="btn-secondary">
              <CheckCheck className="h-4 w-4" />
              모두 읽음
            </button>
          ) : undefined
        }
      />

      <div className="mb-8 flex gap-2">
        <button
          type="button"
          onClick={() => setFilter("all")}
          className={filter === "all" ? "btn-primary" : "btn-secondary"}
        >
          전체
        </button>
        <button
          type="button"
          onClick={() => setFilter("unread")}
          className={filter === "unread" ? "btn-primary" : "btn-secondary"}
        >
          읽지 않음
          {unreadCount > 0 ? ` ${unreadCount}` : ""}
        </button>
      </div>

      {notifications.length === 0 ? (
        <EmptyState title="알림이 없습니다" description="새 소식이 오면 여기에 표시됩니다." />
      ) : (
        <ul className="divide-y divide-[var(--sn-line)]">
          {notifications.map((notification) => {
            const link = getNotificationLink(notification);
            const body = (
              <div className="flex items-start justify-between gap-3 py-5">
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    {!notification.isRead && (
                      <span className="h-2 w-2 shrink-0 rounded-full bg-[var(--sn-accent)]" />
                    )}
                    <h3
                      className={`font-semibold ${
                        notification.isRead
                          ? "text-[var(--sn-ink-muted)]"
                          : "text-[var(--sn-ink)]"
                      }`}
                    >
                      {notification.title}
                    </h3>
                  </div>
                  {notification.content && (
                    <p className="mt-1 line-clamp-2 text-sm text-[var(--sn-ink-muted)]">
                      {notification.content}
                    </p>
                  )}
                  <p className="mt-2 text-xs text-[var(--sn-ink-faint)]">
                    {new Date(notification.createdAt).toLocaleString("ko-KR")}
                  </p>
                </div>
                <div className="flex shrink-0 items-center gap-1">
                  {!notification.isRead && (
                    <button
                      type="button"
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        markAsRead(notification.id);
                      }}
                      className="btn-ghost min-h-[48px] px-3"
                      title="읽음 처리"
                    >
                      <Check className="h-4 w-4" />
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      deleteNotification(notification.id);
                    }}
                    className="btn-ghost min-h-[48px] px-3"
                    title="삭제"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            );

            return (
              <li key={notification.id}>
                {link ? <Link href={link}>{body}</Link> : body}
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
