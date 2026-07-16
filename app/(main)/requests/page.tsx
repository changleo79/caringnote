"use client"

import { Suspense, useEffect, useState } from "react"
import { useSession } from "next-auth/react"
import { useSearchParams } from "next/navigation"
import toast from "react-hot-toast"
import { PageHeader } from "@/components/calm/PageHeader"

const statusLabels: Record<string, { label: string; className: string }> = {
  Pending: { label: "확인 대기", className: "chip-ok" },
  Approved: { label: "접수됨", className: "chip-good" },
  Rejected: { label: "확인 필요", className: "chip-caution" },
  Completed: { label: "전달 완료", className: "chip-good" },
  Cancelled: { label: "취소", className: "badge-neutral" },
}

function SupplyInner() {
  const { data: session } = useSession()
  const isStaff = session?.user?.role === "CAREGIVER" || session?.user?.role === "ADMIN"
  const search = useSearchParams()
  const [list, setList] = useState<any[]>([])
  const [residents, setResidents] = useState<any[]>([])
  const [residentId, setResidentId] = useState(search.get("residentId") || "")
  const [itemName, setItemName] = useState("")
  const [quantity, setQuantity] = useState(1)

  const load = () =>
    fetch("/api/supply-requests")
      .then((r) => r.json())
      .then((d) => setList(Array.isArray(d) ? d : []))

  useEffect(() => {
    load()
    fetch("/api/residents").then((r) => r.json()).then((d) => setResidents(Array.isArray(d) ? d : []))
  }, [])

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    const res = await fetch("/api/supply-requests", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ residentId, itemName, quantity }),
    })
    if (res.ok) {
      toast.success("물품을 요청했습니다.")
      setItemName("")
      load()
    } else toast.error("요청 실패")
  }

  return (
    <div className="mx-auto max-w-xl">
      <PageHeader title="물품 요청" description="기저귀·간식 등 필요한 것을 간단히 요청하세요." />

      {!isStaff && (
        <form onSubmit={submit} className="mb-10 space-y-4">
          <div>
          <label className="label">어르신</label>
          <select className="input" value={residentId} onChange={(e) => setResidentId(e.target.value)} required>
            <option value="">어르신 선택</option>
            {residents.map((r) => (
              <option key={r.id} value={r.id}>{r.name}</option>
            ))}
          </select>
          </div>
          <div>
            <label className="label">필요한 물품</label>
            <input className="input" placeholder="예: 성인용 기저귀" value={itemName} onChange={(e) => setItemName(e.target.value)} required />
          </div>
          <div>
            <label className="label">수량</label>
            <input className="input" type="number" min={1} value={quantity} onChange={(e) => setQuantity(Number(e.target.value))} />
          </div>
          <button className="btn-primary w-full" type="submit">요청하기</button>
        </form>
      )}

      <ul className="space-y-3">
        {list.map((item) => {
          const status = statusLabels[item.status] || { label: item.status, className: "badge-neutral" }
          return (
          <li key={item.id} className="card flex items-center justify-between gap-3 p-5">
            <div>
              <p className="font-display text-lg font-semibold">
                {item.itemName} × {item.quantity}
              </p>
              <p className="text-sm text-[var(--sn-ink-muted)]">
                {item.resident?.name}
              </p>
              <span className={`${status.className} mt-2`}>{status.label}</span>
            </div>
            {isStaff && item.status === "Pending" && (
              <button
                className="btn-primary"
                onClick={async () => {
                  await fetch("/api/supply-requests", {
                    method: "PATCH",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ id: item.id, status: "Completed" }),
                  })
                  toast.success("완료 처리")
                  load()
                }}
              >
                완료
              </button>
            )}
          </li>
          )
        })}
      </ul>
    </div>
  )
}

export default function SupplyRequestsPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-[var(--sn-ink-muted)]">불러오는 중…</div>}>
      <SupplyInner />
    </Suspense>
  )
}
