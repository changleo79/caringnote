import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { redirect } from "next/navigation"
import { prisma } from "@/lib/prisma"
import Link from "next/link"
import { NotebookPen, Users, Heart, Package, CalendarDays } from "lucide-react"

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

    let residents: any[] = []
    let missingCount = 0
    let pendingFamilies = 0

    if (careCenterId) {
      residents = await prisma.resident.findMany({
        where: { careCenterId },
        select: { id: true, name: true, roomNumber: true, statusChip: true },
        orderBy: { name: "asc" },
        take: 12,
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
      missingCount = residents.filter((r) => !writtenIds.has(r.id)).length
      pendingFamilies = await prisma.residentFamily.count({
        where: { isApproved: false, resident: { careCenterId } },
      })
    }

    return (
      <div className="px-4 sm:px-6 py-8 max-w-3xl mx-auto">
        <div className="mb-8">
          <p className="text-brand-700 font-medium text-sm mb-1">Staff Fast</p>
          <h1 className="text-3xl font-semibold text-neutral-900 tracking-tight">
            안녕하세요, {session.user.name}님
          </h1>
          <p className="text-neutral-500 mt-2">돌봄에 집중하세요. 기록은 2분이면 됩니다.</p>
        </div>

        <div className="grid grid-cols-2 gap-3 mb-6">
          <div className="card p-4">
            <p className="text-sm text-neutral-500">오늘 미작성</p>
            <p className="text-3xl font-semibold text-rose-600">{missingCount}</p>
          </div>
          <div className="card p-4">
            <p className="text-sm text-neutral-500">가족 승인 대기</p>
            <p className="text-3xl font-semibold text-amber-600">{pendingFamilies}</p>
          </div>
        </div>

        <Link href="/reports/write" className="btn-primary w-full mb-4 text-lg min-h-[56px]">
          <NotebookPen className="w-6 h-6" /> 알림장 퀵작성
        </Link>

        <div className="grid grid-cols-2 gap-3 mb-8">
          <Link href="/residents" className="btn-secondary"><Users className="w-5 h-5" /> 어르신</Link>
          <Link href="/menu" className="btn-secondary"><CalendarDays className="w-5 h-5" /> 식단</Link>
          <Link href="/announcements" className="btn-secondary">공지</Link>
          <Link href="/handover" className="btn-secondary">인수인계</Link>
        </div>

        <h2 className="font-semibold text-neutral-900 mb-3">어르신</h2>
        <ul className="grid sm:grid-cols-2 gap-2">
          {residents.map((r) => (
            <li key={r.id}>
              <Link href={`/timeline/${r.id}`} className="card-interactive p-3 flex justify-between">
                <span className="font-medium">{r.name}</span>
                <span className="text-sm text-neutral-400">{r.roomNumber || ""}</span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    )
  }

  // Family Calm — 한 어르신 이야기
  const links = await prisma.residentFamily.findMany({
    where: { userId: session.user.id, isApproved: true },
    include: {
      resident: {
        select: {
          id: true,
          name: true,
          photoUrl: true,
          statusChip: true,
          roomNumber: true,
        },
      },
    },
  })

  const primary = links[0]?.resident
  let latestReport: any = null
  let todayMenu: any = null

  if (primary) {
    latestReport = await prisma.dailyReport.findFirst({
      where: { residentId: primary.id, isDraft: false },
      orderBy: { publishedAt: "desc" },
    })
    const residentFull = await prisma.resident.findUnique({
      where: { id: primary.id },
      select: { careCenterId: true },
    })
    if (residentFull) {
      const day = new Date()
      day.setHours(0, 0, 0, 0)
      todayMenu = await prisma.menuPlan.findUnique({
        where: {
          careCenterId_date: { careCenterId: residentFull.careCenterId, date: day },
        },
      })
    }
  }

  const mood =
    primary?.statusChip === "GOOD"
      ? "좋음"
      : primary?.statusChip === "CAUTION"
        ? "주의"
        : "보통"

  return (
    <div className="max-w-xl mx-auto">
      {primary ? (
        <>
          <div className="bg-brand-800 text-white px-4 pt-10 pb-12">
            <p className="text-brand-200 text-sm mb-2">오늘도 함께합니다</p>
            <h1 className="text-3xl font-semibold tracking-tight">
              {primary.name}
              <span className="text-xl font-medium text-brand-100"> · {mood}</span>
            </h1>
            <p className="text-brand-200 mt-2">
              {latestReport?.content || "아직 오늘의 소식이 도착하지 않았습니다."}
            </p>
          </div>

          <div className="px-4 -mt-6 space-y-4 pb-10">
            <div className="card p-5">
              <p className="text-sm text-neutral-500 mb-1">최신 알림장</p>
              <p className="text-neutral-800 leading-relaxed">
                {latestReport?.content || "소식이 오면 여기에 표시됩니다."}
              </p>
              {latestReport && (
                <Link href="/reports" className="inline-flex text-brand-700 font-medium mt-3 text-sm">
                  소식 더 보기 →
                </Link>
              )}
            </div>

            {todayMenu && (
              <div className="card p-5">
                <p className="font-semibold mb-2">오늘 식단</p>
                <p className="text-neutral-600 text-sm">중식 · {todayMenu.lunch || "미등록"}</p>
              </div>
            )}

            <div className="grid grid-cols-2 gap-3">
              <Link href={`/timeline/${primary.id}`} className="btn-primary">
                <Heart className="w-5 h-5" /> 타임라인
              </Link>
              <Link href="/visits" className="btn-secondary">
                <CalendarDays className="w-5 h-5" /> 면회
              </Link>
              <Link href="/requests" className="btn-secondary">
                <Package className="w-5 h-5" /> 물품 요청
              </Link>
              <Link href="/medical" className="btn-secondary">건강</Link>
            </div>

            <p className="text-xs text-neutral-400 text-center px-2">
              밤 22시–아침 7시 알림은 모아 아침에 보여 드립니다. 앱 없이도 매직링크로 소식을 볼 수 있어요.
            </p>
          </div>
        </>
      ) : (
        <div className="p-6">
          <h1 className="page-title mb-2">안녕하세요, {session.user.name}님</h1>
          <p className="page-description mb-6">연결된 어르신이 없습니다. 가족 연결을 요청해 주세요.</p>
          <Link href="/residents/family-requests" className="btn-primary">
            <Users className="w-5 h-5" /> 가족 연결 요청
          </Link>
        </div>
      )}
    </div>
  )
}
