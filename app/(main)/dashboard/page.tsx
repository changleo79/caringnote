import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { redirect } from "next/navigation"
import AppLayout from "@/components/layout/AppLayout"
import { prisma } from "@/lib/prisma"
import Link from "next/link"
import { formatDate } from "@/lib/utils"
import { Camera, Heart, ShoppingBag, Bell } from "lucide-react"

export default async function DashboardPage() {
  const session = await getServerSession(authOptions)

  if (!session) {
    redirect("/auth/login")
  }

  // 최근 게시글, 의료 기록, 주문 정보 가져오기
  const recentPosts = await prisma.post.findMany({
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

  const recentMedicalRecords = await prisma.medicalRecord.findMany({
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

  return (
    <AppLayout>
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            안녕하세요, {session.user.name}님
          </h1>
          <p className="text-gray-600">오늘도 부모님의 건강한 하루를 함께합니다</p>
        </div>

        {/* 빠른 액세스 */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <Link
            href="/community/new"
            className="bg-white rounded-xl p-6 shadow-md hover:shadow-lg transition-shadow text-center"
          >
            <Camera className="w-8 h-8 mx-auto mb-2 text-primary-600" />
            <p className="text-sm font-medium">사진 공유</p>
          </Link>
          <Link
            href="/medical/new"
            className="bg-white rounded-xl p-6 shadow-md hover:shadow-lg transition-shadow text-center"
          >
            <Heart className="w-8 h-8 mx-auto mb-2 text-red-500" />
            <p className="text-sm font-medium">의료 기록</p>
          </Link>
          <Link
            href="/shop"
            className="bg-white rounded-xl p-6 shadow-md hover:shadow-lg transition-shadow text-center"
          >
            <ShoppingBag className="w-8 h-8 mx-auto mb-2 text-green-600" />
            <p className="text-sm font-medium">생필품 구매</p>
          </Link>
          <Link
            href="/notifications"
            className="bg-white rounded-xl p-6 shadow-md hover:shadow-lg transition-shadow text-center"
          >
            <Bell className="w-8 h-8 mx-auto mb-2 text-yellow-600" />
            <p className="text-sm font-medium">알림</p>
          </Link>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {/* 최근 커뮤니티 게시글 */}
          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-gray-900">최근 커뮤니티</h2>
              <Link
                href="/community"
                className="text-sm text-primary-600 hover:text-primary-700"
              >
                더보기 →
              </Link>
            </div>
            <div className="space-y-4">
              {recentPosts.length > 0 ? (
                recentPosts.map((post) => (
                  <Link
                    key={post.id}
                    href={`/community/${post.id}`}
                    className="block p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-start gap-3">
                      {post.resident && (
                        <span className="text-xs bg-primary-100 text-primary-700 px-2 py-1 rounded">
                          {post.resident.name}
                        </span>
                      )}
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">
                          {post.title || "제목 없음"}
                        </p>
                        <p className="text-xs text-gray-500 mt-1">
                          {post.author.name} · {formatDate(post.createdAt)}
                        </p>
                      </div>
                    </div>
                  </Link>
                ))
              ) : (
                <p className="text-sm text-gray-500 text-center py-8">
                  아직 게시글이 없습니다
                </p>
              )}
            </div>
          </div>

          {/* 최근 의료 기록 */}
          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-gray-900">최근 의료 기록</h2>
              <Link
                href="/medical"
                className="text-sm text-primary-600 hover:text-primary-700"
              >
                더보기 →
              </Link>
            </div>
            <div className="space-y-4">
              {recentMedicalRecords.length > 0 ? (
                recentMedicalRecords.map((record) => (
                  <Link
                    key={record.id}
                    href={`/medical/${record.id}`}
                    className="block p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-900">
                          {record.title}
                        </p>
                        <p className="text-xs text-gray-500 mt-1">
                          {record.resident.name} · {formatDate(record.recordDate)}
                        </p>
                      </div>
                      <span className="text-xs bg-red-100 text-red-700 px-2 py-1 rounded">
                        {record.category}
                      </span>
                    </div>
                  </Link>
                ))
              ) : (
                <p className="text-sm text-gray-500 text-center py-8">
                  아직 의료 기록이 없습니다
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  )
}

