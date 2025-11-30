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
    const careCenterId = session.user.careCenterId
    if (careCenterId) {
      records = await prisma.medicalRecord.findMany({
        where: {
          resident: {
            careCenterId: careCenterId,
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
      <div className="section-container py-10">
        {/* Header - Notion 스타일 */}
        <div className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-neutral-900 mb-2 tracking-tight">
              의료 정보
            </h1>
            <p className="text-neutral-600">
              부모님의 건강 상태를 투명하게 확인하세요
            </p>
          </div>
          <Link
            href="/medical/new"
            className="btn-linear-primary inline-flex items-center justify-center gap-2 flex-shrink-0 whitespace-nowrap"
          >
            <Plus className="w-4 h-4" />
            <span>의료 기록 작성</span>
          </Link>
        </div>

        {/* Records List - Notion 스타일 */}
        {records.length > 0 ? (
          <div className="grid md:grid-cols-2 gap-4">
            {records.map((record) => (
              <Link
                key={record.id}
                href={`/medical/${record.id}`}
                className="card-notion p-6 card-hover-linear group"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-xs bg-red-50 text-red-700 px-2.5 py-1 rounded font-medium">
                      {categoryLabels[record.category] || record.category}
                    </span>
                    <span className="text-xs text-neutral-500">{record.resident.name}</span>
                  </div>
                  <FileText className="w-4 h-4 text-neutral-400 flex-shrink-0" />
                </div>
                
                <h3 className="text-base font-semibold text-neutral-900 mb-2 group-hover:text-red-600 transition-colors">
                  {record.title}
                </h3>
                
                {record.content && (
                  <p className="text-sm text-neutral-600 mb-3 line-clamp-2">
                    {record.content}
                  </p>
                )}

                <div className="flex items-center gap-1.5 text-xs text-neutral-500">
                  <Calendar className="w-3.5 h-3.5" />
                  {formatDate(record.recordDate)}
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="card-notion p-12 text-center">
            <div className="w-16 h-16 bg-red-100 rounded-lg flex items-center justify-center mx-auto mb-4">
              <Heart className="w-8 h-8 text-red-600 fill-red-600" />
            </div>
            <h2 className="text-xl font-bold text-neutral-900 mb-2">
              아직 의료 기록이 없습니다
            </h2>
            <p className="text-sm text-neutral-600 mb-6 max-w-md mx-auto">
              첫 번째 의료 기록을 작성하여 부모님의 건강 정보를 관리해보세요
            </p>
            <Link
              href="/medical/new"
              className="btn-linear-primary inline-flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              첫 의료 기록 작성하기
            </Link>
          </div>
        )}
      </div>
    </AppLayout>
  )
}
