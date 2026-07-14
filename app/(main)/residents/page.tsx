"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { useSession } from "next-auth/react"
import { Plus, User } from "lucide-react"
import toast from "react-hot-toast"

type Resident = {
  id: string
  name: string
  roomNumber?: string | null
  photoUrl?: string | null
  statusChip?: string
  families?: { id: string }[]
}

const chipClass: Record<string, string> = {
  GOOD: "chip-good",
  OK: "chip-ok",
  CAUTION: "chip-caution",
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
    <div className="p-4 sm:p-6 max-w-3xl mx-auto">
      <div className="page-header flex items-start justify-between gap-4">
        <div>
          <h1 className="page-title">어르신</h1>
          <p className="page-description">
            {isStaff ? "시설 어르신 명부 · 오늘 소식 작성의 시작점" : "연결된 부모님"}
          </p>
        </div>
        {isStaff && (
          <button className="btn-primary" onClick={() => setShowForm((v) => !v)}>
            <Plus className="w-5 h-5" /> 등록
          </button>
        )}
      </div>

      {showForm && (
        <form onSubmit={create} className="card p-4 mb-6 space-y-3">
          <div>
            <label className="label">이름</label>
            <input className="input" value={name} onChange={(e) => setName(e.target.value)} required />
          </div>
          <div>
            <label className="label">호실</label>
            <input className="input" value={roomNumber} onChange={(e) => setRoomNumber(e.target.value)} />
          </div>
          <button type="submit" className="btn-primary w-full">저장</button>
        </form>
      )}

      {loading ? (
        <p className="text-neutral-500">불러오는 중…</p>
      ) : residents.length === 0 ? (
        <div className="card p-8 text-center text-neutral-500">
          등록된 어르신이 없습니다.
          {!isStaff && (
            <div className="mt-4">
              <Link href="/residents/family-requests" className="btn-secondary">가족 연결 요청</Link>
            </div>
          )}
        </div>
      ) : (
        <ul className="grid gap-3 sm:grid-cols-2">
          {residents.map((r) => (
            <li key={r.id}>
              <Link href={`/timeline/${r.id}`} className="card-interactive p-4 flex items-center gap-3">
                <div className="w-14 h-14 rounded-2xl bg-brand-50 flex items-center justify-center overflow-hidden">
                  {r.photoUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={r.photoUrl} alt="" className="w-full h-full object-cover" />
                  ) : (
                    <User className="w-7 h-7 text-brand-600" />
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <p className="font-semibold text-neutral-900 truncate">{r.name}</p>
                    {r.statusChip && (
                      <span className={chipClass[r.statusChip] || "chip-ok"}>
                        {r.statusChip === "GOOD" ? "좋음" : r.statusChip === "CAUTION" ? "주의" : "보통"}
                      </span>
                    )}
                  </div>
                  <p className="text-neutral-500 text-sm">
                    {r.roomNumber ? `${r.roomNumber}호` : "호실 미정"}
                    {r.families && r.families.length > 0 ? ` · 승인대기 ${r.families.length}` : ""}
                  </p>
                </div>
              </Link>
            </li>
          ))}
        </ul>
      )}

      {isStaff && (
        <div className="mt-6">
          <Link href="/residents/family-requests" className="btn-secondary w-full">
            가족 연결 요청 검토
          </Link>
        </div>
      )}
    </div>
  )
}
