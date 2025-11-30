"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useSession } from "next-auth/react"
import AppLayout from "@/components/layout/AppLayout"
import Link from "next/link"
import toast from "react-hot-toast"
import { ArrowLeft, Heart, Calendar } from "lucide-react"

export default function NewMedicalRecordPage() {
  const router = useRouter()
  const { data: session } = useSession()
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    recordDate: new Date().toISOString().split("T")[0],
    category: "Other",
    residentId: "",
  })
  const [residents, setResidents] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [loadingResidents, setLoadingResidents] = useState(true)

  // 입소자 목록 불러오기
  useEffect(() => {
    const loadResidents = async () => {
      try {
        const res = await fetch("/api/residents")
        const data = await res.json()
        if (res.ok && Array.isArray(data)) {
          setResidents(data)
        }
      } catch (error) {
        console.error("Error loading residents:", error)
      } finally {
        setLoadingResidents(false)
      }
    }

    if (session) {
      loadResidents()
    }
  }, [session])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.title.trim() || !formData.residentId) {
      toast.error("제목과 입소자는 필수입니다.")
      return
    }

    setIsLoading(true)

    try {
      const response = await fetch("/api/medical-records", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: formData.title,
          content: formData.content || null,
          recordDate: formData.recordDate,
          category: formData.category,
          residentId: formData.residentId,
        }),
      })

      const data = await response.json()

      if (response.ok) {
        toast.success("의료 기록이 작성되었습니다!")
        router.push("/medical")
        router.refresh()
      } else {
        toast.error(data.error || "의료 기록 작성에 실패했습니다.")
      }
    } catch (error: any) {
      console.error("Error creating medical record:", error)
      toast.error("의료 기록 작성 중 오류가 발생했습니다.")
    } finally {
      setIsLoading(false)
    }
  }

  if (!session) {
    return null
  }

  return (
    <AppLayout>
      <div className="section-container py-10">
        {/* Back Button */}
        <Link
          href="/medical"
          className="inline-flex items-center gap-2 text-sm text-neutral-600 hover:text-neutral-900 mb-8 transition-colors font-medium"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>뒤로가기</span>
        </Link>

        {/* Header - Notion 스타일 */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-neutral-900 mb-2 tracking-tight">
            새 의료 기록 작성
          </h1>
          <p className="text-neutral-600">
            부모님의 건강 정보를 투명하게 기록해보세요
          </p>
        </div>

        {/* Form - Notion 스타일 */}
        <form onSubmit={handleSubmit} className="card-notion p-8 md:p-10 space-y-6">
          {/* 입소자 선택 */}
          <div>
            <label className="block text-sm font-semibold text-neutral-900 mb-2">
              입소자 <span className="text-red-600">*</span>
            </label>
            {loadingResidents ? (
              <div className="input-vercel w-full bg-neutral-50 text-neutral-500">
                입소자 목록 로딩 중...
              </div>
            ) : (
              <select
                value={formData.residentId}
                onChange={(e) => setFormData({ ...formData, residentId: e.target.value })}
                required
                className="input-vercel w-full"
              >
                <option value="">입소자를 선택하세요</option>
                {residents.map((resident) => (
                  <option key={resident.id} value={resident.id}>
                    {resident.name} {resident.roomNumber ? `(${resident.roomNumber})` : ""}
                  </option>
                ))}
              </select>
            )}
          </div>

          {/* 기록 날짜 */}
          <div>
            <label className="block text-sm font-semibold text-neutral-900 mb-2">
              기록 날짜 <span className="text-red-600">*</span>
            </label>
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-400" />
              <input
                type="date"
                value={formData.recordDate}
                onChange={(e) => setFormData({ ...formData, recordDate: e.target.value })}
                required
                className="input-vercel w-full pl-10"
              />
            </div>
          </div>

          {/* 카테고리 */}
          <div>
            <label className="block text-sm font-semibold text-neutral-900 mb-2">
              카테고리
            </label>
            <select
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              className="input-vercel w-full"
            >
              <option value="Treatment">진료</option>
              <option value="Medication">약물</option>
              <option value="Exam">검사</option>
              <option value="Symptom">증상</option>
              <option value="Other">기타</option>
            </select>
          </div>

          {/* 제목 */}
          <div>
            <label className="block text-sm font-semibold text-neutral-900 mb-2">
              제목 <span className="text-red-600">*</span>
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              required
              className="input-vercel w-full"
              placeholder="의료 기록 제목을 입력하세요"
            />
          </div>

          {/* 내용 */}
          <div>
            <label className="block text-sm font-semibold text-neutral-900 mb-2">
              내용
            </label>
            <textarea
              value={formData.content}
              onChange={(e) => setFormData({ ...formData, content: e.target.value })}
              rows={8}
              className="input-vercel w-full resize-none"
              placeholder="의료 기록 내용을 입력하세요..."
            />
          </div>

          {/* Submit Buttons */}
          <div className="flex gap-3 pt-4">
            <Link
              href="/medical"
              className="btn-linear-secondary flex-1 text-center"
            >
              취소
            </Link>
            <button
              type="submit"
              disabled={isLoading}
              className="flex-1 btn-linear-primary disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? "작성 중..." : "의료 기록 작성"}
            </button>
          </div>
        </form>
      </div>
    </AppLayout>
  )
}
