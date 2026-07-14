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

  return (
    <div className="mx-auto max-w-xl">
      <PageHeader title="식단" description="오늘의 식사를 공유합니다." />

      <div className="mb-8">
        <label className="label">날짜</label>
        <input
          type="date"
          className="input"
          value={date}
          onChange={(e) => setDate(e.target.value)}
        />
      </div>

      {loading ? (
        <div className="h-40 animate-pulse rounded-[var(--sn-radius-md)] bg-[var(--sn-surface-muted)]" />
      ) : (
        <form onSubmit={save} className="space-y-5">
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
            <button type="submit" className="btn-primary w-full">
              저장
            </button>
          )}
        </form>
      )}
    </div>
  );
}
