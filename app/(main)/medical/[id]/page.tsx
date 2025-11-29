import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { redirect } from "next/navigation"
import AppLayout from "@/components/layout/AppLayout"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"

export default async function MedicalRecordDetailPage({
  params,
}: {
  params: { id: string }
}) {
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

        {/* Content Placeholder */}
        <div className="bg-white rounded-3xl shadow-soft border border-gray-100 p-8 md:p-12">
          <div className="text-center py-16">
            <h2 className="text-2xl font-bold text-gray-900 mb-3">
              의료 기록 상세 보기
            </h2>
            <p className="text-gray-600 mb-8">
              기록 ID: {params.id}
            </p>
            <p className="text-gray-500 text-sm">
              의료 기록 상세 기능은 곧 제공될 예정입니다
            </p>
          </div>
        </div>
      </div>
    </AppLayout>
  )
}

