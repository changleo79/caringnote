"use client"

import { useState, useEffect } from "react"
import { signIn } from "next-auth/react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import toast from "react-hot-toast"
import { Mail, Lock, ArrowLeft, AlertCircle } from "lucide-react"
import Logo from "@/components/brand/Logo"
import { Button } from "@/components/ui/Button"
import { Input } from "@/components/ui/Input"
import { Card, CardContent } from "@/components/ui/Card"

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [serverConfigError, setServerConfigError] = useState(false)

  useEffect(() => {
    fetch("/api/auth-check")
      .then((res) => res.json())
      .then((data) => {
        if (data.nextAuth?.status !== "✅ 정상") {
          setServerConfigError(true)
        }
      })
      .catch(() => {})
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
        if (
          result.error.includes("configuration") ||
          result.error.includes("secret") ||
          result.error.includes("NEXTAUTH")
        ) {
          setServerConfigError(true)
          toast.error("서버 구성 오류: NEXTAUTH_SECRET 환경 변수를 확인하세요.")
        } else {
          toast.error("이메일 또는 비밀번호가 올바르지 않습니다.")
        }
      } else if (result?.ok) {
        toast.success("로그인 성공!")
        router.push("/dashboard")
        router.refresh()
      }
    } catch {
      toast.error("로그인 중 오류가 발생했습니다.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-warm-50 flex items-center justify-center px-4 py-12">
      <div className="max-w-md w-full">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-body text-neutral-500 hover:text-neutral-800 mb-8 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          홈으로
        </Link>

        {serverConfigError && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-red-900 text-body">서버 구성 오류</p>
              <p className="text-caption text-red-700 mt-1">
                NEXTAUTH_SECRET 환경 변수가 설정되지 않았습니다.
              </p>
            </div>
          </div>
        )}

        <div className="text-center mb-8">
          <div className="flex justify-center mb-6">
            <Logo size="md" />
          </div>
          <h1 className="text-3xl font-bold text-neutral-900 tracking-tight mb-2">로그인</h1>
          <p className="text-body text-neutral-500">실버노트에 오신 것을 환영합니다</p>
        </div>

        <Card>
          <CardContent className="pt-6">
            <form onSubmit={handleSubmit} className="space-y-5">
              <Input
                label="이메일"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="your@email.com"
                icon={<Mail className="w-5 h-5" />}
              />

              <Input
                label="비밀번호"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="비밀번호를 입력하세요"
                icon={<Lock className="w-5 h-5" />}
              />

              <Button
                type="submit"
                fullWidth
                size="lg"
                disabled={isLoading || serverConfigError}
              >
                {isLoading ? "로그인 중..." : "로그인"}
              </Button>
            </form>

            <p className="text-center text-body text-neutral-500 mt-6 pt-6 border-t border-neutral-100">
              계정이 없으신가요?{" "}
              <Link href="/auth/signup" className="text-brand-600 font-semibold hover:text-brand-700">
                회원가입
              </Link>
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
