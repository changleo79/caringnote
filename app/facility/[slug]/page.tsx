"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import Link from "next/link"

export default function FacilityHomepage() {
  const params = useParams()
  const slug = params.slug as string
  const [data, setData] = useState<any>(null)
  const [error, setError] = useState("")

  useEffect(() => {
    fetch(`/api/homepage/${slug}`)
      .then(async (r) => {
        const d = await r.json()
        if (!r.ok) throw new Error(d.error)
        setData(d)
      })
      .catch((e) => setError(e.message))
  }, [slug])

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6">
        <p>{error}</p>
      </div>
    )
  }
  if (!data) return <div className="min-h-screen flex items-center justify-center text-neutral-500">불러오는 중…</div>

  const { center, announcements, albums } = data

  return (
    <div className="min-h-screen bg-warm-50">
      <header className="bg-brand-800 text-white px-4 py-12">
        <div className="max-w-3xl mx-auto">
          <p className="text-brand-200 text-sm font-medium mb-2">SILVER NOTE</p>
          <h1 className="text-4xl font-semibold tracking-tight">{center.name}</h1>
          <p className="mt-3 text-brand-100 max-w-xl">{center.description}</p>
          <p className="mt-4 text-sm text-brand-200">{center.address} · {center.phone}</p>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 py-8 space-y-10">
        <section>
          <h2 className="text-xl font-semibold mb-4">공지사항</h2>
          <ul className="space-y-3">
            {announcements.map((a: any) => (
              <li key={a.id} className="card p-4">
                <p className="font-semibold">{a.title}</p>
                <p className="text-neutral-600 text-sm mt-1 line-clamp-3">{a.content}</p>
              </li>
            ))}
            {announcements.length === 0 && <p className="text-neutral-500">등록된 공지가 없습니다.</p>}
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-4">앨범</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {albums.map((p: any) => {
              let src = ""
              try {
                src = JSON.parse(p.images || "[]")[0] || ""
              } catch {}
              return (
                <div key={p.id} className="aspect-square rounded-2xl overflow-hidden bg-neutral-200">
                  {src ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={src} alt="" className="w-full h-full object-cover" />
                  ) : null}
                </div>
              )
            })}
          </div>
        </section>

        <Link href="/auth/signup" className="btn-primary w-full">
          보호자로 연결하기
        </Link>
      </main>
    </div>
  )
}
