"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import Link from "next/link";
import toast from "react-hot-toast";
import { ArrowLeft } from "lucide-react";
import { PageHeader } from "@/components/calm/PageHeader";

export default function EditCareCenterPage() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [formData, setFormData] = useState({
    name: "",
    address: "",
    phone: "",
    email: "",
    description: "",
    logoUrl: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [loadingData, setLoadingData] = useState(true);

  useEffect(() => {
    const loadCareCenter = async () => {
      if (status === "loading") return;

      if (!session || session.user.role !== "CAREGIVER") {
        toast.error("요양원 직원만 접근할 수 있습니다.");
        router.push("/dashboard");
        return;
      }

      const careCenterId = session.user.careCenterId || session.user.id;

      try {
        const res = await fetch(`/api/care-centers/${careCenterId}`);
        const data = await res.json();

        if (res.ok) {
          setFormData({
            name: data.name || "",
            address: data.address || "",
            phone: data.phone || "",
            email: data.email || "",
            description: data.description || "",
            logoUrl: data.logoUrl || "",
          });
        } else {
          setFormData({
            name: "",
            address: "",
            phone: "",
            email: "",
            description: "",
            logoUrl: "",
          });
        }
      } catch {
        toast.error("요양원 정보를 불러오는 중 오류가 발생했습니다.");
      } finally {
        setLoadingData(false);
      }
    };

    loadCareCenter();
  }, [session, status, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    if (!session) {
      toast.error("인증이 필요합니다.");
      setIsLoading(false);
      return;
    }

    const careCenterId = session.user.careCenterId || session.user.id;

    try {
      const response = await fetch(`/api/care-centers/${careCenterId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const data = await response.json();

      if (response.ok) {
        toast.success(
          session.user.careCenterId
            ? "요양원 정보가 수정되었습니다."
            : "요양원 정보가 등록되었습니다."
        );
        router.push("/dashboard");
        router.refresh();
      } else {
        toast.error(data.error || "저장에 실패했습니다.");
      }
    } catch {
      toast.error("저장 중 오류가 발생했습니다.");
    } finally {
      setIsLoading(false);
    }
  };

  if (loadingData || status === "loading") {
    return (
      <div className="mx-auto max-w-xl py-16 text-center text-[var(--sn-ink-muted)]">
        불러오는 중…
      </div>
    );
  }

  if (!session || session.user.role !== "CAREGIVER") return null;

  return (
    <div className="mx-auto max-w-xl">
      <Link
        href="/dashboard"
        className="mb-6 inline-flex min-h-[48px] items-center gap-2 text-sm font-medium text-[var(--sn-ink-muted)]"
      >
        <ArrowLeft className="h-4 w-4" />
        홈
      </Link>

      <PageHeader
        title={session.user.careCenterId ? "시설 정보" : "시설 등록"}
        description="보호자에게 보이는 시설 소개를 정리합니다."
      />

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="label">시설명 *</label>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            required
            className="input"
            placeholder="요양원 이름"
          />
        </div>
        <div>
          <label className="label">주소 *</label>
          <input
            type="text"
            value={formData.address}
            onChange={(e) => setFormData({ ...formData, address: e.target.value })}
            required
            className="input"
            placeholder="주소"
          />
        </div>
        <div>
          <label className="label">전화번호</label>
          <input
            type="tel"
            value={formData.phone}
            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            className="input"
            placeholder="02-1234-5678"
          />
        </div>
        <div>
          <label className="label">이메일</label>
          <input
            type="email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            className="input"
            placeholder="info@example.com"
          />
        </div>
        <div>
          <label className="label">소개</label>
          <textarea
            value={formData.description}
            onChange={(e) =>
              setFormData({ ...formData, description: e.target.value })
            }
            rows={5}
            className="input resize-none"
            placeholder="시설에 대한 짧은 소개"
          />
        </div>
        <div>
          <label className="label">로고 이미지 URL</label>
          <input
            type="url"
            value={formData.logoUrl}
            onChange={(e) => setFormData({ ...formData, logoUrl: e.target.value })}
            className="input"
            placeholder="https://..."
          />
          {formData.logoUrl && (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={formData.logoUrl}
              alt="로고 미리보기"
              className="mt-3 h-24 w-24 object-cover"
              onError={(e) => {
                e.currentTarget.style.display = "none";
              }}
            />
          )}
        </div>

        <div className="flex gap-3 pt-2">
          <Link href="/dashboard" className="btn-secondary flex-1 text-center">
            취소
          </Link>
          <button type="submit" disabled={isLoading} className="btn-primary flex-1">
            {isLoading
              ? "저장 중…"
              : session.user.careCenterId
                ? "저장"
                : "등록"}
          </button>
        </div>
      </form>
    </div>
  );
}
