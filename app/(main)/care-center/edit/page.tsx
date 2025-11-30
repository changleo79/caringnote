"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import toast from "react-hot-toast"
import AppLayout from "@/components/layout/AppLayout"
import { Building2, MapPin, Phone, Mail, FileText, ArrowLeft, Loader2 } from "lucide-react"

interface CareCenter {
  id: string
  name: string
  address: string
  phone: string | null
  email: string | null
  description: string | null
  logoUrl: string | null
}

export default function CareCenterEditPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [careCenterId, setCareCenterId] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    name: "",
    address: "",
    phone: "",
    email: "",
    description: "",
    logoUrl: "",
  })

  // 요양원 정보 불러오기
  useEffect(() => {
    async function loadCareCenter() {
      try {
        setIsLoading(true)

        // 현재 사용자의 요양원 정보 조회
        const res = await fetch("/api/users/me/care-center")
        if (!res.ok) {
          throw new Error("요양원 정보를 불러올 수 없습니다.")
        }

        const data = await res.json()

        if (!data.careCenter) {
          // 새로 생성해야 하는 경우
          setCareCenterId(null)
          setIsLoading(false)
          return
        }

        setCareCenterId(data.careCenter.id)

        // 기존 요양원 정보 로드
        const careCenterRes = await fetch(`/api/care-centers/${data.careCenter.id}`)
        if (!careCenterRes.ok) {
          throw new Error("요양원 정보를 불러올 수 없습니다.")
        }

        const careCenter: CareCenter = await careCenterRes.json()

        setFormData({
          name: careCenter.name || "",
          address: careCenter.address || "",
          phone: careCenter.phone || "",
          email: careCenter.email || "",
          description: careCenter.description || "",
          logoUrl: careCenter.logoUrl || "",
        })
      } catch (error: any) {
        console.error("Error loading care center:", error)
        toast.error(error.message || "요양원 정보를 불러오는데 실패했습니다.")
      } finally {
        setIsLoading(false)
      }
    }

    loadCareCenter()
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSaving(true)

    try {
      if (!careCenterId) {
        toast.error("요양원 정보를 찾을 수 없습니다.")
        return
      }

      // 필수 필드 검증
      if (!formData.name.trim() || !formData.address.trim()) {
        toast.error("요양원 이름과 주소는 필수입니다.")
        setIsSaving(false)
        return
      }

      const res = await fetch(`/api/care-centers/${careCenterId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: formData.name.trim(),
          address: formData.address.trim(),
          phone: formData.phone.trim() || null,
          email: formData.email.trim() || null,
          description: formData.description.trim() || null,
          logoUrl: formData.logoUrl.trim() || null,
        }),
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error || "요양원 정보 수정에 실패했습니다.")
      }

      toast.success("요양원 정보가 수정되었습니다.")
      router.push("/care-center")
      router.refresh()
    } catch (error: any) {
      console.error("Error updating care center:", error)
      toast.error(error.message || "요양원 정보 수정에 실패했습니다.")
    } finally {
      setIsSaving(false)
    }
  }

  if (isLoading) {
    return (
      <AppLayout>
        <div className="section-container py-10">
          <div className="card-notion p-12 text-center">
            <Loader2 className="w-8 h-8 text-primary-600 animate-spin mx-auto mb-4" />
            <p className="text-neutral-600">요양원 정보를 불러오는 중...</p>
          </div>
        </div>
      </AppLayout>
    )
  }

  return (
    <AppLayout>
      <div className="section-container py-10">
        {/* Header - Notion 스타일 */}
        <div className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-neutral-900 mb-2 tracking-tight">
              요양원 정보 수정
            </h1>
            <p className="text-neutral-600">요양원 기본 정보를 수정합니다.</p>
          </div>
          <Link
            href="/care-center"
            className="btn-linear-secondary inline-flex items-center justify-center gap-2 flex-shrink-0 whitespace-nowrap"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>돌아가기</span>
          </Link>
        </div>

        {/* Form - Notion 스타일 */}
        <form onSubmit={handleSubmit} className="card-notion p-8 md:p-10">
          <div className="space-y-6 max-w-2xl">
            {/* 요양원 이름 */}
            <div>
              <label className="block text-sm font-semibold text-neutral-900 mb-2">
                요양원 이름 <span className="text-red-600">*</span>
              </label>
              <div className="relative">
                <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-400" />
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                  className="input-vercel w-full pl-10"
                  placeholder="요양원 이름을 입력하세요"
                />
              </div>
            </div>

            {/* 주소 */}
            <div>
              <label className="block text-sm font-semibold text-neutral-900 mb-2">
                주소 <span className="text-red-600">*</span>
              </label>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-400" />
                <input
                  type="text"
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  required
                  className="input-vercel w-full pl-10"
                  placeholder="요양원 주소를 입력하세요"
                />
              </div>
            </div>

            {/* 전화번호 */}
            <div>
              <label className="block text-sm font-semibold text-neutral-900 mb-2">
                전화번호
              </label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-400" />
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="input-vercel w-full pl-10"
                  placeholder="02-1234-5678"
                />
              </div>
            </div>

            {/* 이메일 */}
            <div>
              <label className="block text-sm font-semibold text-neutral-900 mb-2">
                이메일
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-400" />
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="input-vercel w-full pl-10"
                  placeholder="example@example.com"
                />
              </div>
            </div>

            {/* 로고 URL */}
            <div>
              <label className="block text-sm font-semibold text-neutral-900 mb-2">
                로고 URL
              </label>
              <input
                type="url"
                value={formData.logoUrl}
                onChange={(e) => setFormData({ ...formData, logoUrl: e.target.value })}
                className="input-vercel w-full"
                placeholder="https://example.com/logo.png"
              />
              <p className="mt-2 text-xs text-neutral-500">
                로고 이미지의 URL을 입력하세요. (추후 파일 업로드 기능 추가 예정)
              </p>
            </div>

            {/* 설명 */}
            <div>
              <label className="block text-sm font-semibold text-neutral-900 mb-2">
                설명
              </label>
              <div className="relative">
                <FileText className="absolute left-3 top-3 w-5 h-5 text-neutral-400" />
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={6}
                  className="input-vercel w-full pl-10 resize-none"
                  placeholder="요양원에 대한 설명을 입력하세요"
                />
              </div>
            </div>

            {/* Submit Buttons */}
            <div className="flex gap-3 pt-4">
              <button
                type="submit"
                disabled={isSaving}
                className="flex-1 btn-linear-primary inline-flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSaving ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    저장 중...
                  </>
                ) : (
                  <>
                    <Building2 className="w-4 h-4" />
                    저장하기
                  </>
                )}
              </button>
              <Link
                href="/care-center"
                className="btn-linear-secondary inline-flex items-center justify-center gap-2"
              >
                취소
              </Link>
            </div>
          </div>
        </form>
      </div>
    </AppLayout>
  )
}
