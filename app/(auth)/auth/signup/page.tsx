"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import toast from "react-hot-toast"
import { Heart, Mail, Lock, User, Phone, Building2, ArrowLeft } from "lucide-react"

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
  const [loadingCareCenters, setLoadingCareCenters] = useState(true)

  // 요양원 목록 불러오기
  useEffect(() => {
    const loadCareCenters = async () => {
      setLoadingCareCenters(true)
      try {
        const res = await fetch("/api/care-centers")
        const data = await res.json()
        
        // 에러가 포함된 경우도 처리
        if (data.error) {
          console.error("Care centers API error:", data.error)
          setCareCenters([])
          return
        }
        
        // 배열인지 확인
        if (Array.isArray(data)) {
          setCareCenters(data)
          
          // 요양원이 없으면 시드 데이터 생성 시도
          if (data.length === 0) {
            try {
              await fetch("/api/care-centers/seed", { method: "POST" })
              // 시드 생성 후 다시 로드
              const res2 = await fetch("/api/care-centers")
              const data2 = await res2.json()
              if (Array.isArray(data2)) {
                setCareCenters(data2)
              }
            } catch (seedError) {
              console.log("Seed data not available:", seedError)
            }
          }
        } else if (data.careCenters && Array.isArray(data.careCenters)) {
          setCareCenters(data.careCenters)
        } else {
          console.error("Invalid data format:", data)
          setCareCenters([])
        }
      } catch (error) {
        console.error("Error fetching care centers:", error)
        setCareCenters([])
      } finally {
        setLoadingCareCenters(false)
      }
    }

    loadCareCenters()
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

      let data
      try {
        data = await response.json()
      } catch (jsonError) {
        throw new Error("서버 응답을 처리할 수 없습니다.")
      }

      if (response.ok) {
        toast.success("회원가입 성공! 로그인해주세요.")
        setTimeout(() => {
          router.push("/auth/login")
        }, 1000)
      } else {
        const errorMessage = data?.error || `회원가입 중 오류가 발생했습니다. (${response.status})`
        toast.error(errorMessage)
        console.error("Signup error:", data)
      }
    } catch (error: any) {
      console.error("Signup error:", error)
      toast.error(error.message || "회원가입 중 오류가 발생했습니다. 네트워크 연결을 확인해주세요.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-accent-50/30 flex items-center justify-center px-4 py-12">
      <div className="max-w-lg w-full">
        {/* Back to Home */}
        <Link 
          href="/"
          className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 mb-6 transition-colors group"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          <span>홈으로</span>
        </Link>

        {/* Logo/Title */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-primary-500 via-primary-600 to-accent-500 rounded-3xl mb-6 shadow-xl shadow-primary-500/20 transform hover:scale-105 transition-transform">
            <Heart className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-3 tracking-tight">
            회원가입
          </h1>
          <p className="text-base text-gray-600">
            새 계정을 만들어 시작하세요
          </p>
        </div>

        {/* Signup Form */}
        <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl shadow-gray-900/5 p-8 md:p-10 border border-white/50">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* 회원 유형 */}
            <div>
              <label className="block text-sm font-semibold text-gray-800 mb-4">
                회원 유형
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, role: "FAMILY" })}
                  className={`p-5 rounded-2xl border-2 transition-all duration-200 ${
                    formData.role === "FAMILY"
                      ? "border-primary-500 bg-gradient-to-br from-primary-50 to-primary-100 text-primary-700 shadow-md shadow-primary-500/10"
                      : "border-gray-200 hover:border-gray-300 hover:bg-gray-50 text-gray-700"
                  }`}
                >
                  <User className={`w-6 h-6 mx-auto mb-2 ${formData.role === "FAMILY" ? "text-primary-600" : "text-gray-400"}`} />
                  <span className="font-semibold text-sm">가족 회원</span>
                </button>
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, role: "CAREGIVER" })}
                  className={`p-5 rounded-2xl border-2 transition-all duration-200 ${
                    formData.role === "CAREGIVER"
                      ? "border-primary-500 bg-gradient-to-br from-primary-50 to-primary-100 text-primary-700 shadow-md shadow-primary-500/10"
                      : "border-gray-200 hover:border-gray-300 hover:bg-gray-50 text-gray-700"
                  }`}
                >
                  <Building2 className={`w-6 h-6 mx-auto mb-2 ${formData.role === "CAREGIVER" ? "text-primary-600" : "text-gray-400"}`} />
                  <span className="font-semibold text-sm">요양원 직원</span>
                </button>
              </div>
            </div>

            {/* 요양원 선택 */}
            {formData.role === "FAMILY" && (
              <div>
                <label className="block text-sm font-semibold text-gray-800 mb-3">
                  요양원 선택
                  {loadingCareCenters && (
                    <span className="ml-2 text-xs text-gray-500">(로딩 중...)</span>
                  )}
                </label>
                <div className="relative">
                  <Building2 className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 z-10" />
                  <select
                    value={formData.careCenterId}
                    onChange={(e) => setFormData({ ...formData, careCenterId: e.target.value })}
                    required
                    disabled={loadingCareCenters}
                    className="w-full pl-12 pr-4 py-3.5 border border-gray-200 rounded-xl input-focus outline-none transition-all bg-white text-gray-900 appearance-none cursor-pointer hover:border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <option value="">
                      {loadingCareCenters 
                        ? "요양원 목록을 불러오는 중..." 
                        : careCenters.length === 0
                        ? "요양원이 없습니다. 요양원 직원으로 가입하세요"
                        : "요양원을 선택하세요"}
                    </option>
                    {careCenters.map((center) => (
                      <option key={center.id} value={center.id}>
                        {center.name}
                      </option>
                    ))}
                  </select>
                </div>
                {careCenters.length === 0 && !loadingCareCenters && (
                  <p className="mt-2 text-xs text-gray-500">
                    요양원이 없습니다. 요양원 직원으로 가입하거나 관리자에게 문의하세요.
                  </p>
                )}
              </div>
            )}

            {/* 이름 */}
            <div>
              <label className="block text-sm font-semibold text-gray-800 mb-3">
                이름
              </label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 z-10" />
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                  className="w-full pl-12 pr-4 py-3.5 border border-gray-200 rounded-xl input-focus outline-none transition-all bg-white text-gray-900 placeholder:text-gray-400"
                  placeholder="이름을 입력하세요"
                />
              </div>
            </div>

            {/* 이메일 */}
            <div>
              <label className="block text-sm font-semibold text-gray-800 mb-3">
                이메일
              </label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 z-10" />
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
                  className="w-full pl-12 pr-4 py-3.5 border border-gray-200 rounded-xl input-focus outline-none transition-all bg-white text-gray-900 placeholder:text-gray-400"
                  placeholder="your@email.com"
                />
              </div>
            </div>

            {/* 전화번호 */}
            <div>
              <label className="block text-sm font-semibold text-gray-800 mb-3">
                전화번호
              </label>
              <div className="relative">
                <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 z-10" />
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full pl-12 pr-4 py-3.5 border border-gray-200 rounded-xl input-focus outline-none transition-all bg-white text-gray-900 placeholder:text-gray-400"
                  placeholder="010-0000-0000"
                />
              </div>
            </div>

            {/* 비밀번호 */}
            <div>
              <label className="block text-sm font-semibold text-gray-800 mb-3">
                비밀번호
              </label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 z-10" />
                <input
                  type="password"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  required
                  minLength={6}
                  className="w-full pl-12 pr-4 py-3.5 border border-gray-200 rounded-xl input-focus outline-none transition-all bg-white text-gray-900 placeholder:text-gray-400"
                  placeholder="최소 6자 이상"
                />
              </div>
            </div>

            {/* 비밀번호 확인 */}
            <div>
              <label className="block text-sm font-semibold text-gray-800 mb-3">
                비밀번호 확인
              </label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 z-10" />
                <input
                  type="password"
                  value={formData.confirmPassword}
                  onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                  required
                  className="w-full pl-12 pr-4 py-3.5 border border-gray-200 rounded-xl input-focus outline-none transition-all bg-white text-gray-900 placeholder:text-gray-400"
                  placeholder="비밀번호를 다시 입력하세요"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-primary-600 to-primary-700 text-white py-4 rounded-xl font-semibold text-base hover:from-primary-700 hover:to-primary-800 active:scale-[0.98] transition-all duration-200 shadow-lg shadow-primary-500/30 hover:shadow-xl hover:shadow-primary-500/40 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none mt-2"
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

          <div className="mt-8 pt-6 border-t border-gray-200">
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
      </div>
    </div>
  )
}
