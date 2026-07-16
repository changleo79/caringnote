"use client";

import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { PageHeader } from "@/components/calm/PageHeader";

export default function CommunicationReportPage() {
  const [month, setMonth] = useState(() => new Date().toISOString().slice(0, 7));
  const [report, setReport] = useState<any>(null);

  const load = () => {
    fetch(`/api/reports/communication?month=${month}`)
      .then((r) => r.json())
      .then((d) => {
        if (d.error) throw new Error(d.error);
        setReport(d);
      })
      .catch((e) => toast.error(e.message || "리포트 오류"));
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [month]);

  const download = () => {
    if (!report) return;
    const blob = new Blob([JSON.stringify(report, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `silvernote-comm-report-${month}.json`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success("리포트를 내려받았습니다.");
  };

  const s = report?.summary;

  return (
    <div className="mx-auto max-w-xl">
      <PageHeader
        title="소통 리포트"
        description="공단평가 ‘가족과의 소통’ 증빙"
      />

      <div className="mb-8">
        <label className="label">월</label>
        <input
          type="month"
          className="input"
          value={month}
          onChange={(e) => setMonth(e.target.value)}
        />
      </div>

      {s && (
        <div className="space-y-6">
          <div>
            <p className="text-lg font-semibold text-[var(--sn-ink)]">
              {report.careCenterName}
            </p>
            {report.note && (
              <p className="mt-1 text-sm text-[var(--sn-ink-muted)]">{report.note}</p>
            )}
          </div>

          <dl className="grid gap-3 sm:grid-cols-2">
            <div className="card p-5">
              <dt className="text-[var(--sn-ink-muted)]">알림장 발송</dt>
              <dd className="mt-3 font-display text-3xl font-semibold text-[var(--sn-ink)]">
                {s.dailyReportsSent}
              </dd>
            </div>
            <div className="card p-5">
              <dt className="text-[var(--sn-ink-muted)]">열람률</dt>
              <dd className="mt-3 font-display text-3xl font-semibold text-[var(--sn-accent)]">
                {s.readRate}%
              </dd>
              <div className="mt-4 h-1.5 overflow-hidden rounded-full bg-[var(--sn-surface-muted)]">
                <div className="h-full rounded-full bg-[var(--sn-accent)]" style={{ width: `${Math.min(100, s.readRate)}%` }} />
              </div>
            </div>
            <div className="card p-5">
              <dt className="text-[var(--sn-ink-muted)]">어르신 커버리지</dt>
              <dd className="mt-3 font-display text-3xl font-semibold text-[var(--sn-ink)]">
                {s.coverageRate}%
              </dd>
              <div className="mt-4 h-1.5 overflow-hidden rounded-full bg-[var(--sn-surface-muted)]">
                <div className="h-full rounded-full bg-[var(--sn-good)]" style={{ width: `${Math.min(100, s.coverageRate)}%` }} />
              </div>
            </div>
            <div className="card p-5">
              <dt className="text-[var(--sn-ink-muted)]">공지 / 식단 / 앨범</dt>
              <dd className="mt-3 text-2xl font-semibold text-[var(--sn-ink)]">
                {s.announcements} / {s.menuDays} / {s.albumPosts}
              </dd>
            </div>
          </dl>

          <button className="btn-primary w-full" onClick={download}>
            리포트 다운로드
          </button>
        </div>
      )}
    </div>
  );
}
