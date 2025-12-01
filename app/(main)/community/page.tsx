import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { redirect } from "next/navigation"
import AppLayout from "@/components/layout/AppLayout"
import Link from "next/link"
import { Camera, Plus, ImageIcon, Heart, MessageCircle, User } from "lucide-react"
import { formatDate } from "@/lib/utils"
import { prisma } from "@/lib/prisma"
import Image from "next/image"

export default async function CommunityPage() {
  const session = await getServerSession(authOptions)

  if (!session) {
    redirect("/auth/login")
  }

  // 게시글 목록 가져오기
  let posts: any[] = []
  
  try {
    if (session.user.careCenterId) {
      const postsData = await prisma.post.findMany({
        where: {
          careCenterId: session.user.careCenterId,
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
  } catch (error) {
    console.error("Failed to fetch posts:", error)
  }

  return (
    <AppLayout>
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
              커뮤니티
            </h1>
            <p className="text-gray-600">
              부모님의 일상을 함께 공유해보세요
            </p>
          </div>
          <Link
            href="/community/new"
            className="btn-primary inline-flex items-center gap-2"
          >
            <Plus className="w-5 h-5" />
            <span className="hidden sm:inline">게시글 작성</span>
            <span className="sm:hidden">작성</span>
          </Link>
        </div>

        {/* Posts List */}
        {posts.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {posts.map((post) => (
              <Link
                key={post.id}
                href={`/community/${post.id}`}
                className="bg-white rounded-2xl shadow-soft border border-gray-100 overflow-hidden card-hover group"
              >
                {/* 이미지 */}
                {post.images && post.images.length > 0 && (
                  <div className="relative w-full aspect-square overflow-hidden bg-gray-100">
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
                  <div className="flex items-center gap-2 mb-3">
                    {post.resident && (
                      <span className="text-xs bg-primary-100 text-primary-700 px-2 py-1 rounded-full font-medium">
                        {post.resident.name}
                      </span>
                    )}
                    <span className="text-xs text-gray-500">
                      {post.author.name}
                    </span>
                  </div>
                  
                  {post.title && (
                    <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2 group-hover:text-primary-600 transition-colors">
                      {post.title}
                    </h3>
                  )}
                  
                  {post.content && (
                    <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                      {post.content}
                    </p>
                  )}

                  <div className="flex items-center justify-between text-sm text-gray-500">
                    <span>{formatDate(post.createdAt)}</span>
                    <div className="flex items-center gap-3">
                      <span className="flex items-center gap-1">
                        <Heart className={`w-4 h-4 ${post.isLiked ? 'fill-red-500 text-red-500' : ''}`} />
                        {post._count.likes}
                      </span>
                      <span className="flex items-center gap-1">
                        <MessageCircle className="w-4 h-4" />
                        {post._count.comments}
                      </span>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-3xl shadow-soft border border-gray-100 p-12 text-center">
            <div className="w-24 h-24 bg-gradient-to-br from-primary-100 to-accent-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Camera className="w-12 h-12 text-primary-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-3">
              아직 게시글이 없습니다
            </h2>
            <p className="text-gray-600 mb-8 max-w-md mx-auto">
              첫 번째 게시글을 작성하여 부모님의 일상을 가족들과 함께 공유해보세요
            </p>
            <Link
              href="/community/new"
              className="btn-primary inline-flex items-center gap-2"
            >
              <Plus className="w-5 h-5" />
              첫 게시글 작성하기
            </Link>
          </div>
        )}
      </div>
    </AppLayout>
  )
}
