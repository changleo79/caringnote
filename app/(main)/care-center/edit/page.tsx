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

      // careCenterId가 없으면 사용자 ID를 사용 (API에서 자동 생성됨)
      const careCenterId = session.user.careCenterId || session.user.id

      try {
        console.log("요양원 정보 불러오기 시도:", { careCenterId, userId: session.user.id, hasCareCenterId: !!session.user.careCenterId })
        const res = await fetch(`/api/care-centers/${careCenterId}`)
        const data = await res.json()

        console.log("요양원 정보 응답:", { status: res.status, ok: res.ok, data })

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
          console.error("요양원 정보 불러오기 실패:", data)
          // 요양원이 없으면 빈 폼으로 계속 진행 (저장 시 자동 생성됨)
          if (res.status === 404 || data.error?.includes("찾을 수 없습니다")) {
            console.log("요양원이 없음 - 빈 폼으로 진행")
            // 빈 폼으로 계속 진행
            setFormData({
              name: "",
              address: "",
              phone: "",
              email: "",
              description: "",
              logoUrl: "",
            })
            setLoadingData(false)
            return
          }
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
      <div className="container mx-auto px-6 py-12 max-w-4xl">
        {/* Back Button */}
        <Link
          href="/dashboard"
          className="inline-flex items-center gap-2 text-base text-neutral-600 hover:text-neutral-900 mb-8 transition-all duration-300 group font-bold px-4 py-2 rounded-xl hover:bg-white/80 backdrop-blur-sm"
        >
          <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
          <span>뒤로가기</span>
        </Link>

        {/* Header */}
        <div className="mb-12">
          <h1 className="text-5xl md:text-6xl font-black text-neutral-900 mb-4 tracking-tight">
            요양원 정보 수정
          </h1>
          <p className="text-xl text-neutral-600 font-bold">
            요양원 정보를 수정할 수 있습니다
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="bg-gradient-to-br from-purple-50/60 via-white to-indigo-100/40 rounded-3xl shadow-3d border-4 border-purple-300/60 p-12 md:p-16 space-y-10 backdrop-blur-sm">
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
              className="input-vercel w-full"
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
              className="input-vercel w-full"
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
              className="input-vercel w-full"
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
              className="input-vercel w-full"
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
              className="input-vercel w-full resize-none"
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
              className="input-vercel w-full"
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

