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

  // 서버 구성 상태 확인
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
        
        // 서버 구성 오류 감지
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
              <span className="text-xs text-gray-500 mt-1">
                Vercel Settings → Environment Variables 확인 필요
              </span>
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
      
      // 네트워크 오류 또는 서버 오류
      if (error.message?.includes("fetch") || error.message?.includes("network")) {
        toast.error("네트워크 오류가 발생했습니다. 연결을 확인해주세요.")
      } else {
        toast.error("로그인 중 오류가 발생했습니다.")
      }
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-accent-50/30 flex items-center justify-center px-4 py-12">
      <div className="max-w-md w-full">
        {/* Back to Home */}
        <Link 
          href="/"
          className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 mb-6 transition-colors group"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          <span>홈으로</span>
        </Link>

        {/* Server Config Warning */}
        {serverConfigError && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <h3 className="font-semibold text-red-900 mb-1">서버 구성 오류</h3>
                <p className="text-sm text-red-700 mb-2">
                  NEXTAUTH_SECRET 환경 변수가 설정되지 않았습니다.
                </p>
                <p className="text-xs text-red-600">
                  관리자에게 문의하거나 Vercel 환경 변수를 확인하세요.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Logo/Title */}
        <div className="text-center mb-10">
          <div className="mb-6 flex justify-center">
            <Logo variant="default" size="lg" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-3 tracking-tight">
            로그인
          </h1>
          <p className="text-base text-gray-600">
            케어링노트에 오신 것을 환영합니다
          </p>
        </div>

        {/* Login Form */}
        <div className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl shadow-gray-900/5 p-8 md:p-10 border border-white/50">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-sm font-semibold text-gray-800 mb-3">
                이메일
              </label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 z-10" />
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full pl-12 pr-4 py-3.5 border border-gray-200 rounded-xl input-focus outline-none transition-all bg-white text-gray-900 placeholder:text-gray-400"
                  placeholder="your@email.com"
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-semibold text-gray-800 mb-3">
                비밀번호
              </label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 z-10" />
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full pl-12 pr-4 py-3.5 border border-gray-200 rounded-xl input-focus outline-none transition-all bg-white text-gray-900 placeholder:text-gray-400"
                  placeholder="비밀번호를 입력하세요"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading || serverConfigError}
              className="w-full bg-gradient-to-r from-primary-600 to-primary-700 text-white py-4 rounded-xl font-semibold text-base hover:from-primary-700 hover:to-primary-800 active:scale-[0.98] transition-all duration-200 shadow-lg shadow-primary-500/30 hover:shadow-xl hover:shadow-primary-500/40 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
            >
              {isLoading ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                  로그인 중...
                </span>
              ) : serverConfigError ? (
                "서버 구성 오류"
              ) : (
                "로그인"
              )}
            </button>
          </form>

          <div className="mt-8 pt-6 border-t border-gray-200">
            <p className="text-center text-sm text-gray-600">
              계정이 없으신가요?{" "}
              <Link 
                href="/auth/signup" 
                className="text-primary-600 hover:text-primary-700 font-semibold transition-colors"
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
