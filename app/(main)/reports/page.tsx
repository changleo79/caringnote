"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import Image from "next/image"
import toast from "react-hot-toast"
import { PageHeader } from "@/components/calm/PageHeader"
import { StatusChip } from "@/components/calm/StatusChip"
import { EmptyState } from "@/components/calm/EmptyState"
import { cn } from "@/lib/utils"

type Report = {
  id: string
  content?: string | null
  moodChip: string
  images?: string | null
  publishedAt?: string | null
  readAt?: string | null
  resident: { id: string; name: string; photoUrl?: string | null }
  reactions: { type: string }[]
}

export default function ReportsFeedPage() {
  const [reports, setReports] = useState<Report[]>([])
  const [loading, setLoading] = useState(true)
  const [popId, setPopId] = useState<string | null>(null)

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
      if (type === "heart") {
        setPopId(id)
        setTimeout(() => setPopId(null), 500)
      }
      toast.success(type === "thanks" ? "감사를 전했습니다." : "마음을 전했습니다.")
      setReports((prev) =>
        prev.map((r) => (r.id === id ? { ...r, reactions: [...r.reactions, { type }] } : r))
      )
    }
  }

  const imgOf = (r: Report) => {
    try {
      return r.images ? JSON.parse(r.images)[0] : null
    } catch {
      return null
    }
  }

  return (
    <div className="mx-auto max-w-2xl">
      <PageHeader title="소식" description="오늘의 장면과 돌봄 기록을 시간순으로 전합니다." />

      {loading ? (
        <div className="space-y-10" aria-label="소식 불러오는 중">
          {[1, 2].map((item) => (
            <div key={item}>
              <div className="aspect-[4/3] animate-pulse bg-[var(--sn-surface-muted)]" />
              <div className="mt-4 h-6 w-1/3 animate-pulse rounded bg-[var(--sn-surface-muted)]" />
              <div className="mt-3 h-16 animate-pulse rounded bg-[var(--sn-surface-muted)]" />
            </div>
          ))}
        </div>
      ) : reports.length === 0 ? (
        <EmptyState title="아직 도착한 알림장이 없습니다" />
      ) : (
        <ul className="space-y-10">
          {reports.map((r) => {
            const img = imgOf(r)
            return (
              <li key={r.id}>
                {img ? (
                  <div className="relative aspect-[4/3] overflow-hidden bg-[var(--sn-surface-muted)]">
                    <Image
                      src={img}
                      alt={`${r.resident.name} 어르신의 일상 사진`}
                      fill
                      unoptimized={img.startsWith("data:")}
                      sizes="(max-width: 768px) 100vw, 672px"
                      className="object-cover"
                    />
                  </div>
                ) : null}
                <div className={cn(img ? "pt-4" : "")}>
                  <div className="flex items-center justify-between gap-3">
                    <Link
                      href={`/timeline/${r.resident.id}`}
                      className="font-display text-xl font-semibold tracking-[-0.02em]"
                    >
                      {r.resident.name}
                    </Link>
                    <StatusChip status={r.moodChip} />
                  </div>
                  <p className="mt-3 whitespace-pre-wrap text-lg leading-relaxed text-[var(--sn-ink)]">
                    {r.content || "오늘의 소식이 도착했습니다."}
                  </p>
                  <p className="mt-3 text-xs text-[var(--sn-ink-faint)]">
                    {r.publishedAt ? new Date(r.publishedAt).toLocaleString("ko-KR") : ""}
                    {r.readAt ? " · 읽음" : ""}
                  </p>
                  <div className="mt-4 flex gap-2">
                    <button
                      className={cn("btn-secondary flex-1", popId === r.id && "sn-heart-pop")}
                      onClick={() => react(r.id, "heart")}
                    >
                      마음
                    </button>
                    <button className="btn-secondary flex-1" onClick={() => react(r.id, "thanks")}>
                      감사
                    </button>
                  </div>
                </div>
              </li>
            )
          })}
        </ul>
      )}
    </div>
  )
}
