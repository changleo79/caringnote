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
      <div className="container mx-auto px-6 py-12 max-w-7xl">
        {/* Header */}
        <div className="mb-12 flex items-center justify-between">
          <div>
            <h1 className="text-5xl md:text-6xl font-black text-neutral-900 mb-4 tracking-tight">
              커뮤니티
            </h1>
            <p className="text-xl text-neutral-600 font-bold">
              부모님의 일상을 함께 공유해보세요
            </p>
          </div>
          <Link
            href="/community/new"
            className="btn-primary inline-flex items-center gap-3 px-8 py-5"
          >
            <Plus className="w-6 h-6" />
            <span className="hidden sm:inline font-bold text-lg">게시글 작성</span>
            <span className="sm:hidden font-bold">작성</span>
          </Link>
        </div>

        {/* Posts List */}
        {posts.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {posts.map((post) => (
              <Link
                key={post.id}
                href={`/community/${post.id}`}
                className="bg-gradient-to-br from-white via-blue-50/20 to-white rounded-3xl shadow-3d border-2 border-blue-200/50 overflow-hidden card-hover group backdrop-blur-sm"
              >
                {/* 이미지 */}
                {post.images && post.images.length > 0 && (
                  <div className="relative w-full aspect-square overflow-hidden bg-gradient-to-br from-blue-100 to-blue-50">
                    <Image
                      src={post.images[0]}
                      alt={post.title || "게시글 이미지"}
                      fill
                      className="object-cover group-hover:scale-110 transition-transform duration-700"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                  </div>
                )}
                
                {/* 내용 */}
                <div className="p-6">
                  <div className="flex items-center gap-2 mb-4">
                    {post.resident && (
                      <span className="text-xs bg-gradient-to-r from-primary-500 to-primary-600 text-white px-3 py-1.5 rounded-full font-bold shadow-lg">
                        {post.resident.name}
                      </span>
                    )}
                    <span className="text-xs text-neutral-500 font-semibold">
                      {post.author.name}
                    </span>
                  </div>
                  
                  {post.title && (
                    <h3 className="font-black text-xl text-neutral-900 mb-3 line-clamp-2 group-hover:text-primary-600 transition-colors">
                      {post.title}
                    </h3>
                  )}
                  
                  {post.content && (
                    <p className="text-sm text-neutral-600 mb-5 line-clamp-2 font-medium">
                      {post.content}
                    </p>
                  )}

                  <div className="flex items-center justify-between text-sm">
                    <span className="text-neutral-500 font-semibold">{formatDate(post.createdAt)}</span>
                    <div className="flex items-center gap-4">
                      <span className="flex items-center gap-1.5 font-bold">
                        <Heart className={`w-5 h-5 ${post.isLiked ? 'fill-red-500 text-red-500' : 'text-neutral-400'}`} />
                        <span className={post.isLiked ? 'text-red-500' : 'text-neutral-500'}>{post._count.likes}</span>
                      </span>
                      <span className="flex items-center gap-1.5 text-neutral-500 font-bold">
                        <MessageCircle className="w-5 h-5" />
                        {post._count.comments}
                      </span>
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="bg-gradient-to-br from-white via-blue-50/30 to-white rounded-3xl shadow-3d border-2 border-blue-200/50 p-16 text-center backdrop-blur-sm">
            <div className="w-32 h-32 bg-gradient-to-br from-primary-500 to-accent-500 rounded-3xl flex items-center justify-center mx-auto mb-8 shadow-2xl shadow-primary-500/40">
              <Camera className="w-16 h-16 text-white" />
            </div>
            <h2 className="text-3xl font-black text-neutral-900 mb-4">
              아직 게시글이 없습니다
            </h2>
            <p className="text-lg text-neutral-600 mb-10 max-w-md mx-auto font-bold">
              첫 번째 게시글을 작성하여 부모님의 일상을 가족들과 함께 공유해보세요
            </p>
            <Link
              href="/community/new"
              className="btn-primary inline-flex items-center gap-3 px-10 py-5"
            >
              <Plus className="w-6 h-6" />
              <span className="font-bold text-lg">첫 게시글 작성하기</span>
            </Link>
          </div>
        )}
      </div>
    </AppLayout>
  )
}
