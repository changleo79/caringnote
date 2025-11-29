import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { redirect } from "next/navigation"
import AppLayout from "@/components/layout/AppLayout"
import Link from "next/link"
import { Heart, Plus } from "lucide-react"

export default async function MedicalPage() {
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
              의료 정보
            </h1>
            <p className="text-gray-600">
              부모님의 건강 상태를 투명하게 확인하세요
            </p>
          </div>
          <Link
            href="/medical/new"
            className="btn-primary inline-flex items-center gap-2 bg-gradient-to-r from-red-500 to-pink-600 hover:from-red-600 hover:to-pink-700"
          >
            <Plus className="w-5 h-5" />
            <span className="hidden sm:inline">의료 기록 작성</span>
            <span className="sm:hidden">작성</span>
          </Link>
        </div>

        {/* Empty State */}
        <div className="bg-white rounded-3xl shadow-soft border border-gray-100 p-12 text-center">
          <div className="w-24 h-24 bg-gradient-to-br from-red-100 to-pink-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <Heart className="w-12 h-12 text-red-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-3">
            아직 의료 기록이 없습니다
          </h2>
          <p className="text-gray-600 mb-8 max-w-md mx-auto">
            첫 번째 의료 기록을 작성하여 부모님의 건강 정보를 관리해보세요
          </p>
          <Link
            href="/medical/new"
            className="btn-primary inline-flex items-center gap-2 bg-gradient-to-r from-red-500 to-pink-600 hover:from-red-600 hover:to-pink-700"
          >
            <Plus className="w-5 h-5" />
            첫 의료 기록 작성하기
          </Link>
        </div>
      </div>
    </AppLayout>
  )
}

