"use client"

import { useEffect, useState } from "react"
import toast from "react-hot-toast"

export default function CommunicationReportPage() {
  const [month, setMonth] = useState(() => new Date().toISOString().slice(0, 7))
  const [report, setReport] = useState<any>(null)

  const load = () => {
    fetch(`/api/reports/communication?month=${month}`)
      .then((r) => r.json())
      .then((d) => {
        if (d.error) throw new Error(d.error)
        setReport(d)
      })
      .catch((e) => toast.error(e.message || "리포트 오류"))
  }

  useEffect(() => {
    load()
  }, [month])

  const download = () => {
    if (!report) return
    const blob = new Blob([JSON.stringify(report, null, 2)], { type: "application/json" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `silvernote-comm-report-${month}.json`
    a.click()
    URL.revokeObjectURL(url)
    toast.success("리포트를 내려받았습니다.")
  }

  const s = report?.summary

  return (
    <div className="p-4 sm:p-6 max-w-xl mx-auto">
      <div className="page-header">
        <h1 className="page-title">소통 리포트</h1>
        <p className="page-description">공단평가 ‘가족과의 소통’ 증빙 · 3탭 이내</p>
      </div>

      <div className="mb-4">
        <label className="label">월</label>
        <input type="month" className="input" value={month} onChange={(e) => setMonth(e.target.value)} />
      </div>

      {s && (
        <div className="card p-5 space-y-3">
          <p className="font-semibold text-lg">{report.careCenterName}</p>
          <p className="text-sm text-neutral-500">{report.note}</p>
          <dl className="grid grid-cols-2 gap-3 text-sm">
            <div className="rounded-xl bg-warm-50 p-3">
              <dt className="text-neutral-500">알림장 발송</dt>
              <dd className="text-2xl font-semibold text-neutral-900">{s.dailyReportsSent}</dd>
            </div>
            <div className="rounded-xl bg-warm-50 p-3">
              <dt className="text-neutral-500">열람률</dt>
              <dd className="text-2xl font-semibold text-brand-700">{s.readRate}%</dd>
            </div>
            <div className="rounded-xl bg-warm-50 p-3">
              <dt className="text-neutral-500">어르신 커버리지</dt>
              <dd className="text-2xl font-semibold">{s.coverageRate}%</dd>
            </div>
            <div className="rounded-xl bg-warm-50 p-3">
              <dt className="text-neutral-500">공지 / 식단 / 앨범</dt>
              <dd className="text-lg font-semibold">
                {s.announcements} / {s.menuDays} / {s.albumPosts}
              </dd>
            </div>
          </dl>
          <button className="btn-primary w-full" onClick={download}>리포트 다운로드</button>
        </div>
      )}
    </div>
  )
}
