"use client"

import { useState, useEffect } from "react"
import { signIn } from "next-auth/react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import toast from "react-hot-toast"
import { Mail, Lock, ArrowLeft, AlertCircle } from "lucide-react"
import Logo from "@/components/brand/Logo"

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [serverConfigError, setServerConfigError] = useState(false)

  useEffect(() => {
    const checkServerConfig = async () => {
      try {
        const res = await fetch("/api/auth-check")
        const data = await res.json()
        
        if (data.nextAuth?.status !== "✅ 정상") {
          setServerConfigError(true)
        }
      } catch (error) {
        console.error("서버 구성 확인 오류:", error)
      }
    }
    
    checkServerConfig()
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setServerConfigError(false)

    try {
      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
      })

      if (result?.error) {
        console.error("로그인 오류:", result.error)
        
        if (
          result.error.includes("configuration") || 
          result.error.includes("server") ||
          result.error.includes("secret") ||
          result.error.includes("NEXTAUTH")
        ) {
          setServerConfigError(true)
          toast.error(
            <div className="flex flex-col gap-1">
              <span className="font-semibold">서버 구성 오류</span>
              <span className="text-sm">NEXTAUTH_SECRET 환경 변수가 필요합니다.</span>
            </div>,
            { duration: 5000 }
          )
        } else if (result.error.includes("CredentialsSignin")) {
          toast.error("이메일 또는 비밀번호가 올바르지 않습니다.")
        } else {
          toast.error(`로그인 실패: ${result.error}`)
        }
      } else if (result?.ok) {
        toast.success("로그인 성공!")
        router.push("/dashboard")
        router.refresh()
      } else {
        toast.error("로그인에 실패했습니다. 다시 시도해주세요.")
      }
    } catch (error: any) {
      console.error("로그인 예외:", error)
      toast.error("로그인 중 오류가 발생했습니다.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-neutral-50 via-white to-primary-50/40 flex items-center justify-center px-4 py-12 relative overflow-hidden">
      {/* 배경 장식 */}
      <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
      <div className="absolute top-0 right-0 w-96 h-96 bg-primary-200/20 rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-accent-200/20 rounded-full blur-3xl"></div>
      
      <div className="max-w-md w-full relative z-10">
        {/* Back to Home */}
        <Link 
          href="/"
          className="inline-flex items-center gap-2 text-sm text-neutral-600 hover:text-neutral-900 mb-8 transition-all duration-500 font-bold px-5 py-2.5 rounded-xl hover:bg-white/90 backdrop-blur-sm shadow-lg"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>홈으로</span>
        </Link>

        {/* Server Config Warning */}
        {serverConfigError && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <h3 className="font-semibold text-red-900 mb-1">서버 구성 오류</h3>
                <p className="text-sm text-red-700 mb-1">
                  NEXTAUTH_SECRET 환경 변수가 설정되지 않았습니다.
                </p>
                <p className="text-xs text-red-600">
                  관리자에게 문의하거나 Vercel 환경 변수를 확인하세요.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Logo/Title - 프리미엄 느낌 */}
        <div className="text-center mb-12">
          <div className="mb-10 flex justify-center">
            <div className="p-4 bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl">
              <Logo variant="default" size="md" />
            </div>
          </div>
          <h1 className="text-6xl md:text-7xl font-black text-neutral-900 mb-4 tracking-tight">
            로그인
          </h1>
          <p className="text-xl text-neutral-600 font-black">
            케어링노트에 오신 것을 환영합니다
          </p>
        </div>

        {/* Login Form - 프리미엄 느낌 */}
        <div className="bg-gradient-to-br from-white/90 via-white/80 to-neutral-50/40 rounded-3xl shadow-3d border border-white/60 p-12 md:p-14 backdrop-blur-2xl">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-sm font-bold text-neutral-900 mb-3">
                이메일
              </label>
              <div className="relative">
                <Mail className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-400" />
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="input-vercel w-full pl-12"
                  placeholder="your@email.com"
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-bold text-neutral-900 mb-3">
                비밀번호
              </label>
              <div className="relative">
                <Lock className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-400" />
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="input-vercel w-full pl-12"
                  placeholder="비밀번호를 입력하세요"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading || serverConfigError}
              className="btn-linear-primary w-full py-4 text-lg disabled:opacity-50 disabled:cursor-not-allowed mt-8"
            >
              {isLoading ? (
                <span className="flex items-center justify-center gap-3">
                  <span className="w-6 h-6 border-3 border-white border-t-transparent rounded-full animate-spin"></span>
                  로그인 중...
                </span>
              ) : serverConfigError ? (
                "서버 구성 오류"
              ) : (
                "로그인"
              )}
            </button>
          </form>

          <div className="mt-10 pt-8 border-t border-neutral-100">
            <p className="text-center text-base text-neutral-600 font-semibold">
              계정이 없으신가요?{" "}
              <Link 
                href="/auth/signup" 
                className="text-primary-600 hover:text-primary-700 font-bold transition-colors underline-offset-4 hover:underline"
              >
                회원가입
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
