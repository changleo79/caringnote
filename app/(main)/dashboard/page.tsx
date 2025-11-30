import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { redirect } from "next/navigation"
import AppLayout from "@/components/layout/AppLayout"
import { prisma } from "@/lib/prisma"
import Link from "next/link"
import { formatDate } from "@/lib/utils"
import { Camera, Heart, ShoppingBag, Bell, Plus, ArrowRight, ImageIcon, Calendar, MessageCircle } from "lucide-react"

export default async function DashboardPage() {
  const session = await getServerSession(authOptions)

  if (!session) {
    redirect("/auth/login")
  }

  const isFamily = session.user.role === "FAMILY"
  const isCaregiver = session.user.role === "CAREGIVER" || session.user.role === "ADMIN"

  // 연결된 입소자 ID 목록 (가족회원의 경우)
  let connectedResidentIds: string[] = []

  if (isFamily) {
    try {
      const residentFamilies = await prisma.residentFamily.findMany({
        where: {
          userId: session.user.id!,
          isApproved: true,
        },
        select: {
          residentId: true,
        },
      })
      connectedResidentIds = residentFamilies.map(rf => rf.residentId)
    } catch (error) {
      console.error("Failed to fetch connected residents:", error)
    }
  }

  // 최근 게시글, 의료 기록 가져오기
  let recentPosts: any[] = []
  let recentMedicalRecords: any[] = []

  try {
    if (isFamily) {
      // 가족회원: 연결된 입소자의 게시글만
      if (connectedResidentIds.length > 0) {
        recentPosts = await prisma.post.findMany({
          where: {
            residentId: { in: connectedResidentIds },
          },
          take: 5,
          orderBy: { createdAt: "desc" },
          include: {
            author: {
              select: { name: true, avatarUrl: true },
            },
            resident: {
              select: { name: true },
            },
            _count: {
              select: {
                likes: true,
                comments: true,
              },
            },
          },
        })

        // 좋아요 여부 확인
        recentPosts = await Promise.all(
          recentPosts.map(async (post) => {
            const isLiked = await prisma.postLike.findFirst({
              where: {
                postId: post.id,
                userId: session.user.id!,
              },
            })
            return {
              ...post,
              isLiked: !!isLiked,
            }
          })
        )
      }
    } else {
      // 요양원직원: 요양원 전체 게시글
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
    }
  } catch (error) {
    console.error("Failed to fetch recent posts:", error)
  }

  try {
    if (isFamily) {
      // 가족회원: 연결된 입소자의 의료 기록만
      if (connectedResidentIds.length > 0) {
        recentMedicalRecords = await prisma.medicalRecord.findMany({
          where: {
            residentId: { in: connectedResidentIds },
          },
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
      }
    } else {
      // 요양원직원: 요양원 전체 의료 기록
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
    }
  } catch (error) {
    console.error("Failed to fetch medical records:", error)
  }

  return (
    <AppLayout>
      <div className="section-container py-10">
        {/* Welcome Section - Notion 스타일 */}
        <div className="mb-10">
          <div className="card-notion p-8 md:p-10 bg-neutral-50 border-neutral-200">
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-neutral-900 mb-3 tracking-tight">
              안녕하세요, {session.user.name}님
            </h1>
            <p className="text-lg text-neutral-600">
              {isFamily ? "연결된 입소자의 소식을 확인하세요" : "부모님의 건강한 하루를 함께합니다"}
            </p>
          </div>
        </div>

        {/* Quick Actions - 요양원직원만 표시 */}
        {isCaregiver && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
            <Link
              href="/community/new"
              className="card-notion p-6 card-hover-linear group text-center"
            >
              <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center mb-4 mx-auto group-hover:bg-primary-200 transition-colors">
                <Camera className="w-6 h-6 text-primary-600" />
              </div>
              <p className="font-semibold text-neutral-900 mb-1 text-sm">사진 공유</p>
              <p className="text-xs text-neutral-500">일상 기록</p>
            </Link>

            <Link
              href="/medical/new"
              className="card-notion p-6 card-hover-linear group text-center"
            >
              <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center mb-4 mx-auto group-hover:bg-red-200 transition-colors">
                <Heart className="w-6 h-6 text-red-600 fill-red-600" />
              </div>
              <p className="font-semibold text-neutral-900 mb-1 text-sm">의료 기록</p>
              <p className="text-xs text-neutral-500">건강 정보</p>
            </Link>

            <Link
              href="/shop"
              className="card-notion p-6 card-hover-linear group text-center"
            >
              <div className="w-12 h-12 bg-emerald-100 rounded-lg flex items-center justify-center mb-4 mx-auto group-hover:bg-emerald-200 transition-colors">
                <ShoppingBag className="w-6 h-6 text-emerald-600" />
              </div>
              <p className="font-semibold text-neutral-900 mb-1 text-sm">생필품 구매</p>
              <p className="text-xs text-neutral-500">필요 물품</p>
            </Link>

            <Link
              href="/notifications"
              className="card-notion p-6 card-hover-linear group text-center"
            >
              <div className="w-12 h-12 bg-amber-100 rounded-lg flex items-center justify-center mb-4 mx-auto group-hover:bg-amber-200 transition-colors">
                <Bell className="w-6 h-6 text-amber-600" />
              </div>
              <p className="font-semibold text-neutral-900 mb-1 text-sm">알림</p>
              <p className="text-xs text-neutral-500">새 소식</p>
            </Link>
          </div>
        )}

        <div className="grid md:grid-cols-2 gap-6">
          {/* 최근 커뮤니티 - Notion 스타일 */}
          <div className="card-notion overflow-hidden">
            <div className="p-6 border-b border-neutral-200 flex items-center justify-between">
              <h2 className="text-xl font-bold text-neutral-900 flex items-center gap-2">
                <Camera className="w-5 h-5 text-primary-600" />
                최근 커뮤니티
              </h2>
              <Link
                href="/community"
                className="text-sm text-neutral-600 hover:text-neutral-900 font-medium flex items-center gap-1 transition-colors"
              >
                더보기
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
            <div className="p-6 space-y-3">
              {recentPosts.length > 0 ? (
                recentPosts.map((post) => (
                  <Link
                    key={post.id}
                    href={`/community/${post.id}`}
                    className="block p-4 rounded-lg hover:bg-neutral-50 transition-colors border border-neutral-100"
                  >
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 bg-primary-100 rounded-lg flex items-center justify-center flex-shrink-0">
                        <ImageIcon className="w-5 h-5 text-primary-600" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                          {post.resident && (
                            <span className="text-xs bg-primary-50 text-primary-700 px-2 py-0.5 rounded font-medium">
                              {post.resident.name}
                            </span>
                          )}
                          <span className="text-xs text-neutral-500">
                            {post.author.name}
                          </span>
                        </div>
                        <p className="text-sm font-semibold text-neutral-900 truncate mb-1">
                          {post.title || "제목 없음"}
                        </p>
                        <div className="flex items-center justify-between mt-2">
                          <p className="text-xs text-neutral-500">
                            {formatDate(post.createdAt)}
                          </p>
                          {/* 가족회원: 좋아요/댓글 강조 */}
                          {isFamily && post._count && (
                            <div className="flex items-center gap-3 text-xs text-neutral-500">
                              <span className={`flex items-center gap-1 ${post.isLiked ? 'text-red-600' : ''}`}>
                                <Heart className={`w-3.5 h-3.5 ${post.isLiked ? 'fill-red-600' : ''}`} />
                                {post._count.likes || 0}
                              </span>
                              <span className="flex items-center gap-1">
                                <MessageCircle className="w-3.5 h-3.5" />
                                {post._count.comments || 0}
                              </span>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </Link>
                ))
              ) : (
                <div className="text-center py-12">
                  <div className="w-16 h-16 bg-neutral-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                    <Camera className="w-8 h-8 text-neutral-400" />
                  </div>
                  <p className="text-sm text-neutral-600 mb-4">
                    {isFamily ? "아직 게시글이 없습니다" : "아직 게시글이 없습니다"}
                  </p>
                  {isCaregiver && (
                    <Link
                      href="/community/new"
                      className="inline-flex items-center gap-2 text-sm text-primary-600 hover:text-primary-700 font-medium"
                    >
                      <Plus className="w-4 h-4" />
                      첫 게시글 작성하기
                    </Link>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* 최근 의료 기록 - Notion 스타일 */}
          <div className="card-notion overflow-hidden">
            <div className="p-6 border-b border-neutral-200 flex items-center justify-between">
              <h2 className="text-xl font-bold text-neutral-900 flex items-center gap-2">
                <Heart className="w-5 h-5 text-red-600 fill-red-600" />
                최근 의료 기록
              </h2>
              <Link
                href="/medical"
                className="text-sm text-neutral-600 hover:text-neutral-900 font-medium flex items-center gap-1 transition-colors"
              >
                더보기
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
            <div className="p-6 space-y-3">
              {recentMedicalRecords.length > 0 ? (
                recentMedicalRecords.map((record) => (
                  <Link
                    key={record.id}
                    href={`/medical/${record.id}`}
                    className="block p-4 rounded-lg hover:bg-neutral-50 transition-colors border border-neutral-100"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1.5">
                          <span className="text-xs bg-red-50 text-red-700 px-2 py-0.5 rounded font-medium">
                            {record.category}
                          </span>
                          <span className="text-xs text-neutral-500">
                            {record.resident.name}
                          </span>
                        </div>
                        <p className="text-sm font-semibold text-neutral-900 mb-1">
                          {record.title}
                        </p>
                        <div className="flex items-center gap-1.5 text-xs text-neutral-500">
                          <Calendar className="w-3.5 h-3.5" />
                          {formatDate(record.recordDate)}
                        </div>
                      </div>
                    </div>
                  </Link>
                ))
              ) : (
                <div className="text-center py-12">
                  <div className="w-16 h-16 bg-neutral-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                    <Heart className="w-8 h-8 text-neutral-400" />
                  </div>
                  <p className="text-sm text-neutral-600 mb-4">
                    아직 의료 기록이 없습니다
                  </p>
                  {isCaregiver && (
                    <Link
                      href="/medical/new"
                      className="inline-flex items-center gap-2 text-sm text-red-600 hover:text-red-700 font-medium"
                    >
                      <Plus className="w-4 h-4" />
                      첫 의료 기록 작성하기
                    </Link>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  )
}
