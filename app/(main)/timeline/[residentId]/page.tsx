"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import Link from "next/link"
import toast from "react-hot-toast"
import { StatusChip } from "@/components/calm/StatusChip"
import { EmptyState } from "@/components/calm/EmptyState"

type TimelineItem = {
  type: string
  id: string
  at: string
  title: string
  content?: string | null
  moodChip?: string
}

export default function CareTimelinePage() {
  const params = useParams()
  const residentId = params.residentId as string
  const [resident, setResident] = useState<any>(null)
  const [todayMenu, setTodayMenu] = useState<any>(null)
  const [items, setItems] = useState<TimelineItem[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch(`/api/timeline/${residentId}`)
      .then((r) => r.json())
      .then((d) => {
        if (d.error) throw new Error(d.error)
        setResident(d.resident)
        setTodayMenu(d.todayMenu)
        setItems(d.items || [])
      })
      .catch((e) => toast.error(e.message || "타임라인 오류"))
      .finally(() => setLoading(false))
  }, [residentId])

  if (loading) {
    return <div className="p-8 text-[var(--sn-ink-muted)]">불러오는 중…</div>
  }
  if (!resident) {
    return <div className="p-8">어르신을 찾을 수 없습니다.</div>
  }

  return (
    <div className="mx-auto max-w-xl">
      <div className="border-b border-[var(--sn-line)] px-5 pb-8 pt-10">
        <p className="text-sm font-semibold tracking-wide text-[var(--sn-accent)]">Care Timeline</p>
        <div className="mt-3 flex flex-wrap items-center gap-3">
          <h1 className="font-display text-3xl font-semibold tracking-tight">{resident.name}</h1>
          <StatusChip status={resident.statusChip} />
        </div>
        {resident.roomNumber && (
          <p className="mt-1 text-[var(--sn-ink-muted)]">{resident.roomNumber}호</p>
        )}
      </div>

      <div className="space-y-8 px-5 py-8">
        {todayMenu && (
          <div>
            <p className="text-sm font-semibold text-[var(--sn-accent)]">오늘 식단</p>
            <ul className="mt-3 space-y-1 text-[var(--sn-ink)]">
              {todayMenu.breakfast && <li>아침 · {todayMenu.breakfast}</li>}
              {todayMenu.lunch && <li>중식 · {todayMenu.lunch}</li>}
              {todayMenu.dinner && <li>저녁 · {todayMenu.dinner}</li>}
            </ul>
          </div>
        )}

        <div className="flex gap-2">
          <Link href={`/visits?residentId=${residentId}`} className="btn-secondary flex-1">
            면회 예약
          </Link>
          <Link href={`/requests?residentId=${residentId}`} className="btn-secondary flex-1">
            물품 요청
          </Link>
        </div>

        {items.length === 0 ? (
          <EmptyState title="아직 기록이 없습니다" />
        ) : (
          <ol className="relative space-y-0 border-l border-[var(--sn-line)] pl-6">
            {items.map((item) => (
              <li key={`${item.type}-${item.id}`} className="sn-fade-up relative pb-8">
                <span className="absolute -left-[1.9rem] top-1.5 h-2.5 w-2.5 rounded-full bg-[var(--sn-accent)]" />
                <time className="text-xs text-[var(--sn-ink-faint)]">
                  {new Date(item.at).toLocaleString("ko-KR")}
                </time>
                <p className="mt-1 font-display text-lg font-semibold tracking-tight">{item.title}</p>
                {item.content && (
                  <p className="mt-1 whitespace-pre-wrap text-[var(--sn-ink-muted)]">{item.content}</p>
                )}
              </li>
            ))}
          </ol>
        )}
      </div>
    </div>
  )
}
