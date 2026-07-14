"use client"

import { useEffect, useState } from "react"
import { useSession } from "next-auth/react"
import toast from "react-hot-toast"

export default function MenuPage() {
  const { data: session } = useSession()
  const isStaff = session?.user?.role === "CAREGIVER" || session?.user?.role === "ADMIN"
  const [date, setDate] = useState(() => new Date().toISOString().slice(0, 10))
  const [form, setForm] = useState({ breakfast: "", lunch: "", dinner: "", snack: "" })

  const load = () => {
    fetch(`/api/menu-plans?date=${date}`)
      .then((r) => r.json())
      .then((d) => {
        if (d && d.id) {
          setForm({
            breakfast: d.breakfast || "",
            lunch: d.lunch || "",
            dinner: d.dinner || "",
            snack: d.snack || "",
          })
        } else {
          setForm({ breakfast: "", lunch: "", dinner: "", snack: "" })
        }
      })
  }

  useEffect(() => {
    load()
  }, [date])

  const save = async (e: React.FormEvent) => {
    e.preventDefault()
    const res = await fetch("/api/menu-plans", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ date, ...form }),
    })
    if (res.ok) toast.success("식단이 저장되었습니다.")
    else toast.error("저장 실패")
  }

  return (
    <div className="p-4 sm:p-6 max-w-xl mx-auto">
      <div className="page-header">
        <h1 className="page-title">식단표</h1>
        <p className="page-description">오늘의 건강한 식사를 공유합니다.</p>
      </div>

      <div className="mb-4">
        <label className="label">날짜</label>
        <input type="date" className="input" value={date} onChange={(e) => setDate(e.target.value)} />
      </div>

      <form onSubmit={save} className="card p-5 space-y-4">
        {(["breakfast", "lunch", "dinner", "snack"] as const).map((key) => (
          <div key={key}>
            <label className="label">
              {key === "breakfast" ? "아침" : key === "lunch" ? "중식" : key === "dinner" ? "저녁" : "간식"}
            </label>
            <input
              className="input"
              value={form[key]}
              disabled={!isStaff}
              onChange={(e) => setForm((f) => ({ ...f, [key]: e.target.value }))}
            />
          </div>
        ))}
        {isStaff && (
          <button type="submit" className="btn-primary w-full">저장</button>
        )}
      </form>
    </div>
  )
}
