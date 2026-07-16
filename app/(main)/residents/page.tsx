"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { useSession } from "next-auth/react"
import { ArrowRight, NotebookPen, Plus, Search } from "lucide-react"
import toast from "react-hot-toast"
import { PageHeader } from "@/components/calm/PageHeader"
import { StatusChip } from "@/components/calm/StatusChip"
import { EmptyState } from "@/components/calm/EmptyState"

type Resident = {
  id: string
  name: string
  roomNumber?: string | null
  photoUrl?: string | null
  statusChip?: string
  families?: { id: string }[]
}

export default function ResidentsPage() {
  const { data: session } = useSession()
  const isStaff = session?.user?.role === "CAREGIVER" || session?.user?.role === "ADMIN"
  const [residents, setResidents] = useState<Resident[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [name, setName] = useState("")
  const [roomNumber, setRoomNumber] = useState("")
  const [query, setQuery] = useState("")
  const [missingIds, setMissingIds] = useState<Set<string>>(new Set())

  const load = async () => {
    setLoading(true)
    try {
      const res = await fetch("/api/residents")
      const data = await res.json()
      setResidents(Array.isArray(data) ? data : [])
      if (isStaff) {
        const today = new Date().toISOString().slice(0, 10)
        const missingResponse = await fetch(`/api/daily-reports?missing=1&date=${today}`)
        const missing = await missingResponse.json()
        setMissingIds(
          new Set<string>(
            Array.isArray(missing) ? missing.map((resident: Resident) => resident.id) : []
          )
        )
      }
    } catch {
      toast.error("목록을 불러오지 못했습니다.")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    load()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const create = async (e: React.FormEvent) => {
    e.preventDefault()
    const res = await fetch("/api/residents", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, roomNumber }),
    })
    if (!res.ok) {
      toast.error("등록 실패")
      return
    }
    toast.success("어르신이 등록되었습니다.")
    setName("")
    setRoomNumber("")
    setShowForm(false)
    load()
  }

  return (
    <div className="mx-auto max-w-3xl">
      <PageHeader
        title="어르신"
        description={isStaff ? "호실과 오늘 작성 상태를 한눈에 확인합니다." : "연결된 부모님"}
        action={
          isStaff ? (
            <button className="btn-primary shrink-0" onClick={() => setShowForm((v) => !v)}>
              <Plus className="h-5 w-5" /> 등록
            </button>
          ) : null
        }
      />

      {showForm && (
        <form onSubmit={create} className="mb-8 space-y-3 border-b border-[var(--sn-line)] pb-8">
          <input className="input" placeholder="이름" value={name} onChange={(e) => setName(e.target.value)} required />
          <input className="input" placeholder="호실" value={roomNumber} onChange={(e) => setRoomNumber(e.target.value)} />
          <button type="submit" className="btn-primary w-full">저장</button>
        </form>
      )}

      {!loading && residents.length > 6 && (
        <div className="relative mb-6">
          <Search className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-[var(--sn-ink-faint)]" />
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            className="input pl-12"
            placeholder="이름 또는 호실 검색"
            aria-label="어르신 검색"
          />
        </div>
      )}

      {loading ? (
        <p className="text-[var(--sn-ink-muted)]">불러오는 중…</p>
      ) : residents.length === 0 ? (
        <EmptyState
          title="등록된 어르신이 없습니다"
          action={
            !isStaff ? (
              <Link href="/residents/family-requests" className="btn-secondary">
                가족 연결 요청
              </Link>
            ) : null
          }
        />
      ) : (
        <ul className="divide-y divide-[var(--sn-line)] border-y border-[var(--sn-line)]">
          {residents
            .filter(
              (resident) =>
                !query ||
                resident.name.includes(query) ||
                resident.roomNumber?.includes(query)
            )
            .map((r) => {
            const isMissing = missingIds.has(r.id)
            return (
            <li key={r.id} className="flex min-h-[80px] items-center gap-4 py-3">
                <Link href={`/residents/${r.id}`} className="flex min-w-0 flex-1 items-center gap-4">
                <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-full bg-[var(--sn-accent-soft)]">
                  {r.photoUrl ? (
                    <Image
                      src={r.photoUrl}
                      alt={`${r.name} 어르신`}
                      fill
                      sizes="48px"
                      className="object-cover"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center font-display font-semibold text-[var(--sn-accent)]">
                      {r.name.slice(0, 1)}
                    </div>
                  )}
                </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-display text-lg font-semibold">{r.name}</p>
                    <p className="text-sm text-[var(--sn-ink-faint)]">
                      {r.roomNumber ? `${r.roomNumber}호` : "호실 미정"}
                    </p>
                  </div>
                  {isStaff ? (
                    <span className={isMissing ? "chip-ok" : "chip-good"}>
                      {isMissing ? "미작성" : "완료"}
                    </span>
                  ) : (
                    <StatusChip status={r.statusChip} />
                  )}
                  <ArrowRight className="h-4 w-4 text-[var(--sn-ink-faint)]" />
              </Link>
              {isStaff && (
                <Link
                  href={`/reports/write?residentId=${r.id}`}
                  className="flex h-12 w-12 shrink-0 items-center justify-center rounded-[var(--sn-radius)] bg-[var(--sn-accent-soft)] text-[var(--sn-accent)]"
                  aria-label={`${r.name} 어르신 알림장 쓰기`}
                >
                  <NotebookPen className="h-5 w-5" />
                </Link>
              )}
            </li>
          )})}
        </ul>
      )}

      {isStaff && (
        <Link href="/residents/family-requests" className="btn-secondary mt-8 w-full">
          가족 연결 요청 검토
        </Link>
      )}
    </div>
  )
}
