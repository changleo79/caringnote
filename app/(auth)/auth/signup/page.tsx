"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import toast from "react-hot-toast"
import { Mail, Lock, User, Phone, Building2, ArrowLeft, Sparkles } from "lucide-react"
import Logo from "@/components/brand/Logo"

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
  const [careCenterError, setCareCenterError] = useState<string | null>(null)

  // 요양원 목록 불러오기
  useEffect(() => {
    const loadCareCenters = async () => {
      setLoadingCareCenters(true)
      setCareCenterError(null)
      
      try {
        console.log("🔍 요양원 목록 불러오기 시작...")
        const res = await fetch("/api/care-centers")
        
        if (!res.ok) {
          throw new Error(`API 응답 오류: ${res.status} ${res.statusText}`)
        }
        
        const data = await res.json()
        console.log("📦 요양원 목록 API 응답:", data)
        
        // 오류 메시지가 있는 경우
        if (data.error) {
          console.error("❌ Care centers API error:", data.error)
          setCareCenterError(data.error)
          setCareCenters([])
          
          // 데이터베이스 연결 오류인 경우 재시도 안 함
          if (data.code === 'P1001' || data.code === 'P1000') {
            return
          }
        }
        
        // 배열인 경우
        if (Array.isArray(data)) {
          console.log(`✅ 요양원 ${data.length}개 로드 완료`)
          setCareCenters(data)
          
          // 요양원이 없으면 자동으로 시드 데이터 생성 시도
          if (data.length === 0) {
            console.log("⚠️ 요양원이 없음. 시드 데이터 생성 시도...")
            try {
              // GET 메서드 사용 (프로덕션에서도 작동)
              const seedRes = await fetch("/api/care-centers/seed")
              
              if (!seedRes.ok) {
                throw new Error(`시드 API 오류: ${seedRes.status}`)
              }
              
              const seedData = await seedRes.json()
              
              if (seedData.error) {
                console.log("⚠️ 시드 데이터 생성 실패:", seedData.error)
                // 오류가 있어도 버튼 표시를 위해 에러 메시지 설정
              } else if (seedData.count > 0) {
                console.log(`✅ 시드 데이터 생성 완료: ${seedData.count}개`)
                // 다시 요양원 목록 불러오기
                const res2 = await fetch("/api/care-centers")
                const data2 = await res2.json()
                if (Array.isArray(data2) && data2.length > 0) {
                  setCareCenters(data2)
                  setCareCenterError(null)
                  toast.success(`요양원 ${data2.length}개가 생성되었습니다!`)
                  return
                }
              }
            } catch (seedError: any) {
              console.log("⚠️ 시드 데이터 생성 불가:", seedError.message)
            }
          }
        } else if (data.careCenters && Array.isArray(data.careCenters)) {
          // careCenters 속성이 있는 경우
          console.log(`✅ 요양원 ${data.careCenters.length}개 로드 완료`)
          setCareCenters(data.careCenters)
        } else {
          console.error("❌ Invalid data format:", data)
          setCareCenterError("요양원 목록 형식이 올바르지 않습니다.")
          setCareCenters([])
        }
      } catch (error: any) {
        console.error("❌ Error fetching care centers:", error)
        setCareCenterError(error.message || "요양원 목록을 불러오는데 실패했습니다.")
        setCareCenters([])
      } finally {
        setLoadingCareCenters(false)
      }
    }

    loadCareCenters()
    // eslint-disable-next-line react-hooks/exhaustive-deps
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

    if ((formData.role === "FAMILY" || formData.role === "CAREGIVER") && !formData.careCenterId) {
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
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-accent-50/40 flex items-center justify-center px-4 py-12 relative overflow-hidden">
      {/* 배경 요소 */}
      <div className="absolute top-20 left-10 w-40 h-40 bg-primary-300/20 rounded-full blur-3xl animate-float"></div>
      <div className="absolute bottom-20 right-10 w-48 h-48 bg-accent-300/20 rounded-full blur-3xl animate-float" style={{ animationDelay: '2s' }}></div>
      
      <div className="max-w-lg w-full relative z-10">
        {/* Back to Home */}
        <Link 
          href="/"
          className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 mb-8 transition-colors group font-medium"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          <span>홈으로</span>
        </Link>

        {/* Logo/Title - 프리미엄 디자인 */}
        <div className="text-center mb-12">
          <div className="mb-8 flex justify-center animate-fade-in-up">
            <Logo variant="default" size="lg" />
          </div>
          <h1 className="text-5xl md:text-6xl font-black text-gray-900 mb-4 tracking-tighter">
            회원가입
          </h1>
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary-50/80 backdrop-blur-sm text-primary-700 rounded-full text-sm font-bold">
            <Sparkles className="w-4 h-4 text-primary-600" />
            <span>새 계정을 만들어 시작하세요</span>
          </div>
        </div>

        {/* Signup Form - 프리미엄 디자인 */}
        <div className="bg-white/90 backdrop-blur-xl rounded-3xl shadow-2xl shadow-gray-900/10 p-10 md:p-12 border border-white/60">
          <form onSubmit={handleSubmit} className="space-y-7">
            {/* 회원 유형 */}
            <div>
              <label className="block text-sm font-black text-gray-900 mb-5">
                회원 유형
              </label>
              <div className="grid grid-cols-2 gap-4">
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, role: "FAMILY" })}
                  className={`p-6 rounded-2xl border-2 transition-all duration-300 ${
                    formData.role === "FAMILY"
                      ? "border-primary-500 bg-gradient-to-br from-primary-50 to-primary-100 text-primary-700 shadow-xl shadow-primary-500/20 scale-105"
                      : "border-gray-200 hover:border-gray-300 hover:bg-gray-50 text-gray-700"
                  }`}
                >
                  <User className={`w-7 h-7 mx-auto mb-3 ${formData.role === "FAMILY" ? "text-primary-600" : "text-gray-400"}`} />
                  <span className="font-black text-sm">가족 회원</span>
                </button>
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, role: "CAREGIVER" })}
                  className={`p-6 rounded-2xl border-2 transition-all duration-300 ${
                    formData.role === "CAREGIVER"
                      ? "border-primary-500 bg-gradient-to-br from-primary-50 to-primary-100 text-primary-700 shadow-xl shadow-primary-500/20 scale-105"
                      : "border-gray-200 hover:border-gray-300 hover:bg-gray-50 text-gray-700"
                  }`}
                >
                  <Building2 className={`w-7 h-7 mx-auto mb-3 ${formData.role === "CAREGIVER" ? "text-primary-600" : "text-gray-400"}`} />
                  <span className="font-black text-sm">요양원 직원</span>
                </button>
              </div>
            </div>

            {/* 요양원 선택 - 가족회원 및 요양원 직원 모두 */}
            {(formData.role === "FAMILY" || formData.role === "CAREGIVER") && (
              <div>
                <label className="block text-sm font-black text-gray-900 mb-4">
                  {formData.role === "FAMILY" ? "요양원 선택" : "소속 요양원 선택"}
                </label>
                
                {/* 오류 메시지 또는 시드 생성 안내 */}
                {(careCenterError || careCenters.length === 0) && (
                  <div className="mb-4 p-4 bg-blue-50 border-2 border-blue-200 rounded-xl">
                    <p className="text-sm text-blue-700 font-semibold mb-3">
                      {careCenterError ? `⚠️ ${careCenterError}` : "📋 요양원 목록이 비어있습니다. 테스트용 요양원을 생성해주세요."}
                    </p>
                    <div className="flex gap-2 flex-wrap">
                      <button
                        type="button"
                        onClick={async () => {
                          setLoadingCareCenters(true)
                          setCareCenterError(null)
                          
                          try {
                            console.log("🌱 시드 데이터 생성 시작...")
                            // 시드 데이터 생성 (GET 메서드 사용)
                            const seedRes = await fetch("/api/care-centers/seed")
                            
                            if (!seedRes.ok) {
                              throw new Error(`시드 생성 실패: ${seedRes.status}`)
                            }
                            
                            const seedData = await seedRes.json()
                            console.log("🌱 시드 생성 응답:", seedData)
                            
                            if (seedData.error) {
                              toast.error(seedData.error)
                              setCareCenterError(seedData.error)
                              setLoadingCareCenters(false)
                              return
                            }
                            
                            // 시드 생성 성공 확인
                            const createdCount = seedData.count || seedData.careCenters?.length || 0
                            
                            if (createdCount > 0) {
                              toast.success(`✅ 요양원 ${createdCount}개가 생성되었습니다!`)
                              
                              // 데이터베이스 반영 시간을 고려하여 약간 대기
                              await new Promise(resolve => setTimeout(resolve, 800))
                              
                              // 요양원 목록 다시 불러오기
                              console.log("🔄 요양원 목록 다시 불러오기...")
                              const res = await fetch("/api/care-centers", {
                                cache: 'no-store',
                                headers: {
                                  'Cache-Control': 'no-cache'
                                }
                              })
                              
                              if (!res.ok) {
                                throw new Error(`목록 불러오기 실패: ${res.status}`)
                              }
                              
                              const listData = await res.json()
                              console.log("📦 요양원 목록 응답:", listData)
                              
                              // 배열인 경우
                              if (Array.isArray(listData) && listData.length > 0) {
                                console.log(`✅ 요양원 ${listData.length}개 로드 완료`, listData)
                                // 상태 업데이트
                                setCareCenters(listData)
                                setCareCenterError(null)
                                toast.success(`요양원 ${listData.length}개를 불러왔습니다!`)
                              } 
                              // 빈 배열인 경우
                              else if (Array.isArray(listData) && listData.length === 0) {
                                console.warn("⚠️ 목록이 비어있음. 시드 생성은 성공했지만 목록에 표시되지 않습니다.")
                                toast.error("요양원이 생성되었지만 목록에 표시되지 않습니다. 새로고침 버튼을 눌러주세요.")
                              }
                              // 객체이고 careCenters 속성이 있는 경우
                              else if (listData.careCenters && Array.isArray(listData.careCenters)) {
                                console.log(`✅ 요양원 ${listData.careCenters.length}개 로드 완료`)
                                if (listData.careCenters.length > 0) {
                                  setCareCenters(listData.careCenters)
                                  setCareCenterError(null)
                                  toast.success(`요양원 ${listData.careCenters.length}개를 불러왔습니다!`)
                                } else {
                                  toast.error("요양원이 생성되었지만 목록에 표시되지 않습니다. 새로고침 버튼을 눌러주세요.")
                                }
                              }
                              // 오류 응답인 경우
                              else if (listData.error) {
                                console.error("❌ 오류 응답:", listData.error)
                                setCareCenterError(listData.error)
                                toast.error(listData.error)
                              }
                              // 알 수 없는 형식
                              else {
                                console.error("❌ 알 수 없는 응답 형식:", listData)
                                setCareCenterError("요양원 목록 형식이 올바르지 않습니다.")
                                toast.error("요양원 목록을 불러올 수 없습니다. 새로고침 버튼을 눌러주세요.")
                              }
                            } else {
                              toast.error("요양원 생성에 실패했습니다.")
                              setCareCenterError("요양원이 생성되지 않았습니다.")
                            }
                          } catch (error: any) {
                            console.error("❌ 오류 발생:", error)
                            toast.error("요양원 생성 중 오류가 발생했습니다.")
                            setCareCenterError(error.message || "알 수 없는 오류가 발생했습니다.")
                          } finally {
                            setLoadingCareCenters(false)
                          }
                        }}
                        disabled={loadingCareCenters}
                        className="px-4 py-2 bg-primary-600 text-white rounded-lg text-sm font-bold hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                      >
                        {loadingCareCenters ? "생성 중..." : "🎯 테스트용 요양원 생성"}
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setCareCenterError(null)
                          setLoadingCareCenters(true)
                          fetch("/api/care-centers")
                            .then(res => res.json())
                            .then(data => {
                              if (Array.isArray(data)) {
                                setCareCenters(data)
                                if (data.length > 0) {
                                  setCareCenterError(null)
                                }
                              } else if (data.error) {
                                setCareCenterError(data.error)
                              }
                            })
                            .catch(err => setCareCenterError(err.message))
                            .finally(() => setLoadingCareCenters(false))
                        }}
                        disabled={loadingCareCenters}
                        className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg text-sm font-bold hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                      >
                        {loadingCareCenters ? "새로고침 중..." : "🔄 목록 새로고침"}
                      </button>
                    </div>
                  </div>
                )}
                
                <div className="relative">
                  <Building2 className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 z-10" />
                  <select
                    key={`care-center-select-${careCenters.length}`}
                    value={formData.careCenterId}
                    onChange={(e) => {
                      console.log("요양원 선택:", e.target.value)
                      setFormData({ ...formData, careCenterId: e.target.value })
                    }}
                    required
                    disabled={loadingCareCenters}
                    className="w-full pl-14 pr-5 py-4 border-2 border-gray-200 rounded-2xl input-focus outline-none transition-all bg-white text-gray-900 appearance-none cursor-pointer hover:border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed font-medium"
                  >
                    <option value="">
                      {loadingCareCenters 
                        ? "요양원 목록을 불러오는 중..." 
                        : careCenters.length === 0
                        ? careCenterError || (formData.role === "FAMILY" ? "요양원이 없습니다. 먼저 요양원을 등록해주세요" : "요양원이 없습니다. 먼저 요양원을 등록해주세요")
                        : formData.role === "FAMILY" ? "요양원을 선택하세요" : "소속 요양원을 선택하세요"}
                    </option>
                    {careCenters.length > 0 && careCenters.map((center) => {
                      console.log("요양원 옵션 생성:", center.id, center.name)
                      return (
                        <option key={center.id} value={center.id}>
                          {center.name} {center.address ? `(${center.address.split(' ')[0]})` : ''}
                        </option>
                      )
                    })}
                  </select>
                </div>
                
                {/* 요양원 개수 표시 */}
                {!loadingCareCenters && careCenters.length > 0 && (
                  <p className="mt-2 text-xs text-gray-500 font-medium">
                    총 {careCenters.length}개의 요양원이 있습니다
                  </p>
                )}
              </div>
            )}

            {/* 이름 */}
            <div>
              <label className="block text-sm font-black text-gray-900 mb-4">
                이름
              </label>
              <div className="relative">
                <User className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 z-10" />
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  required
                  className="w-full pl-14 pr-5 py-4 border-2 border-gray-200 rounded-2xl input-focus outline-none transition-all bg-white text-gray-900 placeholder:text-gray-400 font-medium"
                  placeholder="이름을 입력하세요"
                />
              </div>
            </div>

            {/* 이메일 */}
            <div>
              <label className="block text-sm font-black text-gray-900 mb-4">
                이메일
              </label>
              <div className="relative">
                <Mail className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 z-10" />
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
                  className="w-full pl-14 pr-5 py-4 border-2 border-gray-200 rounded-2xl input-focus outline-none transition-all bg-white text-gray-900 placeholder:text-gray-400 font-medium"
                  placeholder="your@email.com"
                />
              </div>
            </div>

            {/* 전화번호 */}
            <div>
              <label className="block text-sm font-black text-gray-900 mb-4">
                전화번호
              </label>
              <div className="relative">
                <Phone className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 z-10" />
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full pl-14 pr-5 py-4 border-2 border-gray-200 rounded-2xl input-focus outline-none transition-all bg-white text-gray-900 placeholder:text-gray-400 font-medium"
                  placeholder="010-0000-0000"
                />
              </div>
            </div>

            {/* 비밀번호 */}
            <div>
              <label className="block text-sm font-black text-gray-900 mb-4">
                비밀번호
              </label>
              <div className="relative">
                <Lock className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 z-10" />
                <input
                  type="password"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  required
                  minLength={6}
                  className="w-full pl-14 pr-5 py-4 border-2 border-gray-200 rounded-2xl input-focus outline-none transition-all bg-white text-gray-900 placeholder:text-gray-400 font-medium"
                  placeholder="최소 6자 이상"
                />
              </div>
            </div>

            {/* 비밀번호 확인 */}
            <div>
              <label className="block text-sm font-black text-gray-900 mb-4">
                비밀번호 확인
              </label>
              <div className="relative">
                <Lock className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 z-10" />
                <input
                  type="password"
                  value={formData.confirmPassword}
                  onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                  required
                  className="w-full pl-14 pr-5 py-4 border-2 border-gray-200 rounded-2xl input-focus outline-none transition-all bg-white text-gray-900 placeholder:text-gray-400 font-medium"
                  placeholder="비밀번호를 다시 입력하세요"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-primary-600 via-primary-600 to-primary-700 text-white py-5 rounded-2xl font-black text-lg hover:from-primary-700 hover:via-primary-700 hover:to-primary-800 active:scale-[0.98] transition-all duration-300 shadow-2xl shadow-primary-500/40 hover:shadow-3xl hover:shadow-primary-500/50 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none mt-2"
            >
              {isLoading ? (
                <span className="flex items-center justify-center gap-3">
                  <span className="w-6 h-6 border-3 border-white border-t-transparent rounded-full animate-spin"></span>
                  가입 중...
                </span>
              ) : (
                "회원가입"
              )}
            </button>
          </form>

          <div className="mt-10 pt-8 border-t-2 border-gray-100">
            <p className="text-center text-sm text-gray-600 font-medium">
              이미 계정이 있으신가요?{" "}
              <Link 
                href="/auth/login" 
                className="text-primary-600 hover:text-primary-700 font-black transition-colors"
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
