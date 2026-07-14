"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import toast from "react-hot-toast";
import { ArrowLeft, Check, X } from "lucide-react";
import { formatDate } from "@/lib/utils";
import { PageHeader } from "@/components/calm/PageHeader";
import { EmptyState } from "@/components/calm/EmptyState";

const relationshipLabels: Record<string, string> = {
  부: "부",
  모: "모",
  자녀: "자녀",
  배우자: "배우자",
  형제: "형제",
  자매: "자매",
  기타: "기타",
};

export default function FamilyRequestsPage() {
  const { data: session } = useSession();
  const router = useRouter();
  const [requests, setRequests] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [processingIds, setProcessingIds] = useState<Set<string>>(new Set());

  useEffect(() => {
    if (session) loadRequests();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [session]);

  const loadRequests = async () => {
    setIsLoading(true);
    try {
      const res = await fetch("/api/residents/family-requests");
      if (res.ok) {
        const data = await res.json();
        setRequests(data);
      } else {
        const error = await res.json();
        toast.error(error.error || "연결 요청 목록을 불러오는데 실패했습니다.");
      }
    } catch {
      toast.error("연결 요청 목록을 불러오는 중 오류가 발생했습니다.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleApprove = async (requestId: string) => {
    if (!confirm("연결 요청을 승인하시겠습니까?")) return;
    setProcessingIds((prev) => new Set(prev).add(requestId));
    try {
      const res = await fetch(`/api/residents/family-requests/${requestId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "approve" }),
      });
      const data = await res.json();
      if (res.ok) {
        toast.success("연결 요청이 승인되었습니다.");
        loadRequests();
        router.refresh();
      } else toast.error(data.error || "승인에 실패했습니다.");
    } catch {
      toast.error("승인 처리 중 오류가 발생했습니다.");
    } finally {
      setProcessingIds((prev) => {
        const next = new Set(prev);
        next.delete(requestId);
        return next;
      });
    }
  };

  const handleReject = async (requestId: string) => {
    if (!confirm("연결 요청을 거부하시겠습니까?")) return;
    setProcessingIds((prev) => new Set(prev).add(requestId));
    try {
      const res = await fetch(`/api/residents/family-requests/${requestId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "reject" }),
      });
      const data = await res.json();
      if (res.ok) {
        toast.success("연결 요청이 거부되었습니다.");
        loadRequests();
      } else toast.error(data.error || "거부에 실패했습니다.");
    } catch {
      toast.error("거부 처리 중 오류가 발생했습니다.");
    } finally {
      setProcessingIds((prev) => {
        const next = new Set(prev);
        next.delete(requestId);
        return next;
      });
    }
  };

  if (!session) return null;

  const isCaregiver =
    session.user.role === "CAREGIVER" || session.user.role === "ADMIN";
  const pendingRequests = isCaregiver
    ? requests.filter((r) => !r.isApproved)
    : requests;

  return (
    <div className="mx-auto max-w-xl">
      <Link
        href="/residents"
        className="mb-6 inline-flex min-h-[48px] items-center gap-2 text-sm font-medium text-[var(--sn-ink-muted)]"
      >
        <ArrowLeft className="h-4 w-4" />
        어르신
      </Link>

      <PageHeader
        title={isCaregiver ? "가족 연결 요청" : "연결 요청 내역"}
        description={
          isCaregiver
            ? "보호자 연결을 승인하거나 거절합니다."
            : "입소자 연결 요청 상태입니다."
        }
      />

      {isLoading ? (
        <p className="text-[var(--sn-ink-muted)]">불러오는 중…</p>
      ) : pendingRequests.length === 0 ? (
        <EmptyState
          title={
            isCaregiver
              ? "승인 대기 중인 요청이 없습니다"
              : "연결 요청 내역이 없습니다"
          }
        />
      ) : (
        <ul className="divide-y divide-[var(--sn-line)]">
          {pendingRequests.map((request) => (
            <li key={request.id} className="py-6 first:pt-0">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <h3 className="text-lg font-semibold text-[var(--sn-ink)]">
                    {isCaregiver
                      ? `${request.user?.name || "사용자"}님의 요청`
                      : `${request.resident?.name || "입소자"}님과의 연결`}
                  </h3>
                  <p className="mt-1 text-sm text-[var(--sn-ink-muted)]">
                    {isCaregiver
                      ? `입소자 ${request.resident?.name || ""}${
                          request.resident?.roomNumber
                            ? ` · ${request.resident.roomNumber}`
                            : ""
                        }`
                      : `관계 ${relationshipLabels[request.relationship] || request.relationship}`}
                  </p>
                  {isCaregiver && request.user && (
                    <p className="mt-2 text-sm text-[var(--sn-ink-faint)]">
                      {[request.user.email, request.user.phone]
                        .filter(Boolean)
                        .join(" · ")}
                    </p>
                  )}
                  <p className="mt-2 text-xs text-[var(--sn-ink-faint)]">
                    요청일 {formatDate(request.createdAt)}
                  </p>
                </div>
                <span
                  className={
                    request.isApproved ? "chip-good" : "chip-ok"
                  }
                >
                  {request.isApproved ? "승인됨" : "대기"}
                </span>
              </div>

              {isCaregiver && !request.isApproved && (
                <div className="mt-4 flex gap-2">
                  <button
                    onClick={() => handleApprove(request.id)}
                    disabled={processingIds.has(request.id)}
                    className="btn-primary flex-1"
                  >
                    <Check className="h-4 w-4" />
                    승인
                  </button>
                  <button
                    onClick={() => handleReject(request.id)}
                    disabled={processingIds.has(request.id)}
                    className="btn-secondary flex-1"
                  >
                    <X className="h-4 w-4" />
                    거부
                  </button>
                </div>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
