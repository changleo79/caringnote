import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { redirect } from "next/navigation"
import { prisma } from "@/lib/prisma"
import Link from "next/link"
import Image from "next/image"
import {
  ArrowRight,
  CalendarDays,
  Check,
  Heart,
  NotebookPen,
  Package,
  RefreshCw,
  Users,
} from "lucide-react"
import { StatusChip } from "@/components/calm/StatusChip"

export default async function DashboardPage({
  searchParams,
}: {
  searchParams?: { resident?: string }
}) {
  const session = await getServerSession(authOptions)
  if (!session) redirect("/auth/login")

  const isStaff = session.user.role === "CAREGIVER" || session.user.role === "ADMIN"

  if (isStaff) {
    const careCenterId = session.user.careCenterId
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    const tomorrow = new Date(today)
    tomorrow.setDate(tomorrow.getDate() + 1)

    let residents: {
      id: string
      name: string
      roomNumber: string | null
      photoUrl: string | null
    }[] = []
    let missing: typeof residents = []
    let pendingFamilies = 0
    let activeMedications = 0
    let latestHandover: { content: string; shift: string | null; createdAt: Date } | null = null

    if (careCenterId) {
      const [residentRows, written, familyCount, medicationCount, handover] =
        await Promise.all([
          prisma.resident.findMany({
            where: { careCenterId },
            select: { id: true, name: true, roomNumber: true, photoUrl: true },
            orderBy: [{ roomNumber: "asc" }, { name: "asc" }],
          }),
          prisma.dailyReport.findMany({
            where: {
              careCenterId,
              isDraft: false,
              publishedAt: { gte: today, lt: tomorrow },
            },
            select: { residentId: true },
          }),
          prisma.residentFamily.count({
            where: {
              isApproved: false,
              resident: { careCenterId },
            },
          }),
          prisma.medicationSchedule.count({
            where: {
              active: true,
              resident: { careCenterId },
            },
          }),
          prisma.handoverNote.findFirst({
            where: { careCenterId },
            select: { content: true, shift: true, createdAt: true },
            orderBy: { createdAt: "desc" },
          }),
        ])

      residents = residentRows
      const writtenIds = new Set(written.map((item) => item.residentId))
      missing = residents.filter((resident) => !writtenIds.has(resident.id))
      pendingFamilies = familyCount
      activeMedications = medicationCount
      latestHandover = handover
    }

    const dateLabel = new Intl.DateTimeFormat("ko-KR", {
      month: "long",
      day: "numeric",
      weekday: "long",
    }).format(new Date())

    return (
      <div className="mx-auto max-w-4xl">
        <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
          <div>
            <p className="text-sm font-semibold text-[var(--sn-accent)]">{dateLabel}</p>
            <h1 className="mt-2 font-display text-4xl font-semibold tracking-[-0.04em]">
              안녕하세요, {session.user.name}님
            </h1>
            <p className="mt-2 text-[var(--sn-ink-muted)]">
              오늘 처리할 일을 우선순위대로 모았습니다.
            </p>
          </div>
          <Link href="/reports/write" className="btn-primary min-h-[56px] shrink-0">
            <NotebookPen className="h-5 w-5" />
            알림장 쓰기
          </Link>
        </div>

        <section className="mt-10 grid gap-3 sm:grid-cols-3">
          <Link href="/reports/write" className="card-interactive p-5">
            <p className="text-sm font-medium text-[var(--sn-ink-muted)]">오늘 미작성</p>
            <p className="mt-3 font-display text-4xl font-semibold tabular-nums">
              {missing.length}
            </p>
            <p className="mt-4 flex items-center gap-1 text-sm font-semibold text-[var(--sn-accent)]">
              이어서 작성 <ArrowRight className="h-4 w-4" />
            </p>
          </Link>
          <Link href="/residents/family-requests" className="card-interactive p-5">
            <p className="text-sm font-medium text-[var(--sn-ink-muted)]">가족 승인 대기</p>
            <p className="mt-3 font-display text-4xl font-semibold tabular-nums">
              {pendingFamilies}
            </p>
            <p className="mt-4 flex items-center gap-1 text-sm font-semibold text-[var(--sn-accent)]">
              요청 확인 <Users className="h-4 w-4" />
            </p>
          </Link>
          <Link href="/care-ops" className="card-interactive p-5">
            <p className="text-sm font-medium text-[var(--sn-ink-muted)]">활성 투약 일정</p>
            <p className="mt-3 font-display text-4xl font-semibold tabular-nums">
              {activeMedications}
            </p>
            <p className="mt-4 flex items-center gap-1 text-sm font-semibold text-[var(--sn-accent)]">
              투약 확인 <Heart className="h-4 w-4" />
            </p>
          </Link>
        </section>

        <div className="mt-10 grid gap-8 lg:grid-cols-[1.15fr_.85fr]">
          <section>
            <div className="mb-4 flex items-center justify-between">
              <h2 className="font-display text-xl font-semibold">알림장 미작성</h2>
              <span className="text-sm text-[var(--sn-ink-faint)]">
                전체 {residents.length}명
              </span>
            </div>
            {missing.length === 0 ? (
              <div className="card flex min-h-[180px] flex-col items-center justify-center p-6 text-center">
                <Check className="h-7 w-7 text-[var(--sn-good)]" />
                <p className="mt-3 font-semibold">오늘 알림장을 모두 작성했습니다</p>
                <p className="mt-1 text-sm text-[var(--sn-ink-muted)]">수고하셨어요.</p>
              </div>
            ) : (
              <div className="card px-5">
                {missing.slice(0, 8).map((resident) => (
                  <Link
                    key={resident.id}
                    href={`/reports/write?residentId=${resident.id}`}
                    className="status-row min-h-[64px]"
                  >
                    <span className="flex items-center gap-3">
                      <span className="flex h-10 w-10 items-center justify-center rounded-full bg-[var(--sn-surface-muted)] font-display font-semibold">
                        {resident.name.slice(0, 1)}
                      </span>
                      <span>
                        <span className="block font-semibold">{resident.name}</span>
                        <span className="block text-sm text-[var(--sn-ink-muted)]">
                          {resident.roomNumber || "호실 미등록"}
                        </span>
                      </span>
                    </span>
                    <ArrowRight className="h-4 w-4 text-[var(--sn-ink-faint)]" />
                  </Link>
                ))}
              </div>
            )}
          </section>

          <section>
            <div className="mb-4 flex items-center justify-between">
              <h2 className="font-display text-xl font-semibold">최근 인수인계</h2>
              <Link href="/handover" className="text-sm font-semibold text-[var(--sn-accent)]">
                전체 보기
              </Link>
            </div>
            <div className="card min-h-[180px] p-5">
              {latestHandover ? (
                <>
                  <div className="flex items-center gap-2 text-sm font-semibold text-[var(--sn-accent)]">
                    <RefreshCw className="h-4 w-4" />
                    {latestHandover.shift || "교대 전달"}
                  </div>
                  <p className="mt-4 line-clamp-4 whitespace-pre-wrap leading-relaxed">
                    {latestHandover.content}
                  </p>
                  <p className="mt-4 text-xs text-[var(--sn-ink-faint)]">
                    {latestHandover.createdAt.toLocaleString("ko-KR")}
                  </p>
                </>
              ) : (
                <p className="text-sm text-[var(--sn-ink-muted)]">등록된 인수인계가 없습니다.</p>
              )}
            </div>
          </section>
        </div>
      </div>
    )
  }

  const links = await prisma.residentFamily.findMany({
    where: { userId: session.user.id, isApproved: true },
    include: {
      resident: {
        select: {
          id: true,
          name: true,
          photoUrl: true,
          statusChip: true,
          careCenterId: true,
        },
      },
    },
  })

  const selected =
    links.find((link) => link.resident.id === searchParams?.resident)?.resident ||
    links[0]?.resident

  if (!selected) {
    return (
      <div className="mx-auto max-w-lg py-16 text-center">
        <h1 className="font-display text-2xl font-semibold">
          안녕하세요, {session.user.name}님
        </h1>
        <p className="mt-3 text-[var(--sn-ink-muted)]">아직 연결된 어르신이 없습니다.</p>
        <Link href="/residents/family-requests" className="btn-primary mt-8 inline-flex">
          가족 연결 요청
        </Link>
      </div>
    )
  }

  const latestReport = await prisma.dailyReport.findFirst({
    where: { residentId: selected.id, isDraft: false },
    orderBy: { publishedAt: "desc" },
  })
  let reportImage: string | null = null
  if (latestReport?.images) {
    try {
      reportImage = JSON.parse(latestReport.images)[0] || null
    } catch {
      reportImage = null
    }
  }

  const day = new Date()
  day.setHours(0, 0, 0, 0)
  const todayMenu = await prisma.menuPlan.findUnique({
    where: {
      careCenterId_date: { careCenterId: selected.careCenterId, date: day },
    },
  })
  const photo = reportImage || selected.photoUrl

  return (
    <div className="mx-auto max-w-2xl">
      {links.length > 1 && (
        <nav className="mb-5 flex gap-2 overflow-x-auto pb-1" aria-label="어르신 선택">
          {links.map(({ resident }) => (
            <Link
              key={resident.id}
              href={`/dashboard?resident=${resident.id}`}
              className={
                resident.id === selected.id
                  ? "btn-primary min-h-[44px] shrink-0 px-4 py-2 text-sm"
                  : "btn-secondary min-h-[44px] shrink-0 px-4 py-2 text-sm"
              }
            >
              {resident.name}
            </Link>
          ))}
        </nav>
      )}

      <section className="overflow-hidden rounded-[var(--sn-radius-lg)] bg-[var(--sn-surface)] shadow-[var(--sn-shadow-1)]">
        {photo ? (
          <div className="relative aspect-[4/3] bg-[var(--sn-surface-muted)]">
            <Image
              src={photo}
              alt={`${selected.name} 어르신의 최근 모습`}
              fill
              priority
              unoptimized={photo.startsWith("data:")}
              sizes="(max-width: 768px) 100vw, 672px"
              className="object-cover"
            />
          </div>
        ) : (
          <div className="flex aspect-[4/3] items-center justify-center bg-[var(--sn-accent-soft)]">
            <span className="font-display text-7xl font-semibold text-[var(--sn-accent)]">
              {selected.name.slice(0, 1)}
            </span>
          </div>
        )}

        <div className="p-5 sm:p-7">
          <div className="flex flex-wrap items-center gap-3">
            <h1 className="font-display text-3xl font-semibold tracking-[-0.035em]">
              {selected.name}
            </h1>
            <StatusChip status={selected.statusChip} />
          </div>
          <p className="mt-4 text-lg leading-relaxed">
            {latestReport?.content || "오늘의 소식이 도착하면 이곳에서 가장 먼저 보여 드릴게요."}
          </p>
          {latestReport?.publishedAt && (
            <p className="mt-4 text-sm text-[var(--sn-ink-faint)]">
              {latestReport.publishedAt.toLocaleString("ko-KR")}
            </p>
          )}
        </div>
      </section>

      <section className="mt-8 grid gap-3 sm:grid-cols-2">
        <Link href={`/timeline/${selected.id}`} className="card-interactive p-5">
          <Heart className="h-5 w-5 text-[var(--sn-accent)]" />
          <p className="mt-5 font-semibold">돌봄 타임라인</p>
          <p className="mt-1 text-sm text-[var(--sn-ink-muted)]">오늘의 기록을 시간순으로</p>
        </Link>
        <div className="card p-5">
          <p className="text-sm font-semibold text-[var(--sn-accent)]">오늘 식단</p>
          <p className="mt-5 font-semibold">{todayMenu?.lunch || "아직 등록되지 않았습니다"}</p>
          <p className="mt-1 text-sm text-[var(--sn-ink-muted)]">점심</p>
        </div>
      </section>

      <div className="mt-6 grid grid-cols-2 gap-3">
        <Link href="/visits" className="btn-secondary">
          <CalendarDays className="h-5 w-5" /> 면회
        </Link>
        <Link href="/requests" className="btn-secondary">
          <Package className="h-5 w-5" /> 물품 요청
        </Link>
      </div>
    </div>
  )
}
