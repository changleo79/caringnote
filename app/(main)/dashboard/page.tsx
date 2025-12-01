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
      <div className="container mx-auto px-4 py-10 max-w-7xl">
        {/* Welcome Section - 프리미엄 느낌 */}
        <div className="mb-12">
          <div className="relative bg-gradient-to-br from-primary-500 via-primary-600 to-accent-500 rounded-3xl p-12 md:p-16 text-white shadow-3d overflow-hidden">
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
              <h1 className="text-6xl md:text-7xl lg:text-8xl font-black mb-6 tracking-tight leading-none">
                안녕하세요, {session.user.name}님
              </h1>
              <p className="text-2xl md:text-3xl text-white/95 font-black">
                부모님의 건강한 하루를 함께합니다
              </p>
            </div>
          </div>
        </div>

        {/* Quick Actions - 앱다운 느낌 */}
        <div className={`grid grid-cols-2 ${session.user.role === "CAREGIVER" ? "md:grid-cols-5" : "md:grid-cols-4"} gap-6 mb-12`}>
          <Link
            href="/community/new"
            className="group bg-gradient-to-br from-white via-white to-blue-50/30 rounded-3xl p-10 shadow-3d border border-white/60 card-hover relative overflow-hidden backdrop-blur-sm"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-blue-100/60 via-blue-50/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
            <div className="relative z-10">
              <div className="w-24 h-24 bg-gradient-to-br from-blue-500 via-blue-600 to-blue-700 rounded-3xl flex items-center justify-center mb-6 shadow-2xl shadow-blue-500/50 group-hover:scale-110 group-hover:rotate-6 transition-all duration-700">
                <Camera className="w-12 h-12 text-white" />
              </div>
              <p className="font-black text-neutral-900 mb-2 text-2xl">사진 공유</p>
              <p className="text-base text-neutral-600 font-bold">일상 기록하기</p>
            </div>
          </Link>

          <Link
            href="/medical/new"
            className="group bg-white rounded-3xl p-8 shadow-app-lg border border-neutral-100 card-hover relative overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-red-50/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            <div className="relative z-10">
              <div className="w-20 h-20 bg-gradient-to-br from-red-500 via-pink-500 to-rose-600 rounded-3xl flex items-center justify-center mb-6 shadow-xl shadow-red-500/40 group-hover:scale-110 group-hover:rotate-6 transition-all duration-500">
                <Heart className="w-10 h-10 text-white fill-white" />
              </div>
              <p className="font-black text-neutral-900 mb-2 text-xl">의료 기록</p>
              <p className="text-sm text-neutral-500 font-semibold">건강 정보 기록</p>
            </div>
          </Link>

          <Link
            href="/shop"
            className="group bg-white rounded-3xl p-8 shadow-app-lg border border-neutral-100 card-hover relative overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-green-50/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            <div className="relative z-10">
              <div className="w-20 h-20 bg-gradient-to-br from-green-500 via-emerald-500 to-teal-600 rounded-3xl flex items-center justify-center mb-6 shadow-xl shadow-green-500/40 group-hover:scale-110 group-hover:rotate-6 transition-all duration-500">
                <ShoppingBag className="w-10 h-10 text-white" />
              </div>
              <p className="font-black text-neutral-900 mb-2 text-xl">생필품 구매</p>
              <p className="text-sm text-neutral-500 font-semibold">필요한 물품 주문</p>
            </div>
          </Link>

          <Link
            href="/notifications"
            className="group bg-white rounded-3xl p-8 shadow-app-lg border border-neutral-100 card-hover relative overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-amber-50/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            <div className="relative z-10">
              <div className="w-20 h-20 bg-gradient-to-br from-amber-500 via-orange-500 to-red-600 rounded-3xl flex items-center justify-center mb-6 shadow-xl shadow-amber-500/40 group-hover:scale-110 group-hover:rotate-6 transition-all duration-500">
                <Bell className="w-10 h-10 text-white" />
              </div>
              <p className="font-black text-neutral-900 mb-2 text-xl">알림</p>
              <p className="text-sm text-neutral-500 font-semibold">새 소식 확인</p>
            </div>
          </Link>

          {/* 요양원 직원만 보이는 요양원 정보 수정 링크 */}
          {session.user.role === "CAREGIVER" && (
            <Link
              href="/care-center/edit"
              className="group bg-white rounded-3xl p-8 shadow-app-lg border border-neutral-100 card-hover relative overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-purple-50/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <div className="relative z-10">
                <div className="w-20 h-20 bg-gradient-to-br from-purple-500 via-purple-600 to-indigo-600 rounded-3xl flex items-center justify-center mb-6 shadow-xl shadow-purple-500/40 group-hover:scale-110 group-hover:rotate-6 transition-all duration-500">
                  <Building2 className="w-10 h-10 text-white" />
                </div>
                <p className="font-black text-neutral-900 mb-2 text-xl">요양원 정보</p>
                <p className="text-sm text-neutral-500 font-semibold">정보 수정하기</p>
              </div>
            </Link>
          )}
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* 최근 커뮤니티 - 프리미엄 느낌 */}
          <div className="bg-gradient-to-br from-white via-white to-blue-50/20 rounded-3xl shadow-3d border border-white/60 overflow-hidden backdrop-blur-sm">
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
