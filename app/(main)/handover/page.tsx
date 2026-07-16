"use client";

import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { PageHeader } from "@/components/calm/PageHeader";
import { EmptyState } from "@/components/calm/EmptyState";

export default function HandoverPage() {
  const [notes, setNotes] = useState<any[]>([]);
  const [content, setContent] = useState("");
  const [shift, setShift] = useState("주간→야간");
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);

  const load = () =>
    fetch("/api/handover")
      .then((r) => r.json())
      .then((d) => setNotes(Array.isArray(d) ? d : []))
      .finally(() => setLoading(false));

  useEffect(() => {
    load();
  }, []);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await fetch("/api/handover", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ content, shift }),
    });
    if (res.ok) {
      toast.success("인수인계가 등록되었습니다.");
      setContent("");
      setShowForm(false);
      load();
    } else toast.error("저장 실패 — 직원만 사용할 수 있습니다.");
  };

  return (
    <div className="mx-auto max-w-xl">
      <PageHeader
        title="교대 인수인계"
        description="먼저 확인하고, 꼭 필요한 내용만 다음 근무자에게 전합니다."
        action={
          <button
            type="button"
            onClick={() => setShowForm((current) => !current)}
            className={showForm ? "btn-secondary" : "btn-primary"}
          >
            {showForm ? "닫기" : "새 인계"}
          </button>
        }
      />

      {showForm && (
      <form
        onSubmit={submit}
        className="mb-10 space-y-4 border-b border-[var(--sn-line)] pb-10"
      >
        <div>
          <label className="label">교대</label>
          <select
            className="input"
            value={shift}
            onChange={(e) => setShift(e.target.value)}
          >
            <option>주간→야간</option>
            <option>야간→주간</option>
            <option>기타</option>
          </select>
        </div>
        <div>
          <label className="label">전달 내용</label>
          <textarea
            className="input min-h-[120px]"
            placeholder="다음 근무자에게 전달할 내용"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            required
          />
        </div>
        <button className="btn-primary w-full" type="submit">
          등록
        </button>
      </form>
      )}

      {loading ? (
        <div className="h-24 animate-pulse rounded-[var(--sn-radius-md)] bg-[var(--sn-surface-muted)]" />
      ) : notes.length === 0 ? (
        <EmptyState title="인수인계 노트가 없습니다" />
      ) : (
        <ul className="divide-y divide-[var(--sn-line)]">
          {notes.map((n) => (
            <li key={n.id} className="py-5 first:pt-0">
              <p className="text-xs font-semibold text-[var(--sn-accent)]">{n.shift}</p>
              <p className="mt-2 whitespace-pre-wrap text-[var(--sn-ink)]">{n.content}</p>
              <p className="mt-2 text-xs text-[var(--sn-ink-faint)]">
                {n.author?.name} · {new Date(n.createdAt).toLocaleString("ko-KR")}
              </p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
