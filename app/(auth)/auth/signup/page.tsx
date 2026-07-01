"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import toast from "react-hot-toast"
import { Mail, Lock, User, Phone, Building2, ArrowLeft } from "lucide-react"
import Logo from "@/components/brand/Logo"
import { Button } from "@/components/ui/Button"
import { Input, Select } from "@/components/ui/Input"
import { Card, CardContent } from "@/components/ui/Card"
import { cn } from "@/lib/utils"

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
    <div className="min-h-screen bg-warm-50 flex items-center justify-center px-4 py-12">
      <div className="max-w-lg w-full">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-body text-neutral-500 hover:text-neutral-800 mb-8 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          홈으로
        </Link>

        <div className="text-center mb-8">
          <div className="flex justify-center mb-6">
            <Logo size="md" />
          </div>
          <h1 className="text-3xl font-bold text-neutral-900 tracking-tight mb-2">회원가입</h1>
          <p className="text-body text-neutral-500">새 계정을 만들어 시작하세요</p>
        </div>

        <Card>
          <CardContent className="pt-6">
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Role selection */}
              <div>
                <p className="label">회원 유형</p>
                <div className="grid grid-cols-2 gap-3">
                  {(["FAMILY", "CAREGIVER"] as const).map((role) => (
                    <button
                      key={role}
                      type="button"
                      onClick={() => setFormData({ ...formData, role, careCenterId: "" })}
                      className={cn(
                        "p-4 rounded-xl border-2 transition-all text-center",
                        formData.role === role
                          ? "border-brand-500 bg-brand-50 text-brand-700"
                          : "border-neutral-200 hover:border-neutral-300 text-neutral-600"
                      )}
                    >
                      {role === "FAMILY" ? (
                        <User className="w-6 h-6 mx-auto mb-2" />
                      ) : (
                        <Building2 className="w-6 h-6 mx-auto mb-2" />
                      )}
                      <span className="font-semibold text-body">
                        {role === "FAMILY" ? "가족 회원" : "요양원 직원"}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {formData.role === "FAMILY" && (
                <div>
                  {loadingCareCenters ? (
                    <p className="text-body text-neutral-400 text-center py-3">요양원 목록 불러오는 중...</p>
                  ) : careCenters.length === 0 ? (
                    <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl">
                      <p className="font-semibold text-amber-800 text-body">등록된 요양원이 없습니다</p>
                      <p className="text-caption text-amber-700 mt-1">
                        요양원 직원이 먼저 가입하여 요양원을 등록해주세요.
                      </p>
                    </div>
                  ) : (
                    <Select
                      label="요양원 선택 *"
                      value={formData.careCenterId}
                      onChange={(e) => setFormData({ ...formData, careCenterId: e.target.value })}
                      required
                    >
                      <option value="">요양원을 선택하세요</option>
                      {careCenters.map((c) => (
                        <option key={c.id} value={c.id}>
                          {c.name}{c.address ? ` (${c.address})` : ""}
                        </option>
                      ))}
                    </Select>
                  )}
                </div>
              )}

              <Input
                label="이름"
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
                placeholder="이름을 입력하세요"
                icon={<User className="w-5 h-5" />}
              />

              <Input
                label="이메일"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required
                placeholder="your@email.com"
                icon={<Mail className="w-5 h-5" />}
              />

              <Input
                label="전화번호"
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                placeholder="010-0000-0000"
                icon={<Phone className="w-5 h-5" />}
              />

              <Input
                label="비밀번호"
                type="password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                required
                minLength={6}
                placeholder="최소 6자 이상"
                icon={<Lock className="w-5 h-5" />}
              />

              <Input
                label="비밀번호 확인"
                type="password"
                value={formData.confirmPassword}
                onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                required
                placeholder="비밀번호를 다시 입력하세요"
                icon={<Lock className="w-5 h-5" />}
              />

              <Button type="submit" fullWidth size="lg" disabled={isLoading}>
                {isLoading ? "가입 중..." : "회원가입"}
              </Button>
            </form>

            <p className="text-center text-body text-neutral-500 mt-6 pt-6 border-t border-neutral-100">
              이미 계정이 있으신가요?{" "}
              <Link href="/auth/login" className="text-brand-600 font-semibold hover:text-brand-700">
                로그인
              </Link>
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
