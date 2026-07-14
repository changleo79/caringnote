"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import Link from "next/link"
import { StatusChip } from "@/components/calm/StatusChip"
import { PHOTOS } from "@/lib/photos"

export default function MagicReportPage() {
  const params = useParams()
  const token = params.token as string
  const [data, setData] = useState<any>(null)
  const [error, setError] = useState("")

  useEffect(() => {
    fetch(`/api/daily-reports/magic/${token}`)
      .then(async (r) => {
        const d = await r.json()
        if (!r.ok) throw new Error(d.error || "오류")
        setData(d)
      })
      .catch((e) => setError(e.message))
  }, [token])

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[var(--sn-bg)] px-6">
        <div className="max-w-md text-center">
          <p className="font-display text-xl font-semibold">{error}</p>
          <Link href="/" className="btn-primary mt-6 inline-flex">
            실버노트 홈
          </Link>
        </div>
      </div>
    )
  }

  if (!data) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[var(--sn-bg)] text-[var(--sn-ink-muted)]">
        불러오는 중…
      </div>
    )
  }

  let image: string | null = null
  try {
    if (data.images) image = JSON.parse(data.images)[0]
  } catch {
    image = null
  }

  return (
    <div className="min-h-screen bg-[var(--sn-bg)]">
      <div className="relative min-h-[55svh] overflow-hidden">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={image || PHOTOS.familyStory}
          alt=""
          className="absolute inset-0 h-full w-full object-cover sn-hero-ken"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[rgba(12,32,30,0.88)] via-[rgba(12,32,30,0.25)] to-transparent" />
        <div className="absolute inset-x-0 bottom-0 px-5 pb-8 pt-24 text-white">
          <p className="text-sm font-medium text-white/70">실버노트</p>
          <h1 className="mt-2 font-display text-3xl font-semibold tracking-tight">
            {data.resident.name}
            <span className="ml-2 text-xl font-medium text-white/80">
              ·{" "}
              {data.moodChip === "GOOD"
                ? "좋음"
                : data.moodChip === "CAUTION"
                  ? "주의"
                  : "보통"}
            </span>
          </h1>
          <p className="mt-1 text-white/65">{data.careCenterName}</p>
        </div>
      </div>

      <main className="mx-auto max-w-lg px-5 py-8 sn-fade-up">
        <StatusChip status={data.moodChip} />
        <p className="mt-4 text-lg leading-relaxed text-[var(--sn-ink)] whitespace-pre-wrap">
          {data.content || "오늘의 소식이 도착했습니다."}
        </p>
        <p className="mt-6 text-sm text-[var(--sn-ink-faint)]">
          {data.authorName} · {new Date(data.publishedAt).toLocaleString("ko-KR")}
        </p>
        <Link href="/auth/login" className="btn-primary mt-8 w-full">
          앱에서 더 보기
        </Link>
      </main>
    </div>
  )
}
