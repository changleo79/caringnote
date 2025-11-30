"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useSession } from "next-auth/react"
import Link from "next/link"
import AppLayout from "@/components/layout/AppLayout"
import toast from "react-hot-toast"
import { ArrowLeft, Camera, X, User } from "lucide-react"

export default function NewPostPage() {
  const router = useRouter()
  const { data: session } = useSession()
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    residentId: "",
    category: "Daily",
    images: [] as string[],
  })
  const [residents, setResidents] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [loadingResidents, setLoadingResidents] = useState(true)

  // 입소자 목록 불러오기
  useEffect(() => {
    const loadResidents = async () => {
      try {
        const res = await fetch("/api/residents")
        const data = await res.json()
        if (res.ok && Array.isArray(data)) {
          setResidents(data)
        }
      } catch (error) {
        console.error("Error loading residents:", error)
      } finally {
        setLoadingResidents(false)
      }
    }

    if (session) {
      loadResidents()
    }
  }, [session])

  const handleAddImageUrl = () => {
    const url = prompt("이미지 URL을 입력하세요:")
    if (url && url.trim()) {
      setFormData({
        ...formData,
        images: [...formData.images, url.trim()],
      })
    }
  }

  const handleRemoveImage = (index: number) => {
    setFormData({
      ...formData,
      images: formData.images.filter((_, i) => i !== index),
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

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
      })

      const data = await response.json()

      if (response.ok) {
        toast.success("게시글이 작성되었습니다!")
        router.push("/community")
        router.refresh()
      } else {
        toast.error(data.error || "게시글 작성에 실패했습니다.")
      }
    } catch (error: any) {
      console.error("Error creating post:", error)
      toast.error("게시글 작성 중 오류가 발생했습니다.")
    } finally {
      setIsLoading(false)
    }
  }

  if (!session) {
    return null
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

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
            새 게시글 작성
          </h1>
          <p className="text-gray-600">
            부모님의 일상을 사진과 함께 기록해보세요
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="bg-white rounded-3xl shadow-soft border border-gray-100 p-8 md:p-12 space-y-6">
          {/* 입소자 선택 */}
          <div>
            <label className="block text-sm font-semibold text-gray-800 mb-3">
              입소자 선택 (선택사항)
            </label>
            {loadingResidents ? (
              <div className="w-full px-4 py-3.5 border border-gray-200 rounded-xl bg-gray-50 text-gray-500">
                입소자 목록 로딩 중...
              </div>
            ) : (
              <select
                value={formData.residentId}
                onChange={(e) => setFormData({ ...formData, residentId: e.target.value })}
                className="w-full px-4 py-3.5 border border-gray-200 rounded-xl input-focus outline-none transition-all bg-white text-gray-900"
              >
                <option value="">전체 공유</option>
                {residents.map((resident) => (
                  <option key={resident.id} value={resident.id}>
                    {resident.name} {resident.roomNumber ? `(${resident.roomNumber})` : ""}
                  </option>
                ))}
              </select>
            )}
          </div>

          {/* 카테고리 */}
          <div>
            <label className="block text-sm font-semibold text-gray-800 mb-3">
              카테고리
            </label>
            <select
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              className="w-full px-4 py-3.5 border border-gray-200 rounded-xl input-focus outline-none transition-all bg-white text-gray-900"
            >
              <option value="Daily">일상</option>
              <option value="Medical">의료</option>
              <option value="Event">행사</option>
              <option value="Announcement">공지</option>
            </select>
          </div>

          {/* 제목 */}
          <div>
            <label className="block text-sm font-semibold text-gray-800 mb-3">
              제목 (선택사항)
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full px-4 py-3.5 border border-gray-200 rounded-xl input-focus outline-none transition-all bg-white text-gray-900 placeholder:text-gray-400"
              placeholder="게시글 제목을 입력하세요"
            />
          </div>

          {/* 내용 */}
          <div>
            <label className="block text-sm font-semibold text-gray-800 mb-3">
              내용
            </label>
            <textarea
              value={formData.content}
              onChange={(e) => setFormData({ ...formData, content: e.target.value })}
              rows={6}
              className="w-full px-4 py-3.5 border border-gray-200 rounded-xl input-focus outline-none transition-all bg-white text-gray-900 placeholder:text-gray-400 resize-none"
              placeholder="부모님의 일상을 기록해보세요..."
            />
          </div>

          {/* 이미지 */}
          <div>
            <label className="block text-sm font-semibold text-gray-800 mb-3">
              이미지
            </label>
            <div className="space-y-3">
              {formData.images.map((imageUrl, index) => (
                <div key={index} className="relative group">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={imageUrl}
                    alt={`이미지 ${index + 1}`}
                    className="w-full h-48 object-cover rounded-xl border border-gray-200"
                    onError={(e) => {
                      e.currentTarget.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='200'%3E%3Crect fill='%23f3f4f6' width='400' height='200'/%3E%3Ctext fill='%239ca3af' font-family='sans-serif' font-size='18' x='50%25' y='50%25' text-anchor='middle' dy='.3em'%3E이미지 로드 실패%3C/text%3E%3C/svg%3E"
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => handleRemoveImage(index)}
                    className="absolute top-2 right-2 p-2 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ))}
              <button
                type="button"
                onClick={handleAddImageUrl}
                className="w-full py-12 border-2 border-dashed border-gray-300 rounded-xl hover:border-primary-400 hover:bg-primary-50 transition-all flex flex-col items-center justify-center gap-2 text-gray-600"
              >
                <Camera className="w-8 h-8" />
                <span>이미지 URL 추가</span>
              </button>
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex gap-4 pt-4">
            <Link
              href="/community"
              className="btn-secondary flex-1 text-center"
            >
              취소
            </Link>
            <button
              type="submit"
              disabled={isLoading}
              className="btn-primary flex-1"
            >
              {isLoading ? "작성 중..." : "게시글 작성"}
            </button>
          </div>
        </form>
      </div>
    </AppLayout>
  )
}
