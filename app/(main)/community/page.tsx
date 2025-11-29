import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { redirect } from "next/navigation"
import AppLayout from "@/components/layout/AppLayout"
import Link from "next/link"
import { Camera, Plus, ImageIcon } from "lucide-react"
import { formatDate } from "@/lib/utils"

export default async function CommunityPage() {
  const session = await getServerSession(authOptions)

  if (!session) {
    redirect("/auth/login")
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

        {/* Empty State */}
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
      </div>
    </AppLayout>
  )
}

