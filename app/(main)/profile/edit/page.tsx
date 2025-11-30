"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useSession } from "next-auth/react"
import AppLayout from "@/components/layout/AppLayout"
import Link from "next/link"
import toast from "react-hot-toast"
import { ArrowLeft, User, Save, Upload, X } from "lucide-react"
import Image from "next/image"

export default function ProfileEditPage() {
  const router = useRouter()
  const { data: session, update } = useSession()
  const [isLoading, setIsLoading] = useState(false)
  const [loadingProfile, setLoadingProfile] = useState(true)
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    avatarUrl: "",
  })
  const [user, setUser] = useState<any>(null)

  // 프로필 정보 불러오기
  useEffect(() => {
    const loadProfile = async () => {
      try {
        const res = await fetch("/api/users/me")
        const data = await res.json()
        
        if (res.ok) {
          setUser(data)
          setFormData({
            name: data.name || "",
            phone: data.phone || "",
            avatarUrl: data.avatarUrl || "",
          })
        } else {
          toast.error(data.error || "프로필을 불러오는데 실패했습니다.")
        }
      } catch (error) {
        console.error("Error loading profile:", error)
        toast.error("프로필을 불러오는 중 오류가 발생했습니다.")
      } finally {
        setLoadingProfile(false)
      }
    }

    if (session) {
      loadProfile()
    }
  }, [session])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const res = await fetch("/api/users/me", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      })

      const data = await res.json()

      if (res.ok) {
        toast.success("프로필이 수정되었습니다!")
        // 세션 업데이트
        await update()
        router.push("/dashboard")
        router.refresh()
      } else {
        toast.error(data.error || "프로필 수정에 실패했습니다.")
      }
    } catch (error) {
      console.error("Error updating profile:", error)
      toast.error("프로필 수정 중 오류가 발생했습니다.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleAddImageUrl = () => {
    const url = prompt("프로필 이미지 URL을 입력하세요:")
    if (url && url.trim()) {
      setFormData({
        ...formData,
        avatarUrl: url.trim(),
      })
    }
  }

  if (!session) {
    return null
  }

  if (loadingProfile) {
    return (
      <AppLayout>
        <div className="section-container py-10">
          <div className="card-notion p-12 text-center">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
            <p className="mt-4 text-neutral-600">프로필을 불러오는 중...</p>
          </div>
        </div>
      </AppLayout>
    )
  }

  return (
    <AppLayout>
      <div className="section-container py-10">
        {/* Back Button */}
        <Link
          href="/dashboard"
          className="inline-flex items-center gap-2 text-sm text-neutral-600 hover:text-neutral-900 mb-8 transition-colors font-medium"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>뒤로가기</span>
        </Link>

        {/* Header - Notion 스타일 */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-neutral-900 mb-2 tracking-tight">
            프로필 수정
          </h1>
          <p className="text-neutral-600">
            회원정보를 수정할 수 있습니다
          </p>
        </div>

        {/* Form - Notion 스타일 */}
        <form onSubmit={handleSubmit} className="card-notion p-8 md:p-10 space-y-6">
          {/* 프로필 사진 */}
          <div>
            <label className="block text-sm font-semibold text-neutral-900 mb-3">
              프로필 사진
            </label>
            <div className="flex items-center gap-6">
              <div className="relative w-20 h-20 rounded-lg overflow-hidden bg-neutral-100 flex items-center justify-center">
                {formData.avatarUrl ? (
                  <Image
                    src={formData.avatarUrl}
                    alt="Profile"
                    fill
                    className="object-cover"
                  />
                ) : (
                  <User className="w-10 h-10 text-neutral-400" />
                )}
              </div>
              <div className="flex-1">
                <button
                  type="button"
                  onClick={handleAddImageUrl}
                  className="btn-linear-secondary inline-flex items-center gap-2"
                >
                  <Upload className="w-4 h-4" />
                  이미지 URL 추가
                </button>
                {formData.avatarUrl && (
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, avatarUrl: "" })}
                    className="ml-2 btn-linear-ghost inline-flex items-center gap-2"
                  >
                    <X className="w-4 h-4" />
                    제거
                  </button>
                )}
                <p className="mt-2 text-xs text-neutral-500">
                  프로필 이미지 URL을 입력하세요 (이후 실제 이미지 업로드 기능 추가 예정)
                </p>
              </div>
            </div>
          </div>

          {/* 이름 */}
          <div>
            <label className="block text-sm font-semibold text-neutral-900 mb-2">
              이름 <span className="text-red-600">*</span>
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
              className="input-vercel w-full"
              placeholder="이름을 입력하세요"
            />
          </div>

          {/* 전화번호 */}
          <div>
            <label className="block text-sm font-semibold text-neutral-900 mb-2">
              전화번호
            </label>
            <input
              type="tel"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              className="input-vercel w-full"
              placeholder="010-1234-5678"
            />
          </div>

          {/* 이메일 (읽기 전용) */}
          {user && (
            <div>
              <label className="block text-sm font-semibold text-neutral-900 mb-2">
                이메일
              </label>
              <input
                type="email"
                value={user.email}
                disabled
                className="input-vercel w-full bg-neutral-50 text-neutral-500 cursor-not-allowed"
              />
              <p className="mt-2 text-xs text-neutral-500">
                이메일은 변경할 수 없습니다
              </p>
            </div>
          )}

          {/* 요양원 정보 (읽기 전용) */}
          {user?.careCenter && (
            <div>
              <label className="block text-sm font-semibold text-neutral-900 mb-2">
                소속 요양원
              </label>
              <input
                type="text"
                value={user.careCenter.name}
                disabled
                className="input-vercel w-full bg-neutral-50 text-neutral-500 cursor-not-allowed"
              />
            </div>
          )}

          {/* Submit Buttons */}
          <div className="flex gap-3 pt-4">
            <button
              type="submit"
              disabled={isLoading}
              className="flex-1 btn-linear-primary inline-flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Save className="w-4 h-4" />
              {isLoading ? "저장 중..." : "저장하기"}
            </button>
            <Link
              href="/dashboard"
              className="btn-linear-secondary inline-flex items-center justify-center gap-2"
            >
              취소
            </Link>
          </div>
        </form>

        {/* 비밀번호 변경 링크 */}
        <div className="mt-6 text-center">
          <Link
            href="/profile/password"
            className="text-neutral-900 hover:text-neutral-700 font-semibold text-sm"
          >
            비밀번호 변경하기 →
          </Link>
        </div>
      </div>
    </AppLayout>
  )
}
