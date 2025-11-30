"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useSession } from "next-auth/react"
import AppLayout from "@/components/layout/AppLayout"
import Link from "next/link"
import toast from "react-hot-toast"
import { ArrowLeft, Lock, Eye, EyeOff } from "lucide-react"

export default function PasswordChangePage() {
  const router = useRouter()
  const { data: session } = useSession()
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  })
  const [showCurrentPassword, setShowCurrentPassword] = useState(false)
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // 유효성 검사
    if (!formData.currentPassword || !formData.newPassword || !formData.confirmPassword) {
      toast.error("모든 필드를 입력해주세요.")
      return
    }

    if (formData.newPassword.length < 6) {
      toast.error("새 비밀번호는 6자 이상이어야 합니다.")
      return
    }

    if (formData.newPassword !== formData.confirmPassword) {
      toast.error("새 비밀번호가 일치하지 않습니다.")
      return
    }

    if (formData.currentPassword === formData.newPassword) {
      toast.error("새 비밀번호는 현재 비밀번호와 다르게 설정해주세요.")
      return
    }

    setIsLoading(true)

    try {
      const res = await fetch("/api/users/me/password", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          currentPassword: formData.currentPassword,
          newPassword: formData.newPassword,
        }),
      })

      const data = await res.json()

      if (res.ok) {
        toast.success("비밀번호가 변경되었습니다!")
        router.push("/dashboard")
      } else {
        toast.error(data.error || "비밀번호 변경에 실패했습니다.")
      }
    } catch (error) {
      console.error("Error changing password:", error)
      toast.error("비밀번호 변경 중 오류가 발생했습니다.")
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
          href="/profile/edit"
          className="inline-flex items-center gap-2 text-sm text-neutral-600 hover:text-neutral-900 mb-8 transition-colors font-medium"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>뒤로가기</span>
        </Link>

        {/* Header - Notion 스타일 */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-neutral-900 mb-2 tracking-tight">
            비밀번호 변경
          </h1>
          <p className="text-neutral-600">
            보안을 위해 정기적으로 비밀번호를 변경해주세요
          </p>
        </div>

        {/* Form - Notion 스타일 */}
        <form onSubmit={handleSubmit} className="card-notion p-8 md:p-10 space-y-6">
          {/* 현재 비밀번호 */}
          <div>
            <label className="block text-sm font-semibold text-neutral-900 mb-2">
              현재 비밀번호 <span className="text-red-600">*</span>
            </label>
            <div className="relative">
              <input
                type={showCurrentPassword ? "text" : "password"}
                value={formData.currentPassword}
                onChange={(e) => setFormData({ ...formData, currentPassword: e.target.value })}
                required
                className="input-vercel w-full pr-12"
                placeholder="현재 비밀번호를 입력하세요"
              />
              <button
                type="button"
                onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-600"
              >
                {showCurrentPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
          </div>

          {/* 새 비밀번호 */}
          <div>
            <label className="block text-sm font-semibold text-neutral-900 mb-2">
              새 비밀번호 <span className="text-red-600">*</span>
            </label>
            <div className="relative">
              <input
                type={showNewPassword ? "text" : "password"}
                value={formData.newPassword}
                onChange={(e) => setFormData({ ...formData, newPassword: e.target.value })}
                required
                minLength={6}
                className="input-vercel w-full pr-12"
                placeholder="새 비밀번호를 입력하세요 (6자 이상)"
              />
              <button
                type="button"
                onClick={() => setShowNewPassword(!showNewPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-600"
              >
                {showNewPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
            <p className="mt-2 text-xs text-neutral-500">
              6자 이상의 비밀번호를 입력해주세요
            </p>
          </div>

          {/* 새 비밀번호 확인 */}
          <div>
            <label className="block text-sm font-semibold text-neutral-900 mb-2">
              새 비밀번호 확인 <span className="text-red-600">*</span>
            </label>
            <div className="relative">
              <input
                type={showConfirmPassword ? "text" : "password"}
                value={formData.confirmPassword}
                onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                required
                minLength={6}
                className="input-vercel w-full pr-12"
                placeholder="새 비밀번호를 다시 입력하세요"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-600"
              >
                {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
            {formData.confirmPassword && formData.newPassword !== formData.confirmPassword && (
              <p className="mt-2 text-xs text-red-600">
                비밀번호가 일치하지 않습니다
              </p>
            )}
          </div>

          {/* Submit Buttons */}
          <div className="flex gap-3 pt-4">
            <button
              type="submit"
              disabled={isLoading}
              className="flex-1 btn-linear-primary inline-flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Lock className="w-4 h-4" />
              {isLoading ? "변경 중..." : "비밀번호 변경"}
            </button>
            <Link
              href="/profile/edit"
              className="btn-linear-secondary inline-flex items-center justify-center gap-2"
            >
              취소
            </Link>
          </div>
        </form>
      </div>
    </AppLayout>
  )
}
