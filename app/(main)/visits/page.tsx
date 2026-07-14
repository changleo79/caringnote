"use client"

import { Suspense, useEffect, useState } from "react"
import { useSession } from "next-auth/react"
import { useSearchParams } from "next/navigation"
import toast from "react-hot-toast"
import { PageHeader } from "@/components/calm/PageHeader"

function VisitsInner() {
  const { data: session } = useSession()
  const isStaff = session?.user?.role === "CAREGIVER" || session?.user?.role === "ADMIN"
  const search = useSearchParams()
  const [list, setList] = useState<any[]>([])
  const [residents, setResidents] = useState<any[]>([])
  const [residentId, setResidentId] = useState(search.get("residentId") || "")
  const [visitAt, setVisitAt] = useState("")
  const [visitors, setVisitors] = useState("")
  const [notes, setNotes] = useState("")

  const load = () =>
    fetch("/api/visits")
      .then((r) => r.json())
      .then((d) => setList(Array.isArray(d) ? d : []))

  useEffect(() => {
    load()
    fetch("/api/residents")
      .then((r) => r.json())
      .then((d) => setResidents(Array.isArray(d) ? d : []))
  }, [])

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    const res = await fetch("/api/visits", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ residentId, visitAt, visitors, notes }),
    })
    if (res.ok) {
      toast.success("면회를 요청했습니다.")
      setVisitAt("")
      setNotes("")
      load()
    } else toast.error("요청 실패")
  }

  const updateStatus = async (id: string, status: string) => {
    const res = await fetch("/api/visits", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, status }),
    })
    if (res.ok) {
      toast.success("처리되었습니다.")
      load()
    }
  }

  return (
    <div className="mx-auto max-w-xl px-4 py-8 sm:px-6">
      <PageHeader title="면회" description="전화 대신, 차분히 예약하세요." />

      {!isStaff && (
        <form onSubmit={submit} className="mb-10 space-y-4">
          <div>
            <label className="label">어르신</label>
            <select className="input" value={residentId} onChange={(e) => setResidentId(e.target.value)} required>
              <option value="">선택</option>
              {residents.map((r) => (
                <option key={r.id} value={r.id}>{r.name}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="label">방문 일시</label>
            <input type="datetime-local" className="input" value={visitAt} onChange={(e) => setVisitAt(e.target.value)} required />
          </div>
          <div>
            <label className="label">방문자</label>
            <input className="input" value={visitors} onChange={(e) => setVisitors(e.target.value)} />
          </div>
          <div>
            <label className="label">메모</label>
            <textarea className="input" value={notes} onChange={(e) => setNotes(e.target.value)} />
          </div>
          <button className="btn-primary w-full" type="submit">면회 요청</button>
        </form>
      )}

      <ul className="divide-y divide-[var(--sn-line)]">
        {list.map((item) => (
          <li key={item.id} className="py-5">
            <p className="font-display text-lg font-semibold">{item.resident?.name}</p>
            <p className="mt-1 text-sm text-[var(--sn-ink-muted)]">
              {new Date(item.visitAt).toLocaleString("ko-KR")} · {item.status}
            </p>
            {isStaff && item.status === "Pending" && (
              <div className="mt-3 flex gap-2">
                <button className="btn-primary flex-1" onClick={() => updateStatus(item.id, "Approved")}>승인</button>
                <button className="btn-secondary flex-1" onClick={() => updateStatus(item.id, "Rejected")}>거절</button>
              </div>
            )}
          </li>
        ))}
      </ul>
    </div>
  )
}

export default function VisitsPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-[var(--sn-ink-muted)]">불러오는 중…</div>}>
      <VisitsInner />
    </Suspense>
  )
}
