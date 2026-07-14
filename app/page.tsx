import Link from "next/link";
import { ArrowRight, NotebookPen, HeartHandshake, ShieldCheck } from "lucide-react";

/**
 * 랜딩 — 첫 뷰포트: 브랜드 + 한 문장 + CTA + 풀블리드 케어 장면
 * 아래 섹션은 역할별 한 가지 메시지씩 (보호사 / 보호자 / 시설장)
 */
export default function HomePage() {
  return (
    <div className="landing min-h-screen bg-[var(--ln-sand)] text-[var(--ln-ink)]">
      {/* 투명 내비 — 브랜드를 헤로에 맡김 */}
      <header className="absolute inset-x-0 top-0 z-20">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-end gap-2 px-4 sm:px-6">
          <Link
            href="/auth/login"
            className="rounded-xl px-4 py-2.5 text-[15px] font-medium text-white/90 transition hover:bg-white/10 hover:text-white"
          >
            로그인
          </Link>
          <Link
            href="/auth/signup"
            className="rounded-xl bg-white px-5 py-2.5 text-[15px] font-semibold text-[var(--ln-teal-deep)] transition hover:bg-[var(--ln-mist)]"
          >
            시작하기
          </Link>
        </div>
      </header>

      {/* HERO — 풀블리드 한 장면 */}
      <section className="relative flex min-h-[100svh] items-end overflow-hidden">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="https://images.unsplash.com/photo-1581579438747-1dc8d17bbce4?auto=format&fit=crop&w=2400&q=80"
          alt="요양원에서 손잡고 대화하는 따뜻한 케어 장면"
          className="absolute inset-0 h-full w-full object-cover object-[center_30%] landing-hero- ken"
        />
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(180deg, rgba(10,40,38,0.25) 0%, rgba(10,40,38,0.15) 35%, rgba(10,40,38,0.72) 78%, rgba(10,40,38,0.92) 100%)",
          }}
        />
        <div className="pointer-events-none absolute inset-0 opacity-40 mix-blend-soft-light landing-grain" />

        <div className="relative z-10 w-full px-4 pb-14 pt-28 sm:px-8 sm:pb-20 md:px-12 lg:px-16">
          <div className="mx-auto max-w-6xl landing-fade-up">
            <p className="font-display text-[clamp(3.25rem,12vw,7.5rem)] font-semibold leading-[0.92] tracking-[-0.04em] text-white">
              실버노트
            </p>
            <h1 className="mt-5 max-w-xl font-display text-[clamp(1.35rem,3.2vw,2rem)] font-medium leading-snug tracking-[-0.02em] text-white/95">
              가족이 부모님의 하루를 믿고 느낄 수 있는 시니어 케어 OS
            </h1>
            <p className="mt-4 max-w-md text-[17px] leading-relaxed text-white/75 sm:text-lg">
              앱 없이도 10초 안심. 보호사는 2분 퀵작성으로 돌봄에 집중합니다.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
              <Link
                href="/auth/signup"
                className="inline-flex min-h-[56px] items-center justify-center gap-2 rounded-2xl bg-[var(--ln-teal)] px-8 text-lg font-semibold text-white transition hover:bg-[var(--ln-teal-deep)] active:scale-[0.99]"
              >
                무료로 시작하기
                <ArrowRight className="h-5 w-5" />
              </Link>
              <Link
                href="/auth/login"
                className="inline-flex min-h-[56px] items-center justify-center rounded-2xl border border-white/35 bg-white/10 px-8 text-lg font-semibold text-white backdrop-blur-sm transition hover:bg-white/18"
              >
                로그인
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 보호자 — 10초 안심 */}
      <section className="relative overflow-hidden px-4 py-20 sm:px-8 sm:py-28">
        <div
          className="absolute inset-0 -z-10"
          style={{
            background:
              "radial-gradient(ellipse 80% 60% at 10% 0%, rgba(15,110,106,0.08), transparent 55%), linear-gradient(180deg, #F3EEE6 0%, #EDE6DB 100%)",
          }}
        />
        <div className="mx-auto grid max-w-6xl items-center gap-12 lg:grid-cols-2 lg:gap-16">
          <div className="landing-fade-up">
            <p className="font-display text-sm font-semibold tracking-wide text-[var(--ln-teal-deep)]">
              보호자
            </p>
            <h2 className="mt-3 font-display text-[clamp(1.75rem,4vw,2.75rem)] font-semibold leading-tight tracking-[-0.03em]">
              오늘 괜찮으신지,
              <br />
              10초면 알 수 있어요
            </h2>
            <p className="mt-4 max-w-md text-lg leading-relaxed text-[var(--ln-ink-muted)]">
              오늘의 사진·상태 칩·한 줄 소식·식단이 한 화면에. 카카오 알림톡과
              매직링크로 앱 설치 없이도 바로 열람합니다.
            </p>
            <ul className="mt-8 space-y-3 text-[17px] text-[var(--ln-ink)]">
              <li className="flex gap-3">
                <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--ln-teal)]" />
                좋음 · 보통 · 주의 상태 신호
              </li>
              <li className="flex gap-3">
                <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--ln-teal)]" />
                하트·감사 한 탭 반응
              </li>
              <li className="flex gap-3">
                <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--ln-teal)]" />
                큰글씨 모드 · Quiet hours
              </li>
            </ul>
          </div>
          <div className="relative landing-soft-rise">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="https://images.unsplash.com/photo-1516734212186-a967f81ad0d7?auto=format&fit=crop&w=1400&q=80"
              alt="가족과 함께하는 평온한 일상"
              className="h-[min(52vh,420px)] w-full object-cover object-center"
            />
            <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-[rgba(10,40,38,0.85)] to-transparent px-6 pb-6 pt-16 text-white">
              <p className="font-display text-2xl font-semibold tracking-tight">어머니 · 좋음</p>
              <p className="mt-1 text-white/80">오늘 산책을 다녀오셨어요</p>
              <p className="mt-3 text-sm text-white/65">중식 · 생선구이, 된장찌개</p>
            </div>
          </div>
        </div>
      </section>

      {/* 보호사 — 2분 퀵작성 */}
      <section className="bg-[var(--ln-ink)] px-4 py-20 text-[var(--ln-sand)] sm:px-8 sm:py-28">
        <div className="mx-auto grid max-w-6xl items-center gap-12 lg:grid-cols-2 lg:gap-16">
          <div className="order-2 lg:order-1">
            <div className="grid grid-cols-3 gap-3">
              {["식사 잘함", "낮잠", "산책"].map((chip, i) => (
                <div
                  key={chip}
                  className="flex min-h-[72px] items-center justify-center rounded-2xl border border-white/15 bg-white/5 text-center text-sm font-medium landing-chip"
                  style={{ animationDelay: `${i * 120}ms` }}
                >
                  {chip}
                </div>
              ))}
            </div>
            <div className="mt-3 flex min-h-[56px] items-center justify-center gap-2 rounded-2xl bg-[var(--ln-teal)] text-base font-semibold text-white">
              <NotebookPen className="h-5 w-5" />
              전송 · 다음 미작성 어르신
            </div>
          </div>
          <div className="order-1 lg:order-2 landing-fade-up">
            <p className="font-display text-sm font-semibold tracking-wide text-[var(--ln-teal-soft)]">
              요양보호사 · Staff Fast
            </p>
            <h2 className="mt-3 font-display text-[clamp(1.75rem,4vw,2.75rem)] font-semibold leading-tight tracking-[-0.03em] text-white">
              돌봄을 끊지 않는
              <br />
              2분 퀵작성
            </h2>
            <p className="mt-4 max-w-md text-lg leading-relaxed text-white/65">
              사진 → 상태 칩 → 전송. 장갑 모드 큰 타깃, 오늘 미작성 체크리스트,
              태블릿 FAB으로 기록은 돌봄의 부산물이 됩니다.
            </p>
          </div>
        </div>
      </section>

      {/* 시설장 — 신뢰 */}
      <section className="px-4 py-20 sm:px-8 sm:py-28">
        <div className="mx-auto max-w-6xl">
          <div className="max-w-2xl landing-fade-up">
            <p className="font-display text-sm font-semibold tracking-wide text-[var(--ln-teal-deep)]">
              시설장 · 복지사
            </p>
            <h2 className="mt-3 font-display text-[clamp(1.75rem,4vw,2.75rem)] font-semibold leading-tight tracking-[-0.03em]">
              열람 · 증빙 · 비상연락이
              <br />
              한곳에
            </h2>
            <p className="mt-4 text-lg leading-relaxed text-[var(--ln-ink-muted)]">
              월간 소통 리포트로 공단평가 ‘수급자 가족과의 소통’을 준비하고,
              교대 인수인계와 케어플랜·투약까지 요양원 Ops로 이어집니다.
            </p>
          </div>

          <div className="mt-14 grid gap-10 md:grid-cols-3">
            {[
              {
                icon: HeartHandshake,
                title: "Care Timeline",
                desc: "알림장·식단·투약·사진을 어르신 한 분의 시계열로 모읍니다.",
              },
              {
                icon: ShieldCheck,
                title: "Trust Layer",
                desc: "열람 확인과 소통 리포트로 신뢰를 남기고, 감시 느낌은 덜어냅니다.",
              },
              {
                icon: NotebookPen,
                title: "실버케어 Ops",
                desc: "무거운 ERP 대신 입소 케어·면회·물품 요청에 먼저 맞춥니다.",
              },
            ].map(({ icon: Icon, title, desc }) => (
              <div key={title} className="border-t border-[var(--ln-line)] pt-6">
                <Icon className="h-6 w-6 text-[var(--ln-teal)]" strokeWidth={1.75} />
                <h3 className="mt-4 font-display text-xl font-semibold tracking-tight">{title}</h3>
                <p className="mt-2 text-[16px] leading-relaxed text-[var(--ln-ink-muted)]">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 닫는 CTA */}
      <section className="relative overflow-hidden px-4 py-24 sm:px-8">
        <div
          className="absolute inset-0 -z-10"
          style={{
            background:
              "linear-gradient(135deg, #0F6E6A 0%, #0A3D3A 55%, #163A36 100%)",
          }}
        />
        <div className="pointer-events-none absolute -right-20 top-0 h-72 w-72 rounded-full bg-white/5 blur-3xl" />
        <div className="mx-auto max-w-3xl text-center text-white landing-fade-up">
          <p className="font-display text-[clamp(2rem,6vw,3.5rem)] font-semibold tracking-[-0.03em]">
            기록이 돌봄을 방해하지 않게
          </p>
          <p className="mx-auto mt-4 max-w-lg text-lg text-white/75">
            시설은 부담을 줄이고, 보호자는 따뜻하게 연결됩니다. 지금 실버노트를
            열어보세요.
          </p>
          <Link
            href="/auth/signup"
            className="mt-8 inline-flex min-h-[56px] items-center justify-center gap-2 rounded-2xl bg-white px-8 text-lg font-semibold text-[var(--ln-teal-deep)] transition hover:bg-[var(--ln-mist)]"
          >
            시설 · 가족 시작하기
            <ArrowRight className="h-5 w-5" />
          </Link>
        </div>
      </section>

      <footer className="border-t border-[var(--ln-line)] bg-[var(--ln-sand)] px-4 py-10 sm:px-8">
        <div className="mx-auto flex max-w-6xl flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <p className="font-display text-xl font-semibold tracking-tight">실버노트</p>
            <p className="text-sm text-[var(--ln-ink-muted)]">Silver Note · Senior Care OS</p>
          </div>
          <p className="text-sm text-[var(--ln-ink-muted)]">
            © {new Date().getFullYear()} Silver Note
          </p>
        </div>
      </footer>
    </div>
  );
}
