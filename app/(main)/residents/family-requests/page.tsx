"use client"

import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import AppLayout from "@/components/layout/AppLayout"
import Link from "next/link"
import toast from "react-hot-toast"
import { ArrowLeft, User, Calendar, Check, X, Mail, Phone, Clock } from "lucide-react"
import { formatDate } from "@/lib/utils"

const relationshipLabels: Record<string, string> = {
  부: "부",
  모: "모",
  자녀: "자녀",
  배우자: "배우자",
  형제: "형제",
  자매: "자매",
  기타: "기타",
}

export default function FamilyRequestsPage() {
  const { data: session } = useSession()
  const router = useRouter()
  const [requests, setRequests] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [processingIds, setProcessingIds] = useState<Set<string>>(new Set())

  useEffect(() => {
    if (session) {
      loadRequests()
    }
  }, [session])

  const loadRequests = async () => {
    setIsLoading(true)
    try {
      const res = await fetch("/api/residents/family-requests")
      if (res.ok) {
        const data = await res.json()
        setRequests(data)
      } else {
        const error = await res.json()
        toast.error(error.error || "연결 요청 목록을 불러오는데 실패했습니다.")
      }
    } catch (error) {
      console.error("Error loading requests:", error)
      toast.error("연결 요청 목록을 불러오는 중 오류가 발생했습니다.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleApprove = async (requestId: string) => {
    if (!confirm("연결 요청을 승인하시겠습니까?")) return

    setProcessingIds((prev) => new Set(prev).add(requestId))
    try {
      const res = await fetch(`/api/residents/family-requests/${requestId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "approve" }),
      })

      const data = await res.json()

      if (res.ok) {
        toast.success("연결 요청이 승인되었습니다.")
        loadRequests()
        router.refresh()
      } else {
        toast.error(data.error || "승인에 실패했습니다.")
      }
    } catch (error) {
      console.error("Error approving request:", error)
      toast.error("승인 처리 중 오류가 발생했습니다.")
    } finally {
      setProcessingIds((prev) => {
        const next = new Set(prev)
        next.delete(requestId)
        return next
      })
    }
  }

  const handleReject = async (requestId: string) => {
    if (!confirm("연결 요청을 거부하시겠습니까?")) return

    setProcessingIds((prev) => new Set(prev).add(requestId))
    try {
      const res = await fetch(`/api/residents/family-requests/${requestId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "reject" }),
      })

      const data = await res.json()

      if (res.ok) {
        toast.success("연결 요청이 거부되었습니다.")
        loadRequests()
      } else {
        toast.error(data.error || "거부에 실패했습니다.")
      }
    } catch (error) {
      console.error("Error rejecting request:", error)
      toast.error("거부 처리 중 오류가 발생했습니다.")
    } finally {
      setProcessingIds((prev) => {
        const next = new Set(prev)
        next.delete(requestId)
        return next
      })
    }
  }

  if (!session) {
    return null
  }

  const isCaregiver = session.user.role === "CAREGIVER" || session.user.role === "ADMIN"
  const isFamily = session.user.role === "FAMILY"

  // 승인 대기 중인 요청만 필터링 (CAREGIVER용)
  const pendingRequests = isCaregiver
    ? requests.filter((r) => !r.isApproved)
    : requests

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

        {/* Header - Notion 스타일 */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-neutral-900 mb-2 tracking-tight">
            {isCaregiver ? "가족 연결 요청 승인" : "연결 요청 내역"}
          </h1>
          <p className="text-neutral-600">
            {isCaregiver
              ? "가족 회원의 입소자 연결 요청을 승인하거나 거부할 수 있습니다"
              : "입소자 연결 요청 내역을 확인할 수 있습니다"}
          </p>
        </div>

        {/* Requests List - Notion 스타일 */}
        {isLoading ? (
          <div className="card-notion p-12">
            <div className="text-center py-16">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
              <p className="mt-4 text-neutral-600">요청 목록을 불러오는 중...</p>
            </div>
          </div>
        ) : pendingRequests.length > 0 ? (
          <div className="space-y-4">
            {pendingRequests.map((request) => (
              <div
                key={request.id}
                className={`card-notion p-6 ${
                  !request.isApproved ? "bg-primary-50/50 border-primary-200" : ""
                }`}
              >
                <div className="flex items-start gap-4">
                  {/* 아이콘 */}
                  <div className={`w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0 ${
                    !request.isApproved 
                      ? "bg-amber-100 text-amber-600" 
                      : request.isApproved 
                      ? "bg-emerald-100 text-emerald-600" 
                      : "bg-neutral-100 text-neutral-600"
                  }`}>
                    {!request.isApproved ? (
                      <Clock className="w-6 h-6" />
                    ) : (
                      <Check className="w-6 h-6" />
                    )}
                  </div>

                  {/* 정보 */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-4 mb-3">
                      <div>
                        <h3 className="font-semibold text-lg text-neutral-900 mb-1">
                          {isCaregiver 
                            ? `${request.user?.name || "사용자"}님의 연결 요청`
                            : `${request.resident?.name || "입소자"}님과의 연결 요청`}
                        </h3>
                        <div className="flex flex-wrap items-center gap-3 text-sm text-neutral-600">
                          <div className="flex items-center gap-1.5">
                            <User className="w-4 h-4" />
                            <span>
                              {isCaregiver 
                                ? `입소자: ${request.resident?.name || ""} ${request.resident?.roomNumber ? `(${request.resident.roomNumber}호실)` : ""}`
                                : `입소자: ${request.resident?.name || ""}`}
                            </span>
                          </div>
                          <div className="flex items-center gap-1.5">
                            <span className="px-2 py-0.5 bg-primary-50 text-primary-700 rounded text-xs font-medium">
                              {relationshipLabels[request.relationship] || request.relationship}
                            </span>
                          </div>
                        </div>
                      </div>
                      {!request.isApproved && (
                        <span className="px-3 py-1 bg-amber-100 text-amber-700 rounded-lg text-xs font-semibold flex-shrink-0">
                          승인 대기
                        </span>
                      )}
                      {request.isApproved && (
                        <span className="px-3 py-1 bg-emerald-100 text-emerald-700 rounded-lg text-xs font-semibold flex-shrink-0">
                          승인됨
                        </span>
                      )}
                    </div>

                    {/* 가족 회원 정보 (CAREGIVER만) */}
                    {isCaregiver && request.user && (
                      <div className="mt-4 p-4 bg-white rounded-lg border border-neutral-200 space-y-2">
                        <p className="text-sm font-semibold text-neutral-900 mb-2">가족 회원 정보</p>
                        <div className="flex items-center gap-2 text-sm text-neutral-600">
                          <User className="w-4 h-4 text-neutral-400" />
                          <span>{request.user.name}</span>
                        </div>
                        {request.user.email && (
                          <div className="flex items-center gap-2 text-sm text-neutral-600">
                            <Mail className="w-4 h-4 text-neutral-400" />
                            <span>{request.user.email}</span>
                          </div>
                        )}
                        {request.user.phone && (
                          <div className="flex items-center gap-2 text-sm text-neutral-600">
                            <Phone className="w-4 h-4 text-neutral-400" />
                            <span>{request.user.phone}</span>
                          </div>
                        )}
                      </div>
                    )}

                    {/* 요청 날짜 */}
                    <div className="mt-3 flex items-center gap-2 text-xs text-neutral-500">
                      <Calendar className="w-3.5 h-3.5" />
                      <span>요청일: {formatDate(request.createdAt)}</span>
                      {request.approvedAt && (
                        <>
                          <span>•</span>
                          <span>승인일: {formatDate(request.approvedAt)}</span>
                        </>
                      )}
                    </div>

                    {/* Actions (CAREGIVER만) */}
                    {isCaregiver && !request.isApproved && (
                      <div className="mt-4 flex gap-2">
                        <button
                          onClick={() => handleApprove(request.id)}
                          disabled={processingIds.has(request.id)}
                          className="flex-1 btn-linear-primary inline-flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          <Check className="w-4 h-4" />
                          승인
                        </button>
                        <button
                          onClick={() => handleReject(request.id)}
                          disabled={processingIds.has(request.id)}
                          className="flex-1 btn-linear-secondary inline-flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          <X className="w-4 h-4" />
                          거부
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="card-notion p-12 text-center">
            <div className="w-16 h-16 bg-primary-100 rounded-lg flex items-center justify-center mx-auto mb-4">
              <User className="w-8 h-8 text-primary-600" />
            </div>
            <h2 className="text-xl font-bold text-neutral-900 mb-2">
              {isCaregiver ? "승인 대기 중인 요청이 없습니다" : "연결 요청 내역이 없습니다"}
            </h2>
            <p className="text-sm text-neutral-600">
              {isCaregiver
                ? "새로운 가족 연결 요청이 들어오면 여기에 표시됩니다"
                : "입소자와 연결을 요청하면 여기에 표시됩니다"}
            </p>
          </div>
        )}
      </div>
    </AppLayout>
  )
}

