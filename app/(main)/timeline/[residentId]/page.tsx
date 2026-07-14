"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import Link from "next/link"
import toast from "react-hot-toast"

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

  if (loading) return <div className="p-6 text-neutral-500">불러오는 중…</div>
  if (!resident) return <div className="p-6">어르신을 찾을 수 없습니다.</div>

  const mood =
    resident.statusChip === "GOOD" ? "좋음" : resident.statusChip === "CAUTION" ? "주의" : "보통"

  return (
    <div className="max-w-2xl mx-auto">
      <div className="relative bg-brand-800 text-white px-4 pt-8 pb-10">
        <p className="text-brand-100 text-sm mb-1">Care Timeline</p>
        <h1 className="text-3xl font-semibold tracking-tight">
          {resident.name}
          <span className="ml-3 text-lg font-medium text-brand-100">· {mood}</span>
        </h1>
        {resident.roomNumber && (
          <p className="text-brand-200 mt-1">{resident.roomNumber}호</p>
        )}
      </div>

      <div className="px-4 -mt-6 space-y-4 pb-10">
        {todayMenu && (
          <div className="card p-4">
            <p className="font-semibold text-neutral-900 mb-2">오늘 식단</p>
            <ul className="text-neutral-600 space-y-1 text-sm">
              {todayMenu.breakfast && <li>아침 · {todayMenu.breakfast}</li>}
              {todayMenu.lunch && <li>중식 · {todayMenu.lunch}</li>}
              {todayMenu.dinner && <li>저녁 · {todayMenu.dinner}</li>}
              {todayMenu.snack && <li>간식 · {todayMenu.snack}</li>}
            </ul>
          </div>
        )}

        <div className="flex gap-2">
          <Link href={`/visits?residentId=${residentId}`} className="btn-secondary flex-1 text-center">
            면회 예약
          </Link>
          <Link href={`/requests?residentId=${residentId}`} className="btn-secondary flex-1 text-center">
            물품 요청
          </Link>
        </div>

        {items.length === 0 ? (
          <div className="card p-8 text-center text-neutral-500">아직 기록이 없습니다.</div>
        ) : (
          <ol className="space-y-3">
            {items.map((item) => (
              <li key={`${item.type}-${item.id}`} className="card p-4">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-semibold uppercase tracking-wide text-brand-700">
                    {item.type}
                  </span>
                  <time className="text-xs text-neutral-400">
                    {new Date(item.at).toLocaleString("ko-KR")}
                  </time>
                </div>
                <p className="font-semibold text-neutral-900">{item.title}</p>
                {item.content && (
                  <p className="text-neutral-600 mt-1 whitespace-pre-wrap">{item.content}</p>
                )}
              </li>
            ))}
          </ol>
        )}
      </div>
    </div>
  )
}
