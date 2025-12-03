"use client"

import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import { redirect } from "next/navigation"
import AppLayout from "@/components/layout/AppLayout"
import Link from "next/link"
import { Camera, Plus, ImageIcon, Heart, MessageCircle, User, Search, Filter, X } from "lucide-react"
import { formatDate } from "@/lib/utils"
import toast from "react-hot-toast"
import { PostCategory } from "@prisma/client"

interface Post {
  id: string
  title: string | null
  content: string | null
  images: string[]
  category: PostCategory
  createdAt: string
  author: {
    id: string
    name: string
    avatarUrl: string | null
  }
  resident: {
    id: string
    name: string
  } | null
  _count: {
    comments: number
    likes: number
  }
  isLiked: boolean
}

export default function CommunityPage() {
  const { data: session, status } = useSession()
  const [posts, setPosts] = useState<Post[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState<PostCategory | "all">("all")
  const [selectedResident, setSelectedResident] = useState<string>("all")
  const [residents, setResidents] = useState<{ id: string; name: string }[]>([])
  const [showFilters, setShowFilters] = useState(false)

  useEffect(() => {
    if (status === "unauthenticated") {
      redirect("/auth/login")
    }
  }, [status])

  useEffect(() => {
    if (session) {
      loadPosts()
      loadResidents()
    }
  }, [session])

  const loadResidents = async () => {
    try {
      const res = await fetch("/api/residents")
      if (res.ok) {
        const data = await res.json()
        setResidents(data || [])
      }
    } catch (error) {
      console.error("입소자 목록 로드 실패:", error)
    }
  }

  const loadPosts = async () => {
    try {
      setIsLoading(true)
      const params = new URLSearchParams()
      if (selectedCategory !== "all") {
        params.append("category", selectedCategory)
      }
      if (selectedResident !== "all") {
        params.append("residentId", selectedResident)
      }
      if (searchQuery.trim()) {
        params.append("search", searchQuery.trim())
      }

      const res = await fetch(`/api/posts?${params.toString()}`)
      if (res.ok) {
        const data = await res.json()
        setPosts(data || [])
      } else {
        toast.error("게시글을 불러오는데 실패했습니다.")
      }
    } catch (error) {
      console.error("게시글 로드 오류:", error)
      toast.error("게시글을 불러오는 중 오류가 발생했습니다.")
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    if (session) {
      loadPosts()
    }
  }, [selectedCategory, selectedResident, session])

  const handleSearch = () => {
    loadPosts()
  }

  const clearFilters = () => {
    setSearchQuery("")
    setSelectedCategory("all")
    setSelectedResident("all")
  }

  const filteredPosts = posts.filter((post) => {
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase()
      const matchesTitle = post.title?.toLowerCase().includes(query)
      const matchesContent = post.content?.toLowerCase().includes(query)
      const matchesAuthor = post.author.name.toLowerCase().includes(query)
      const matchesResident = post.resident?.name.toLowerCase().includes(query)
      if (!matchesTitle && !matchesContent && !matchesAuthor && !matchesResident) {
        return false
      }
    }
    return true
  })

  if (status === "loading" || isLoading) {
    return (
      <AppLayout>
        <div className="container mx-auto px-6 py-16 max-w-7xl">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
          </div>
        </div>
      </AppLayout>
    )
  }

  return (
    <AppLayout>
      <div className="container mx-auto px-6 py-16 max-w-7xl">
        {/* Header */}
        <div className="mb-8 md:mb-12 flex items-center justify-between flex-wrap gap-4">
          <div>
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-black text-neutral-900 mb-3 md:mb-4 tracking-tight">
              커뮤니티
            </h1>
            <p className="text-lg md:text-2xl text-neutral-600 font-black">
              부모님의 일상을 함께 공유해보세요
            </p>
          </div>
          <Link
            href="/community/new"
            className="btn-modern text-white inline-flex items-center gap-3 px-6 md:px-8 py-4 md:py-5 text-base md:text-lg"
          >
            <Plus className="w-5 h-5 md:w-6 md:h-6" />
            <span className="hidden sm:inline font-black">게시글 작성</span>
            <span className="sm:hidden font-black">작성</span>
          </Link>
        </div>

        {/* 검색 및 필터 */}
        <div className="mb-8 space-y-4">
          {/* 검색 바 */}
          <div className="flex gap-3">
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-400" />
              <input
                type="text"
                placeholder="게시글, 작성자, 입소자 이름으로 검색..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && handleSearch()}
                className="input-modern pl-12 pr-4"
              />
            </div>
            <button
              onClick={handleSearch}
              className="btn-modern text-white px-6 md:px-8 py-4 md:py-5 text-base md:text-lg"
            >
              검색
            </button>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="px-6 py-4 bg-white border-2 border-neutral-200 rounded-2xl hover:border-primary-500 transition-all flex items-center gap-2"
            >
              <Filter className="w-5 h-5" />
              <span className="hidden sm:inline font-bold">필터</span>
            </button>
          </div>

          {/* 필터 패널 */}
          {showFilters && (
            <div className="bg-gradient-to-br from-white via-blue-50/40 to-white rounded-3xl p-6 shadow-3d border-2 border-blue-200/50">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold text-neutral-900">필터 옵션</h3>
                <button
                  onClick={clearFilters}
                  className="text-sm text-neutral-600 hover:text-primary-600 font-semibold flex items-center gap-1"
                >
                  <X className="w-4 h-4" />
                  초기화
                </button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* 카테고리 필터 */}
                <div>
                  <label className="block text-sm font-bold text-neutral-700 mb-2">
                    카테고리
                  </label>
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value as PostCategory | "all")}
                    className="w-full px-4 py-3 bg-white rounded-xl border-2 border-neutral-200 focus:border-primary-500 focus:outline-none"
                  >
                    <option value="all">전체</option>
                    <option value="Daily">일상</option>
                    <option value="Medical">의료</option>
                    <option value="Event">행사</option>
                    <option value="Announcement">공지</option>
                  </select>
                </div>

                {/* 입소자 필터 */}
                <div>
                  <label className="block text-sm font-bold text-neutral-700 mb-2">
                    입소자
                  </label>
                  <select
                    value={selectedResident}
                    onChange={(e) => setSelectedResident(e.target.value)}
                    className="w-full px-4 py-3 bg-white rounded-xl border-2 border-neutral-200 focus:border-primary-500 focus:outline-none"
                  >
                    <option value="all">전체</option>
                    {residents.map((resident) => (
                      <option key={resident.id} value={resident.id}>
                        {resident.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* 활성 필터 표시 */}
          {(selectedCategory !== "all" || selectedResident !== "all" || searchQuery.trim()) && (
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-sm font-semibold text-neutral-600">활성 필터:</span>
              {searchQuery.trim() && (
                <span className="px-3 py-1 bg-primary-100 text-primary-800 rounded-lg text-sm font-bold flex items-center gap-2">
                  검색: {searchQuery}
                  <button
                    onClick={() => setSearchQuery("")}
                    className="hover:text-primary-600"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              )}
              {selectedCategory !== "all" && (
                <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-lg text-sm font-bold flex items-center gap-2">
                  카테고리: {selectedCategory}
                  <button
                    onClick={() => setSelectedCategory("all")}
                    className="hover:text-blue-600"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              )}
              {selectedResident !== "all" && (
                <span className="px-3 py-1 bg-green-100 text-green-800 rounded-lg text-sm font-bold flex items-center gap-2">
                  입소자: {residents.find((r) => r.id === selectedResident)?.name}
                  <button
                    onClick={() => setSelectedResident("all")}
                    className="hover:text-green-600"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              )}
            </div>
          )}
        </div>

        {/* Posts List */}
        {filteredPosts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredPosts.map((post) => (
              <Link
                key={post.id}
                href={`/community/${post.id}`}
                className="card-modern p-6 md:p-10 card-hover relative overflow-hidden group"
              >
                {/* 이미지 */}
                {post.images && post.images.length > 0 && (
                  <div className="relative w-full h-64 mb-6 rounded-2xl overflow-hidden">
                    <img
                      src={post.images[0]}
                      alt={post.title || "게시글 이미지"}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    {post.images.length > 1 && (
                      <div className="absolute top-4 right-4 px-3 py-1 bg-black/60 text-white rounded-xl text-sm font-bold backdrop-blur-sm">
                        +{post.images.length - 1}
                      </div>
                    )}
                  </div>
                )}

                {/* 카테고리 배지 */}
                <div className="mb-4">
                  <span className="inline-block px-3 py-1 bg-primary-100 text-primary-800 rounded-lg text-xs font-bold">
                    {post.category === "Daily" && "일상"}
                    {post.category === "Medical" && "의료"}
                    {post.category === "Event" && "행사"}
                    {post.category === "Announcement" && "공지"}
                  </span>
                </div>

                {/* 제목 */}
                {post.title && (
                  <h3 className="text-2xl font-black text-neutral-900 mb-3 line-clamp-2">
                    {post.title}
                  </h3>
                )}

                {/* 내용 */}
                {post.content && (
                  <p className="text-neutral-600 mb-4 line-clamp-3">{post.content}</p>
                )}

                {/* 입소자 정보 */}
                {post.resident && (
                  <div className="flex items-center gap-2 mb-4 text-sm text-neutral-500">
                    <User className="w-4 h-4" />
                    <span className="font-semibold">{post.resident.name}</span>
                  </div>
                )}

                {/* 메타 정보 */}
                <div className="flex items-center justify-between pt-4 border-t border-neutral-200">
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                      <Heart
                        className={`w-5 h-5 ${
                          post.isLiked ? "text-red-500 fill-red-500" : "text-neutral-400"
                        }`}
                      />
                      <span className="text-sm font-bold text-neutral-600">
                        {post._count.likes}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MessageCircle className="w-5 h-5 text-neutral-400" />
                      <span className="text-sm font-bold text-neutral-600">
                        {post._count.comments}
                      </span>
                    </div>
                  </div>
                  <span className="text-xs text-neutral-500">
                    {formatDate(post.createdAt)}
                  </span>
                </div>

                {/* 작성자 정보 */}
                <div className="flex items-center gap-3 mt-4 pt-4 border-t border-neutral-100">
                  <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-primary-600 rounded-full flex items-center justify-center text-white font-bold">
                    {post.author.avatarUrl ? (
                      <img
                        src={post.author.avatarUrl}
                        alt={post.author.name}
                        className="w-full h-full rounded-full object-cover"
                      />
                    ) : (
                      <User className="w-5 h-5" />
                    )}
                  </div>
                  <div>
                    <p className="text-sm font-bold text-neutral-900">{post.author.name}</p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="bg-gradient-to-br from-white via-blue-50/40 to-white rounded-3xl shadow-3d border-2 border-blue-200/50 p-16 text-center">
            <Camera className="w-16 h-16 text-neutral-400 mx-auto mb-4" />
            <h3 className="text-2xl font-bold text-neutral-900 mb-2">게시글이 없습니다</h3>
            <p className="text-neutral-600 mb-6">
              {searchQuery.trim() || selectedCategory !== "all" || selectedResident !== "all"
                ? "검색 조건에 맞는 게시글이 없습니다."
                : "첫 게시글을 작성해보세요!"}
            </p>
            <Link
              href="/community/new"
              className="btn-primary inline-flex items-center gap-2 px-6 py-3"
            >
              <Plus className="w-5 h-5" />
              게시글 작성하기
            </Link>
          </div>
        )}
      </div>
    </AppLayout>
  )
}
