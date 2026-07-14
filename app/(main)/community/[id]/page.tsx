"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { useSession } from "next-auth/react";
import Link from "next/link";
import Image from "next/image";
import toast from "react-hot-toast";
import { ArrowLeft, Heart, Send } from "lucide-react";
import { formatDate } from "@/lib/utils";

export default function PostDetailPage() {
  const params = useParams();
  const { data: session } = useSession();
  const [post, setPost] = useState<any>(null);
  const [comments, setComments] = useState<any[]>([]);
  const [newComment, setNewComment] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmittingComment, setIsSubmittingComment] = useState(false);
  const [heartPop, setHeartPop] = useState(false);

  useEffect(() => {
    const loadPost = async () => {
      try {
        const res = await fetch(`/api/posts/${params.id}`);
        const data = await res.json();
        if (res.ok) {
          setPost(data);
          setComments(data.comments || []);
        } else {
          toast.error(data.error || "게시글을 불러올 수 없습니다.");
        }
      } catch {
        toast.error("게시글을 불러오는 중 오류가 발생했습니다.");
      } finally {
        setIsLoading(false);
      }
    };
    if (session && params.id) loadPost();
  }, [session, params.id]);

  const handleLike = async () => {
    if (!post || !session) return;
    try {
      const res = await fetch(`/api/posts/${params.id}/like`, { method: "POST" });
      const data = await res.json();
      if (res.ok) {
        setHeartPop(true);
        setTimeout(() => setHeartPop(false), 450);
        setPost({
          ...post,
          isLiked: data.liked,
          _count: { ...post._count, likes: data.likeCount },
        });
      }
    } catch {
      /* ignore */
    }
  };

  const handleSubmitComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim() || !session) return;
    setIsSubmittingComment(true);
    try {
      const res = await fetch(`/api/posts/${params.id}/comments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: newComment }),
      });
      const data = await res.json();
      if (res.ok) {
        setComments([...comments, data]);
        setNewComment("");
        setPost({
          ...post,
          _count: { ...post._count, comments: (post._count?.comments || 0) + 1 },
        });
      } else {
        toast.error(data.error || "댓글 작성에 실패했습니다.");
      }
    } catch {
      toast.error("댓글 작성 중 오류가 발생했습니다.");
    } finally {
      setIsSubmittingComment(false);
    }
  };

  const handleDeleteComment = async (commentId: string) => {
    if (!confirm("댓글을 삭제하시겠습니까?")) return;
    try {
      const res = await fetch(`/api/comments/${commentId}`, { method: "DELETE" });
      if (res.ok) {
        setComments(comments.filter((c) => c.id !== commentId));
        setPost({
          ...post,
          _count: { ...post._count, comments: post._count.comments - 1 },
        });
        toast.success("댓글이 삭제되었습니다.");
      } else {
        const data = await res.json();
        toast.error(data.error || "댓글 삭제에 실패했습니다.");
      }
    } catch {
      toast.error("댓글 삭제 중 오류가 발생했습니다.");
    }
  };

  if (!session) return null;

  if (isLoading) {
    return (
      <div className="mx-auto max-w-xl py-16 text-center text-[var(--sn-ink-muted)]">
        불러오는 중…
      </div>
    );
  }

  if (!post) {
    return (
      <div className="mx-auto max-w-xl py-16 text-center">
        <h2 className="page-title">게시글을 찾을 수 없습니다</h2>
        <Link href="/community" className="btn-primary mt-6 inline-flex">
          <ArrowLeft className="h-4 w-4" />
          앨범으로
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-xl">
      <Link
        href="/community"
        className="mb-6 inline-flex min-h-[48px] items-center gap-2 text-sm font-medium text-[var(--sn-ink-muted)]"
      >
        <ArrowLeft className="h-4 w-4" />
        앨범
      </Link>

      {post.images && post.images.length > 0 && (
        <div className="-mx-4 mb-6 space-y-2 sm:-mx-6">
          {post.images.map((imageUrl: string, index: number) => (
            <div key={index} className="relative w-full overflow-hidden bg-[var(--sn-surface-muted)]">
              <Image
                src={imageUrl}
                alt=""
                width={1200}
                height={900}
                className="h-auto w-full object-cover"
              />
            </div>
          ))}
        </div>
      )}

      <div className="mb-2 text-sm text-[var(--sn-ink-faint)]">
        {post.author?.name} · {formatDate(post.createdAt)}
        {post.resident ? ` · ${post.resident.name}` : ""}
      </div>
      {post.title && (
        <h1 className="font-display text-2xl font-semibold text-[var(--sn-ink)]">
          {post.title}
        </h1>
      )}
      {post.content && (
        <p className="mt-3 whitespace-pre-wrap leading-relaxed text-[var(--sn-ink)]">
          {post.content}
        </p>
      )}

      <button
        type="button"
        onClick={handleLike}
        className={`mt-6 inline-flex min-h-[48px] items-center gap-2 text-[var(--sn-ink)] ${
          heartPop ? "sn-heart-pop" : ""
        }`}
      >
        <Heart
          className={`h-6 w-6 ${
            post.isLiked ? "fill-[var(--sn-caution)] text-[var(--sn-caution)]" : ""
          }`}
        />
        <span className="font-semibold">{post._count?.likes || 0}</span>
      </button>

      <section className="mt-10 border-t border-[var(--sn-line)] pt-8">
        <h2 className="mb-4 text-lg font-semibold text-[var(--sn-ink)]">
          댓글 {comments.length}
        </h2>

        <ul className="mb-6 divide-y divide-[var(--sn-line)]">
          {comments.length === 0 ? (
            <li className="py-6 text-sm text-[var(--sn-ink-faint)]">아직 댓글이 없습니다.</li>
          ) : (
            comments.map((comment) => (
              <li key={comment.id} className="py-4">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-sm font-semibold text-[var(--sn-ink)]">
                      {comment.author.name}
                    </p>
                    <p className="mt-1 text-sm text-[var(--sn-ink-muted)]">
                      {comment.content}
                    </p>
                    <p className="mt-1 text-xs text-[var(--sn-ink-faint)]">
                      {formatDate(comment.createdAt)}
                    </p>
                  </div>
                  {comment.author.id === session.user.id && (
                    <button
                      type="button"
                      onClick={() => handleDeleteComment(comment.id)}
                      className="text-xs text-[var(--sn-caution)]"
                    >
                      삭제
                    </button>
                  )}
                </div>
              </li>
            ))
          )}
        </ul>

        <form onSubmit={handleSubmitComment} className="flex gap-2">
          <input
            type="text"
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="댓글을 입력하세요"
            className="input flex-1"
            disabled={isSubmittingComment}
          />
          <button
            type="submit"
            disabled={!newComment.trim() || isSubmittingComment}
            className="btn-primary px-4"
          >
            <Send className="h-4 w-4" />
          </button>
        </form>
      </section>
    </div>
  );
}
