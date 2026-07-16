"use client";

import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { PageHeader } from "@/components/calm/PageHeader";

export default function ProfilePage() {
  const [fontScale, setFontScale] = useState(1);
  const [staffMode, setStaffMode] = useState(false);
  const [phone, setPhone] = useState("");
  const [pin, setPin] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [careCenterName, setCareCenterName] = useState("");
  const [role, setRole] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/profile")
      .then((r) => r.json())
      .then((d) => {
        if (d?.id) {
          setFontScale(d.fontScale || 1);
          setStaffMode(Boolean(d.staffMode));
          setPhone(d.phone || "");
          setName(d.name || "");
          setEmail(d.email || "");
          setCareCenterName(d.careCenter?.name || "");
          setRole(d.role || "");
          document.documentElement.classList.remove("font-scale-2", "font-scale-3");
          if (d.fontScale === 2) document.documentElement.classList.add("font-scale-2");
          if (d.fontScale === 3) document.documentElement.classList.add("font-scale-3");
        }
      })
      .finally(() => setLoading(false));
  }, []);

  const save = async () => {
    const res = await fetch("/api/profile", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        fontScale,
        staffMode,
        phone,
        ...(pin.length >= 4 ? { pin } : {}),
      }),
    });
    if (!res.ok) {
      toast.error("저장에 실패했습니다.");
      return;
    }
    document.documentElement.classList.remove("font-scale-2", "font-scale-3");
    if (fontScale === 2) document.documentElement.classList.add("font-scale-2");
    if (fontScale === 3) document.documentElement.classList.add("font-scale-3");
    toast.success("설정을 저장했습니다.");
    setPin("");
  };

  if (loading) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-[var(--sn-accent)] border-t-transparent" />
      </div>
    );
  }

  const isStaff = role === "CAREGIVER" || role === "ADMIN";

  return (
    <div className="mx-auto max-w-lg">
      <PageHeader
        title="내 설정"
        description={`${name}님의 읽기·작성 환경`}
      />

      <div className="space-y-10">
        <section className="card p-5">
          <p className="font-display text-xl font-semibold">{name}</p>
          <p className="mt-1 text-sm text-[var(--sn-ink-muted)]">{email}</p>
          <div className="mt-4 flex flex-wrap gap-2">
            <span className="badge-neutral">{isStaff ? "시설 직원" : "보호자"}</span>
            {careCenterName && <span className="badge-neutral">{careCenterName}</span>}
          </div>
        </section>

        <section>
          <h2 className="mb-2 text-lg font-semibold text-[var(--sn-ink)]">큰글씨 모드</h2>
          <p className="mb-4 text-sm text-[var(--sn-ink-muted)]">
            보호자·시니어 열람용. 본문 크기를 키웁니다.
          </p>
          <div className="grid grid-cols-3 gap-2">
            {[
              { v: 1, label: "기본" },
              { v: 2, label: "크게" },
              { v: 3, label: "더 크게" },
            ].map((opt) => (
              <button
                key={opt.v}
                type="button"
                onClick={() => setFontScale(opt.v)}
                className={fontScale === opt.v ? "btn-primary" : "btn-secondary"}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </section>

        <section className="border-t border-[var(--sn-line)] pt-8">
          <h2 className="mb-3 text-lg font-semibold text-[var(--sn-ink)]">연락처</h2>
          <label className="label">휴대폰</label>
          <input
            className="input"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="010-0000-0000"
          />
        </section>

        {isStaff && (
          <section className="border-t border-[var(--sn-line)] pt-8">
            <h2 className="mb-3 text-lg font-semibold text-[var(--sn-ink)]">Staff 태블릿</h2>
            <label className="flex min-h-[56px] items-center gap-3">
              <input
                type="checkbox"
                checked={staffMode}
                onChange={(e) => setStaffMode(e.target.checked)}
                className="h-6 w-6"
              />
              <span>공용 태블릿 큰 타깃 모드 선호</span>
            </label>
            <label className="label mt-4">직원 PIN (4자리 이상)</label>
            <input
              className="input"
              type="password"
              inputMode="numeric"
              value={pin}
              onChange={(e) => setPin(e.target.value)}
              placeholder="교대 시 빠른 전환용"
              autoComplete="off"
            />
          </section>
        )}

        <button type="button" onClick={save} className="btn-primary w-full">
          저장
        </button>
      </div>
    </div>
  );
}
