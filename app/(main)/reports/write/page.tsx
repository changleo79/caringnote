"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import toast from "react-hot-toast"
import { Camera, Send, Sparkles } from "lucide-react"

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

export default function QuickReportWritePage() {
  const router = useRouter()
  const [residents, setResidents] = useState<Resident[]>([])
  const [missing, setMissing] = useState<Resident[]>([])
  const [residentId, setResidentId] = useState("")
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
        if (d.residentId) setResidentId(d.residentId)
        if (d.moodChip) setMoodChip(d.moodChip)
        if (Array.isArray(d.chips)) setChips(d.chips)
        if (d.content) setContent(d.content)
        if (d.image) setImage(d.image)
      }
    } catch {
      /* ignore */
    }
  }, [])

  useEffect(() => {
    const payload = { residentId, moodChip, chips, content, image }
    try {
      localStorage.setItem(DRAFT_KEY, JSON.stringify(payload))
    } catch {
      /* quota */
    }
  }, [residentId, moodChip, chips, content, image])

  const toggleChip = (id: string) => {
    setChips((prev) => (prev.includes(id) ? prev.filter((c) => c !== id) : [...prev, id]))
  }

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
        body: JSON.stringify({
          residentName: resident?.name,
          moodChip,
          chips,
        }),
      })
      const data = await res.json()
      if (res.ok && data.draft) {
        setContent(data.draft)
        toast.success("초안을 채웠습니다. 다듬어 보내세요.")
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
        } else {
          router.push("/dashboard")
        }
      }
    } catch {
      toast.error("전송에 실패했습니다. 오프라인 초안은 기기에 보관됩니다.")
    } finally {
      setSending(false)
    }
  }

  return (
    <div className="p-4 sm:p-6 max-w-xl mx-auto">
      <div className="page-header">
        <h1 className="page-title">알림장 퀵작성</h1>
        <p className="page-description">사진 → 칩 → 전송. 2분이면 충분합니다.</p>
      </div>

      {missing.length > 0 && (
        <div className="card p-3 mb-4 border-rose-200 bg-rose-50/50">
          <p className="text-sm font-medium text-rose-800 mb-2">오늘 미작성 {missing.length}명</p>
          <div className="flex flex-wrap gap-2">
            {missing.map((m) => (
              <button
                key={m.id}
                type="button"
                onClick={() => setResidentId(m.id)}
                className="badge bg-white text-rose-700 border border-rose-200"
              >
                {m.name}
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="space-y-5">
        <div>
          <label className="label">어르신</label>
          <div className="grid grid-cols-3 gap-2">
            {residents.map((r) => (
              <button
                key={r.id}
                type="button"
                onClick={() => setResidentId(r.id)}
                className={`min-h-[56px] rounded-2xl border px-2 py-3 text-sm font-medium ${
                  residentId === r.id
                    ? "border-brand-500 bg-brand-50 text-brand-800"
                    : "border-neutral-200 bg-white"
                }`}
              >
                {r.name}
                {r.roomNumber ? <span className="block text-xs text-neutral-400">{r.roomNumber}</span> : null}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="label">사진 (선택)</label>
          <label className="card flex flex-col items-center justify-center min-h-[120px] cursor-pointer border-dashed">
            {image ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={image} alt="미리보기" className="max-h-48 rounded-xl" />
            ) : (
              <>
                <Camera className="w-8 h-8 text-brand-600 mb-2" />
                <span className="text-neutral-500">사진 찍기 / 선택</span>
              </>
            )}
            <input type="file" accept="image/*" capture="environment" className="hidden" onChange={onFile} />
          </label>
        </div>

        <div>
          <label className="label">상태</label>
          <div className="flex gap-2">
            {MOODS.map((m) => (
              <button
                key={m.id}
                type="button"
                onClick={() => setMoodChip(m.id)}
                className={`btn flex-1 ${moodChip === m.id ? "btn-primary" : "btn-secondary"}`}
              >
                {m.label}
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="label">오늘 한 일</label>
          <div className="flex flex-wrap gap-2">
            {CHIP_OPTIONS.map((c) => (
              <button
                key={c.id}
                type="button"
                onClick={() => toggleChip(c.id)}
                className={`min-h-[48px] px-4 rounded-xl border font-medium ${
                  chips.includes(c.id)
                    ? "bg-brand-600 text-white border-brand-600"
                    : "bg-white border-neutral-200"
                }`}
              >
                {c.label}
              </button>
            ))}
          </div>
        </div>

        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="label mb-0">한 줄 소식 (선택)</label>
            <button
              type="button"
              onClick={aiDraft}
              disabled={drafting || !residentId}
              className="text-sm font-medium text-brand-700 inline-flex items-center gap-1 min-h-[44px] px-2"
            >
              <Sparkles className="w-4 h-4" />
              {drafting ? "작성 중…" : "AI 초안"}
            </button>
          </div>
          <textarea
            className="input min-h-[96px]"
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
            <Send className="w-5 h-5" />
            {sending ? "전송 중…" : "전송"}
          </button>
        </div>
      </div>
    </div>
  )
}
