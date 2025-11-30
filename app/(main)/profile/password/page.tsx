"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useSession } from "next-auth/react"
import AppLayout from "@/components/layout/AppLayout"
import Link from "next/link"
import toast from "react-hot-toast"
import { ArrowLeft, Lock, Save, Eye, EyeOff } from "lucide-react"

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
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Back Button */}
        <Link
          href="/profile/edit"
          className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 mb-6 transition-colors group"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          <span>뒤로가기</span>
        </Link>

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
            비밀번호 변경
          </h1>
          <p className="text-gray-600">
            보안을 위해 정기적으로 비밀번호를 변경해주세요
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="bg-white rounded-3xl shadow-soft border border-gray-100 p-8 md:p-12 space-y-6">
          {/* 현재 비밀번호 */}
          <div>
            <label className="block text-sm font-semibold text-gray-800 mb-3">
              현재 비밀번호 <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <input
                type={showCurrentPassword ? "text" : "password"}
                value={formData.currentPassword}
                onChange={(e) => setFormData({ ...formData, currentPassword: e.target.value })}
                required
                className="w-full px-4 py-3.5 pr-12 border-2 border-gray-200 rounded-xl input-focus outline-none transition-all bg-white text-gray-900 font-medium"
                placeholder="현재 비밀번호를 입력하세요"
              />
              <button
                type="button"
                onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showCurrentPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
          </div>

          {/* 새 비밀번호 */}
          <div>
            <label className="block text-sm font-semibold text-gray-800 mb-3">
              새 비밀번호 <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <input
                type={showNewPassword ? "text" : "password"}
                value={formData.newPassword}
                onChange={(e) => setFormData({ ...formData, newPassword: e.target.value })}
                required
                minLength={6}
                className="w-full px-4 py-3.5 pr-12 border-2 border-gray-200 rounded-xl input-focus outline-none transition-all bg-white text-gray-900 font-medium"
                placeholder="새 비밀번호를 입력하세요 (6자 이상)"
              />
              <button
                type="button"
                onClick={() => setShowNewPassword(!showNewPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showNewPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
            <p className="mt-2 text-xs text-gray-500">
              6자 이상의 비밀번호를 입력해주세요
            </p>
          </div>

          {/* 새 비밀번호 확인 */}
          <div>
            <label className="block text-sm font-semibold text-gray-800 mb-3">
              새 비밀번호 확인 <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <input
                type={showConfirmPassword ? "text" : "password"}
                value={formData.confirmPassword}
                onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                required
                minLength={6}
                className="w-full px-4 py-3.5 pr-12 border-2 border-gray-200 rounded-xl input-focus outline-none transition-all bg-white text-gray-900 font-medium"
                placeholder="새 비밀번호를 다시 입력하세요"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>
            {formData.confirmPassword && formData.newPassword !== formData.confirmPassword && (
              <p className="mt-2 text-xs text-red-500">
                비밀번호가 일치하지 않습니다
              </p>
            )}
          </div>

          {/* Submit Buttons */}
          <div className="flex gap-4 pt-4">
            <button
              type="submit"
              disabled={isLoading}
              className="flex-1 btn-primary inline-flex items-center justify-center gap-2"
            >
              <Lock className="w-5 h-5" />
              {isLoading ? "변경 중..." : "비밀번호 변경"}
            </button>
            <Link
              href="/profile/edit"
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

