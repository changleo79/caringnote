"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import Logo from "@/components/brand/Logo";

export default function FacilityHomepage() {
  const params = useParams();
  const slug = params.slug as string;
  const [data, setData] = useState<any>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch(`/api/homepage/${slug}`)
      .then(async (r) => {
        const d = await r.json();
        if (!r.ok) throw new Error(d.error);
        setData(d);
      })
      .catch((e) => setError(e.message));
  }, [slug]);

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center p-6 text-[var(--sn-ink-muted)]">
        {error}
      </div>
    );
  }
  if (!data) {
    return (
      <div className="flex min-h-screen items-center justify-center text-[var(--sn-ink-muted)]">
        불러오는 중…
      </div>
    );
  }

  const { center, announcements, albums } = data;

  return (
    <div className="min-h-screen bg-[var(--sn-bg)]">
      <header className="px-4 pb-12 pt-8 sm:px-6">
        <div className="mx-auto max-w-3xl">
          <Logo />
          <h1 className="mt-10 font-display text-4xl font-semibold tracking-tight text-[var(--sn-ink)] sm:text-5xl">
            {center.name}
          </h1>
          {center.description && (
            <p className="mt-4 max-w-xl text-lg text-[var(--sn-ink-muted)]">
              {center.description}
            </p>
          )}
          <p className="mt-4 text-sm text-[var(--sn-ink-faint)]">
            {[center.address, center.phone].filter(Boolean).join(" · ")}
          </p>
        </div>
      </header>

      <main className="mx-auto max-w-3xl space-y-14 px-4 pb-16 sm:px-6">
        <section>
          <h2 className="mb-6 text-xl font-semibold text-[var(--sn-ink)]">공지</h2>
          {announcements.length === 0 ? (
            <p className="text-[var(--sn-ink-faint)]">등록된 공지가 없습니다.</p>
          ) : (
            <ul className="divide-y divide-[var(--sn-line)]">
              {announcements.map((a: any) => (
                <li key={a.id} className="py-5 first:pt-0">
                  <p className="font-semibold text-[var(--sn-ink)]">{a.title}</p>
                  <p className="mt-1 line-clamp-3 text-sm text-[var(--sn-ink-muted)]">
                    {a.content}
                  </p>
                </li>
              ))}
            </ul>
          )}
        </section>

        <section>
          <h2 className="mb-6 text-xl font-semibold text-[var(--sn-ink)]">앨범</h2>
          <div className="columns-2 gap-2 sm:columns-3">
            {albums.map((p: any) => {
              let src = "";
              try {
                src = JSON.parse(p.images || "[]")[0] || "";
              } catch {
                /* ignore */
              }
              return (
                <div key={p.id} className="mb-2 break-inside-avoid">
                  {src ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={src} alt="" className="w-full object-cover aspect-[4/5]" />
                  ) : null}
                </div>
              );
            })}
          </div>
        </section>

        <Link href="/auth/signup" className="btn-primary w-full">
          보호자로 연결하기
        </Link>
      </main>
    </div>
  );
}
