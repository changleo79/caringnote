"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { useSession } from "next-auth/react"
import { Plus } from "lucide-react"
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

  const load = async () => {
    setLoading(true)
    try {
      const res = await fetch("/api/residents")
      const data = await res.json()
      setResidents(Array.isArray(data) ? data : [])
    } catch {
      toast.error("목록을 불러오지 못했습니다.")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    load()
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
    <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6">
      <PageHeader
        title="어르신"
        description={isStaff ? "담당 어르신 그리드 · 소식 작성의 시작" : "연결된 부모님"}
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
        <ul className="grid grid-cols-2 gap-4 sm:grid-cols-3">
          {residents.map((r) => (
            <li key={r.id}>
              <Link href={`/timeline/${r.id}`} className="group block">
                <div className="aspect-square overflow-hidden bg-[var(--sn-accent-soft)]">
                  {r.photoUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={r.photoUrl} alt="" className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.03]" />
                  ) : (
                    <div className="flex h-full items-center justify-center font-display text-3xl font-semibold text-[var(--sn-accent)]">
                      {r.name.slice(0, 1)}
                    </div>
                  )}
                </div>
                <div className="mt-3 flex items-center justify-between gap-2">
                  <div className="min-w-0">
                    <p className="truncate font-display text-lg font-semibold">{r.name}</p>
                    <p className="text-sm text-[var(--sn-ink-faint)]">
                      {r.roomNumber ? `${r.roomNumber}호` : "호실 미정"}
                    </p>
                  </div>
                  <StatusChip status={r.statusChip} />
                </div>
              </Link>
            </li>
          ))}
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
