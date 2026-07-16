import Link from "next/link"
import { ArrowRight, CalendarDays, Check, Heart, ImagePlus, Send } from "lucide-react"
import Logo from "@/components/brand/Logo"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-[var(--sn-bg)] text-[var(--sn-ink)]">
      <header className="border-b border-[var(--sn-line)] bg-[var(--sn-bg)]">
        <div className="section-container flex h-20 items-center justify-between">
          <Logo size="sm" />
          <nav className="flex items-center gap-2" aria-label="계정">
            <Link
              href="/auth/login"
              className="inline-flex min-h-[44px] items-center px-4 text-sm font-semibold text-[var(--sn-ink-muted)]"
            >
              로그인
            </Link>
            <Link
              href="/auth/signup"
              className="inline-flex min-h-[44px] items-center rounded-[var(--sn-radius)] bg-[var(--sn-ink)] px-5 text-sm font-semibold text-white"
            >
              시작하기
            </Link>
          </nav>
        </div>
      </header>

      <main>
        <section className="overflow-hidden">
          <div className="section-container grid min-h-[calc(100svh-5rem)] items-center gap-14 py-16 lg:grid-cols-[.95fr_1.05fr] lg:py-24">
            <div className="max-w-xl">
              <p className="mb-5 text-sm font-semibold tracking-[0.1em] text-[var(--sn-accent)]">
                돌봄의 하루를 가장 명확하게
              </p>
              <h1 className="font-display text-[clamp(2.8rem,6vw,5.25rem)] font-semibold leading-[1.05] tracking-[-0.05em]">
                부모님의 오늘이
                <br />
                안심으로 이어집니다
              </h1>
              <p className="mt-6 max-w-lg text-lg leading-relaxed text-[var(--sn-ink-muted)] sm:text-xl">
                시설의 돌봄 기록을 가족이 이해하기 쉬운 사진과 말로 전하는 시니어 케어 커뮤니케이션.
              </p>
              <div className="mt-9 flex flex-wrap gap-3">
                <Link href="/auth/signup" className="btn-primary min-h-[54px] px-7">
                  무료로 시작하기
                  <ArrowRight className="h-4 w-4" />
                </Link>
                <a href="#how" className="btn-secondary min-h-[54px] px-7">
                  제품 둘러보기
                </a>
              </div>
              <div className="mt-10 flex flex-wrap gap-x-7 gap-y-2 text-sm text-[var(--sn-ink-faint)]">
                <span>앱 설치 없이 열람</span>
                <span>2분 퀵작성</span>
                <span>큰글씨 지원</span>
              </div>
            </div>

            <div className="relative mx-auto w-full max-w-[38rem]">
              <div className="absolute -inset-12 rounded-full bg-[var(--sn-accent-soft)] blur-3xl" />
              <div className="relative overflow-hidden rounded-[1.75rem] border border-[var(--sn-line)] bg-[var(--sn-surface)] shadow-[0_30px_80px_rgba(23,32,30,.13)]">
                <div className="flex items-center justify-between border-b border-[var(--sn-line)] px-6 py-5">
                  <div>
                    <p className="text-xs font-semibold text-[var(--sn-accent)]">오늘의 소식</p>
                    <p className="mt-1 font-display text-xl font-semibold">김영자 어르신</p>
                  </div>
                  <span className="chip-good">편안함</span>
                </div>
                <div className="grid min-h-[17rem] place-items-center bg-[linear-gradient(145deg,#dfeee9,#f4f1e8)] p-8 text-center">
                  <div>
                    <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-white/70 font-display text-3xl font-semibold text-[var(--sn-accent)]">
                      김
                    </div>
                    <p className="mt-5 text-sm font-medium text-[var(--sn-ink-muted)]">
                      실제 사진이 도착하면 이곳에 표시됩니다
                    </p>
                  </div>
                </div>
                <div className="p-6">
                  <p className="font-display text-2xl font-semibold tracking-[-0.025em]">
                    정원에서 산책을 다녀오셨어요
                  </p>
                  <p className="mt-3 leading-relaxed text-[var(--sn-ink-muted)]">
                    점심을 잘 드시고 오후에는 햇볕을 쬐며 천천히 걸으셨습니다.
                  </p>
                  <div className="mt-6 flex items-center justify-between border-t border-[var(--sn-line)] pt-5">
                    <span className="text-sm text-[var(--sn-ink-faint)]">오늘 오후 4:20</span>
                    <span className="flex items-center gap-2 text-sm font-semibold text-[var(--sn-accent)]">
                      <CalendarDays className="h-4 w-4" />
                      타임라인
                    </span>
                  </div>
                </div>
              </div>
              <div className="absolute -bottom-6 -left-4 hidden rounded-[var(--sn-radius-lg)] border border-[var(--sn-line)] bg-white px-5 py-4 shadow-[var(--sn-shadow-2)] sm:block">
                <p className="text-xs text-[var(--sn-ink-faint)]">보호자 확인</p>
                <p className="mt-1 font-semibold">방금 읽었어요</p>
              </div>
            </div>
          </div>
        </section>

        <section id="how" className="section-container py-24 sm:py-32">
          <div className="grid gap-14 lg:grid-cols-[.8fr_1.2fr] lg:items-end">
            <div>
              <p className="text-sm font-semibold text-[var(--sn-accent)]">보호자에게</p>
              <h2 className="mt-4 max-w-md font-display text-4xl font-semibold leading-tight tracking-[-0.035em] sm:text-5xl">
                숫자보다 먼저,
                <br />
                오늘의 한 장면
              </h2>
              <p className="mt-6 max-w-md text-lg leading-relaxed text-[var(--sn-ink-muted)]">
                사진, 쉬운 상태, 짧은 설명. 보호자가 가장 궁금한 것부터 보여줍니다.
              </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-[1.15fr_.85fr]">
              <div className="flex aspect-[4/5] flex-col justify-between rounded-[var(--sn-radius-lg)] bg-[var(--sn-accent)] p-7 text-white sm:p-9">
                <div className="flex items-center justify-between text-sm text-white/70">
                  <span>오늘의 소식</span>
                  <span>오후 4:20</span>
                </div>
                <div>
                  <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-white/14 font-display text-2xl font-semibold">
                    김
                  </div>
                  <p className="font-display text-3xl font-semibold leading-tight tracking-[-0.03em]">
                    김영자 어르신의
                    <br />
                    평온한 오후
                  </p>
                  <p className="mt-4 max-w-xs leading-relaxed text-white/76">
                    사진이 없어도 상태와 쉬운 설명이 먼저 전해집니다.
                  </p>
                </div>
              </div>
              <div className="flex flex-col justify-between rounded-[var(--sn-radius-lg)] bg-[var(--sn-surface)] p-6 shadow-[var(--sn-shadow-1)]">
                <div>
                  <span className="chip-good">편안함</span>
                  <p className="mt-5 font-display text-2xl font-semibold tracking-[-0.025em]">
                    오늘 산책을
                    <br />
                    다녀오셨어요
                  </p>
                  <p className="mt-3 text-sm leading-relaxed text-[var(--sn-ink-muted)]">
                    점심도 잘 드시고 오후에는 정원에서 천천히 걸으셨습니다.
                  </p>
                </div>
                <p className="mt-10 text-xs text-[var(--sn-ink-faint)]">오늘 오후 4:20 · 이은지 요양보호사</p>
              </div>
            </div>
          </div>
        </section>

        <section className="bg-[var(--sn-ink)] text-white">
          <div className="section-container grid gap-16 py-24 sm:py-32 lg:grid-cols-2 lg:items-center">
            <div>
              <p className="text-sm font-semibold text-[var(--sn-accent-mist)]">요양보호사에게</p>
              <h2 className="mt-4 max-w-lg font-display text-4xl font-semibold leading-tight tracking-[-0.035em] sm:text-5xl">
                돌봄을 멈추지 않는
                <br />
                2분 기록
              </h2>
              <p className="mt-6 max-w-md text-lg leading-relaxed text-white/64">
                어르신 선택, 사진과 상태, 확인. 현장에서 필요한 세 단계만 남겼습니다.
              </p>
            </div>

            <div className="rounded-[var(--sn-radius-lg)] bg-white p-4 text-[var(--sn-ink)] shadow-2xl sm:p-6">
              <div className="flex items-center justify-between border-b border-[var(--sn-line)] pb-4">
                <div>
                  <p className="text-xs font-semibold text-[var(--sn-accent)]">2 / 3</p>
                  <p className="mt-1 font-display text-xl font-semibold">김영자 어르신</p>
                </div>
                <span className="chip-ok">작성 중</span>
              </div>
              <div className="grid grid-cols-3 gap-2 py-5">
                {[
                  { icon: ImagePlus, label: "사진" },
                  { icon: Heart, label: "편안함" },
                  { icon: Check, label: "식사 잘함" },
                ].map(({ icon: Icon, label }, index) => (
                  <div
                    key={label}
                    className={`flex min-h-[88px] flex-col items-center justify-center gap-2 rounded-[var(--sn-radius)] ${
                      index === 0 ? "bg-[var(--sn-surface-muted)]" : "bg-[var(--sn-accent-soft)]"
                    }`}
                  >
                    <Icon className="h-5 w-5 text-[var(--sn-accent)]" />
                    <span className="text-sm font-semibold">{label}</span>
                  </div>
                ))}
              </div>
              <div className="flex min-h-[52px] items-center justify-center gap-2 rounded-[var(--sn-radius)] bg-[var(--sn-accent)] font-semibold text-white">
                <Send className="h-4 w-4" />
                가족에게 전송
              </div>
            </div>
          </div>
        </section>

        <section className="section-container py-24 sm:py-32">
          <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
            <div className="grid gap-3 sm:grid-cols-2">
              {[
                ["01", "알림장 작성", "사진과 상태를 2분 안에"],
                ["02", "가족 열람", "앱 없이도 바로 확인"],
                ["03", "반응과 소통", "마음과 감사를 가볍게"],
                ["04", "소통 리포트", "기록은 자동으로 증빙"],
              ].map(([number, title, description]) => (
                <div key={number} className="card min-h-[176px] p-5">
                  <p className="text-sm font-semibold text-[var(--sn-accent)]">{number}</p>
                  <p className="mt-8 font-display text-xl font-semibold">{title}</p>
                  <p className="mt-2 text-sm text-[var(--sn-ink-muted)]">{description}</p>
                </div>
              ))}
            </div>
            <div className="lg:pl-12">
              <p className="text-sm font-semibold text-[var(--sn-accent)]">시설에게</p>
              <h2 className="mt-4 font-display text-4xl font-semibold leading-tight tracking-[-0.035em] sm:text-5xl">
                기록은 가볍게,
                <br />
                신뢰는 오래
              </h2>
              <p className="mt-6 max-w-md text-lg leading-relaxed text-[var(--sn-ink-muted)]">
                열람 현황, 보호자 소통, 인수인계 기록이 하나의 흐름으로 남습니다.
              </p>
              <Link href="/auth/signup" className="btn-primary mt-8">
                시설 시작하기
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </section>

        <section className="border-y border-[var(--sn-line)] bg-[var(--sn-surface)]">
          <div className="section-container flex flex-col items-start justify-between gap-8 py-16 sm:flex-row sm:items-center">
            <div>
              <h2 className="font-display text-3xl font-semibold tracking-[-0.03em]">
                오늘부터 더 가까운 돌봄
              </h2>
              <p className="mt-2 text-[var(--sn-ink-muted)]">시설과 가족 모두 무료로 시작할 수 있습니다.</p>
            </div>
            <Link href="/auth/signup" className="btn-primary shrink-0">
              실버노트 시작하기
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </section>
      </main>

      <footer className="section-container flex flex-col justify-between gap-5 py-10 sm:flex-row sm:items-center">
        <Logo size="sm" />
        <p className="text-sm text-[var(--sn-ink-faint)]">
          © {new Date().getFullYear()} Silver Note
        </p>
      </footer>
    </div>
  )
}
