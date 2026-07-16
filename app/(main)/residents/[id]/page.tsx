"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import Link from "next/link";
import Image from "next/image";
import toast from "react-hot-toast";
import { ArrowLeft } from "lucide-react";
import { formatDate } from "@/lib/utils";

const relationshipOptions = [
  { value: "부", label: "부" },
  { value: "모", label: "모" },
  { value: "자녀", label: "자녀" },
  { value: "배우자", label: "배우자" },
  { value: "형제", label: "형제" },
  { value: "자매", label: "자매" },
  { value: "기타", label: "기타" },
];

export default function ResidentDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { data: session } = useSession();
  const [resident, setResident] = useState<any>(null);
  const [existingRequest, setExistingRequest] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showRequestForm, setShowRequestForm] = useState(false);
  const [relationship, setRelationship] = useState("");

  useEffect(() => {
    if (session && params.id) {
      loadResident();
      if (session.user.role === "FAMILY") loadExistingRequest();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [session, params.id]);

  const loadResident = async () => {
    try {
      const res = await fetch(`/api/residents/${params.id}`);
      const data = await res.json();
      if (res.ok) setResident(data);
      else {
        toast.error(data.error || "입소자 정보를 불러올 수 없습니다.");
        router.push("/residents");
      }
    } catch {
      toast.error("입소자 정보를 불러오는 중 오류가 발생했습니다.");
    } finally {
      setIsLoading(false);
    }
  };

  const loadExistingRequest = async () => {
    try {
      const res = await fetch("/api/residents/family-requests");
      const data = await res.json();
      if (res.ok && Array.isArray(data)) {
        const request = data.find((r: any) => r.residentId === params.id);
        if (request) {
          setExistingRequest(request);
          setShowRequestForm(false);
        } else {
          setShowRequestForm(true);
        }
      }
    } catch {
      /* ignore */
    }
  };

  const handleRequestConnection = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!relationship) {
      toast.error("관계를 선택해주세요.");
      return;
    }
    setIsSubmitting(true);
    try {
      const res = await fetch(`/api/residents/${params.id}/family-request`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ relationship }),
      });
      const data = await res.json();
      if (res.ok) {
        toast.success("연결 요청이 전송되었습니다. 승인을 기다려주세요.");
        setShowRequestForm(false);
        loadExistingRequest();
        router.refresh();
      } else {
        toast.error(data.error || "연결 요청에 실패했습니다.");
      }
    } catch {
      toast.error("연결 요청 중 오류가 발생했습니다.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!session) return null;

  const isFamily = session.user.role === "FAMILY";
  const isCaregiver =
    session.user.role === "CAREGIVER" || session.user.role === "ADMIN";
  const isConnected = isFamily && existingRequest?.isApproved;
  const isPending = isFamily && existingRequest && !existingRequest.isApproved;

  if (isLoading) {
    return (
      <div className="mx-auto max-w-xl py-16 text-center text-[var(--sn-ink-muted)]">
        불러오는 중…
      </div>
    );
  }

  if (!resident) {
    return (
      <div className="mx-auto max-w-xl py-16 text-center">
        <h2 className="page-title">입소자를 찾을 수 없습니다</h2>
        <Link href="/residents" className="btn-primary mt-6 inline-flex">
          <ArrowLeft className="h-4 w-4" />
          어르신 목록
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-xl">
      <Link
        href="/residents"
        className="mb-6 inline-flex min-h-[48px] items-center gap-2 text-sm font-medium text-[var(--sn-ink-muted)]"
      >
        <ArrowLeft className="h-4 w-4" />
        어르신
      </Link>

      <div className="-mx-4 mb-8 aspect-[4/3] overflow-hidden bg-[var(--sn-surface-muted)] sm:-mx-6">
        {resident.photoUrl ? (
          <Image
            src={resident.photoUrl}
            alt={resident.name}
            width={1200}
            height={900}
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center font-display text-6xl text-[var(--sn-ink-faint)]">
            {resident.name?.[0] || "·"}
          </div>
        )}
      </div>

      <div className="mb-2 flex flex-wrap items-center gap-2">
        {isConnected && <span className="chip-good">연결됨</span>}
        {isPending && <span className="chip-ok">승인 대기</span>}
      </div>
      <h1 className="font-display text-3xl font-semibold tracking-tight text-[var(--sn-ink)]">
        {resident.name}
      </h1>

      <dl className="mt-6 space-y-3 text-sm">
        {resident.roomNumber && (
          <div className="flex gap-3">
            <dt className="w-20 shrink-0 text-[var(--sn-ink-faint)]">호실</dt>
            <dd className="text-[var(--sn-ink)]">{resident.roomNumber}</dd>
          </div>
        )}
        {resident.birthDate && (
          <div className="flex gap-3">
            <dt className="w-20 shrink-0 text-[var(--sn-ink-faint)]">생년월일</dt>
            <dd className="text-[var(--sn-ink)]">
              {new Date(resident.birthDate).toLocaleDateString("ko-KR", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </dd>
          </div>
        )}
        {resident.gender && (
          <div className="flex gap-3">
            <dt className="w-20 shrink-0 text-[var(--sn-ink-faint)]">성별</dt>
            <dd className="text-[var(--sn-ink)]">{resident.gender}</dd>
          </div>
        )}
      </dl>

      {isFamily && showRequestForm && !isConnected && !isPending && (
        <form
          onSubmit={handleRequestConnection}
          className="mt-10 space-y-4 border-t border-[var(--sn-line)] pt-8"
        >
          <h2 className="text-lg font-semibold text-[var(--sn-ink)]">연결 요청</h2>
          <p className="text-sm text-[var(--sn-ink-muted)]">
            관계를 선택하고 요청하면, 시설 직원 승인 후 연결됩니다.
          </p>
          <div>
            <label className="label">관계 *</label>
            <select
              value={relationship}
              onChange={(e) => setRelationship(e.target.value)}
              required
              className="input"
            >
              <option value="">선택하세요</option>
              {relationshipOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
          <div className="flex gap-3">
            <button type="submit" disabled={isSubmitting} className="btn-primary flex-1">
              {isSubmitting ? "요청 중…" : "연결 요청"}
            </button>
            <button
              type="button"
              onClick={() => setShowRequestForm(false)}
              className="btn-secondary"
            >
              취소
            </button>
          </div>
        </form>
      )}

      {isFamily && existingRequest && (
        <div className="mt-10 border-t border-[var(--sn-line)] pt-8">
          <h2 className="text-lg font-semibold text-[var(--sn-ink)]">
            {isConnected ? "연결 완료" : "승인 대기 중"}
          </h2>
          <p className="mt-2 text-sm text-[var(--sn-ink-muted)]">
            관계 {existingRequest.relationship} · 요청일{" "}
            {formatDate(existingRequest.createdAt)}
            {existingRequest.approvedAt
              ? ` · 승인일 ${formatDate(existingRequest.approvedAt)}`
              : ""}
          </p>
          {isPending && (
            <p className="mt-3 text-sm text-[var(--sn-ink-faint)]">
              시설 직원의 승인을 기다리고 있습니다.
            </p>
          )}
        </div>
      )}

      {isCaregiver && (
        <div className="mt-10 flex gap-3">
          <Link
            href={`/timeline/${resident.id}`}
            className="btn-primary flex-1 text-center"
          >
            타임라인
          </Link>
          <Link
            href={`/reports/write?residentId=${resident.id}`}
            className="btn-secondary flex-1 text-center"
          >
            알림장 쓰기
          </Link>
        </div>
      )}
    </div>
  );
}
