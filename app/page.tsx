import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { PHOTOS } from "@/lib/photos"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-[var(--sn-bg)] text-[var(--sn-ink)]">
      <header className="absolute inset-x-0 top-0 z-20">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-end gap-2 px-4 sm:px-6">
          <Link
            href="/auth/login"
            className="rounded-xl px-4 py-2.5 text-[15px] font-medium text-white/90 hover:bg-white/10"
          >
            로그인
          </Link>
          <Link
            href="/auth/signup"
            className="rounded-xl bg-white px-5 py-2.5 text-[15px] font-semibold text-[var(--sn-accent-hover)]"
          >
            시작하기
          </Link>
        </div>
      </header>

      {/* Hero — brand first, one composition */}
      <section className="relative flex min-h-[100svh] items-end overflow-hidden">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={PHOTOS.hero}
          alt="요양원에서의 따뜻한 돌봄 순간"
          className="absolute inset-0 h-full w-full object-cover object-[center_25%] sn-hero-ken"
        />
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(180deg, rgba(12,32,30,0.15) 0%, rgba(12,32,30,0.2) 40%, rgba(12,32,30,0.78) 100%)",
          }}
        />
        <div className="pointer-events-none absolute inset-0 opacity-30 mix-blend-soft-light landing-grain" />

        <div className="relative z-10 w-full px-5 pb-16 pt-28 sm:px-10 lg:px-16">
          <div className="mx-auto max-w-6xl sn-fade-up">
            <p className="font-display text-[clamp(3.5rem,13vw,8rem)] font-semibold leading-[0.9] tracking-[-0.045em] text-white">
              실버노트
            </p>
            <h1 className="mt-6 max-w-lg font-display text-[clamp(1.25rem,2.8vw,1.85rem)] font-medium leading-snug tracking-[-0.02em] text-white/95">
              가족이 부모님의 하루를 믿고 느낄 수 있는 시니어 케어 OS
            </h1>
            <p className="mt-4 max-w-md text-[17px] leading-relaxed text-white/72">
              앱 없이도 10초 안심. 보호사는 2분 퀵작성으로 돌봄에 집중합니다.
            </p>
            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
              <Link href="/auth/signup" className="btn-primary min-h-[56px] px-8 text-lg">
                무료로 시작하기
                <ArrowRight className="h-5 w-5" />
              </Link>
              <Link
                href="/auth/login"
                className="inline-flex min-h-[56px] items-center justify-center rounded-2xl border border-white/30 bg-white/10 px-8 text-lg font-semibold text-white backdrop-blur-sm"
              >
                로그인
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Family story — one job */}
      <section className="px-5 py-24 sm:px-10">
        <div className="mx-auto grid max-w-6xl items-end gap-12 lg:grid-cols-12">
          <div className="lg:col-span-5 sn-fade-up">
            <p className="text-sm font-semibold tracking-wide text-[var(--sn-accent)]">보호자</p>
            <h2 className="mt-3 font-display text-[clamp(1.85rem,4vw,2.75rem)] font-semibold leading-[1.15] tracking-[-0.03em]">
              오늘 괜찮으신지,
              <br />
              사진 한 장으로
            </h2>
            <p className="mt-4 max-w-sm text-lg leading-relaxed text-[var(--sn-ink-muted)]">
              상태 · 한 줄 소식 · 식단이 한 화면에. 매직링크로 앱 없이 열람합니다.
            </p>
          </div>
          <div className="relative lg:col-span-7 landing-soft-rise">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={PHOTOS.familyStory}
              alt="평온한 돌봄의 하루"
              className="aspect-[4/3] w-full object-cover"
            />
            <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-[rgba(12,32,30,0.88)] via-[rgba(12,32,30,0.4)] to-transparent px-6 pb-6 pt-20 text-white">
              <p className="font-display text-2xl font-semibold tracking-tight">어머니 · 좋음</p>
              <p className="mt-1 text-white/80">오늘 산책을 다녀오셨어요</p>
            </div>
          </div>
        </div>
      </section>

      {/* Staff — gesture */}
      <section className="bg-[var(--sn-ink)] px-5 py-24 text-[var(--sn-bg)] sm:px-10">
        <div className="mx-auto max-w-6xl">
          <p className="text-sm font-semibold tracking-wide text-[var(--sn-accent-mist)]">요양보호사</p>
          <h2 className="mt-3 max-w-xl font-display text-[clamp(1.85rem,4vw,2.75rem)] font-semibold leading-[1.15] tracking-[-0.03em] text-white">
            돌봄을 끊지 않는 2분 퀵작성
          </h2>
          <p className="mt-4 max-w-md text-lg text-white/60">
            사진 → 칩 → 전송. 장갑 모드 큰 타깃으로 기록은 부산물이 됩니다.
          </p>
          <div className="mt-12 grid grid-cols-3 gap-3 sm:max-w-lg">
            {["식사 잘함", "낮잠", "산책"].map((c, i) => (
              <div
                key={c}
                className="flex min-h-[80px] items-center justify-center border border-white/15 bg-white/5 text-center text-sm font-medium landing-chip"
                style={{ animationDelay: `${i * 100}ms` }}
              >
                {c}
              </div>
            ))}
          </div>
          <div className="mt-3 flex min-h-[56px] max-w-lg items-center justify-center bg-[var(--sn-accent)] text-base font-semibold text-white">
            전송
          </div>
        </div>
      </section>

      {/* Trust */}
      <section className="px-5 py-24 sm:px-10">
        <div className="mx-auto max-w-6xl">
          <p className="text-sm font-semibold tracking-wide text-[var(--sn-accent)]">시설</p>
          <h2 className="mt-3 max-w-xl font-display text-[clamp(1.85rem,4vw,2.75rem)] font-semibold leading-[1.15] tracking-[-0.03em]">
            열람과 증빙이 자연스럽게
          </h2>
          <p className="mt-4 max-w-lg text-lg text-[var(--sn-ink-muted)]">
            Care Timeline · 소통 리포트 · 인수인계. 감시가 아니라 신뢰를 남깁니다.
          </p>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={PHOTOS.hands}
            alt="돌봄의 손길"
            className="mt-14 aspect-[21/9] w-full object-cover"
          />
        </div>
      </section>

      {/* Closing CTA — photo band */}
      <section className="relative overflow-hidden px-5 py-28 sm:px-10">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={PHOTOS.garden} alt="" className="absolute inset-0 h-full w-full object-cover" />
        <div className="absolute inset-0 bg-[rgba(12,32,30,0.72)]" />
        <div className="relative mx-auto max-w-2xl text-center text-white sn-fade-up">
          <p className="font-display text-[clamp(2rem,5vw,3.25rem)] font-semibold tracking-[-0.03em]">
            기록이 돌봄을 방해하지 않게
          </p>
          <p className="mx-auto mt-4 max-w-md text-lg text-white/75">
            시설은 부담을 줄이고, 보호자는 따뜻하게 연결됩니다.
          </p>
          <Link
            href="/auth/signup"
            className="mt-8 inline-flex min-h-[56px] items-center justify-center gap-2 rounded-2xl bg-white px-8 text-lg font-semibold text-[var(--sn-accent-hover)]"
          >
            시설 · 가족 시작하기
            <ArrowRight className="h-5 w-5" />
          </Link>
        </div>
      </section>

      <footer className="border-t border-[var(--sn-line)] px-5 py-10 sm:px-10">
        <div className="mx-auto flex max-w-6xl flex-col justify-between gap-3 sm:flex-row sm:items-center">
          <div>
            <p className="font-display text-xl font-semibold">실버노트</p>
            <p className="text-sm text-[var(--sn-ink-muted)]">Silver Note</p>
          </div>
          <p className="text-sm text-[var(--sn-ink-faint)]">
            © {new Date().getFullYear()} Silver Note
          </p>
        </div>
      </footer>
    </div>
  )
}
