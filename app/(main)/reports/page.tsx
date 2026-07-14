"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import toast from "react-hot-toast"

type Report = {
  id: string
  content?: string | null
  moodChip: string
  publishedAt?: string | null
  readAt?: string | null
  resident: { id: string; name: string; photoUrl?: string | null }
  reactions: { type: string }[]
}

const moodLabel: Record<string, string> = { GOOD: "좋음", OK: "보통", CAUTION: "주의" }
const moodClass: Record<string, string> = { GOOD: "chip-good", OK: "chip-ok", CAUTION: "chip-caution" }

export default function ReportsFeedPage() {
  const [reports, setReports] = useState<Report[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch("/api/daily-reports")
      .then((r) => r.json())
      .then((d) => setReports(Array.isArray(d) ? d : []))
      .catch(() => toast.error("소식을 불러오지 못했습니다."))
      .finally(() => setLoading(false))
  }, [])

  const react = async (id: string, type: string) => {
    const res = await fetch(`/api/daily-reports/${id}/react`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ type }),
    })
    if (res.ok) {
      toast.success(type === "thanks" ? "감사를 전했습니다." : "마음을 전했습니다.")
      setReports((prev) =>
        prev.map((r) =>
          r.id === id ? { ...r, reactions: [...r.reactions, { type }] } : r
        )
      )
    }
  }

  return (
    <div className="p-4 sm:p-6 max-w-2xl mx-auto">
      <div className="page-header">
        <h1 className="page-title">소식</h1>
        <p className="page-description">부모님의 하루를 차분히 확인하세요.</p>
      </div>

      {loading ? (
        <p className="text-neutral-500">불러오는 중…</p>
      ) : reports.length === 0 ? (
        <div className="card p-8 text-center text-neutral-500">아직 도착한 알림장이 없습니다.</div>
      ) : (
        <ul className="space-y-4">
          {reports.map((r) => (
            <li key={r.id} className="card overflow-hidden animate-[fadeUp_0.35s_ease]">
              <div className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <Link href={`/timeline/${r.resident.id}`} className="font-semibold text-neutral-900">
                    {r.resident.name}
                  </Link>
                  <span className={moodClass[r.moodChip] || "chip-ok"}>
                    {moodLabel[r.moodChip] || r.moodChip}
                  </span>
                </div>
                <p className="text-neutral-700 whitespace-pre-wrap">
                  {r.content || "오늘의 소식이 도착했습니다."}
                </p>
                <p className="text-xs text-neutral-400 mt-2">
                  {r.publishedAt ? new Date(r.publishedAt).toLocaleString("ko-KR") : ""}
                  {r.readAt ? " · 읽음" : " · 미열람"}
                </p>
                <div className="flex gap-2 mt-4">
                  <button className="btn-secondary flex-1" onClick={() => react(r.id, "heart")}>
                    하트
                  </button>
                  <button className="btn-secondary flex-1" onClick={() => react(r.id, "thanks")}>
                    감사
                  </button>
                  <Link href={`/timeline/${r.resident.id}`} className="btn-primary flex-1 text-center">
                    타임라인
                  </Link>
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
