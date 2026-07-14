"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import Link from "next/link"

/** 매직링크 — 앱 설치 없이 10초 안심 열람 */
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
      <div className="min-h-screen bg-warm-50 flex items-center justify-center p-6">
        <div className="card p-8 max-w-md text-center">
          <p className="text-neutral-700">{error}</p>
          <Link href="/" className="btn-primary mt-6 inline-flex">실버노트 홈</Link>
        </div>
      </div>
    )
  }

  if (!data) {
    return <div className="min-h-screen bg-warm-50 flex items-center justify-center text-neutral-500">불러오는 중…</div>
  }

  const mood =
    data.moodChip === "GOOD" ? "좋음" : data.moodChip === "CAUTION" ? "주의" : "보통"

  return (
    <div className="min-h-screen bg-warm-50">
      <div className="max-w-lg mx-auto">
        <header className="px-4 pt-8 pb-4">
          <p className="text-brand-700 font-semibold text-sm tracking-wide">SILVER NOTE</p>
          <h1 className="text-3xl font-semibold text-neutral-900 mt-2">
            {data.resident.name}
            <span className="text-xl text-neutral-500 font-medium"> · {mood}</span>
          </h1>
          <p className="text-neutral-500 mt-1">{data.careCenterName}</p>
        </header>

        <main className="px-4 pb-12 space-y-4">
          {data.images && (
            <div className="rounded-2xl overflow-hidden bg-neutral-200 min-h-[200px]">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={JSON.parse(data.images)[0]}
                alt=""
                className="w-full object-cover max-h-[360px]"
              />
            </div>
          )}
          <div className="card p-5">
            <p className="text-lg text-neutral-800 leading-relaxed whitespace-pre-wrap">
              {data.content || "오늘의 소식이 도착했습니다."}
            </p>
            <p className="text-sm text-neutral-400 mt-4">
              {data.authorName} · {new Date(data.publishedAt).toLocaleString("ko-KR")}
            </p>
          </div>
          <Link href="/auth/login" className="btn-primary w-full">
            앱에서 더 보기
          </Link>
        </main>
      </div>
    </div>
  )
}
