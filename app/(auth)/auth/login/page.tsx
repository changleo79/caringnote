"use client"

import { useState, useEffect } from "react"
import { signIn } from "next-auth/react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import toast from "react-hot-toast"
import { Mail, Lock, ArrowLeft, AlertCircle } from "lucide-react"
import Logo from "@/components/brand/Logo"
import { Button } from "@/components/ui/Button"
import { Input } from "@/components/ui/Input"
import { PHOTO_ALT, PHOTOS } from "@/lib/photos"

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
        if (data.nextAuth?.status !== "✅ 정상") setServerConfigError(true)
      })
      .catch(() => {})
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setServerConfigError(false)
    try {
      const result = await signIn("credentials", { email, password, redirect: false })
      if (result?.error) {
        if (
          result.error.includes("configuration") ||
          result.error.includes("secret") ||
          result.error.includes("NEXTAUTH")
        ) {
          setServerConfigError(true)
          toast.error("서버 구성 오류: NEXTAUTH_SECRET을 확인하세요.")
        } else {
          toast.error("이메일 또는 비밀번호가 올바르지 않습니다.")
        }
      } else if (result?.ok) {
        toast.success("로그인되었습니다.")
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
    <div className="min-h-screen bg-[var(--sn-surface)] lg:grid lg:grid-cols-[1.05fr_.95fr]">
      <div className="relative h-56 overflow-hidden sm:h-72 lg:h-screen">
        <Image
          src={PHOTOS.auth}
          alt={PHOTO_ALT.auth}
          fill
          priority
          sizes="(max-width: 1024px) 100vw, 52vw"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(10,24,21,.08),rgba(10,24,21,.62))]" />
        <div className="absolute inset-x-0 bottom-0 px-6 pb-6 text-white sm:px-10 sm:pb-8 lg:px-12 lg:pb-12">
          <p className="font-display text-2xl font-semibold tracking-[-0.03em] lg:text-4xl">
            부모님의 하루를,
            <br className="hidden lg:block" /> 가장 가까이.
          </p>
        </div>
      </div>

      <div className="flex flex-col justify-center px-6 py-10 sm:px-12 lg:min-h-screen">
        <div className="mx-auto w-full max-w-md">
          <Link
            href="/"
            className="mb-10 inline-flex items-center gap-2 text-[var(--sn-ink-muted)] hover:text-[var(--sn-ink)]"
          >
            <ArrowLeft className="h-4 w-4" />
            홈으로
          </Link>

          <Logo size="md" href="/" />
          <h1 className="mt-8 font-display text-3xl font-semibold tracking-[-0.03em]">로그인</h1>
          <p className="mt-2 text-[var(--sn-ink-muted)]">시설 직원과 보호자 모두 같은 화면에서 시작합니다.</p>

          {serverConfigError && (
            <div className="mt-6 flex gap-3 border border-[var(--sn-caution)] bg-[var(--sn-caution-bg)] p-4 text-[var(--sn-caution)]">
              <AlertCircle className="mt-0.5 h-5 w-5 shrink-0" />
              <p className="text-sm">서버 인증 설정이 필요합니다. 관리자에게 문의해 주세요.</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="mt-8 space-y-5">
            <Input
              label="이메일"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              icon={<Mail className="h-5 w-5" />}
              required
              autoComplete="email"
            />
            <Input
              label="비밀번호"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              icon={<Lock className="h-5 w-5" />}
              required
              autoComplete="current-password"
            />
            <Button type="submit" fullWidth disabled={isLoading} className="min-h-[56px]">
              {isLoading ? "확인 중…" : "로그인"}
            </Button>
          </form>

          <p className="mt-8 text-center text-[var(--sn-ink-muted)]">
            계정이 없으신가요?{" "}
            <Link href="/auth/signup" className="font-semibold text-[var(--sn-accent)]">
              회원가입
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
