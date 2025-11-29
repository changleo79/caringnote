import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { redirect } from "next/navigation"
import AppLayout from "@/components/layout/AppLayout"
import Link from "next/link"
import { ArrowLeft, Heart } from "lucide-react"

export default async function NewMedicalRecordPage() {
  const session = await getServerSession(authOptions)

  if (!session) {
    redirect("/auth/login")
  }

  return (
    <AppLayout>
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Back Button */}
        <Link
          href="/medical"
          className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 mb-6 transition-colors group"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          <span>뒤로가기</span>
        </Link>

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
            새 의료 기록 작성
          </h1>
          <p className="text-gray-600">
            부모님의 건강 정보를 투명하게 기록해보세요
          </p>
        </div>

        {/* Form Placeholder */}
        <div className="bg-white rounded-3xl shadow-soft border border-gray-100 p-8 md:p-12">
          <div className="text-center py-16">
            <div className="w-20 h-20 bg-gradient-to-br from-red-100 to-pink-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Heart className="w-10 h-10 text-red-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-3">
              의료 기록 작성 기능 준비 중
            </h2>
            <p className="text-gray-600 mb-8">
              곧 의료 기록 작성 기능이 제공될 예정입니다
            </p>
            <Link
              href="/medical"
              className="btn-secondary inline-flex items-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              의료 정보로 돌아가기
            </Link>
          </div>
        </div>
      </div>
    </AppLayout>
  )
}

