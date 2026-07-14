"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";
import { PageHeader } from "@/components/calm/PageHeader";
import { EmptyState } from "@/components/calm/EmptyState";
import { PHOTOS } from "@/lib/photos";

interface Post {
  id: string;
  title: string | null;
  content: string | null;
  images: string[];
  createdAt: string;
  author: { name: string };
  _count: { comments: number; likes: number };
}

export default function CommunityPage() {
  const { data: session, status } = useSession();
  const isStaff = ["ADMIN", "MANAGER", "CAREGIVER"].includes(session?.user?.role || "");
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status === "unauthenticated") redirect("/auth/login");
  }, [status]);

  useEffect(() => {
    if (!session) return;
    fetch("/api/posts")
      .then((r) => r.json())
      .then((d) => setPosts(Array.isArray(d) ? d : []))
      .catch(() => setPosts([]))
      .finally(() => setLoading(false));
  }, [session]);

  return (
    <div>
      <PageHeader
        title="앨범"
        description="시설의 일상 사진"
        action={
          isStaff ? (
            <Link href="/community/new" className="btn-primary">
              올리기
            </Link>
          ) : undefined
        }
      />

      {loading ? (
        <div className="grid grid-cols-2 gap-2 md:grid-cols-3">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div
              key={i}
              className="aspect-[4/5] animate-pulse bg-[var(--sn-surface-muted)]"
            />
          ))}
        </div>
      ) : posts.length === 0 ? (
        <EmptyState
          title="아직 사진이 없습니다"
          description="보호사가 올린 시설 앨범이 여기에 모입니다."
          action={
            isStaff ? (
              <Link href="/community/new" className="btn-primary">
                첫 사진 올리기
              </Link>
            ) : undefined
          }
        />
      ) : (
        <div className="columns-2 gap-2 md:columns-3 md:gap-3">
          {posts.map((post, i) => {
            const photo =
              post.images?.[0] || PHOTOS.moments[i % PHOTOS.moments.length];
            return (
              <Link
                key={post.id}
                href={`/community/${post.id}`}
                className="mb-2 block break-inside-avoid md:mb-3"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={photo}
                  alt=""
                  className="w-full object-cover"
                  style={{
                    aspectRatio: i % 3 === 0 ? "4/5" : i % 3 === 1 ? "1/1" : "3/4",
                  }}
                />
                <div className="mt-2 px-0.5">
                  <p className="line-clamp-2 text-sm text-[var(--sn-ink)]">
                    {post.content || post.title || "일상"}
                  </p>
                  <p className="mt-1 text-xs text-[var(--sn-ink-faint)]">
                    {post.author.name} · 공감 {post._count.likes}
                  </p>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
