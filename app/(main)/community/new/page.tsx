"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import Link from "next/link";
import toast from "react-hot-toast";
import { ArrowLeft, Camera, X } from "lucide-react";
import { PageHeader } from "@/components/calm/PageHeader";

export default function NewPostPage() {
  const router = useRouter();
  const { data: session } = useSession();
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    residentId: "",
    category: "Daily",
    images: [] as string[],
  });
  const [residents, setResidents] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [loadingResidents, setLoadingResidents] = useState(true);
  const [uploadingImages, setUploadingImages] = useState<Set<number>>(new Set());

  useEffect(() => {
    const loadResidents = async () => {
      try {
        const res = await fetch("/api/residents");
        const data = await res.json();
        if (res.ok && Array.isArray(data)) setResidents(data);
      } catch {
        /* ignore */
      } finally {
        setLoadingResidents(false);
      }
    };
    if (session) loadResidents();
  }, [session]);

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const fileArray = Array.from(files);
    const maxFiles = 10;
    const remainingSlots = maxFiles - formData.images.length;

    if (fileArray.length > remainingSlots) {
      toast.error(`최대 ${maxFiles}개까지 업로드 가능합니다.`);
      return;
    }

    for (let i = 0; i < Math.min(fileArray.length, remainingSlots); i++) {
      const file = fileArray[i];
      const imageIndex = formData.images.length + i;
      setUploadingImages((prev) => new Set(prev).add(imageIndex));

      try {
        const uploadFormData = new FormData();
        uploadFormData.append("file", file);
        const response = await fetch("/api/upload", {
          method: "POST",
          body: uploadFormData,
        });
        const data = await response.json();
        if (response.ok) {
          setFormData((prev) => ({
            ...prev,
            images: [...prev.images, data.url],
          }));
        } else {
          toast.error(data.error || "업로드 실패");
        }
      } catch {
        toast.error("업로드 중 오류가 발생했습니다.");
      } finally {
        setUploadingImages((prev) => {
          const next = new Set(prev);
          next.delete(imageIndex);
          return next;
        });
      }
    }
  };

  const handleRemoveImage = (index: number) => {
    setFormData({
      ...formData,
      images: formData.images.filter((_, i) => i !== index),
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const response = await fetch("/api/posts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: formData.title || null,
          content: formData.content || null,
          images: formData.images.length > 0 ? formData.images : null,
          residentId: formData.residentId || null,
          category: formData.category,
        }),
      });
      const data = await response.json();
      if (response.ok) {
        toast.success("앨범에 올렸습니다.");
        router.push("/community");
        router.refresh();
      } else {
        toast.error(data.error || "게시글 작성에 실패했습니다.");
      }
    } catch {
      toast.error("게시글 작성 중 오류가 발생했습니다.");
    } finally {
      setIsLoading(false);
    }
  };

  if (!session) return null;

  return (
    <div className="mx-auto max-w-xl">
      <Link
        href="/community"
        className="mb-6 inline-flex min-h-[48px] items-center gap-2 text-sm font-medium text-[var(--sn-ink-muted)]"
      >
        <ArrowLeft className="h-4 w-4" />
        앨범
      </Link>

      <PageHeader title="사진 올리기" description="일상의 한 장면을 공유합니다." />

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="label">사진</label>
          <div className="space-y-3">
            {formData.images.map((imageUrl, index) => (
              <div key={index} className="relative">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={imageUrl}
                  alt={`선택한 사진 ${index + 1}`}
                  className="w-full object-cover"
                  style={{ maxHeight: 320 }}
                />
                <button
                  type="button"
                  onClick={() => handleRemoveImage(index)}
                  className="absolute right-2 top-2 flex h-10 w-10 items-center justify-center bg-[var(--sn-ink)] text-white"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            ))}
            {uploadingImages.size > 0 && (
              <p className="text-sm text-[var(--sn-ink-muted)]">업로드 중…</p>
            )}
            {formData.images.length < 10 && (
              <label className="flex min-h-[120px] cursor-pointer flex-col items-center justify-center gap-2 border border-dashed border-[var(--sn-line-strong)] text-[var(--sn-ink-muted)]">
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleFileSelect}
                  className="hidden"
                  disabled={isLoading || uploadingImages.size > 0}
                />
                <Camera className="h-7 w-7" />
                <span className="text-sm">사진 선택</span>
              </label>
            )}
          </div>
        </div>

        <div>
          <label className="label">어르신 (선택)</label>
          {loadingResidents ? (
            <p className="text-[var(--sn-ink-muted)]">불러오는 중…</p>
          ) : (
            <select
              value={formData.residentId}
              onChange={(e) =>
                setFormData({ ...formData, residentId: e.target.value })
              }
              className="input"
            >
              <option value="">전체 공유</option>
              {residents.map((resident) => (
                <option key={resident.id} value={resident.id}>
                  {resident.name}
                  {resident.roomNumber ? ` (${resident.roomNumber})` : ""}
                </option>
              ))}
            </select>
          )}
        </div>

        <div>
          <label className="label">한 줄 이야기</label>
          <textarea
            value={formData.content}
            onChange={(e) =>
              setFormData({ ...formData, content: e.target.value })
            }
            rows={4}
            className="input resize-none"
            placeholder="오늘 있었던 일을 짧게"
          />
        </div>

        <div className="flex gap-3 pt-2">
          <Link href="/community" className="btn-secondary flex-1 text-center">
            취소
          </Link>
          <button type="submit" disabled={isLoading} className="btn-primary flex-1">
            {isLoading ? "올리는 중…" : "올리기"}
          </button>
        </div>
      </form>
    </div>
  );
}
