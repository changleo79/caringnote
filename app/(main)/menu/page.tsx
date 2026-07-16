"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import toast from "react-hot-toast";
import { PageHeader } from "@/components/calm/PageHeader";

export default function MenuPage() {
  const { data: session } = useSession();
  const isStaff = session?.user?.role === "CAREGIVER" || session?.user?.role === "ADMIN";
  const [date, setDate] = useState(() => new Date().toISOString().slice(0, 10));
  const [form, setForm] = useState({ breakfast: "", lunch: "", dinner: "", snack: "" });
  const [loading, setLoading] = useState(true);

  const load = () => {
    setLoading(true);
    fetch(`/api/menu-plans?date=${date}`)
      .then((r) => r.json())
      .then((d) => {
        if (d && d.id) {
          setForm({
            breakfast: d.breakfast || "",
            lunch: d.lunch || "",
            dinner: d.dinner || "",
            snack: d.snack || "",
          });
        } else {
          setForm({ breakfast: "", lunch: "", dinner: "", snack: "" });
        }
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [date]);

  const save = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await fetch("/api/menu-plans", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ date, ...form }),
    });
    if (res.ok) toast.success("식단이 저장되었습니다.");
    else toast.error("저장 실패");
  };

  const labels = {
    breakfast: "아침",
    lunch: "점심",
    dinner: "저녁",
    snack: "간식",
  } as const;
  const weekDays = Array.from({ length: 7 }, (_, index) => {
    const current = new Date();
    const day = current.getDay();
    current.setDate(current.getDate() - day + index);
    return {
      value: current.toISOString().slice(0, 10),
      weekday: new Intl.DateTimeFormat("ko-KR", { weekday: "short" }).format(current),
      day: current.getDate(),
    };
  });

  return (
    <div className="mx-auto max-w-xl">
      <PageHeader title="식단" description="오늘의 식사를 공유합니다." />

      <div className="mb-8">
        <div className="grid grid-cols-7 gap-1 rounded-[var(--sn-radius-lg)] bg-[var(--sn-surface)] p-2 shadow-[var(--sn-shadow-1)]">
          {weekDays.map((day) => (
            <button
              key={day.value}
              type="button"
              onClick={() => setDate(day.value)}
              className={`flex min-h-[56px] flex-col items-center justify-center rounded-[var(--sn-radius-sm)] text-sm ${
                date === day.value
                  ? "bg-[var(--sn-accent)] font-semibold text-white"
                  : "text-[var(--sn-ink-muted)]"
              }`}
            >
              <span className="text-xs">{day.weekday}</span>
              <span className="mt-1">{day.day}</span>
            </button>
          ))}
        </div>
        <input
          type="date"
          className="input mt-3"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          aria-label="다른 날짜 선택"
        />
      </div>

      {loading ? (
        <div className="h-40 animate-pulse rounded-[var(--sn-radius-md)] bg-[var(--sn-surface-muted)]" />
      ) : (
        <form onSubmit={save} className="grid gap-5 sm:grid-cols-2">
          {(Object.keys(labels) as Array<keyof typeof labels>).map((key) => (
            <div key={key}>
              <label className="label">{labels[key]}</label>
              <input
                className="input"
                value={form[key]}
                disabled={!isStaff}
                onChange={(e) => setForm((f) => ({ ...f, [key]: e.target.value }))}
                placeholder={isStaff ? `${labels[key]} 메뉴` : "아직 등록되지 않았습니다"}
              />
            </div>
          ))}
          {isStaff && (
            <button type="submit" className="btn-primary w-full sm:col-span-2">
              저장
            </button>
          )}
        </form>
      )}
    </div>
  );
}
