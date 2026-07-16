"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import toast from "react-hot-toast";
import { PageHeader } from "@/components/calm/PageHeader";
import { EmptyState } from "@/components/calm/EmptyState";
export default function AnnouncementsPage() {
  const { data: session } = useSession();
  const isStaff = session?.user?.role === "CAREGIVER" || session?.user?.role === "ADMIN";
  const [list, setList] = useState<any[]>([]);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [isUrgent, setIsUrgent] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(true);

  const load = () => {
    setLoading(true);
    fetch("/api/announcements")
      .then((r) => r.json())
      .then((d) => setList(Array.isArray(d) ? d : []))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    load();
  }, []);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await fetch("/api/announcements", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title, content, isUrgent }),
    });
    if (res.ok) {
      toast.success("공지를 올렸습니다.");
      setTitle("");
      setContent("");
      setIsUrgent(false);
      setShowForm(false);
      load();
    } else toast.error("작성 실패");
  };

  return (
    <div className="mx-auto max-w-xl">
      <PageHeader
        title="공지"
        description="시설에서 전하는 소식"
        action={
          isStaff ? (
            <button
              type="button"
              onClick={() => setShowForm((v) => !v)}
              className="btn-secondary"
            >
              {showForm ? "닫기" : "작성"}
            </button>
          ) : undefined
        }
      />

      {showForm && isStaff && (
        <form onSubmit={submit} className="mb-10 space-y-4 border-b border-[var(--sn-line)] pb-10">
          <div>
            <label className="label">제목</label>
            <input
              className="input"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>
          <div>
            <label className="label">내용</label>
            <textarea
              className="input min-h-[120px]"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              required
            />
          </div>
          <label className="flex min-h-[56px] items-center gap-3 text-sm text-[var(--sn-ink-muted)]">
            <input
              type="checkbox"
              checked={isUrgent}
              onChange={(e) => setIsUrgent(e.target.checked)}
              className="h-6 w-6"
            />
            긴급으로 표시
          </label>
          <button type="submit" className="btn-primary w-full">
            공지 올리기
          </button>
        </form>
      )}

      {loading ? (
        <div className="space-y-4">
          {[1, 2].map((i) => (
            <div
              key={i}
              className="h-24 animate-pulse rounded-[var(--sn-radius-md)] bg-[var(--sn-surface-muted)]"
            />
          ))}
        </div>
      ) : list.length === 0 ? (
        <EmptyState title="공지가 없습니다" description="시설 공지가 등록되면 여기에 표시됩니다." />
      ) : (
        <div className="divide-y divide-[var(--sn-line)]">
          {list.map((a) => (
            <article key={a.id} className="py-6 first:pt-0">
              <div className="flex flex-wrap items-center gap-2">
                {a.isUrgent && <span className="chip-caution">긴급</span>}
                <h2 className="text-lg font-semibold text-[var(--sn-ink)]">{a.title}</h2>
              </div>
              <p className="mt-1 text-xs text-[var(--sn-ink-faint)]">
                {new Date(a.createdAt).toLocaleDateString("ko-KR")}
              </p>
              <p className="mt-3 whitespace-pre-wrap leading-relaxed text-[var(--sn-ink-muted)]">
                {a.content}
              </p>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
