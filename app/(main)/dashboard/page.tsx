import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { redirect } from "next/navigation"
import AppLayout from "@/components/layout/AppLayout"
import { prisma } from "@/lib/prisma"
import Link from "next/link"
import { formatDate } from "@/lib/utils"
import { Camera, Heart, ShoppingBag, Bell, Plus, ArrowRight, ImageIcon, Calendar, Sparkles, Building2 } from "lucide-react"

export default async function DashboardPage() {
  const session = await getServerSession(authOptions)

  if (!session) {
    redirect("/auth/login")
  }

  // 최근 게시글, 의료 기록 가져오기
  let recentPosts: any[] = []
  let recentMedicalRecords: any[] = []

  try {
    recentPosts = await prisma.post.findMany({
      where: session.user.careCenterId
        ? { careCenterId: session.user.careCenterId }
        : undefined,
      take: 5,
      orderBy: { createdAt: "desc" },
      include: {
        author: {
          select: { name: true, avatarUrl: true },
        },
        resident: {
          select: { name: true },
        },
      },
    })
  } catch (error) {
    console.error("Failed to fetch recent posts:", error)
  }

  try {
    recentMedicalRecords = await prisma.medicalRecord.findMany({
      where: session.user.careCenterId
        ? {
            resident: {
              careCenterId: session.user.careCenterId,
            },
          }
        : undefined,
      take: 5,
      orderBy: { recordDate: "desc" },
      include: {
        resident: {
          select: { name: true },
        },
        createdBy: {
          select: { name: true },
        },
      },
    })
  } catch (error) {
    console.error("Failed to fetch medical records:", error)
  }

  return (
    <AppLayout>
      <div className="container mx-auto px-6 py-12 max-w-7xl">
        {/* Welcome Section - 프리미엄 느낌 */}
        <div className="mb-16">
          <div className="relative bg-gradient-to-br from-blue-500 via-blue-600 via-cyan-500 to-blue-700 rounded-3xl p-16 md:p-24 text-white shadow-2xl shadow-blue-500/50 overflow-hidden border-4 border-blue-400/60">
            {/* 빛나는 효과 */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12 animate-shimmer"></div>
            {/* 배경 패턴 */}
            <div className="absolute inset-0 bg-grid-pattern opacity-10"></div>
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,rgba(255,255,255,0.2),transparent_60%)]"></div>
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_80%,rgba(255,255,255,0.1),transparent_50%)]"></div>
            
            <div className="relative z-10">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-3 bg-white/30 backdrop-blur-md rounded-2xl shadow-lg">
                  <Sparkles className="w-6 h-6 text-white" />
                </div>
                <span className="text-base font-black text-white/95 tracking-wide">오늘도 좋은 하루 되세요</span>
              </div>
              <h1 className="text-7xl md:text-8xl lg:text-9xl font-black mb-8 tracking-tight leading-none drop-shadow-2xl">
                안녕하세요, {session.user.name}님
              </h1>
              <p className="text-3xl md:text-4xl text-white font-black drop-shadow-lg">
                부모님의 건강한 하루를 함께합니다
              </p>
            </div>
          </div>
        </div>

        {/* Quick Actions - 프리미엄 느낌 */}
        <div className={`grid grid-cols-2 ${session.user.role === "CAREGIVER" ? "md:grid-cols-5" : "md:grid-cols-4"} gap-8 mb-16`}>
          <Link
            href="/community/new"
            className="group bg-white rounded-3xl p-16 shadow-2xl shadow-blue-200/40 border-4 border-blue-400/70 card-hover relative overflow-hidden backdrop-blur-sm hover:border-blue-500/80 transition-all duration-500"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-blue-100/60 via-blue-50/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
            <div className="relative z-10">
              <div className="w-28 h-28 bg-gradient-to-br from-blue-500 via-blue-600 to-blue-700 rounded-3xl flex items-center justify-center mb-8 shadow-2xl shadow-blue-500/60 group-hover:scale-125 group-hover:rotate-12 transition-all duration-700 group-hover:shadow-blue-500/80">
                <Camera className="w-14 h-14 text-white" />
              </div>
              <p className="font-black text-neutral-900 mb-3 text-3xl">사진 공유</p>
              <p className="text-lg text-neutral-600 font-black">일상 기록하기</p>
            </div>
          </Link>

          <Link
            href="/medical/new"
            className="group bg-white rounded-3xl p-16 shadow-2xl shadow-red-200/40 border-4 border-red-400/70 card-hover relative overflow-hidden backdrop-blur-sm hover:border-red-500/80 transition-all duration-500"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-red-100/60 via-red-50/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
            <div className="relative z-10">
              <div className="w-28 h-28 bg-gradient-to-br from-red-500 via-pink-500 to-rose-600 rounded-3xl flex items-center justify-center mb-8 shadow-2xl shadow-red-500/60 group-hover:scale-125 group-hover:rotate-12 transition-all duration-700 group-hover:shadow-red-500/80">
                <Heart className="w-14 h-14 text-white fill-white" />
              </div>
              <p className="font-black text-neutral-900 mb-3 text-3xl">의료 기록</p>
              <p className="text-lg text-neutral-600 font-black">건강 정보 기록</p>
            </div>
          </Link>

          <Link
            href="/shop"
            className="group bg-white rounded-3xl p-16 shadow-2xl shadow-green-200/40 border-4 border-green-400/70 card-hover relative overflow-hidden backdrop-blur-sm hover:border-green-500/80 transition-all duration-500"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-green-100/60 via-green-50/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
            <div className="relative z-10">
              <div className="w-28 h-28 bg-gradient-to-br from-green-500 via-emerald-500 to-teal-600 rounded-3xl flex items-center justify-center mb-8 shadow-2xl shadow-green-500/60 group-hover:scale-125 group-hover:rotate-12 transition-all duration-700 group-hover:shadow-green-500/80">
                <ShoppingBag className="w-14 h-14 text-white" />
              </div>
              <p className="font-black text-neutral-900 mb-3 text-3xl">생필품 구매</p>
              <p className="text-lg text-neutral-600 font-black">필요한 물품 주문</p>
            </div>
          </Link>

          <Link
            href="/notifications"
            className="group bg-white rounded-3xl p-16 shadow-2xl shadow-amber-200/40 border-4 border-amber-400/70 card-hover relative overflow-hidden backdrop-blur-sm hover:border-amber-500/80 transition-all duration-500"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-amber-100/60 via-amber-50/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
            <div className="relative z-10">
              <div className="w-28 h-28 bg-gradient-to-br from-amber-500 via-orange-500 to-red-600 rounded-3xl flex items-center justify-center mb-8 shadow-2xl shadow-amber-500/60 group-hover:scale-125 group-hover:rotate-12 transition-all duration-700 group-hover:shadow-amber-500/80">
                <Bell className="w-14 h-14 text-white" />
              </div>
              <p className="font-black text-neutral-900 mb-3 text-3xl">알림</p>
              <p className="text-lg text-neutral-600 font-black">새 소식 확인</p>
            </div>
          </Link>

          {/* 요양원 직원만 보이는 요양원 정보 수정 링크 */}
          {session.user.role === "CAREGIVER" && (
            <Link
              href="/care-center/edit"
              className="group bg-white rounded-3xl p-16 shadow-2xl shadow-purple-200/40 border-4 border-purple-400/70 card-hover relative overflow-hidden backdrop-blur-sm hover:border-purple-500/80 transition-all duration-500"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-purple-100/60 via-purple-50/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
              <div className="relative z-10">
                <div className="w-28 h-28 bg-gradient-to-br from-purple-500 via-purple-600 to-indigo-600 rounded-3xl flex items-center justify-center mb-8 shadow-2xl shadow-purple-500/60 group-hover:scale-125 group-hover:rotate-12 transition-all duration-700 group-hover:shadow-purple-500/80">
                  <Building2 className="w-14 h-14 text-white" />
                </div>
                <p className="font-black text-neutral-900 mb-3 text-3xl">요양원 정보</p>
                <p className="text-lg text-neutral-600 font-black">정보 수정하기</p>
              </div>
            </Link>
          )}
        </div>

        <div className="grid md:grid-cols-2 gap-10">
          {/* 최근 커뮤니티 - 프리미엄 느낌 */}
          <div className="bg-white rounded-3xl shadow-2xl shadow-blue-200/40 border-4 border-blue-400/70 overflow-hidden backdrop-blur-sm">
            <div className="p-8 border-b border-white/40 flex items-center justify-between bg-gradient-to-r from-blue-50/60 via-blue-50/40 to-transparent">
              <h2 className="text-2xl font-black text-neutral-900 flex items-center gap-4">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-500/30">
                  <Camera className="w-6 h-6 text-white" />
                </div>
                최근 커뮤니티
              </h2>
              <Link
                href="/community"
                className="text-sm text-primary-600 hover:text-primary-700 font-bold flex items-center gap-2 group/link px-4 py-2 rounded-xl hover:bg-primary-50 transition-all duration-300"
              >
                더보기
                <ArrowRight className="w-4 h-4 group-hover/link:translate-x-1 transition-transform" />
              </Link>
            </div>
            <div className="p-8 space-y-4">
              {recentPosts.length > 0 ? (
                recentPosts.map((post) => (
                  <Link
                    key={post.id}
                    href={`/community/${post.id}`}
                    className="block p-6 bg-gradient-to-r from-neutral-50 to-white rounded-2xl hover:from-blue-50 hover:to-blue-50/50 transition-all duration-300 group border border-neutral-100 hover:border-blue-200 hover:shadow-lg hover:-translate-y-1"
                  >
                    <div className="flex items-start gap-4">
                      <div className="w-14 h-14 bg-gradient-to-br from-primary-500 via-primary-600 to-accent-500 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-lg shadow-primary-500/30 group-hover:scale-110 transition-transform duration-300">
                        <ImageIcon className="w-7 h-7 text-white" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-3">
                          {post.resident && (
                            <span className="text-xs bg-primary-100 text-primary-700 px-3 py-1.5 rounded-full font-bold">
                              {post.resident.name}
                            </span>
                          )}
                          <span className="text-xs text-neutral-500 font-semibold">
                            {post.author.name}
                          </span>
                        </div>
                        <p className="text-base font-bold text-neutral-900 truncate group-hover:text-primary-600 transition-colors mb-2">
                          {post.title || "제목 없음"}
                        </p>
                        <p className="text-xs text-neutral-500 font-semibold">
                          {formatDate(post.createdAt)}
                        </p>
                      </div>
                    </div>
                  </Link>
                ))
              ) : (
                <div className="text-center py-16">
                  <div className="w-20 h-20 bg-gradient-to-br from-blue-100 to-blue-200 rounded-2xl flex items-center justify-center mx-auto mb-5 shadow-lg">
                    <Camera className="w-10 h-10 text-blue-600" />
                  </div>
                  <p className="text-sm text-gray-600 mb-5 font-medium">
                    아직 게시글이 없습니다
                  </p>
                  <Link
                    href="/community/new"
                    className="inline-flex items-center gap-2 text-sm text-primary-600 hover:text-primary-700 font-bold"
                  >
                    <Plus className="w-4 h-4" />
                    첫 게시글 작성하기
                  </Link>
                </div>
              )}
            </div>
          </div>

          {/* 최근 의료 기록 - 앱다운 느낌 */}
          <div className="bg-white rounded-3xl shadow-app-lg border border-neutral-100 overflow-hidden">
            <div className="p-8 border-b border-neutral-100 flex items-center justify-between bg-gradient-to-r from-red-50/50 to-transparent">
              <h2 className="text-2xl font-black text-neutral-900 flex items-center gap-4">
                <div className="w-12 h-12 bg-gradient-to-br from-red-500 to-pink-600 rounded-2xl flex items-center justify-center shadow-lg shadow-red-500/30">
                  <Heart className="w-6 h-6 text-white fill-white" />
                </div>
                최근 의료 기록
              </h2>
              <Link
                href="/medical"
                className="text-sm text-red-600 hover:text-red-700 font-bold flex items-center gap-2 group/link px-4 py-2 rounded-xl hover:bg-red-50 transition-all duration-300"
              >
                더보기
                <ArrowRight className="w-4 h-4 group-hover/link:translate-x-1 transition-transform" />
              </Link>
            </div>
            <div className="p-8 space-y-4">
              {recentMedicalRecords.length > 0 ? (
                recentMedicalRecords.map((record) => (
                  <Link
                    key={record.id}
                    href={`/medical/${record.id}`}
                    className="block p-6 bg-gradient-to-r from-red-50/50 to-white rounded-2xl hover:from-red-50 hover:to-red-50/50 transition-all duration-300 group border border-red-100 hover:border-red-200 hover:shadow-lg hover:-translate-y-1"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-3">
                          <span className="text-xs bg-red-100 text-red-700 px-3 py-1.5 rounded-full font-bold">
                            {record.category}
                          </span>
                          <span className="text-xs text-neutral-500 font-semibold">
                            {record.resident.name}
                          </span>
                        </div>
                        <p className="text-base font-bold text-neutral-900 group-hover:text-red-600 transition-colors mb-2">
                          {record.title}
                        </p>
                        <div className="flex items-center gap-1.5 text-xs text-neutral-500 font-semibold">
                          <Calendar className="w-3.5 h-3.5" />
                          {formatDate(record.recordDate)}
                        </div>
                      </div>
                    </div>
                  </Link>
                ))
              ) : (
                <div className="text-center py-16">
                  <div className="w-20 h-20 bg-gradient-to-br from-red-100 to-pink-200 rounded-2xl flex items-center justify-center mx-auto mb-5 shadow-lg">
                    <Heart className="w-10 h-10 text-red-600" />
                  </div>
                  <p className="text-sm text-gray-600 mb-5 font-medium">
                    아직 의료 기록이 없습니다
                  </p>
                  <Link
                    href="/medical/new"
                    className="inline-flex items-center gap-2 text-sm text-red-600 hover:text-red-700 font-bold"
                  >
                    <Plus className="w-4 h-4" />
                    첫 의료 기록 작성하기
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  )
}
