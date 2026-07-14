"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import Link from "next/link";
import toast from "react-hot-toast";
import { ArrowLeft } from "lucide-react";
import { PageHeader } from "@/components/calm/PageHeader";

export default function NewMedicalRecordPage() {
  const router = useRouter();
  const { data: session } = useSession();
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    recordDate: new Date().toISOString().split("T")[0],
    category: "Other",
    residentId: "",
  });
  const [residents, setResidents] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [loadingResidents, setLoadingResidents] = useState(true);

  useEffect(() => {
    const loadResidents = async () => {
      try {
        const res = await fetch("/api/residents");
        const data = await res.json();
        if (res.ok && Array.isArray(data)) setResidents(data);
      } catch {
        /* ignore */
      } finally {
        setLoadingResidents(false);
      }
    };
    if (session) loadResidents();
  }, [session]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim() || !formData.residentId) {
      toast.error("제목과 입소자는 필수입니다.");
      return;
    }
    setIsLoading(true);
    try {
      const response = await fetch("/api/medical-records", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: formData.title,
          content: formData.content || null,
          recordDate: formData.recordDate,
          category: formData.category,
          residentId: formData.residentId,
        }),
      });
      const data = await response.json();
      if (response.ok) {
        toast.success("의료 기록이 작성되었습니다!");
        router.push("/medical");
        router.refresh();
      } else {
        toast.error(data.error || "의료 기록 작성에 실패했습니다.");
      }
    } catch {
      toast.error("의료 기록 작성 중 오류가 발생했습니다.");
    } finally {
      setIsLoading(false);
    }
  };

  if (!session) return null;

  return (
    <div className="mx-auto max-w-xl">
      <Link
        href="/medical"
        className="mb-6 inline-flex min-h-[48px] items-center gap-2 text-sm font-medium text-[var(--sn-ink-muted)]"
      >
        <ArrowLeft className="h-4 w-4" />
        건강
      </Link>

      <PageHeader title="건강 기록" description="쉬운 말로 남기는 건강 메모" />

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="label">입소자 *</label>
          {loadingResidents ? (
            <p className="text-[var(--sn-ink-muted)]">불러오는 중…</p>
          ) : (
            <select
              value={formData.residentId}
              onChange={(e) =>
                setFormData({ ...formData, residentId: e.target.value })
              }
              required
              className="input"
            >
              <option value="">선택하세요</option>
              {residents.map((resident) => (
                <option key={resident.id} value={resident.id}>
                  {resident.name}
                  {resident.roomNumber ? ` (${resident.roomNumber})` : ""}
                </option>
              ))}
            </select>
          )}
        </div>
        <div>
          <label className="label">기록 날짜 *</label>
          <input
            type="date"
            value={formData.recordDate}
            onChange={(e) =>
              setFormData({ ...formData, recordDate: e.target.value })
            }
            required
            className="input"
          />
        </div>
        <div>
          <label className="label">종류</label>
          <select
            value={formData.category}
            onChange={(e) =>
              setFormData({ ...formData, category: e.target.value })
            }
            className="input"
          >
            <option value="Treatment">진료</option>
            <option value="Medication">약물</option>
            <option value="Exam">검사</option>
            <option value="Symptom">증상</option>
            <option value="Other">기타</option>
          </select>
        </div>
        <div>
          <label className="label">제목 *</label>
          <input
            type="text"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            required
            className="input"
            placeholder="한 줄로 요약"
          />
        </div>
        <div>
          <label className="label">내용 (쉬운 말)</label>
          <textarea
            value={formData.content}
            onChange={(e) =>
              setFormData({ ...formData, content: e.target.value })
            }
            rows={8}
            className="input resize-none"
            placeholder="보호자가 이해하기 쉬운 말로 적어 주세요"
          />
        </div>
        <div className="flex gap-3 pt-2">
          <Link href="/medical" className="btn-secondary flex-1 text-center">
            취소
          </Link>
          <button type="submit" disabled={isLoading} className="btn-primary flex-1">
            {isLoading ? "작성 중…" : "저장"}
          </button>
        </div>
      </form>
    </div>
  );
}
