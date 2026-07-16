"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import toast from "react-hot-toast"
import { Mail, Lock, User, Phone, Building2, ArrowLeft } from "lucide-react"
import Logo from "@/components/brand/Logo"
import { Button } from "@/components/ui/Button"
import { Input, Select } from "@/components/ui/Input"
import { cn } from "@/lib/utils"
import { PHOTO_ALT, PHOTOS } from "@/lib/photos"

interface CareCenter {
  id: string
  name: string
  address?: string
}

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
  const [careCenters, setCareCenters] = useState<CareCenter[]>([])
  const [loadingCareCenters, setLoadingCareCenters] = useState(true)

  useEffect(() => {
    fetch("/api/care-centers")
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) setCareCenters(data)
        else if (data.careCenters) setCareCenters(data.careCenters)
      })
      .catch(() => setCareCenters([]))
      .finally(() => setLoadingCareCenters(false))
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
      toast.error("가족 회원은 요양원을 선택해야 합니다.")
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
        toast.error(data?.error || "회원가입 중 오류가 발생했습니다.")
      }
    } catch {
      toast.error("네트워크 오류가 발생했습니다.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-[var(--sn-surface)] lg:grid lg:grid-cols-[1.05fr_.95fr]">
      <div className="relative h-48 overflow-hidden sm:h-64 lg:sticky lg:top-0 lg:h-screen">
        <Image
          src={PHOTOS.auth}
          alt={PHOTO_ALT.auth}
          fill
          priority
          sizes="(max-width: 1024px) 100vw, 52vw"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(10,24,21,.06),rgba(10,24,21,.6))]" />
        <div className="absolute inset-x-0 bottom-0 px-6 pb-6 text-white sm:px-10 sm:pb-8 lg:px-12 lg:pb-12">
          <p className="font-display text-2xl font-semibold tracking-[-0.03em] lg:text-4xl">
            더 가까운 돌봄을
            <br className="hidden lg:block" /> 함께 시작해요
          </p>
        </div>
      </div>

      <div className="flex flex-col justify-center px-6 py-10 sm:px-12 lg:min-h-screen">
        <div className="mx-auto w-full max-w-md">
          <Link href="/" className="mb-8 inline-flex items-center gap-2 text-[var(--sn-ink-muted)]">
            <ArrowLeft className="h-4 w-4" /> 홈으로
          </Link>
          <Logo size="md" />
          <h1 className="mt-8 font-display text-3xl font-semibold tracking-[-0.03em]">회원가입</h1>
          <p className="mt-2 text-[var(--sn-ink-muted)]">시설과 가족을 연결하는 첫 단계입니다.</p>

          <form onSubmit={handleSubmit} className="mt-8 space-y-5">
            <div>
              <p className="label">회원 유형</p>
              <div className="grid grid-cols-2 gap-3">
                {(["FAMILY", "CAREGIVER"] as const).map((role) => (
                  <button
                    key={role}
                    type="button"
                    onClick={() => setFormData({ ...formData, role, careCenterId: "" })}
                    className={cn(
                      "min-h-[72px] rounded-[var(--sn-radius)] border p-4 text-center transition",
                      formData.role === role
                        ? "border-[var(--sn-accent)] bg-[var(--sn-accent-soft)] text-[var(--sn-accent-hover)]"
                        : "border-[var(--sn-line)] text-[var(--sn-ink-muted)]"
                    )}
                  >
                    {role === "FAMILY" ? (
                      <User className="mx-auto mb-2 h-6 w-6" />
                    ) : (
                      <Building2 className="mx-auto mb-2 h-6 w-6" />
                    )}
                    <span className="font-semibold">
                      {role === "FAMILY" ? "가족" : "시설 직원"}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {formData.role === "FAMILY" && (
              <Select
                label="요양원 선택"
                value={formData.careCenterId}
                onChange={(e) => setFormData({ ...formData, careCenterId: e.target.value })}
                required
                disabled={loadingCareCenters}
              >
                <option value="">요양원을 선택하세요</option>
                {careCenters.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </Select>
            )}

            <Input label="이름" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} required icon={<User className="h-5 w-5" />} />
            <Input label="이메일" type="email" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} required icon={<Mail className="h-5 w-5" />} />
            <Input label="전화번호" type="tel" value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} icon={<Phone className="h-5 w-5" />} />
            <Input label="비밀번호" type="password" value={formData.password} onChange={(e) => setFormData({ ...formData, password: e.target.value })} required minLength={6} icon={<Lock className="h-5 w-5" />} />
            <Input label="비밀번호 확인" type="password" value={formData.confirmPassword} onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })} required icon={<Lock className="h-5 w-5" />} />

            <Button type="submit" fullWidth disabled={isLoading} className="min-h-[56px]">
              {isLoading ? "가입 중…" : "회원가입"}
            </Button>
          </form>

          <p className="mt-8 text-center text-[var(--sn-ink-muted)]">
            이미 계정이 있으신가요?{" "}
            <Link href="/auth/login" className="font-semibold text-[var(--sn-accent)]">
              로그인
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
