"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import Logo from "@/components/brand/Logo"
import { StatusChip } from "@/components/calm/StatusChip"

export default function MagicReportPage() {
  const params = useParams()
  const token = params.token as string
  const [data, setData] = useState<any>(null)
  const [error, setError] = useState("")

  useEffect(() => {
    fetch(`/api/daily-reports/magic/${token}`)
      .then(async (response) => {
        const body = await response.json()
        if (!response.ok) throw new Error(body.error || "소식을 열 수 없습니다.")
        setData(body)
      })
      .catch((reason) => setError(reason.message))
  }, [token])

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[var(--sn-bg)] px-6">
        <div className="max-w-md text-center">
          <Logo size="sm" />
          <p className="mt-8 font-display text-xl font-semibold">{error}</p>
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
    if (data.images) image = JSON.parse(data.images)[0] || null
  } catch {
    image = null
  }

  return (
    <div className="min-h-screen bg-[var(--sn-bg)]">
      <header className="border-b border-[var(--sn-line)]">
        <div className="mx-auto flex h-16 max-w-2xl items-center px-5">
          <Logo size="sm" />
        </div>
      </header>

      <main className="mx-auto max-w-2xl">
        {image ? (
          <div className="relative aspect-[4/3] bg-[var(--sn-surface-muted)]">
            <Image
              src={image}
              alt={`${data.resident.name} 어르신의 오늘 모습`}
              fill
              priority
              unoptimized={image.startsWith("data:")}
              sizes="(max-width: 768px) 100vw, 672px"
              className="object-cover"
            />
          </div>
        ) : (
          <div className="flex aspect-[4/3] items-center justify-center bg-[var(--sn-accent-soft)]">
            <span className="font-display text-7xl font-semibold text-[var(--sn-accent)]">
              {data.resident.name.slice(0, 1)}
            </span>
          </div>
        )}

        <article className="px-5 py-8 sm:px-8 sm:py-10">
          <div className="flex flex-wrap items-center gap-3">
            <h1 className="font-display text-3xl font-semibold tracking-[-0.035em]">
              {data.resident.name} 어르신
            </h1>
            <StatusChip status={data.moodChip} />
          </div>
          <p className="mt-2 text-sm text-[var(--sn-ink-muted)]">{data.careCenterName}</p>
          <p className="mt-7 whitespace-pre-wrap text-lg leading-relaxed">
            {data.content || "오늘의 소식이 도착했습니다."}
          </p>
          <p className="mt-6 text-sm text-[var(--sn-ink-faint)]">
            {data.authorName} · {new Date(data.publishedAt).toLocaleString("ko-KR")}
          </p>
          <Link href="/auth/login" className="btn-primary mt-9 w-full">
            앱에서 지난 소식 보기
          </Link>
        </article>
      </main>
    </div>
  )
}
