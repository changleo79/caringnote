import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { redirect } from "next/navigation"
import AppLayout from "@/components/layout/AppLayout"
import Link from "next/link"
import { Camera, Plus, Heart, MessageCircle } from "lucide-react"
import { formatDate } from "@/lib/utils"
import { prisma } from "@/lib/prisma"
import Image from "next/image"

export default async function CommunityPage() {
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

  // 게시글 목록 가져오기
  let posts: any[] = []
  
  try {
    if (isFamily) {
      // 가족회원: 연결된 입소자의 게시글만
      if (connectedResidentIds.length > 0) {
        const postsData = await prisma.post.findMany({
          where: {
            residentId: { in: connectedResidentIds },
          },
          include: {
            author: {
              select: {
                id: true,
                name: true,
                avatarUrl: true,
              },
            },
            resident: {
              select: {
                id: true,
                name: true,
              },
            },
            _count: {
              select: {
                comments: true,
                likes: true,
              },
            },
          },
          orderBy: {
            createdAt: "desc",
          },
          take: 50,
        })

        // 좋아요 여부 확인
        posts = await Promise.all(
          postsData.map(async (post) => {
            const isLiked = await prisma.postLike.findFirst({
              where: {
                postId: post.id,
                userId: session.user.id!,
              },
            })

            return {
              ...post,
              images: post.images ? JSON.parse(post.images) : [],
              isLiked: !!isLiked,
            }
          })
        )
      }
    } else {
      // 요양원직원: 요양원 전체 게시글
      const careCenterId = session.user.careCenterId
      if (careCenterId) {
        const postsData = await prisma.post.findMany({
          where: {
            careCenterId: careCenterId,
          },
          include: {
            author: {
              select: {
                id: true,
                name: true,
                avatarUrl: true,
              },
            },
            resident: {
              select: {
                id: true,
                name: true,
              },
            },
            _count: {
              select: {
                comments: true,
                likes: true,
              },
            },
          },
          orderBy: {
            createdAt: "desc",
          },
          take: 50,
        })

        // 좋아요 여부 확인
        posts = await Promise.all(
          postsData.map(async (post) => {
            const isLiked = await prisma.postLike.findFirst({
              where: {
                postId: post.id,
                userId: session.user.id!,
              },
            })

            return {
              ...post,
              images: post.images ? JSON.parse(post.images) : [],
              isLiked: !!isLiked,
            }
          })
        )
      }
    }
  } catch (error) {
    console.error("Failed to fetch posts:", error)
  }

  return (
    <AppLayout>
      <div className="section-container py-10">
        {/* Header - Notion 스타일 */}
        <div className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-neutral-900 mb-2 tracking-tight">
              커뮤니티
            </h1>
            <p className="text-neutral-600">
              {isFamily ? "연결된 입소자의 일상을 확인하세요" : "부모님의 일상을 함께 공유해보세요"}
            </p>
          </div>
          {isCaregiver && (
            <Link
              href="/community/new"
              className="btn-linear-primary inline-flex items-center justify-center gap-2 flex-shrink-0 whitespace-nowrap"
            >
              <Plus className="w-4 h-4" />
              <span>게시글 작성</span>
            </Link>
          )}
        </div>

        {/* Posts List - Notion 스타일 */}
        {posts.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {posts.map((post) => (
              <Link
                key={post.id}
                href={`/community/${post.id}`}
                className="card-notion overflow-hidden card-hover-linear group"
              >
                {/* 이미지 */}
                {post.images && post.images.length > 0 && (
                  <div className="relative w-full aspect-square overflow-hidden bg-neutral-100">
                    <Image
                      src={post.images[0]}
                      alt={post.title || "게시글 이미지"}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    />
                  </div>
                )}
                
                {/* 내용 */}
                <div className="p-5">
                  <div className="flex items-center gap-2 mb-3 flex-wrap">
                    {post.resident && (
                      <span className="text-xs bg-primary-50 text-primary-700 px-2.5 py-1 rounded font-medium">
                        {post.resident.name}
                      </span>
                    )}
                    <span className="text-xs text-neutral-500">
                      {post.author.name}
                    </span>
                  </div>
                  
                  {post.title && (
                    <h3 className="font-semibold text-neutral-900 mb-2 line-clamp-2 group-hover:text-primary-600 transition-colors">
                      {post.title}
                    </h3>
                  )}
                  
                  {post.content && (
                    <p className="text-sm text-neutral-600 mb-4 line-clamp-2">
                      {post.content}
                    </p>
                  )}

                  <div className="flex items-center justify-between text-sm text-neutral-500 pt-3 border-t border-neutral-100">
                    <span>{formatDate(post.createdAt)}</span>
                    <div className="flex items-center gap-3">
                      <span className="flex items-center gap-1.5">
                        <Heart className={`w-4 h-4 ${post.isLiked ? 'fill-red-500 text-red-500' : ''}`} />
                        {post._count?.likes || 0}
                      </span>
                      <span className="flex items-center gap-1.5">
                        <MessageCircle className="w-4 h-4" />
                        {post._count?.comments || 0}
                      </span>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="card-notion p-12 text-center">
            <div className="w-16 h-16 bg-primary-100 rounded-lg flex items-center justify-center mx-auto mb-4">
              <Camera className="w-8 h-8 text-primary-600" />
            </div>
            <h2 className="text-xl font-bold text-neutral-900 mb-2">
              아직 게시글이 없습니다
            </h2>
            <p className="text-sm text-neutral-600 mb-6 max-w-md mx-auto">
              {isFamily 
                ? "연결된 입소자의 게시글이 아직 없습니다"
                : "첫 번째 게시글을 작성하여 부모님의 일상을 가족들과 함께 공유해보세요"}
            </p>
            {isCaregiver && (
              <Link
                href="/community/new"
                className="btn-linear-primary inline-flex items-center gap-2"
              >
                <Plus className="w-4 h-4" />
                첫 게시글 작성하기
              </Link>
            )}
          </div>
        )}
      </div>
    </AppLayout>
  )
}
