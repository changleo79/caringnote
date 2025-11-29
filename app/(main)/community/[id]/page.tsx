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
        <div className="container mx-auto px-4 py-8 max-w-4xl">
          <Skeleton variant="rectangular" className="h-96 w-full" />
        </div>
      </AppLayout>
    )
  }

  if (!post) {
    return (
      <AppLayout>
        <div className="container mx-auto px-4 py-8 max-w-4xl">
          <div className="bg-white rounded-3xl shadow-soft border border-gray-100 p-12 text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-3">
              게시글을 찾을 수 없습니다
            </h2>
            <Link href="/community" className="btn-primary inline-flex items-center gap-2 mt-4">
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
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Back Button */}
        <Link
          href="/community"
          className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 mb-6 transition-colors group"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          <span>뒤로가기</span>
        </Link>

        {/* Post Content */}
        <div className="bg-white rounded-3xl shadow-soft border border-gray-100 overflow-hidden mb-6">
          {/* Author Info */}
          <div className="p-6 border-b border-gray-100 flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-br from-primary-400 to-accent-400 rounded-full flex items-center justify-center">
              <User className="w-6 h-6 text-white" />
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2">
                {post.resident && (
                  <span className="text-xs bg-primary-100 text-primary-700 px-2 py-1 rounded-full font-medium">
                    {post.resident.name}
                  </span>
                )}
              </div>
              <p className="text-sm font-semibold text-gray-900">{post.author.name}</p>
              <p className="text-xs text-gray-500">{formatDate(post.createdAt)}</p>
            </div>
          </div>

          {/* Images */}
          {post.images && post.images.length > 0 && (
            <div className="space-y-2 p-6 pt-0">
              {post.images.map((imageUrl: string, index: number) => (
                <div key={index} className="relative w-full aspect-auto max-h-96 overflow-hidden rounded-xl">
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
              <h2 className="text-2xl font-bold text-gray-900 mb-3">{post.title}</h2>
            )}
            {post.content && (
              <p className="text-gray-700 whitespace-pre-wrap leading-relaxed">{post.content}</p>
            )}
          </div>

          {/* Actions */}
          <div className="px-6 pb-6 pt-0 flex items-center gap-6">
            <button
              onClick={handleLike}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all ${
                post.isLiked
                  ? "bg-red-50 text-red-600"
                  : "bg-gray-50 text-gray-600 hover:bg-gray-100"
              }`}
            >
              <Heart className={`w-5 h-5 ${post.isLiked ? "fill-red-600" : ""}`} />
              <span className="font-medium">{post._count.likes}</span>
            </button>
            <div className="flex items-center gap-2 text-gray-600">
              <MessageCircle className="w-5 h-5" />
              <span className="font-medium">{post._count.comments}</span>
            </div>
          </div>
        </div>

        {/* Comments Section */}
        <div className="bg-white rounded-3xl shadow-soft border border-gray-100 overflow-hidden">
          <div className="p-6 border-b border-gray-100">
            <h3 className="text-xl font-bold text-gray-900">댓글 {comments.length}</h3>
          </div>

          {/* Comments List */}
          <div className="p-6 space-y-4 max-h-96 overflow-y-auto">
            {comments.length > 0 ? (
              comments.map((comment) => (
                <div key={comment.id} className="flex items-start gap-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-primary-400 to-accent-400 rounded-full flex items-center justify-center flex-shrink-0">
                    <User className="w-5 h-5 text-white" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <p className="text-sm font-semibold text-gray-900">{comment.author.name}</p>
                      {comment.author.id === session.user.id && (
                        <button
                          onClick={() => handleDeleteComment(comment.id)}
                          className="text-xs text-red-600 hover:text-red-700"
                        >
                          삭제
                        </button>
                      )}
                    </div>
                    <p className="text-sm text-gray-700">{comment.content}</p>
                    <p className="text-xs text-gray-500 mt-1">{formatDate(comment.createdAt)}</p>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-center text-gray-500 py-8">아직 댓글이 없습니다.</p>
            )}
          </div>

          {/* Comment Form */}
          <div className="p-6 border-t border-gray-100">
            <form onSubmit={handleSubmitComment} className="flex gap-3">
              <input
                type="text"
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="댓글을 입력하세요..."
                className="flex-1 px-4 py-2.5 border border-gray-200 rounded-xl input-focus outline-none transition-all bg-white text-gray-900 placeholder:text-gray-400"
                disabled={isSubmittingComment}
              />
              <button
                type="submit"
                disabled={!newComment.trim() || isSubmittingComment}
                className="btn-primary px-6 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Send className="w-5 h-5" />
              </button>
            </form>
          </div>
        </div>
      </div>
    </AppLayout>
  )
}
