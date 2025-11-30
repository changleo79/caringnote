"use client"

import { useState, useEffect } from "react"
import { useRouter, useParams } from "next/navigation"
import { useSession } from "next-auth/react"
import AppLayout from "@/components/layout/AppLayout"
import Link from "next/link"
import toast from "react-hot-toast"
import { ArrowLeft, Save, Upload, X, User } from "lucide-react"
import Image from "next/image"

export default function EditResidentPage() {
  const router = useRouter()
  const params = useParams()
  const { data: session } = useSession()
  const [isLoading, setIsLoading] = useState(false)
  const [loadingResident, setLoadingResident] = useState(true)
  const [formData, setFormData] = useState({
    name: "",
    birthDate: "",
    gender: "",
    roomNumber: "",
    photoUrl: "",
  })

  // 입소자 정보 불러오기
  useEffect(() => {
    const loadResident = async () => {
      try {
        const res = await fetch(`/api/residents/${params.id}`)
        const data = await res.json()
        
        if (res.ok) {
          setFormData({
            name: data.name || "",
            birthDate: data.birthDate ? new Date(data.birthDate).toISOString().split('T')[0] : "",
            gender: data.gender || "",
            roomNumber: data.roomNumber || "",
            photoUrl: data.photoUrl || "",
          })
        } else {
          toast.error(data.error || "입소자 정보를 불러오는데 실패했습니다.")
          router.push("/residents")
        }
      } catch (error) {
        console.error("Error loading resident:", error)
        toast.error("입소자 정보를 불러오는 중 오류가 발생했습니다.")
        router.push("/residents")
      } finally {
        setLoadingResident(false)
      }
    }

    if (session && params.id) {
      loadResident()
    }
  }, [session, params.id, router])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.name) {
      toast.error("이름을 입력해주세요.")
      return
    }

    setIsLoading(true)

    try {
      const res = await fetch(`/api/residents/${params.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      })

      const data = await res.json()

      if (res.ok) {
        toast.success("입소자 정보가 수정되었습니다!")
        router.push("/residents")
        router.refresh()
      } else {
        toast.error(data.error || "입소자 수정에 실패했습니다.")
      }
    } catch (error) {
      console.error("Error updating resident:", error)
      toast.error("입소자 수정 중 오류가 발생했습니다.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleAddImageUrl = () => {
    const url = prompt("프로필 이미지 URL을 입력하세요:")
    if (url && url.trim()) {
      setFormData({
        ...formData,
        photoUrl: url.trim(),
      })
    }
  }

  if (!session || (session.user.role !== "CAREGIVER" && session.user.role !== "ADMIN")) {
    return (
      <AppLayout>
        <div className="container mx-auto px-4 py-8 max-w-4xl">
          <div className="bg-white rounded-3xl shadow-soft border border-gray-100 p-12 text-center">
            <p className="text-gray-600">입소자 수정은 요양원 직원만 가능합니다.</p>
          </div>
        </div>
      </AppLayout>
    )
  }

  if (loadingResident) {
    return (
      <AppLayout>
        <div className="container mx-auto px-4 py-8 max-w-4xl">
          <div className="text-center py-16">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
            <p className="mt-4 text-gray-600">입소자 정보를 불러오는 중...</p>
          </div>
        </div>
      </AppLayout>
    )
  }

  return (
    <AppLayout>
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Back Button */}
        <Link
          href="/residents"
          className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 mb-6 transition-colors group"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          <span>뒤로가기</span>
        </Link>

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
            입소자 정보 수정
          </h1>
          <p className="text-gray-600">
            입소자 정보를 수정합니다
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="bg-white rounded-3xl shadow-soft border border-gray-100 p-8 md:p-12 space-y-6">
          {/* 프로필 사진 */}
          <div>
            <label className="block text-sm font-semibold text-gray-800 mb-3">
              프로필 사진
            </label>
            <div className="flex items-center gap-6">
              <div className="relative w-24 h-24 rounded-full overflow-hidden bg-gradient-to-br from-primary-400 to-accent-400 flex items-center justify-center">
                {formData.photoUrl ? (
                  <Image
                    src={formData.photoUrl}
                    alt="Profile"
                    fill
                    className="object-cover"
                  />
                ) : (
                  <User className="w-12 h-12 text-white" />
                )}
              </div>
              <div className="flex-1">
                <button
                  type="button"
                  onClick={handleAddImageUrl}
                  className="px-4 py-2 bg-primary-600 text-white rounded-lg text-sm font-bold hover:bg-primary-700 transition-colors inline-flex items-center gap-2"
                >
                  <Upload className="w-4 h-4" />
                  이미지 URL 추가
                </button>
                {formData.photoUrl && (
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, photoUrl: "" })}
                    className="ml-2 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg text-sm font-bold hover:bg-gray-300 transition-colors inline-flex items-center gap-2"
                  >
                    <X className="w-4 h-4" />
                    제거
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* 이름 */}
          <div>
            <label className="block text-sm font-semibold text-gray-800 mb-3">
              이름 <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
              className="w-full px-4 py-3.5 border-2 border-gray-200 rounded-xl input-focus outline-none transition-all bg-white text-gray-900 font-medium"
              placeholder="이름을 입력하세요"
            />
          </div>

          {/* 생년월일 */}
          <div>
            <label className="block text-sm font-semibold text-gray-800 mb-3">
              생년월일
            </label>
            <input
              type="date"
              value={formData.birthDate}
              onChange={(e) => setFormData({ ...formData, birthDate: e.target.value })}
              className="w-full px-4 py-3.5 border-2 border-gray-200 rounded-xl input-focus outline-none transition-all bg-white text-gray-900 font-medium"
            />
          </div>

          {/* 성별 */}
          <div>
            <label className="block text-sm font-semibold text-gray-800 mb-3">
              성별
            </label>
            <select
              value={formData.gender}
              onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
              className="w-full px-4 py-3.5 border-2 border-gray-200 rounded-xl input-focus outline-none transition-all bg-white text-gray-900 font-medium"
            >
              <option value="">선택하세요</option>
              <option value="남성">남성</option>
              <option value="여성">여성</option>
            </select>
          </div>

          {/* 호실 */}
          <div>
            <label className="block text-sm font-semibold text-gray-800 mb-3">
              호실
            </label>
            <input
              type="text"
              value={formData.roomNumber}
              onChange={(e) => setFormData({ ...formData, roomNumber: e.target.value })}
              className="w-full px-4 py-3.5 border-2 border-gray-200 rounded-xl input-focus outline-none transition-all bg-white text-gray-900 font-medium"
              placeholder="예: 101"
            />
          </div>

          {/* Submit Buttons */}
          <div className="flex gap-4 pt-4">
            <button
              type="submit"
              disabled={isLoading}
              className="flex-1 btn-primary inline-flex items-center justify-center gap-2"
            >
              <Save className="w-5 h-5" />
              {isLoading ? "수정 중..." : "수정하기"}
            </button>
            <Link
              href="/residents"
              className="px-6 py-3.5 bg-gray-200 text-gray-700 rounded-xl font-bold hover:bg-gray-300 transition-colors"
            >
              취소
            </Link>
          </div>
        </form>
      </div>
    </AppLayout>
  )
}

