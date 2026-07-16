"use client"

import { Suspense, useEffect, useMemo, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import toast from "react-hot-toast"
import {
  ArrowLeft,
  ArrowRight,
  Camera,
  Check,
  Search,
  Send,
  Sparkles,
  X,
} from "lucide-react"
import { ChipPicker } from "@/components/calm/ChipPicker"

type Resident = {
  id: string
  name: string
  roomNumber?: string | null
  photoUrl?: string | null
}

const ACTIVITIES = [
  { id: "meal", label: "식사 잘함" },
  { id: "sleep", label: "편안한 휴식" },
  { id: "walk", label: "산책" },
  { id: "program", label: "프로그램 참여" },
  { id: "low", label: "컨디션 저하" },
  { id: "hospital", label: "병원 동행" },
]

const MOODS = [
  { id: "GOOD", label: "편안함" },
  { id: "OK", label: "평소와 같음" },
  { id: "CAUTION", label: "살펴봄" },
]

const DRAFT_KEY = "sn-quick-report-draft-v2"

function QuickWriteInner() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [step, setStep] = useState(1)
  const [residents, setResidents] = useState<Resident[]>([])
  const [missing, setMissing] = useState<Resident[]>([])
  const [query, setQuery] = useState("")
  const [residentId, setResidentId] = useState(searchParams.get("residentId") || "")
  const [moodChip, setMoodChip] = useState("OK")
  const [chips, setChips] = useState<string[]>([])
  const [content, setContent] = useState("")
  const [image, setImage] = useState<string | null>(null)
  const [uploading, setUploading] = useState(false)
  const [sending, setSending] = useState(false)
  const [drafting, setDrafting] = useState(false)

  useEffect(() => {
    fetch("/api/residents")
      .then((response) => response.json())
      .then((data) => setResidents(Array.isArray(data) ? data : []))
    const today = new Date().toISOString().slice(0, 10)
    fetch(`/api/daily-reports?missing=1&date=${today}`)
      .then((response) => response.json())
      .then((data) => setMissing(Array.isArray(data) ? data : []))

    try {
      const raw = localStorage.getItem(DRAFT_KEY)
      if (!raw) return
      const draft = JSON.parse(raw)
      if (!searchParams.get("residentId") && draft.residentId) {
        setResidentId(draft.residentId)
      }
      if (draft.moodChip) setMoodChip(draft.moodChip)
      if (Array.isArray(draft.chips)) setChips(draft.chips)
      if (draft.content) setContent(draft.content)
      if (draft.image) setImage(draft.image)
    } catch {
      /* A corrupt local draft must never block writing. */
    }
  }, [searchParams])

  useEffect(() => {
    try {
      localStorage.setItem(
        DRAFT_KEY,
        JSON.stringify({ residentId, moodChip, chips, content, image })
      )
    } catch {
      /* Storage may be unavailable on shared devices. */
    }
  }, [residentId, moodChip, chips, content, image])

  const filteredResidents = useMemo(() => {
    const normalized = query.trim().toLowerCase()
    if (!normalized) return residents
    return residents.filter(
      (resident) =>
        resident.name.toLowerCase().includes(normalized) ||
        resident.roomNumber?.toLowerCase().includes(normalized)
    )
  }, [query, residents])

  const selectedResident = residents.find((resident) => resident.id === residentId)

  const chooseResident = (id: string) => {
    setResidentId(id)
    setStep(2)
  }

  const onFile = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return
    setUploading(true)
    try {
      const formData = new FormData()
      formData.append("file", file)
      const response = await fetch("/api/upload", { method: "POST", body: formData })
      const data = await response.json()
      if (!response.ok || !data.url) throw new Error(data.error || "업로드 실패")
      setImage(data.url)
      toast.success("사진을 준비했습니다.")
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "사진 업로드에 실패했습니다.")
    } finally {
      setUploading(false)
      event.target.value = ""
    }
  }

  const aiDraft = async () => {
    setDrafting(true)
    try {
      const response = await fetch("/api/ai/draft", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          residentName: selectedResident?.name,
          moodChip,
          chips,
        }),
      })
      const data = await response.json()
      if (response.ok && data.draft) {
        setContent(data.draft)
        toast.success("초안을 채웠습니다.")
      } else {
        toast.error("초안을 만들지 못했습니다.")
      }
    } finally {
      setDrafting(false)
    }
  }

  const submit = async (asDraft = false) => {
    if (!residentId) {
      toast.error("어르신을 선택하세요.")
      setStep(1)
      return
    }
    setSending(true)
    try {
      const response = await fetch("/api/daily-reports", {
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
      if (!response.ok) throw new Error("전송 실패")
      toast.success(asDraft ? "임시 저장했습니다." : "가족에게 전했습니다.")
      localStorage.removeItem(DRAFT_KEY)

      if (asDraft) return
      const next = missing.find((resident) => resident.id !== residentId)
      if (!next) {
        router.push("/dashboard")
        return
      }
      setMissing((current) => current.filter((resident) => resident.id !== residentId))
      setResidentId(next.id)
      setMoodChip("OK")
      setChips([])
      setContent("")
      setImage(null)
      setStep(2)
      toast.success(`다음은 ${next.name} 어르신입니다.`)
    } catch {
      toast.error("전송하지 못했습니다. 입력 내용은 이 기기에 보관됩니다.")
    } finally {
      setSending(false)
    }
  }

  return (
    <div className="mx-auto max-w-2xl">
      <header className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-semibold text-[var(--sn-accent)]">{step} / 3</p>
            <h1 className="mt-1 font-display text-3xl font-semibold tracking-[-0.03em]">
              {step === 1 ? "어르신 선택" : step === 2 ? "오늘의 기록" : "확인하고 전송"}
            </h1>
          </div>
          {missing.length > 0 && (
            <span className="chip-ok">미작성 {missing.length}명</span>
          )}
        </div>
        <div className="mt-5 grid grid-cols-3 gap-2" aria-hidden="true">
          {[1, 2, 3].map((item) => (
            <span
              key={item}
              className={`h-1 rounded-full ${
                item <= step ? "bg-[var(--sn-accent)]" : "bg-[var(--sn-line)]"
              }`}
            />
          ))}
        </div>
      </header>

      {step === 1 && (
        <section>
          <div className="relative mb-5">
            <Search className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-[var(--sn-ink-faint)]" />
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              className="input pl-12"
              placeholder="이름 또는 호실 검색"
              aria-label="어르신 검색"
            />
          </div>
          <div className="divide-y divide-[var(--sn-line)] border-y border-[var(--sn-line)]">
            {filteredResidents.map((resident) => {
              const isMissing = missing.some((item) => item.id === resident.id)
              return (
                <button
                  key={resident.id}
                  type="button"
                  onClick={() => chooseResident(resident.id)}
                  className="flex min-h-[72px] w-full items-center gap-4 py-3 text-left"
                >
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[var(--sn-surface-muted)] font-display font-semibold">
                    {resident.name.slice(0, 1)}
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block font-semibold">{resident.name}</span>
                    <span className="block text-sm text-[var(--sn-ink-muted)]">
                      {resident.roomNumber || "호실 미등록"}
                    </span>
                  </span>
                  <span className={isMissing ? "chip-ok" : "chip-good"}>
                    {isMissing ? "미작성" : "완료"}
                  </span>
                  <ArrowRight className="h-4 w-4 text-[var(--sn-ink-faint)]" />
                </button>
              )
            })}
          </div>
        </section>
      )}

      {step === 2 && (
        <section className="space-y-8">
          <button
            type="button"
            onClick={() => setStep(1)}
            className="inline-flex min-h-[44px] items-center gap-2 text-sm font-medium text-[var(--sn-ink-muted)]"
          >
            <ArrowLeft className="h-4 w-4" />
            {selectedResident?.name || "어르신 다시 선택"}
          </button>

          <div>
            <label className="label">사진</label>
            {image ? (
              <div className="relative aspect-[4/3] overflow-hidden bg-[var(--sn-surface-muted)]">
                {/* Supports both newly uploaded URLs and historic data URLs. */}
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={image} alt="알림장 사진 미리보기" className="h-full w-full object-cover" />
                <button
                  type="button"
                  onClick={() => setImage(null)}
                  className="absolute right-3 top-3 flex h-11 w-11 items-center justify-center rounded-full bg-black/60 text-white"
                  aria-label="사진 삭제"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
            ) : (
              <label className="flex min-h-[180px] cursor-pointer flex-col items-center justify-center rounded-[var(--sn-radius)] border border-dashed border-[var(--sn-line-strong)] bg-[var(--sn-surface)]">
                <Camera className="mb-3 h-7 w-7 text-[var(--sn-accent)]" />
                <span className="font-semibold">
                  {uploading ? "사진 올리는 중…" : "사진 찍기 또는 선택"}
                </span>
                <span className="mt-1 text-sm text-[var(--sn-ink-muted)]">최대 10MB</span>
                <input
                  type="file"
                  accept="image/jpeg,image/png,image/webp,image/gif"
                  capture="environment"
                  className="hidden"
                  onChange={onFile}
                  disabled={uploading}
                />
              </label>
            )}
          </div>

          <div>
            <label className="label">오늘 상태</label>
            <ChipPicker
              options={MOODS}
              value={moodChip}
              onChange={(value) => setMoodChip(String(value))}
            />
          </div>

          <div>
            <label className="label">오늘 한 일</label>
            <ChipPicker
              options={ACTIVITIES}
              value={chips}
              multi
              onChange={(value) => setChips(Array.isArray(value) ? value : [value])}
            />
          </div>

          <button type="button" onClick={() => setStep(3)} className="btn-primary w-full">
            확인하기
            <ArrowRight className="h-5 w-5" />
          </button>
        </section>
      )}

      {step === 3 && (
        <section>
          <button
            type="button"
            onClick={() => setStep(2)}
            className="mb-6 inline-flex min-h-[44px] items-center gap-2 text-sm font-medium text-[var(--sn-ink-muted)]"
          >
            <ArrowLeft className="h-4 w-4" />
            기록 수정
          </button>

          <div className="card overflow-hidden">
            {image && (
              <div className="aspect-[4/3] overflow-hidden bg-[var(--sn-surface-muted)]">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={image}
                  alt={`${selectedResident?.name || "어르신"} 어르신 알림장 사진`}
                  className="h-full w-full object-cover"
                />
              </div>
            )}
            <div className="p-5 sm:p-6">
              <div className="flex items-center justify-between gap-3">
                <div>
                  <p className="font-display text-xl font-semibold">{selectedResident?.name}</p>
                  <p className="mt-1 text-sm text-[var(--sn-ink-muted)]">
                    {MOODS.find((item) => item.id === moodChip)?.label}
                  </p>
                </div>
                <Check className="h-5 w-5 text-[var(--sn-accent)]" />
              </div>
              {chips.length > 0 && (
                <div className="mt-4 flex flex-wrap gap-2">
                  {chips.map((chip) => (
                    <span key={chip} className="badge-neutral">
                      {ACTIVITIES.find((item) => item.id === chip)?.label || chip}
                    </span>
                  ))}
                </div>
              )}
              <div className="mt-6">
                <div className="mb-2 flex items-center justify-between">
                  <label htmlFor="report-content" className="label mb-0">
                    가족에게 전할 말
                  </label>
                  <button
                    type="button"
                    onClick={aiDraft}
                    disabled={drafting}
                    className="inline-flex min-h-[44px] items-center gap-1.5 text-sm font-semibold text-[var(--sn-accent)]"
                  >
                    <Sparkles className="h-4 w-4" />
                    {drafting ? "작성 중…" : "AI 초안"}
                  </button>
                </div>
                <textarea
                  id="report-content"
                  className="input min-h-[128px]"
                  value={content}
                  onChange={(event) => setContent(event.target.value)}
                  placeholder="오늘의 모습을 쉬운 말로 적어 주세요."
                />
              </div>
            </div>
          </div>

          <div className="mt-5 flex gap-3">
            <button
              type="button"
              className="btn-secondary flex-1"
              disabled={sending}
              onClick={() => submit(true)}
            >
              임시 저장
            </button>
            <button
              type="button"
              className="btn-primary flex-[2]"
              disabled={sending}
              onClick={() => submit(false)}
            >
              <Send className="h-5 w-5" />
              {sending ? "전송 중…" : "가족에게 전송"}
            </button>
          </div>
        </section>
      )}
    </div>
  )
}

export default function QuickReportWritePage() {
  return (
    <Suspense fallback={<div className="py-20 text-center text-[var(--sn-ink-muted)]">불러오는 중…</div>}>
      <QuickWriteInner />
    </Suspense>
  )
}
