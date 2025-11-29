import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { redirect } from "next/navigation"
import AppLayout from "@/components/layout/AppLayout"
import { prisma } from "@/lib/prisma"
import Link from "next/link"
import { formatDate } from "@/lib/utils"
import { Camera, Heart, ShoppingBag, Bell, Plus, ArrowRight, ImageIcon, Calendar } from "lucide-react"

export default async function DashboardPage() {
  const session = await getServerSession(authOptions)

  if (!session) {
    redirect("/auth/login")
  }

  // 최근 게시글, 의료 기록, 주문 정보 가져오기 (안전하게)
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
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Welcome Section */}
        <div className="mb-8">
          <div className="bg-gradient-to-br from-primary-500 to-accent-500 rounded-3xl p-8 md:p-12 text-white shadow-soft-lg">
            <h1 className="text-3xl md:text-4xl font-bold mb-2">
              안녕하세요, {session.user.name}님
            </h1>
            <p className="text-lg text-primary-50">
              오늘도 부모님의 건강한 하루를 함께합니다
            </p>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <Link
            href="/community/new"
            className="bg-white rounded-2xl p-6 shadow-soft card-hover border border-gray-100 group"
          >
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center mb-4 shadow-lg shadow-blue-500/20 group-hover:scale-110 transition-transform">
              <Camera className="w-6 h-6 text-white" />
            </div>
            <p className="font-semibold text-gray-900 mb-1">사진 공유</p>
            <p className="text-xs text-gray-500">일상 기록하기</p>
          </Link>

          <Link
            href="/medical/new"
            className="bg-white rounded-2xl p-6 shadow-soft card-hover border border-gray-100 group"
          >
            <div className="w-12 h-12 bg-gradient-to-br from-red-500 to-pink-600 rounded-xl flex items-center justify-center mb-4 shadow-lg shadow-red-500/20 group-hover:scale-110 transition-transform">
              <Heart className="w-6 h-6 text-white" />
            </div>
            <p className="font-semibold text-gray-900 mb-1">의료 기록</p>
            <p className="text-xs text-gray-500">건강 정보 기록</p>
          </Link>

          <Link
            href="/shop"
            className="bg-white rounded-2xl p-6 shadow-soft card-hover border border-gray-100 group"
          >
            <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center mb-4 shadow-lg shadow-green-500/20 group-hover:scale-110 transition-transform">
              <ShoppingBag className="w-6 h-6 text-white" />
            </div>
            <p className="font-semibold text-gray-900 mb-1">생필품 구매</p>
            <p className="text-xs text-gray-500">필요한 물품 주문</p>
          </Link>

          <Link
            href="/notifications"
            className="bg-white rounded-2xl p-6 shadow-soft card-hover border border-gray-100 group"
          >
            <div className="w-12 h-12 bg-gradient-to-br from-amber-500 to-orange-600 rounded-xl flex items-center justify-center mb-4 shadow-lg shadow-amber-500/20 group-hover:scale-110 transition-transform">
              <Bell className="w-6 h-6 text-white" />
            </div>
            <p className="font-semibold text-gray-900 mb-1">알림</p>
            <p className="text-xs text-gray-500">새 소식 확인</p>
          </Link>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {/* 최근 커뮤니티 */}
          <div className="bg-white rounded-2xl shadow-soft border border-gray-100 overflow-hidden">
            <div className="p-6 border-b border-gray-100 flex items-center justify-between">
              <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                <Camera className="w-5 h-5 text-primary-600" />
                최근 커뮤니티
              </h2>
              <Link
                href="/community"
                className="text-sm text-primary-600 hover:text-primary-700 font-medium flex items-center gap-1"
              >
                더보기
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
            <div className="p-6 space-y-4">
              {recentPosts.length > 0 ? (
                recentPosts.map((post) => (
                  <Link
                    key={post.id}
                    href={`/community/${post.id}`}
                    className="block p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors group"
                  >
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-primary-400 to-accent-400 rounded-lg flex items-center justify-center flex-shrink-0">
                        <ImageIcon className="w-5 h-5 text-white" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          {post.resident && (
                            <span className="text-xs bg-primary-100 text-primary-700 px-2 py-0.5 rounded-full font-medium">
                              {post.resident.name}
                            </span>
                          )}
                          <span className="text-xs text-gray-500">
                            {post.author.name}
                          </span>
                        </div>
                        <p className="text-sm font-medium text-gray-900 truncate group-hover:text-primary-600 transition-colors">
                          {post.title || "제목 없음"}
                        </p>
                        <p className="text-xs text-gray-500 mt-1">
                          {formatDate(post.createdAt)}
                        </p>
                      </div>
                    </div>
                  </Link>
                ))
              ) : (
                <div className="text-center py-12">
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Camera className="w-8 h-8 text-gray-400" />
                  </div>
                  <p className="text-sm text-gray-500 mb-4">
                    아직 게시글이 없습니다
                  </p>
                  <Link
                    href="/community/new"
                    className="inline-flex items-center gap-2 text-sm text-primary-600 hover:text-primary-700 font-medium"
                  >
                    <Plus className="w-4 h-4" />
                    첫 게시글 작성하기
                  </Link>
                </div>
              )}
            </div>
          </div>

          {/* 최근 의료 기록 */}
          <div className="bg-white rounded-2xl shadow-soft border border-gray-100 overflow-hidden">
            <div className="p-6 border-b border-gray-100 flex items-center justify-between">
              <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                <Heart className="w-5 h-5 text-red-500" />
                최근 의료 기록
              </h2>
              <Link
                href="/medical"
                className="text-sm text-primary-600 hover:text-primary-700 font-medium flex items-center gap-1"
              >
                더보기
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
            <div className="p-6 space-y-4">
              {recentMedicalRecords.length > 0 ? (
                recentMedicalRecords.map((record) => (
                  <Link
                    key={record.id}
                    href={`/medical/${record.id}`}
                    className="block p-4 bg-red-50/50 rounded-xl hover:bg-red-50 transition-colors group border border-red-100"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-xs bg-red-100 text-red-700 px-2 py-0.5 rounded-full font-medium">
                            {record.category}
                          </span>
                          <span className="text-xs text-gray-500">
                            {record.resident.name}
                          </span>
                        </div>
                        <p className="text-sm font-medium text-gray-900 group-hover:text-red-600 transition-colors">
                          {record.title}
                        </p>
                        <div className="flex items-center gap-1 text-xs text-gray-500 mt-1">
                          <Calendar className="w-3 h-3" />
                          {formatDate(record.recordDate)}
                        </div>
                      </div>
                    </div>
                  </Link>
                ))
              ) : (
                <div className="text-center py-12">
                  <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Heart className="w-8 h-8 text-red-400" />
                  </div>
                  <p className="text-sm text-gray-500 mb-4">
                    아직 의료 기록이 없습니다
                  </p>
                  <Link
                    href="/medical/new"
                    className="inline-flex items-center gap-2 text-sm text-red-600 hover:text-red-700 font-medium"
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
