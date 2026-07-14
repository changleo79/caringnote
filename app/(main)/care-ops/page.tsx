"use client"

import { useEffect, useState } from "react"
import { useSession } from "next-auth/react"
import toast from "react-hot-toast"
import Link from "next/link"

/** Phase 4 — 요양원 Ops: 케어플랜·투약 확인 */
export default function CareOpsPage() {
  const { data: session } = useSession()
  const isStaff = session?.user?.role === "CAREGIVER" || session?.user?.role === "ADMIN"
  const [residents, setResidents] = useState<any[]>([])
  const [residentId, setResidentId] = useState("")
  const [plans, setPlans] = useState<any[]>([])
  const [meds, setMeds] = useState<any[]>([])
  const [planTitle, setPlanTitle] = useState("")
  const [planContent, setPlanContent] = useState("")
  const [medName, setMedName] = useState("")
  const [medDosage, setMedDosage] = useState("")
  const [medSchedule, setMedSchedule] = useState("")

  const loadResidents = () =>
    fetch("/api/residents")
      .then((r) => r.json())
      .then((d) => {
        const list = Array.isArray(d) ? d : []
        setResidents(list)
        if (!residentId && list[0]) setResidentId(list[0].id)
      })

  const loadOps = (id: string) => {
    if (!id) return
    fetch(`/api/care-plans?residentId=${id}`)
      .then((r) => r.json())
      .then((d) => setPlans(Array.isArray(d) ? d : []))
    fetch(`/api/medications?residentId=${id}`)
      .then((r) => r.json())
      .then((d) => setMeds(Array.isArray(d) ? d : []))
  }

  useEffect(() => {
    loadResidents()
  }, [])

  useEffect(() => {
    if (residentId) loadOps(residentId)
  }, [residentId])

  if (!isStaff) {
    return (
      <div className="mx-auto max-w-lg px-4 py-16 text-center text-neutral-500">
        시설 직원 전용 화면입니다.
      </div>
    )
  }

  const addPlan = async (e: React.FormEvent) => {
    e.preventDefault()
    const res = await fetch("/api/care-plans", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ residentId, title: planTitle, content: planContent }),
    })
    if (res.ok) {
      toast.success("케어플랜을 저장했습니다.")
      setPlanTitle("")
      setPlanContent("")
      loadOps(residentId)
    } else toast.error("저장 실패")
  }

  const addMed = async (e: React.FormEvent) => {
    e.preventDefault()
    const res = await fetch("/api/medications", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        residentId,
        name: medName,
        dosage: medDosage,
        schedule: medSchedule,
      }),
    })
    if (res.ok) {
      toast.success("투약 일정을 추가했습니다.")
      setMedName("")
      setMedDosage("")
      setMedSchedule("")
      loadOps(residentId)
    } else toast.error("저장 실패")
  }

  const logMed = async (scheduleId: string) => {
    const res = await fetch("/api/medications", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "log", scheduleId, administered: true }),
    })
    if (res.ok) toast.success("투약 확인 기록")
    else toast.error("기록 실패")
  }

  return (
    <div className="mx-auto max-w-2xl px-4 py-8 sm:px-6">
      <header className="page-header">
        <p className="text-sm font-medium text-brand-700">실버케어 Ops</p>
        <h1 className="page-title">케어플랜 · 투약</h1>
        <p className="page-description">입소 요양원 라이트 Ops. ERP 대신 돌봄 기록에 집중합니다.</p>
      </header>

      <div className="mb-6">
        <label className="label">어르신</label>
        <select
          className="input"
          value={residentId}
          onChange={(e) => setResidentId(e.target.value)}
        >
          {residents.map((r) => (
            <option key={r.id} value={r.id}>
              {r.name} {r.roomNumber ? `(${r.roomNumber})` : ""}
            </option>
          ))}
        </select>
      </div>

      <section className="card p-5 mb-6">
        <h2 className="font-semibold mb-3">케어플랜 작성</h2>
        <form onSubmit={addPlan} className="space-y-3">
          <input
            className="input"
            placeholder="제목"
            value={planTitle}
            onChange={(e) => setPlanTitle(e.target.value)}
            required
          />
          <textarea
            className="input min-h-[100px]"
            placeholder="목표·주의사항"
            value={planContent}
            onChange={(e) => setPlanContent(e.target.value)}
            required
          />
          <button type="submit" className="btn-primary w-full">
            케어플랜 저장
          </button>
        </form>
        <ul className="mt-4 space-y-2">
          {plans.map((p) => (
            <li key={p.id} className="rounded-xl bg-neutral-50 p-3">
              <p className="font-medium">{p.title}</p>
              <p className="text-sm text-neutral-600 mt-1 whitespace-pre-wrap">{p.content}</p>
            </li>
          ))}
        </ul>
      </section>

      <section className="card p-5 mb-6">
        <h2 className="font-semibold mb-3">투약 일정</h2>
        <form onSubmit={addMed} className="space-y-3 mb-4">
          <input
            className="input"
            placeholder="약 이름"
            value={medName}
            onChange={(e) => setMedName(e.target.value)}
            required
          />
          <div className="grid grid-cols-2 gap-2">
            <input
              className="input"
              placeholder="용량"
              value={medDosage}
              onChange={(e) => setMedDosage(e.target.value)}
            />
            <input
              className="input"
              placeholder="시간 (예: 아침)"
              value={medSchedule}
              onChange={(e) => setMedSchedule(e.target.value)}
            />
          </div>
          <button type="submit" className="btn-secondary w-full">
            일정 추가
          </button>
        </form>
        <ul className="space-y-2">
          {meds.map((m) => (
            <li key={m.id} className="flex items-center justify-between gap-3 rounded-xl border border-neutral-200 p-3">
              <div>
                <p className="font-medium">{m.name}</p>
                <p className="text-sm text-neutral-500">
                  {[m.dosage, m.schedule].filter(Boolean).join(" · ")}
                </p>
              </div>
              <button type="button" className="btn-primary min-h-[48px] px-4" onClick={() => logMed(m.id)}>
                투여 확인
              </button>
            </li>
          ))}
        </ul>
      </section>

      <Link href={`/timeline/${residentId}`} className="btn-ghost w-full">
        타임라인에서 보기
      </Link>
    </div>
  )
}
