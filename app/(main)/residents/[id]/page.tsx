"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { useSession } from "next-auth/react"
import AppLayout from "@/components/layout/AppLayout"
import Link from "next/link"
import Image from "next/image"
import toast from "react-hot-toast"
import { ArrowLeft, User, Calendar, MapPin, Users, UserPlus, Clock, Check } from "lucide-react"
import { formatDate } from "@/lib/utils"

const relationshipOptions = [
  { value: "부", label: "부" },
  { value: "모", label: "모" },
  { value: "자녀", label: "자녀" },
  { value: "배우자", label: "배우자" },
  { value: "형제", label: "형제" },
  { value: "자매", label: "자매" },
  { value: "기타", label: "기타" },
]

export default function ResidentDetailPage() {
  const params = useParams()
  const router = useRouter()
  const { data: session } = useSession()
  const [resident, setResident] = useState<any>(null)
  const [existingRequest, setExistingRequest] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showRequestForm, setShowRequestForm] = useState(false)
  const [relationship, setRelationship] = useState("")

  useEffect(() => {
    if (session && params.id) {
      loadResident()
      if (session.user.role === "FAMILY") {
        loadExistingRequest()
      }
    }
  }, [session, params.id])

  const loadResident = async () => {
    try {
      const res = await fetch(`/api/residents/${params.id}`)
      const data = await res.json()
      if (res.ok) {
        setResident(data)
      } else {
        toast.error(data.error || "입소자 정보를 불러올 수 없습니다.")
        router.push("/residents")
      }
    } catch (error) {
      console.error("Error loading resident:", error)
      toast.error("입소자 정보를 불러오는 중 오류가 발생했습니다.")
    } finally {
      setIsLoading(false)
    }
  }

  const loadExistingRequest = async () => {
    try {
      const res = await fetch("/api/residents/family-requests")
      const data = await res.json()
      if (res.ok && Array.isArray(data)) {
        const request = data.find((r: any) => r.residentId === params.id)
        if (request) {
          setExistingRequest(request)
          setShowRequestForm(false)
        } else {
          setShowRequestForm(true)
        }
      }
    } catch (error) {
      console.error("Error loading existing request:", error)
    }
  }

  const handleRequestConnection = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!relationship) {
      toast.error("관계를 선택해주세요.")
      return
    }

    setIsSubmitting(true)
    try {
      const res = await fetch(`/api/residents/${params.id}/family-request`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ relationship }),
      })

      const data = await res.json()

      if (res.ok) {
        toast.success("연결 요청이 전송되었습니다. 승인을 기다려주세요.")
        setShowRequestForm(false)
        loadExistingRequest()
        router.refresh()
      } else {
        toast.error(data.error || "연결 요청에 실패했습니다.")
      }
    } catch (error) {
      console.error("Error requesting connection:", error)
      toast.error("연결 요청 중 오류가 발생했습니다.")
    } finally {
      setIsSubmitting(false)
    }
  }

  if (!session) {
    return null
  }

  const isFamily = session.user.role === "FAMILY"
  const isCaregiver = session.user.role === "CAREGIVER" || session.user.role === "ADMIN"
  const isConnected = isFamily && existingRequest?.isApproved
  const isPending = isFamily && existingRequest && !existingRequest.isApproved

  if (isLoading) {
    return (
      <AppLayout>
        <div className="section-container py-10">
          <div className="card-notion p-12">
            <div className="text-center py-16">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
              <p className="mt-4 text-neutral-600">입소자 정보를 불러오는 중...</p>
            </div>
          </div>
        </div>
      </AppLayout>
    )
  }

  if (!resident) {
    return (
      <AppLayout>
        <div className="section-container py-10">
          <div className="card-notion p-12 text-center">
            <h2 className="text-xl font-bold text-neutral-900 mb-2">
              입소자를 찾을 수 없습니다
            </h2>
            <Link href="/residents" className="btn-linear-primary inline-flex items-center gap-2 mt-6">
              <ArrowLeft className="w-4 h-4" />
              입소자 목록으로
            </Link>
          </div>
        </div>
      </AppLayout>
    )
  }

  return (
    <AppLayout>
      <div className="section-container py-10">
        {/* Back Button */}
        <Link
          href="/residents"
          className="inline-flex items-center gap-2 text-sm text-neutral-600 hover:text-neutral-900 mb-8 transition-colors font-medium"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>뒤로가기</span>
        </Link>

        {/* Resident Info - Notion 스타일 */}
        <div className="card-notion overflow-hidden mb-6">
          {/* 프로필 사진 */}
          <div className="relative w-full h-64 md:h-96 bg-neutral-100">
            {resident.photoUrl ? (
              <Image
                src={resident.photoUrl}
                alt={resident.name}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 1200px"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <User className="w-32 h-32 text-neutral-300" />
              </div>
            )}
          </div>

          {/* 정보 */}
          <div className="p-6 md:p-8">
            <div className="flex items-start justify-between mb-6">
              <h1 className="text-3xl md:text-4xl font-bold text-neutral-900">{resident.name}</h1>
              {isConnected && (
                <span className="px-3 py-1.5 bg-emerald-100 text-emerald-700 rounded-lg text-sm font-semibold flex items-center gap-2">
                  <Check className="w-4 h-4" />
                  연결됨
                </span>
              )}
              {isPending && (
                <span className="px-3 py-1.5 bg-amber-100 text-amber-700 rounded-lg text-sm font-semibold flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  승인 대기
                </span>
              )}
            </div>

            <div className="grid md:grid-cols-2 gap-6">
              {resident.roomNumber && (
                <div className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-neutral-400 mt-1 flex-shrink-0" />
                  <div>
                    <p className="text-sm text-neutral-500 mb-1">호실</p>
                    <p className="text-neutral-900 font-medium">{resident.roomNumber}호실</p>
                  </div>
                </div>
              )}

              {resident.birthDate && (
                <div className="flex items-start gap-3">
                  <Calendar className="w-5 h-5 text-neutral-400 mt-1 flex-shrink-0" />
                  <div>
                    <p className="text-sm text-neutral-500 mb-1">생년월일</p>
                    <p className="text-neutral-900 font-medium">
                      {new Date(resident.birthDate).toLocaleDateString('ko-KR', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                      })}
                    </p>
                  </div>
                </div>
              )}

              {resident.gender && (
                <div className="flex items-start gap-3">
                  <Users className="w-5 h-5 text-neutral-400 mt-1 flex-shrink-0" />
                  <div>
                    <p className="text-sm text-neutral-500 mb-1">성별</p>
                    <p className="text-neutral-900 font-medium">{resident.gender}</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* 가족회원: 연결 요청 폼 */}
        {isFamily && showRequestForm && !isConnected && !isPending && (
          <div className="card-notion p-6 md:p-8">
            <h2 className="text-xl font-bold text-neutral-900 mb-4">연결 요청</h2>
            <p className="text-sm text-neutral-600 mb-6">
              입소자와의 관계를 선택하고 연결을 요청해주세요. 요양원 직원의 승인 후 연결됩니다.
            </p>
            <form onSubmit={handleRequestConnection} className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-neutral-900 mb-2">
                  관계 <span className="text-red-600">*</span>
                </label>
                <select
                  value={relationship}
                  onChange={(e) => setRelationship(e.target.value)}
                  required
                  className="input-vercel w-full"
                >
                  <option value="">관계를 선택하세요</option>
                  {relationshipOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
              <div className="flex gap-3">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 btn-linear-primary disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? "요청 중..." : "연결 요청하기"}
                </button>
                <button
                  type="button"
                  onClick={() => setShowRequestForm(false)}
                  className="btn-linear-secondary"
                >
                  취소
                </button>
              </div>
            </form>
          </div>
        )}

        {/* 가족회원: 연결 상태 정보 */}
        {isFamily && existingRequest && (
          <div className="card-notion p-6 md:p-8">
            <div className="flex items-center gap-3 mb-4">
              {isConnected ? (
                <Check className="w-6 h-6 text-emerald-600" />
              ) : (
                <Clock className="w-6 h-6 text-amber-600" />
              )}
              <h2 className="text-xl font-bold text-neutral-900">
                {isConnected ? "연결 완료" : "승인 대기 중"}
              </h2>
            </div>
            <div className="space-y-2 text-sm text-neutral-600">
              <p>
                <span className="font-semibold">관계:</span> {existingRequest.relationship}
              </p>
              <p>
                <span className="font-semibold">요청일:</span> {formatDate(existingRequest.createdAt)}
              </p>
              {existingRequest.approvedAt && (
                <p>
                  <span className="font-semibold">승인일:</span> {formatDate(existingRequest.approvedAt)}
                </p>
              )}
            </div>
            {isPending && (
              <p className="mt-4 text-sm text-neutral-600">
                요양원 직원의 승인을 기다리고 있습니다.
              </p>
            )}
          </div>
        )}

        {/* 요양원직원: 수정/삭제 버튼 */}
        {isCaregiver && (
          <div className="flex gap-3">
            <Link
              href={`/residents/${resident.id}/edit`}
              className="flex-1 btn-linear-primary text-center"
            >
              정보 수정
            </Link>
          </div>
        )}
      </div>
    </AppLayout>
  )
}

