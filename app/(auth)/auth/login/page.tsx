"use client"

import { useState, useEffect } from "react"
import { signIn } from "next-auth/react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import toast from "react-hot-toast"
import { Mail, Lock, ArrowLeft, AlertCircle, Sparkles } from "lucide-react"
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
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-accent-50/40 flex items-center justify-center px-4 py-12 relative overflow-hidden">
      {/* 배경 요소 */}
      <div className="absolute top-20 left-10 w-40 h-40 bg-primary-300/20 rounded-full blur-3xl animate-float"></div>
      <div className="absolute bottom-20 right-10 w-48 h-48 bg-accent-300/20 rounded-full blur-3xl animate-float" style={{ animationDelay: '2s' }}></div>
      
      <div className="max-w-md w-full relative z-10">
        {/* Back to Home */}
        <Link 
          href="/"
          className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 mb-8 transition-colors group font-medium"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          <span>홈으로</span>
        </Link>

        {/* Server Config Warning */}
        {serverConfigError && (
          <div className="mb-6 p-5 bg-red-50/90 backdrop-blur-sm border-2 border-red-200 rounded-2xl shadow-lg">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-6 h-6 text-red-600 flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <h3 className="font-black text-red-900 mb-2">서버 구성 오류</h3>
                <p className="text-sm text-red-700 mb-2 font-medium">
                  NEXTAUTH_SECRET 환경 변수가 설정되지 않았습니다.
                </p>
                <p className="text-xs text-red-600 font-medium">
                  관리자에게 문의하거나 Vercel 환경 변수를 확인하세요.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Logo/Title - 프리미엄 디자인 */}
        <div className="text-center mb-12">
          <div className="mb-8 flex justify-center animate-fade-in-up">
            <Logo variant="default" size="lg" />
          </div>
          <h1 className="text-5xl md:text-6xl font-black text-gray-900 mb-4 tracking-tighter">
            로그인
          </h1>
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary-50/80 backdrop-blur-sm text-primary-700 rounded-full text-sm font-bold mb-2">
            <Sparkles className="w-4 h-4 text-primary-600" />
            <span>케어링노트에 오신 것을 환영합니다</span>
          </div>
        </div>

        {/* Login Form - 프리미엄 디자인 */}
        <div className="bg-white/90 backdrop-blur-xl rounded-3xl shadow-2xl shadow-gray-900/10 p-10 md:p-12 border border-white/60">
          <form onSubmit={handleSubmit} className="space-y-7">
            <div>
              <label htmlFor="email" className="block text-sm font-black text-gray-900 mb-4">
                이메일
              </label>
              <div className="relative">
                <Mail className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 z-10" />
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full pl-14 pr-5 py-4 border-2 border-gray-200 rounded-2xl input-focus outline-none transition-all bg-white text-gray-900 placeholder:text-gray-400 font-medium"
                  placeholder="your@email.com"
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-black text-gray-900 mb-4">
                비밀번호
              </label>
              <div className="relative">
                <Lock className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 z-10" />
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full pl-14 pr-5 py-4 border-2 border-gray-200 rounded-2xl input-focus outline-none transition-all bg-white text-gray-900 placeholder:text-gray-400 font-medium"
                  placeholder="비밀번호를 입력하세요"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading || serverConfigError}
              className="w-full bg-gradient-to-r from-primary-600 via-primary-600 to-primary-700 text-white py-5 rounded-2xl font-black text-lg hover:from-primary-700 hover:via-primary-700 hover:to-primary-800 active:scale-[0.98] transition-all duration-300 shadow-2xl shadow-primary-500/40 hover:shadow-3xl hover:shadow-primary-500/50 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
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

          <div className="mt-10 pt-8 border-t-2 border-gray-100">
            <p className="text-center text-sm text-gray-600 font-medium">
              계정이 없으신가요?{" "}
              <Link 
                href="/auth/signup" 
                className="text-primary-600 hover:text-primary-700 font-black transition-colors"
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
