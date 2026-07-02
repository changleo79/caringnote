import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { redirect } from "next/navigation"
import AppLayout from "@/components/layout/AppLayout"
import { prisma } from "@/lib/prisma"
import Link from "next/link"
import { formatDate } from "@/lib/utils"
import { Camera, Heart, ShoppingBag, Bell, Plus, ArrowRight, ImageIcon, Calendar, Building2 } from "lucide-react"
import { Card, CardContent, CardHeader } from "@/components/ui/Card"

const quickActions = [
  { href: "/community/new", label: "일상 기록", desc: "사진 공유하기", icon: Camera, color: "bg-brand-50 text-brand-600" },
  { href: "/medical/new", label: "의료 기록", desc: "건강 정보 기록", icon: Heart, color: "bg-red-50 text-red-600" },
  { href: "/shop", label: "생필품", desc: "필요한 물품 주문", icon: ShoppingBag, color: "bg-emerald-50 text-emerald-600" },
  { href: "/notifications", label: "알림", desc: "새 소식 확인", icon: Bell, color: "bg-amber-50 text-amber-600" },
]

export default async function DashboardPage() {
  const session = await getServerSession(authOptions)
  if (!session) redirect("/auth/login")

  let recentPosts: Array<{
    id: string
    title: string | null
    createdAt: Date
    author: { name: string }
    resident: { name: string } | null
  }> = []

  let recentMedicalRecords: Array<{
    id: string
    title: string
    category: string
    recordDate: Date
    resident: { name: string }
  }> = []

  try {
    recentPosts = await prisma.post.findMany({
      where: session.user.careCenterId ? { careCenterId: session.user.careCenterId } : undefined,
      take: 5,
      orderBy: { createdAt: "desc" },
      include: {
        author: { select: { name: true } },
        resident: { select: { name: true } },
      },
    })
  } catch (error) {
    console.error("Failed to fetch posts:", error)
  }

  try {
    recentMedicalRecords = await prisma.medicalRecord.findMany({
      where: session.user.careCenterId
        ? { resident: { careCenterId: session.user.careCenterId } }
        : undefined,
      take: 5,
      orderBy: { recordDate: "desc" },
      include: {
        resident: { select: { name: true } },
      },
    })
  } catch (error) {
    console.error("Failed to fetch medical records:", error)
  }

  const actions = session.user.role === "CAREGIVER"
    ? [...quickActions, { href: "/care-center/edit", label: "요양원", desc: "정보 수정하기", icon: Building2, color: "bg-purple-50 text-purple-600" }]
    : quickActions

  return (
    <AppLayout>
      <div className="px-4 sm:px-6 py-8 max-w-5xl">
        {/* Welcome */}
        <div className="mb-8">
          <div className="card p-8 bg-brand-600 border-brand-700 text-white">
            <p className="text-brand-100 text-body mb-2">오늘도 좋은 하루 되세요</p>
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight mb-1">
              안녕하세요, {session.user.name}님
            </h1>
            <p className="text-brand-100 text-body-lg">
              부모님의 건강한 하루를 함께합니다
            </p>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {actions.map((action) => {
            const Icon = action.icon
            return (
              <Link key={action.href} href={action.href} className="card-interactive p-5 text-center">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center mx-auto mb-3 ${action.color}`}>
                  <Icon className="w-6 h-6" />
                </div>
                <p className="font-semibold text-neutral-900 text-body">{action.label}</p>
                <p className="text-caption text-neutral-500 mt-0.5">{action.desc}</p>
              </Link>
            )
          })}
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Recent Community */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <h2 className="font-semibold text-neutral-900 flex items-center gap-2">
                <Camera className="w-5 h-5 text-brand-600" />
                최근 일상
              </h2>
              <Link href="/community" className="text-caption text-brand-600 font-medium flex items-center gap-1 hover:text-brand-700">
                더보기 <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </CardHeader>
            <CardContent className="space-y-3">
              {recentPosts.length > 0 ? (
                recentPosts.map((post) => (
                  <Link
                    key={post.id}
                    href={`/community/${post.id}`}
                    className="flex items-start gap-3 p-3 rounded-xl hover:bg-neutral-50 transition-colors group"
                  >
                    <div className="w-10 h-10 bg-brand-50 rounded-xl flex items-center justify-center flex-shrink-0">
                      <ImageIcon className="w-5 h-5 text-brand-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        {post.resident && (
                          <span className="badge-brand text-[11px]">{post.resident.name}</span>
                        )}
                        <span className="text-caption text-neutral-400">{post.author.name}</span>
                      </div>
                      <p className="text-body font-medium text-neutral-900 truncate group-hover:text-brand-600 transition-colors">
                        {post.title || "제목 없음"}
                      </p>
                      <p className="text-caption text-neutral-400">{formatDate(post.createdAt)}</p>
                    </div>
                  </Link>
                ))
              ) : (
                <div className="text-center py-10">
                  <Camera className="w-10 h-10 text-neutral-300 mx-auto mb-3" />
                  <p className="text-body text-neutral-500 mb-4">아직 게시글이 없습니다</p>
                  <Link href="/community/new" className="inline-flex items-center gap-1.5 text-brand-600 font-medium text-body hover:text-brand-700">
                    <Plus className="w-4 h-4" /> 첫 게시글 작성하기
                  </Link>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Recent Medical */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <h2 className="font-semibold text-neutral-900 flex items-center gap-2">
                <Heart className="w-5 h-5 text-red-500" />
                최근 의료 기록
              </h2>
              <Link href="/medical" className="text-caption text-red-600 font-medium flex items-center gap-1 hover:text-red-700">
                더보기 <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </CardHeader>
            <CardContent className="space-y-3">
              {recentMedicalRecords.length > 0 ? (
                recentMedicalRecords.map((record) => (
                  <Link
                    key={record.id}
                    href={`/medical/${record.id}`}
                    className="flex items-start gap-3 p-3 rounded-xl hover:bg-neutral-50 transition-colors group"
                  >
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="badge bg-red-50 text-red-700 text-[11px]">{record.category}</span>
                        <span className="text-caption text-neutral-400">{record.resident.name}</span>
                      </div>
                      <p className="text-body font-medium text-neutral-900 group-hover:text-red-600 transition-colors">
                        {record.title}
                      </p>
                      <div className="flex items-center gap-1 text-caption text-neutral-400 mt-0.5">
                        <Calendar className="w-3.5 h-3.5" />
                        {formatDate(record.recordDate)}
                      </div>
                    </div>
                  </Link>
                ))
              ) : (
                <div className="text-center py-10">
                  <Heart className="w-10 h-10 text-neutral-300 mx-auto mb-3" />
                  <p className="text-body text-neutral-500 mb-4">아직 의료 기록이 없습니다</p>
                  <Link href="/medical/new" className="inline-flex items-center gap-1.5 text-red-600 font-medium text-body hover:text-red-700">
                    <Plus className="w-4 h-4" /> 첫 의료 기록 작성하기
                  </Link>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </AppLayout>
  )
}
