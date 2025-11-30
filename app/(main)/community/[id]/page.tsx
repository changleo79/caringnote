"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { useSession } from "next-auth/react"
import AppLayout from "@/components/layout/AppLayout"
import Link from "next/link"
import Image from "next/image"
import toast from "react-hot-toast"
import { ArrowLeft, Heart, MessageCircle, Send, User, Trash2 } from "lucide-react"
import { formatDate } from "@/lib/utils"
import { Skeleton } from "@/components/ui/Skeleton"

export default function PostDetailPage() {
  const params = useParams()
  const router = useRouter()
  const { data: session } = useSession()
  const [post, setPost] = useState<any>(null)
  const [comments, setComments] = useState<any[]>([])
  const [newComment, setNewComment] = useState("")
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmittingComment, setIsSubmittingComment] = useState(false)

  // 게시글 로드
  useEffect(() => {
    const loadPost = async () => {
      try {
        const res = await fetch(`/api/posts/${params.id}`)
        const data = await res.json()
        if (res.ok) {
          setPost(data)
          setComments(data.comments || [])
        } else {
          toast.error(data.error || "게시글을 불러올 수 없습니다.")
        }
      } catch (error) {
        console.error("Error loading post:", error)
        toast.error("게시글을 불러오는 중 오류가 발생했습니다.")
      } finally {
        setIsLoading(false)
      }
    }

    if (session && params.id) {
      loadPost()
    }
  }, [session, params.id])

  // 좋아요 토글
  const handleLike = async () => {
    if (!post || !session) return

    try {
      const res = await fetch(`/api/posts/${params.id}/like`, {
        method: "POST",
      })
      const data = await res.json()

      if (res.ok) {
        setPost({
          ...post,
          isLiked: data.liked,
          _count: {
            ...post._count,
            likes: data.likeCount,
          },
        })
      }
    } catch (error) {
      console.error("Error toggling like:", error)
    }
  }

  // 댓글 작성
  const handleSubmitComment = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newComment.trim() || !session) return

    setIsSubmittingComment(true)
    try {
      const res = await fetch(`/api/posts/${params.id}/comments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: newComment }),
      })
      const data = await res.json()

      if (res.ok) {
        setComments([...comments, data])
        setNewComment("")
        setPost({
          ...post,
          _count: {
            ...post._count,
            comments: post._count.comments + 1,
          },
        })
        toast.success("댓글이 작성되었습니다!")
      } else {
        toast.error(data.error || "댓글 작성에 실패했습니다.")
      }
    } catch (error) {
      console.error("Error submitting comment:", error)
      toast.error("댓글 작성 중 오류가 발생했습니다.")
    } finally {
      setIsSubmittingComment(false)
    }
  }

  // 댓글 삭제
  const handleDeleteComment = async (commentId: string) => {
    if (!confirm("댓글을 삭제하시겠습니까?")) return

    try {
      const res = await fetch(`/api/comments/${commentId}`, {
        method: "DELETE",
      })

      if (res.ok) {
        setComments(comments.filter((c) => c.id !== commentId))
        setPost({
          ...post,
          _count: {
            ...post._count,
            comments: post._count.comments - 1,
          },
        })
        toast.success("댓글이 삭제되었습니다.")
      } else {
        const data = await res.json()
        toast.error(data.error || "댓글 삭제에 실패했습니다.")
      }
    } catch (error) {
      console.error("Error deleting comment:", error)
      toast.error("댓글 삭제 중 오류가 발생했습니다.")
    }
  }

  if (!session) {
    return null
  }

  if (isLoading) {
    return (
      <AppLayout>
        <div className="section-container py-10">
          <Skeleton variant="rectangular" className="h-96 w-full rounded-xl" />
        </div>
      </AppLayout>
    )
  }

  if (!post) {
    return (
      <AppLayout>
        <div className="section-container py-10">
          <div className="card-notion p-12 text-center">
            <h2 className="text-xl font-bold text-neutral-900 mb-2">
              게시글을 찾을 수 없습니다
            </h2>
            <Link href="/community" className="btn-linear-primary inline-flex items-center gap-2 mt-6">
              <ArrowLeft className="w-4 h-4" />
              커뮤니티로 돌아가기
            </Link>
          </div>
        </div>
      </AppLayout>
    )
  }

  return (
    <AppLayout>
      <div className="section-container py-10">
        {/* Back Button */}
        <Link
          href="/community"
          className="inline-flex items-center gap-2 text-sm text-neutral-600 hover:text-neutral-900 mb-8 transition-colors font-medium"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>뒤로가기</span>
        </Link>

        {/* Post Content - Notion 스타일 */}
        <div className="card-notion overflow-hidden mb-6">
          {/* Author Info */}
          <div className="p-6 border-b border-neutral-200 flex items-center gap-3">
            <div className="w-10 h-10 bg-neutral-100 rounded-lg flex items-center justify-center">
              <User className="w-5 h-5 text-neutral-400" />
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                {post.resident && (
                  <span className="text-xs bg-primary-50 text-primary-700 px-2 py-0.5 rounded font-medium">
                    {post.resident.name}
                  </span>
                )}
              </div>
              <p className="text-sm font-semibold text-neutral-900">{post.author.name}</p>
              <p className="text-xs text-neutral-500">{formatDate(post.createdAt)}</p>
            </div>
          </div>

          {/* Images */}
          {post.images && post.images.length > 0 && (
            <div className="space-y-3 p-6 pt-6">
              {post.images.map((imageUrl: string, index: number) => (
                <div key={index} className="relative w-full aspect-auto max-h-96 overflow-hidden rounded-lg bg-neutral-100">
                  <Image
                    src={imageUrl}
                    alt={`이미지 ${index + 1}`}
                    width={800}
                    height={600}
                    className="w-full h-auto object-contain"
                  />
                </div>
              ))}
            </div>
          )}

          {/* Title & Content */}
          <div className="p-6 pt-0">
            {post.title && (
              <h2 className="text-2xl font-bold text-neutral-900 mb-3">{post.title}</h2>
            )}
            {post.content && (
              <p className="text-neutral-700 whitespace-pre-wrap leading-relaxed">{post.content}</p>
            )}
          </div>

          {/* Actions - 좋아요/댓글 강조 */}
          <div className="px-6 pb-6 pt-0 flex items-center gap-4 border-t border-neutral-200 pt-6">
            <button
              onClick={handleLike}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all font-semibold ${
                post.isLiked
                  ? "bg-red-50 text-red-600 hover:bg-red-100"
                  : "bg-neutral-100 text-neutral-600 hover:bg-neutral-200"
              }`}
            >
              <Heart className={`w-5 h-5 ${post.isLiked ? "fill-red-600" : ""}`} />
              <span>{post._count.likes || 0}</span>
            </button>
            <div className="flex items-center gap-2 px-4 py-2 rounded-lg bg-neutral-100 text-neutral-600">
              <MessageCircle className="w-5 h-5" />
              <span className="font-semibold">{post._count.comments || 0}</span>
            </div>
          </div>
        </div>

        {/* Comments Section - Notion 스타일 */}
        <div className="card-notion overflow-hidden">
          <div className="p-6 border-b border-neutral-200">
            <h3 className="text-lg font-bold text-neutral-900">댓글 {comments.length}</h3>
          </div>

          {/* Comments List */}
          <div className="p-6 space-y-4 max-h-96 overflow-y-auto">
            {comments.length > 0 ? (
              comments.map((comment) => (
                <div key={comment.id} className="flex items-start gap-3 pb-4 border-b border-neutral-100 last:border-0 last:pb-0">
                  <div className="w-8 h-8 bg-neutral-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <User className="w-4 h-4 text-neutral-400" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <p className="text-sm font-semibold text-neutral-900">{comment.author.name}</p>
                      {comment.author.id === session.user.id && (
                        <button
                          onClick={() => handleDeleteComment(comment.id)}
                          className="text-xs text-red-600 hover:text-red-700 font-medium"
                        >
                          삭제
                        </button>
                      )}
                    </div>
                    <p className="text-sm text-neutral-700 mb-1">{comment.content}</p>
                    <p className="text-xs text-neutral-500">{formatDate(comment.createdAt)}</p>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-center text-neutral-500 py-8">아직 댓글이 없습니다.</p>
            )}
          </div>

          {/* Comment Form - Notion 스타일 */}
          <div className="p-6 border-t border-neutral-200 bg-neutral-50">
            <form onSubmit={handleSubmitComment} className="flex gap-3">
              <input
                type="text"
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="댓글을 입력하세요..."
                className="flex-1 input-vercel"
                disabled={isSubmittingComment}
              />
              <button
                type="submit"
                disabled={!newComment.trim() || isSubmittingComment}
                className="btn-linear-primary px-4 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </div>
        </div>
      </div>
    </AppLayout>
  )
}
