import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { redirect } from "next/navigation"
import { prisma } from "@/lib/prisma"
import Link from "next/link"
import { NotebookPen, CalendarDays, Package, Heart } from "lucide-react"
import { StatusChip } from "@/components/calm/StatusChip"
import { PHOTOS } from "@/lib/photos"

export default async function DashboardPage() {
  const session = await getServerSession(authOptions)
  if (!session) redirect("/auth/login")

  const isStaff = session.user.role === "CAREGIVER" || session.user.role === "ADMIN"

  if (isStaff) {
    const careCenterId = session.user.careCenterId
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    const tomorrow = new Date(today)
    tomorrow.setDate(tomorrow.getDate() + 1)

    let residents: { id: string; name: string; roomNumber: string | null; photoUrl: string | null }[] = []
    let missing: typeof residents = []

    if (careCenterId) {
      residents = await prisma.resident.findMany({
        where: { careCenterId },
        select: { id: true, name: true, roomNumber: true, photoUrl: true },
        orderBy: { name: "asc" },
      })
      const written = await prisma.dailyReport.findMany({
        where: {
          careCenterId,
          isDraft: false,
          publishedAt: { gte: today, lt: tomorrow },
        },
        select: { residentId: true },
      })
      const writtenIds = new Set(written.map((w) => w.residentId))
      missing = residents.filter((r) => !writtenIds.has(r.id))
    }

    return (
      <div className="mx-auto max-w-xl px-4 py-8 sm:px-6">
        <p className="text-sm font-semibold tracking-wide text-[var(--sn-accent)]">오늘 돌봄</p>
        <h1 className="mt-2 font-display text-3xl font-semibold tracking-tight">
          {session.user.name}님
        </h1>
        <p className="mt-2 text-[var(--sn-ink-muted)]">기록은 2분이면 됩니다. 돌봄에 집중하세요.</p>

        <div className="mt-8 flex items-baseline justify-between border-b border-[var(--sn-line)] pb-4">
          <p className="text-[var(--sn-ink-muted)]">오늘 미작성</p>
          <p className="font-display text-4xl font-semibold tabular-nums text-[var(--sn-ink)]">
            {missing.length}
          </p>
        </div>

        <Link href="/reports/write" className="btn-primary mt-6 w-full min-h-[56px] text-lg">
          <NotebookPen className="h-6 w-6" />
          알림장 쓰기
        </Link>

        {missing.length > 0 && (
          <ul className="mt-8 space-y-2">
            {missing.map((r) => (
              <li key={r.id}>
                <Link
                  href={`/reports/write?residentId=${r.id}`}
                  className="flex min-h-[56px] items-center justify-between border-b border-[var(--sn-line)] py-3"
                >
                  <span className="font-medium">{r.name}</span>
                  <span className="text-sm text-[var(--sn-ink-faint)]">{r.roomNumber || ""}</span>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>
    )
  }

  // Family Calm — photo story
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

  const primary = links[0]?.resident
  let latestReport: any = null
  let todayMenu: any = null
  let reportImage: string | null = null

  if (primary) {
    latestReport = await prisma.dailyReport.findFirst({
      where: { residentId: primary.id, isDraft: false },
      orderBy: { publishedAt: "desc" },
    })
    if (latestReport?.images) {
      try {
        reportImage = JSON.parse(latestReport.images)[0]
      } catch {
        reportImage = null
      }
    }
    const day = new Date()
    day.setHours(0, 0, 0, 0)
    todayMenu = await prisma.menuPlan.findUnique({
      where: {
        careCenterId_date: { careCenterId: primary.careCenterId, date: day },
      },
    })
  }

  if (!primary) {
    return (
      <div className="mx-auto max-w-lg px-4 py-16 text-center">
        <h1 className="font-display text-2xl font-semibold">안녕하세요, {session.user.name}님</h1>
        <p className="mt-3 text-[var(--sn-ink-muted)]">연결된 어르신이 없습니다.</p>
        <Link href="/residents/family-requests" className="btn-primary mt-8 inline-flex">
          가족 연결 요청
        </Link>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-xl">
      <div className="relative min-h-[58svh] overflow-hidden">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={reportImage || primary.photoUrl || PHOTOS.familyStory}
          alt={`${primary.name} 어르신 오늘의 모습`}
          className="absolute inset-0 h-full w-full object-cover sn-hero-ken"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[rgba(12,32,30,0.9)] via-[rgba(12,32,30,0.2)] to-transparent" />
        <div className="absolute inset-x-0 bottom-0 px-5 pb-8 text-white">
          <div className="flex items-center gap-3">
            <h1 className="font-display text-3xl font-semibold tracking-tight">{primary.name}</h1>
            <StatusChip status={primary.statusChip} />
          </div>
          <p className="mt-3 text-lg leading-relaxed text-white/85">
            {latestReport?.content || "아직 오늘의 소식이 도착하지 않았습니다."}
          </p>
        </div>
      </div>

      <div className="space-y-6 px-5 py-8 sn-fade-up">
        {todayMenu && (
          <div>
            <p className="text-sm font-semibold text-[var(--sn-accent)]">오늘 식단</p>
            <p className="mt-2 text-[var(--sn-ink)]">중식 · {todayMenu.lunch || "미등록"}</p>
          </div>
        )}

        <div className="grid grid-cols-2 gap-3">
          <Link href={`/timeline/${primary.id}`} className="btn-primary">
            <Heart className="h-5 w-5" /> 타임라인
          </Link>
          <Link href="/visits" className="btn-secondary">
            <CalendarDays className="h-5 w-5" /> 면회
          </Link>
          <Link href="/requests" className="btn-secondary">
            <Package className="h-5 w-5" /> 물품
          </Link>
          <Link href="/reports" className="btn-secondary">
            소식 더보기
          </Link>
        </div>

        <p className="text-center text-xs text-[var(--sn-ink-faint)]">
          밤 22시–아침 7시 알림은 모아 아침에 보여 드립니다.
        </p>
      </div>
    </div>
  )
}
