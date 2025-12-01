"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useSession } from "next-auth/react"
import Link from "next/link"
import AppLayout from "@/components/layout/AppLayout"
import toast from "react-hot-toast"
import { ArrowLeft, Building2, Phone, Mail, MapPin, FileText, Image as ImageIcon } from "lucide-react"

export default function EditCareCenterPage() {
  const router = useRouter()
  const { data: session, status } = useSession()
  const [formData, setFormData] = useState({
    name: "",
    address: "",
    phone: "",
    email: "",
    description: "",
    logoUrl: "",
  })
  const [isLoading, setIsLoading] = useState(false)
  const [loadingData, setLoadingData] = useState(true)

  // 요양원 정보 불러오기
  useEffect(() => {
    const loadCareCenter = async () => {
      if (status === "loading") return
      
      if (!session || session.user.role !== "CAREGIVER") {
        toast.error("요양원 직원만 접근할 수 있습니다.")
        router.push("/dashboard")
        return
      }

      // careCenterId가 없으면 임시 ID 생성 (나중에 API에서 실제 ID로 생성됨)
      const careCenterId = session.user.careCenterId || session.user.id

      try {
        const res = await fetch(`/api/care-centers/${careCenterId}`)
        const data = await res.json()

        if (res.ok) {
          setFormData({
            name: data.name || "",
            address: data.address || "",
            phone: data.phone || "",
            email: data.email || "",
            description: data.description || "",
            logoUrl: data.logoUrl || "",
          })
        } else {
          toast.error(data.error || "요양원 정보를 불러오는데 실패했습니다.")
          router.push("/dashboard")
        }
      } catch (error: any) {
        console.error("Error loading care center:", error)
        toast.error("요양원 정보를 불러오는 중 오류가 발생했습니다.")
        router.push("/dashboard")
      } finally {
        setLoadingData(false)
      }
    }

    loadCareCenter()
  }, [session, status, router])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    if (!session) {
      toast.error("인증이 필요합니다.")
      setIsLoading(false)
      return
    }

    // careCenterId가 없으면 사용자 ID를 사용 (API에서 자동 생성됨)
    const careCenterId = session.user.careCenterId || session.user.id

    try {
      const response = await fetch(`/api/care-centers/${careCenterId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      })

      const data = await response.json()

      if (response.ok) {
        toast.success("요양원 정보가 저장되었습니다!")
        router.push("/dashboard")
        router.refresh()
      } else {
        toast.error(data.error || "요양원 정보 저장에 실패했습니다.")
      }
    } catch (error: any) {
      console.error("Error updating care center:", error)
      toast.error("요양원 정보 저장 중 오류가 발생했습니다.")
    } finally {
      setIsLoading(false)
    }
  }

  if (status === "loading" || loadingData) {
    return (
      <AppLayout>
        <div className="container mx-auto px-4 py-8 max-w-4xl">
          <div className="text-center py-20">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
            <p className="mt-4 text-gray-600">로딩 중...</p>
          </div>
        </div>
      </AppLayout>
    )
  }

  if (!session || session.user.role !== "CAREGIVER") {
    return null
  }

  return (
    <AppLayout>
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Back Button */}
        <Link
          href="/dashboard"
          className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 mb-6 transition-colors group"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          <span>뒤로가기</span>
        </Link>

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
            요양원 정보 수정
          </h1>
          <p className="text-gray-600">
            요양원 정보를 수정할 수 있습니다
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="bg-white rounded-3xl shadow-soft border border-gray-100 p-8 md:p-12 space-y-6">
          {/* 요양원 이름 */}
          <div>
            <label className="block text-sm font-semibold text-gray-800 mb-3 flex items-center gap-2">
              <Building2 className="w-4 h-4 text-primary-600" />
              요양원 이름 <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
              className="w-full px-4 py-3.5 border border-gray-200 rounded-xl input-focus outline-none transition-all bg-white text-gray-900 placeholder:text-gray-400"
              placeholder="요양원 이름을 입력하세요"
            />
          </div>

          {/* 주소 */}
          <div>
            <label className="block text-sm font-semibold text-gray-800 mb-3 flex items-center gap-2">
              <MapPin className="w-4 h-4 text-primary-600" />
              주소 <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              required
              className="w-full px-4 py-3.5 border border-gray-200 rounded-xl input-focus outline-none transition-all bg-white text-gray-900 placeholder:text-gray-400"
              placeholder="요양원 주소를 입력하세요"
            />
          </div>

          {/* 전화번호 */}
          <div>
            <label className="block text-sm font-semibold text-gray-800 mb-3 flex items-center gap-2">
              <Phone className="w-4 h-4 text-primary-600" />
              전화번호
            </label>
            <input
              type="tel"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              className="w-full px-4 py-3.5 border border-gray-200 rounded-xl input-focus outline-none transition-all bg-white text-gray-900 placeholder:text-gray-400"
              placeholder="02-1234-5678"
            />
          </div>

          {/* 이메일 */}
          <div>
            <label className="block text-sm font-semibold text-gray-800 mb-3 flex items-center gap-2">
              <Mail className="w-4 h-4 text-primary-600" />
              이메일
            </label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="w-full px-4 py-3.5 border border-gray-200 rounded-xl input-focus outline-none transition-all bg-white text-gray-900 placeholder:text-gray-400"
              placeholder="info@example.com"
            />
          </div>

          {/* 설명 */}
          <div>
            <label className="block text-sm font-semibold text-gray-800 mb-3 flex items-center gap-2">
              <FileText className="w-4 h-4 text-primary-600" />
              설명
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={6}
              className="w-full px-4 py-3.5 border border-gray-200 rounded-xl input-focus outline-none transition-all bg-white text-gray-900 placeholder:text-gray-400 resize-none"
              placeholder="요양원에 대한 설명을 입력하세요"
            />
          </div>

          {/* 로고 URL */}
          <div>
            <label className="block text-sm font-semibold text-gray-800 mb-3 flex items-center gap-2">
              <ImageIcon className="w-4 h-4 text-primary-600" />
              로고 이미지 URL
            </label>
            <input
              type="url"
              value={formData.logoUrl}
              onChange={(e) => setFormData({ ...formData, logoUrl: e.target.value })}
              className="w-full px-4 py-3.5 border border-gray-200 rounded-xl input-focus outline-none transition-all bg-white text-gray-900 placeholder:text-gray-400"
              placeholder="https://example.com/logo.png"
            />
            {formData.logoUrl && (
              <div className="mt-3">
                <img
                  src={formData.logoUrl}
                  alt="로고 미리보기"
                  className="w-32 h-32 object-cover rounded-xl border border-gray-200"
                  onError={(e) => {
                    e.currentTarget.style.display = "none"
                  }}
                />
              </div>
            )}
          </div>

          {/* Submit Button */}
          <div className="flex gap-4 pt-4">
            <Link
              href="/dashboard"
              className="btn-secondary flex-1 text-center"
            >
              취소
            </Link>
            <button
              type="submit"
              disabled={isLoading}
              className="btn-primary flex-1"
            >
              {isLoading ? "수정 중..." : "정보 수정"}
            </button>
          </div>
        </form>
      </div>
    </AppLayout>
  )
}

