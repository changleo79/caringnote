import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { redirect } from "next/navigation"
import AppLayout from "@/components/layout/AppLayout"
import Link from "next/link"
import { Heart, Plus, Calendar, FileText } from "lucide-react"
import { formatDate } from "@/lib/utils"
import { prisma } from "@/lib/prisma"

const categoryLabels: Record<string, string> = {
  Treatment: "진료",
  Medication: "약물",
  Exam: "검사",
  Symptom: "증상",
  Other: "기타",
}

export default async function MedicalPage() {
  const session = await getServerSession(authOptions)

  if (!session) {
    redirect("/auth/login")
  }

  // 의료 기록 목록 가져오기
  let records: any[] = []
  
  try {
    if (session.user.careCenterId) {
      records = await prisma.medicalRecord.findMany({
        where: {
          resident: {
            careCenterId: session.user.careCenterId,
          },
        },
        include: {
          resident: {
            select: {
              id: true,
              name: true,
            },
          },
          createdBy: {
            select: {
              id: true,
              name: true,
            },
          },
        },
        orderBy: {
          recordDate: "desc",
        },
        take: 100,
      })
    }
  } catch (error) {
    console.error("Failed to fetch medical records:", error)
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

        {/* Records List */}
        {records.length > 0 ? (
          <div className="grid md:grid-cols-2 gap-6">
            {records.map((record) => (
              <Link
                key={record.id}
                href={`/medical/${record.id}`}
                className="bg-white rounded-2xl shadow-soft border border-gray-100 overflow-hidden card-hover group"
              >
                <div className="p-6">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <span className="text-xs bg-red-100 text-red-700 px-3 py-1 rounded-full font-medium">
                        {categoryLabels[record.category] || record.category}
                      </span>
                      <span className="text-xs text-gray-500">{record.resident.name}</span>
                    </div>
                    <FileText className="w-5 h-5 text-red-400" />
                  </div>
                  
                  <h3 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-red-600 transition-colors">
                    {record.title}
                  </h3>
                  
                  {record.content && (
                    <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                      {record.content}
                    </p>
                  )}

                  <div className="flex items-center gap-1 text-xs text-gray-500">
                    <Calendar className="w-3 h-3" />
                    {formatDate(record.recordDate)}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
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
        )}
      </div>
    </AppLayout>
  )
}
