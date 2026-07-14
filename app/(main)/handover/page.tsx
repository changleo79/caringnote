"use client"

import { useEffect, useState } from "react"
import toast from "react-hot-toast"

export default function HandoverPage() {
  const [notes, setNotes] = useState<any[]>([])
  const [content, setContent] = useState("")
  const [shift, setShift] = useState("주간→야간")

  const load = () =>
    fetch("/api/handover")
      .then((r) => r.json())
      .then((d) => setNotes(Array.isArray(d) ? d : []))

  useEffect(() => {
    load()
  }, [])

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    const res = await fetch("/api/handover", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ content, shift }),
    })
    if (res.ok) {
      toast.success("인수인계가 등록되었습니다.")
      setContent("")
      load()
    } else toast.error("저장 실패 — 직원만 사용할 수 있습니다.")
  }

  return (
    <div className="p-4 sm:p-6 max-w-xl mx-auto">
      <div className="page-header">
        <h1 className="page-title">교대 인수인계</h1>
        <p className="page-description">보호자에게는 보이지 않는 내부 노트입니다.</p>
      </div>

      <form onSubmit={submit} className="card p-5 space-y-3 mb-6">
        <select className="input" value={shift} onChange={(e) => setShift(e.target.value)}>
          <option>주간→야간</option>
          <option>야간→주간</option>
          <option>기타</option>
        </select>
        <textarea
          className="input min-h-[120px]"
          placeholder="다음 근무자에게 전달할 내용"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          required
        />
        <button className="btn-primary w-full" type="submit">등록</button>
      </form>

      <ul className="space-y-3">
        {notes.map((n) => (
          <li key={n.id} className="card p-4">
            <p className="text-xs text-brand-700 font-semibold mb-1">{n.shift}</p>
            <p className="text-neutral-800 whitespace-pre-wrap">{n.content}</p>
            <p className="text-xs text-neutral-400 mt-2">
              {n.author?.name} · {new Date(n.createdAt).toLocaleString("ko-KR")}
            </p>
          </li>
        ))}
      </ul>
    </div>
  )
}
