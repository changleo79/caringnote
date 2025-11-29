"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import toast from "react-hot-toast"
import { Heart, Mail, Lock, User, Phone, Building2 } from "lucide-react"

export default function SignupPage() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    name: "",
    phone: "",
    role: "FAMILY" as "FAMILY" | "CAREGIVER",
    careCenterId: "",
  })
  const [isLoading, setIsLoading] = useState(false)
  const [careCenters, setCareCenters] = useState<any[]>([])

  // 요양원 목록 불러오기
  useEffect(() => {
    fetch("/api/care-centers")
      .then((res) => res.json())
      .then((data) => setCareCenters(data))
      .catch(() => {})
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (formData.password !== formData.confirmPassword) {
      toast.error("비밀번호가 일치하지 않습니다.")
      return
    }

    if (formData.password.length < 6) {
      toast.error("비밀번호는 최소 6자 이상이어야 합니다.")
      return
    }

    if (formData.role === "FAMILY" && !formData.careCenterId) {
      toast.error("요양원을 선택해주세요.")
      return
    }

    setIsLoading(true)

    try {
      const response = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
          name: formData.name,
          phone: formData.phone,
          role: formData.role,
          careCenterId: formData.careCenterId || null,
        }),
      })

      const data = await response.json()

      if (response.ok) {
        toast.success("회원가입 성공! 로그인해주세요.")
        router.push("/auth/login")
      } else {
        toast.error(data.error || "회원가입 중 오류가 발생했습니다.")
      }
    } catch (error) {
      toast.error("회원가입 중 오류가 발생했습니다.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen gradient-soft flex items-center justify-center px-4 py-12">
      <div className="max-w-lg w-full">
        {/* Logo/Title */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-primary-500 to-accent-500 rounded-2xl mb-4 shadow-lg">
            <Heart className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            회원가입
          </h1>
          <p className="text-gray-600">
            새 계정을 만들어 시작하세요
          </p>
        </div>

        {/* Signup Form */}
        <div className="bg-white rounded-3xl shadow-soft-lg p-8 border border-gray-100">
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* 회원 유형 */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-3">
                회원 유형
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, role: "FAMILY" })}
                  className={`p-4 rounded-xl border-2 transition-all ${
                    formData.role === "FAMILY"
                      ? "border-primary-500 bg-primary-50 text-primary-700"
                      : "border-gray-200 hover:border-gray-300 text-gray-700"
                  }`}
                >
                  <User className="w-5 h-5 mx-auto mb-2" />
                  <span className="font-semibold text-sm">가족 회원</span>
                </button>
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, role: "CAREGIVER" })}
                  className={`p-4 rounded-xl border-2 transition-all ${
                    formData.role === "CAREGIVER"
                      ? "border-primary-500 bg-primary-50 text-primary-700"
                      : "border-gray-200 hover:border-gray-300 text-gray-700"
                  }`}
                >
                  <Building2 className="w-5 h-5 mx-auto mb-2" />
                  <span className="font-semibold text-sm">요양원 직원</span>
                </button>
              </div>
            </div>

            {/* 요양원 선택 */}
            {formData.role === "FAMILY" && (
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  요양원 선택
                </label>
                <div className="relative">
                  <Building2 className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <select
                    value={formData.careCenterId}
                    onChange={(e) => setFormData({ ...formData, careCenterId: e.target.value })}
                    required
                    className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl input-focus outline-none transition bg-gray-50/50 appearance-none"
                  >
                    <option value="">요양원을 선택하세요</option>
                    {careCenters.map((center) => (
                      <option key={center.id} value={center.id}>
                        {center.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            )}

            {/* 이름 */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                이름
              </label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                  className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl input-focus outline-none transition bg-gray-50/50"
                  placeholder="이름을 입력하세요"
                />
              </div>
            </div>

            {/* 이메일 */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                이메일
              </label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
                  className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl input-focus outline-none transition bg-gray-50/50"
                  placeholder="your@email.com"
                />
              </div>
            </div>

            {/* 전화번호 */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                전화번호
              </label>
              <div className="relative">
                <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl input-focus outline-none transition bg-gray-50/50"
                  placeholder="010-0000-0000"
                />
              </div>
            </div>

            {/* 비밀번호 */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                비밀번호
              </label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="password"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  required
                  minLength={6}
                  className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl input-focus outline-none transition bg-gray-50/50"
                  placeholder="최소 6자 이상"
                />
              </div>
            </div>

            {/* 비밀번호 확인 */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                비밀번호 확인
              </label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="password"
                  value={formData.confirmPassword}
                  onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                  required
                  className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl input-focus outline-none transition bg-gray-50/50"
                  placeholder="비밀번호를 다시 입력하세요"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="btn-primary w-full mt-2"
            >
              {isLoading ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                  가입 중...
                </span>
              ) : (
                "회원가입"
              )}
            </button>
          </form>

          <div className="mt-6 pt-6 border-t border-gray-200">
            <p className="text-center text-sm text-gray-600">
              이미 계정이 있으신가요?{" "}
              <Link 
                href="/auth/login" 
                className="text-primary-600 hover:text-primary-700 font-semibold transition-colors"
              >
                로그인
              </Link>
            </p>
          </div>
        </div>

        {/* Back to Home */}
        <div className="mt-6 text-center">
          <Link 
            href="/"
            className="text-sm text-gray-500 hover:text-gray-700 transition-colors inline-flex items-center gap-1"
          >
            ← 홈으로 돌아가기
          </Link>
        </div>
      </div>
    </div>
  )
}
