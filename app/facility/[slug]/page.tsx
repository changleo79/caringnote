"use client"

import { useEffect, useMemo, useState } from "react"
import { useParams } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import { ArrowRight, MapPin, Phone } from "lucide-react"
import Logo from "@/components/brand/Logo"

export default function FacilityHomepage() {
  const params = useParams()
  const slug = params.slug as string
  const [data, setData] = useState<any>(null)
  const [error, setError] = useState("")

  useEffect(() => {
    fetch(`/api/homepage/${slug}`)
      .then(async (response) => {
        const body = await response.json()
        if (!response.ok) throw new Error(body.error)
        setData(body)
      })
      .catch((reason) => setError(reason.message))
  }, [slug])

  const photos = useMemo(() => {
    if (!data?.albums) return []
    return data.albums.flatMap((post: any) => {
      try {
        const images = JSON.parse(post.images || "[]")
        return Array.isArray(images)
          ? images.map((src: string) => ({
              src,
              alt: post.title || post.content || `${data.center.name}의 일상`,
              id: `${post.id}-${src}`,
            }))
          : []
      } catch {
        return []
      }
    })
  }, [data])

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center p-6 text-[var(--sn-ink-muted)]">
        {error}
      </div>
    )
  }
  if (!data) {
    return (
      <div className="flex min-h-screen items-center justify-center text-[var(--sn-ink-muted)]">
        불러오는 중…
      </div>
    )
  }

  const { center, announcements } = data
  const hero = photos[0]

  return (
    <div className="min-h-screen bg-[var(--sn-bg)]">
      <header className="absolute inset-x-0 top-0 z-20">
        <div className="section-container flex h-20 items-center justify-between">
          <Logo light={Boolean(hero)} size="sm" />
          <Link
            href="/auth/login"
            className={hero ? "text-sm font-semibold text-white" : "text-sm font-semibold"}
          >
            로그인
          </Link>
        </div>
      </header>

      <section
        className={`relative flex min-h-[64svh] items-end ${
          hero ? "text-white" : "bg-[var(--sn-accent-soft)]"
        }`}
      >
        {hero && (
          <>
            <Image
              src={hero.src}
              alt={hero.alt}
              fill
              priority
              unoptimized={hero.src.startsWith("data:")}
              sizes="100vw"
              className="object-cover"
            />
            <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(10,24,21,.08),rgba(10,24,21,.72))]" />
          </>
        )}
        <div className="section-container relative pb-12 pt-28 sm:pb-16">
          <p className={`text-sm font-semibold ${hero ? "text-white/72" : "text-[var(--sn-accent)]"}`}>
            실버노트와 함께하는 시설
          </p>
          <h1 className="mt-3 max-w-3xl font-display text-4xl font-semibold tracking-[-0.04em] sm:text-6xl">
            {center.name}
          </h1>
          {center.description && (
            <p className={`mt-5 max-w-xl text-lg leading-relaxed ${hero ? "text-white/82" : "text-[var(--sn-ink-muted)]"}`}>
              {center.description}
            </p>
          )}
        </div>
      </section>

      <main className="section-container py-16 sm:py-24">
        <div className="grid gap-16 lg:grid-cols-[.72fr_1.28fr]">
          <aside>
            <h2 className="font-display text-2xl font-semibold">시설 안내</h2>
            <dl className="mt-6 space-y-4 text-sm text-[var(--sn-ink-muted)]">
              {center.address && (
                <div className="flex gap-3">
                  <MapPin className="mt-0.5 h-4 w-4 shrink-0" />
                  <dd>{center.address}</dd>
                </div>
              )}
              {center.phone && (
                <div className="flex gap-3">
                  <Phone className="mt-0.5 h-4 w-4 shrink-0" />
                  <dd>{center.phone}</dd>
                </div>
              )}
            </dl>
            <Link href="/auth/signup" className="btn-primary mt-8">
              보호자로 연결
              <ArrowRight className="h-4 w-4" />
            </Link>
          </aside>

          <section>
            <h2 className="font-display text-2xl font-semibold">최근 공지</h2>
            {announcements.length === 0 ? (
              <p className="mt-6 text-[var(--sn-ink-faint)]">등록된 공지가 없습니다.</p>
            ) : (
              <ul className="mt-4 divide-y divide-[var(--sn-line)]">
                {announcements.map((announcement: any) => (
                  <li key={announcement.id} className="py-5">
                    <div className="flex items-center gap-2">
                      {announcement.isUrgent && <span className="chip-caution">중요</span>}
                      <h3 className="font-semibold">{announcement.title}</h3>
                    </div>
                    <p className="mt-2 line-clamp-3 text-sm leading-relaxed text-[var(--sn-ink-muted)]">
                      {announcement.content}
                    </p>
                  </li>
                ))}
              </ul>
            )}
          </section>
        </div>

        <section className="mt-20">
          <div className="flex items-end justify-between">
            <div>
              <p className="text-sm font-semibold text-[var(--sn-accent)]">시설의 하루</p>
              <h2 className="mt-2 font-display text-3xl font-semibold tracking-[-0.03em]">앨범</h2>
            </div>
          </div>
          {photos.length === 0 ? (
            <div className="mt-8 border-y border-[var(--sn-line)] py-16 text-center text-[var(--sn-ink-faint)]">
              아직 공개된 사진이 없습니다.
            </div>
          ) : (
            <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-3">
              {photos.slice(0, 9).map((photo: any, index: number) => (
                <div
                  key={photo.id}
                  className={`relative overflow-hidden bg-[var(--sn-surface-muted)] ${
                    index === 0 ? "col-span-2 row-span-2 aspect-square" : "aspect-square"
                  }`}
                >
                  <Image
                    src={photo.src}
                    alt={photo.alt}
                    fill
                    unoptimized={photo.src.startsWith("data:")}
                    sizes={index === 0 ? "(max-width: 640px) 100vw, 66vw" : "33vw"}
                    className="object-cover"
                  />
                </div>
              ))}
            </div>
          )}
        </section>
      </main>
    </div>
  )
}
