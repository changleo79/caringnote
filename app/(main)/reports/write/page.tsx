"use client"

import { useEffect, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import toast from "react-hot-toast"
import { Camera, Send, Sparkles } from "lucide-react"
import { PageHeader } from "@/components/calm/PageHeader"
import { ChipPicker } from "@/components/calm/ChipPicker"
import { Suspense } from "react"

type Resident = { id: string; name: string; roomNumber?: string | null; photoUrl?: string | null }

const CHIP_OPTIONS = [
  { id: "meal", label: "식사 잘함" },
  { id: "sleep", label: "낮잠" },
  { id: "walk", label: "산책" },
  { id: "low", label: "컨디션 저하" },
  { id: "hospital", label: "병원 동행" },
]

const MOODS = [
  { id: "GOOD", label: "좋음" },
  { id: "OK", label: "보통" },
  { id: "CAUTION", label: "주의" },
]

const DRAFT_KEY = "sn-quick-report-draft"

function QuickWriteInner() {
  const router = useRouter()
  const search = useSearchParams()
  const [residents, setResidents] = useState<Resident[]>([])
  const [missing, setMissing] = useState<Resident[]>([])
  const [residentId, setResidentId] = useState(search.get("residentId") || "")
  const [moodChip, setMoodChip] = useState("OK")
  const [chips, setChips] = useState<string[]>([])
  const [content, setContent] = useState("")
  const [image, setImage] = useState<string | null>(null)
  const [sending, setSending] = useState(false)
  const [drafting, setDrafting] = useState(false)

  useEffect(() => {
    fetch("/api/residents")
      .then((r) => r.json())
      .then((d) => setResidents(Array.isArray(d) ? d : []))
    const today = new Date().toISOString().slice(0, 10)
    fetch(`/api/daily-reports?missing=1&date=${today}`)
      .then((r) => r.json())
      .then((d) => setMissing(Array.isArray(d) ? d : []))
    try {
      const raw = localStorage.getItem(DRAFT_KEY)
      if (raw) {
        const d = JSON.parse(raw)
        if (!search.get("residentId") && d.residentId) setResidentId(d.residentId)
        if (d.moodChip) setMoodChip(d.moodChip)
        if (Array.isArray(d.chips)) setChips(d.chips)
        if (d.content) setContent(d.content)
        if (d.image) setImage(d.image)
      }
    } catch {
      /* ignore */
    }
  }, [search])

  useEffect(() => {
    try {
      localStorage.setItem(
        DRAFT_KEY,
        JSON.stringify({ residentId, moodChip, chips, content, image })
      )
    } catch {
      /* quota */
    }
  }, [residentId, moodChip, chips, content, image])

  const onFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = () => setImage(String(reader.result))
    reader.readAsDataURL(file)
  }

  const aiDraft = async () => {
    const resident = residents.find((r) => r.id === residentId)
    setDrafting(true)
    try {
      const res = await fetch("/api/ai/draft", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ residentName: resident?.name, moodChip, chips }),
      })
      const data = await res.json()
      if (res.ok && data.draft) {
        setContent(data.draft)
        toast.success("초안을 채웠습니다.")
      } else toast.error("초안 생성 실패")
    } finally {
      setDrafting(false)
    }
  }

  const submit = async (asDraft = false) => {
    if (!residentId) {
      toast.error("어르신을 선택하세요.")
      return
    }
    setSending(true)
    try {
      const res = await fetch("/api/daily-reports", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          residentId,
          content,
          moodChip,
          chips,
          images: image ? [image] : [],
          isDraft: asDraft,
        }),
      })
      if (!res.ok) throw new Error("fail")
      toast.success(asDraft ? "임시저장되었습니다." : "알림장을 보냈습니다.")
      localStorage.removeItem(DRAFT_KEY)
      if (!asDraft) {
        const next = missing.find((m) => m.id !== residentId)
        if (next) {
          setResidentId(next.id)
          setContent("")
          setChips([])
          setImage(null)
          setMoodChip("OK")
          setMissing((m) => m.filter((x) => x.id !== residentId))
        } else router.push("/dashboard")
      }
    } catch {
      toast.error("전송에 실패했습니다. 초안은 기기에 보관됩니다.")
    } finally {
      setSending(false)
    }
  }

  return (
    <div className="mx-auto max-w-xl px-4 py-6 sm:px-6">
      <PageHeader title="알림장 퀵작성" description="사진 → 칩 → 전송. 2분이면 충분합니다." />

      {missing.length > 0 && (
        <div className="mb-6 border-b border-[var(--sn-line)] pb-4">
          <p className="text-sm font-medium text-[var(--sn-ink-muted)]">
            오늘 미작성 {missing.length}명
          </p>
          <div className="mt-2 flex flex-wrap gap-2">
            {missing.map((m) => (
              <button
                key={m.id}
                type="button"
                onClick={() => setResidentId(m.id)}
                className="badge-neutral border border-[var(--sn-line)]"
              >
                {m.name}
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="space-y-6">
        <div>
          <label className="label">어르신</label>
          <div className="grid grid-cols-3 gap-2">
            {residents.map((r) => (
              <button
                key={r.id}
                type="button"
                onClick={() => setResidentId(r.id)}
                className={`flex min-h-[72px] flex-col items-center justify-center border px-2 py-3 text-sm font-medium ${
                  residentId === r.id
                    ? "border-[var(--sn-accent)] bg-[var(--sn-accent-soft)] text-[var(--sn-accent-hover)]"
                    : "border-[var(--sn-line)] bg-[var(--sn-surface)]"
                }`}
              >
                <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[var(--sn-bg)] font-display text-sm">
                  {r.name.slice(0, 1)}
                </span>
                <span className="mt-1">{r.name}</span>
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="label">사진</label>
          <label className="flex min-h-[180px] cursor-pointer flex-col items-center justify-center border border-dashed border-[var(--sn-line-strong)] bg-[var(--sn-surface)]">
            {image ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={image} alt="미리보기" className="max-h-56 w-full object-cover" />
            ) : (
              <>
                <Camera className="mb-2 h-8 w-8 text-[var(--sn-accent)]" />
                <span className="text-[var(--sn-ink-muted)]">사진 찍기 / 선택</span>
              </>
            )}
            <input type="file" accept="image/*" capture="environment" className="hidden" onChange={onFile} />
          </label>
        </div>

        <div>
          <label className="label">상태</label>
          <ChipPicker options={MOODS} value={moodChip} onChange={(v) => setMoodChip(String(v))} />
        </div>

        <div>
          <label className="label">오늘 한 일</label>
          <ChipPicker
            options={CHIP_OPTIONS}
            value={chips}
            multi
            onChange={(v) => setChips(Array.isArray(v) ? v : [v])}
          />
        </div>

        <div>
          <div className="mb-2 flex items-center justify-between">
            <label className="label mb-0">한 줄 소식</label>
            <button
              type="button"
              onClick={aiDraft}
              disabled={drafting || !residentId}
              className="inline-flex min-h-[44px] items-center gap-1 text-sm font-medium text-[var(--sn-accent)]"
            >
              <Sparkles className="h-4 w-4" />
              {drafting ? "작성 중…" : "AI 초안"}
            </button>
          </div>
          <textarea
            className="input min-h-[100px]"
            placeholder="예: 오늘 산책을 다녀오셨어요."
            value={content}
            onChange={(e) => setContent(e.target.value)}
          />
        </div>

        <div className="flex gap-3">
          <button type="button" className="btn-secondary flex-1" disabled={sending} onClick={() => submit(true)}>
            임시저장
          </button>
          <button type="button" className="btn-primary flex-[2]" disabled={sending} onClick={() => submit(false)}>
            <Send className="h-5 w-5" />
            {sending ? "전송 중…" : "전송"}
          </button>
        </div>
      </div>
    </div>
  )
}

export default function QuickReportWritePage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-[var(--sn-ink-muted)]">불러오는 중…</div>}>
      <QuickWriteInner />
    </Suspense>
  )
}
