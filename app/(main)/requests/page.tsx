"use client"

import { Suspense, useEffect, useState } from "react"
import { useSession } from "next-auth/react"
import { useSearchParams } from "next/navigation"
import toast from "react-hot-toast"

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
    <div className="p-4 sm:p-6 max-w-xl mx-auto">
      <div className="page-header">
        <h1 className="page-title">물품 요청</h1>
        <p className="page-description">기저귀·간식 등 필요한 것을 간단히 요청하세요.</p>
      </div>

      {!isStaff && (
        <form onSubmit={submit} className="card p-5 space-y-3 mb-6">
          <select className="input" value={residentId} onChange={(e) => setResidentId(e.target.value)} required>
            <option value="">어르신 선택</option>
            {residents.map((r) => (
              <option key={r.id} value={r.id}>{r.name}</option>
            ))}
          </select>
          <input className="input" placeholder="품목 (예: 성인용 기저귀)" value={itemName} onChange={(e) => setItemName(e.target.value)} required />
          <input className="input" type="number" min={1} value={quantity} onChange={(e) => setQuantity(Number(e.target.value))} />
          <button className="btn-primary w-full" type="submit">요청하기</button>
        </form>
      )}

      <ul className="space-y-3">
        {list.map((item) => (
          <li key={item.id} className="card p-4 flex justify-between gap-3">
            <div>
              <p className="font-semibold">{item.itemName} × {item.quantity}</p>
              <p className="text-sm text-neutral-500">{item.resident?.name} · {item.status}</p>
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
        ))}
      </ul>
    </div>
  )
}

export default function SupplyRequestsPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-neutral-500">불러오는 중…</div>}>
      <SupplyInner />
    </Suspense>
  )
}
