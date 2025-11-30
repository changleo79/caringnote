import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { redirect } from "next/navigation"
import AppLayout from "@/components/layout/AppLayout"
import Link from "next/link"
import { ArrowLeft, Calendar, User, FileText } from "lucide-react"
import { formatDate } from "@/lib/utils"
import { prisma } from "@/lib/prisma"

const categoryLabels: Record<string, string> = {
  Treatment: "진료",
  Medication: "약물",
  Exam: "검사",
  Symptom: "증상",
  Other: "기타",
}

export default async function MedicalRecordDetailPage({
  params,
}: {
  params: { id: string }
}) {
  const session = await getServerSession(authOptions)

  if (!session) {
    redirect("/auth/login")
  }

  // 의료 기록 가져오기
  let record: any = null

  try {
    record = await prisma.medicalRecord.findUnique({
      where: { id: params.id },
      include: {
        resident: {
          select: {
            id: true,
            name: true,
            roomNumber: true,
          },
        },
        createdBy: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    })

    if (record) {
      record = {
        ...record,
        attachments: record.attachments ? JSON.parse(record.attachments) : [],
      }
    }
  } catch (error) {
    console.error("Failed to fetch medical record:", error)
  }

  if (!record) {
    return (
      <AppLayout>
        <div className="section-container py-10">
          <div className="card-notion p-12 text-center">
            <h2 className="text-xl font-bold text-neutral-900 mb-2">
              의료 기록을 찾을 수 없습니다
            </h2>
            <Link href="/medical" className="btn-linear-primary inline-flex items-center gap-2 mt-6">
              <ArrowLeft className="w-4 h-4" />
              의료 정보로 돌아가기
            </Link>
          </div>
        </div>
      </AppLayout>
    )
  }

  return (
    <AppLayout>
      <div className="section-container py-10">
        {/* Back Button */}
        <Link
          href="/medical"
          className="inline-flex items-center gap-2 text-sm text-neutral-600 hover:text-neutral-900 mb-8 transition-colors font-medium"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>뒤로가기</span>
        </Link>

        {/* Record Content - Notion 스타일 */}
        <div className="card-notion overflow-hidden">
          {/* Header */}
          <div className="p-6 md:p-8 border-b border-neutral-200">
            <div className="flex items-start justify-between mb-4">
              <div>
                <span className="text-xs bg-red-50 text-red-700 px-2.5 py-1 rounded font-medium mb-3 inline-block">
                  {categoryLabels[record.category] || record.category}
                </span>
                <h1 className="text-2xl md:text-3xl font-bold text-neutral-900 mb-3">{record.title}</h1>
                <div className="flex flex-wrap items-center gap-4 text-sm text-neutral-600">
                  <div className="flex items-center gap-1.5">
                    <User className="w-4 h-4 text-neutral-400" />
                    <span>{record.resident.name} {record.resident.roomNumber ? `(${record.resident.roomNumber}호실)` : ""}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Calendar className="w-4 h-4 text-neutral-400" />
                    <span>{formatDate(record.recordDate)}</span>
                  </div>
                </div>
              </div>
              <FileText className="w-6 h-6 text-neutral-400 flex-shrink-0" />
            </div>
            <div className="text-xs text-neutral-500">
              작성자: {record.createdBy.name} • {formatDate(record.createdAt)}
            </div>
          </div>

          {/* Content */}
          <div className="p-6 md:p-8">
            {record.content && (
              <div className="prose max-w-none">
                <p className="text-neutral-700 whitespace-pre-wrap leading-relaxed">
                  {record.content}
                </p>
              </div>
            )}

            {/* Attachments */}
            {record.attachments && record.attachments.length > 0 && (
              <div className="mt-8 pt-6 border-t border-neutral-200">
                <h3 className="text-sm font-semibold text-neutral-900 mb-3">첨부파일</h3>
                <div className="space-y-2">
                  {record.attachments.map((attachment: string, index: number) => (
                    <a
                      key={index}
                      href={attachment}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block p-3 bg-neutral-50 rounded-lg hover:bg-neutral-100 transition-colors text-sm text-neutral-700 border border-neutral-200"
                    >
                      {attachment}
                    </a>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </AppLayout>
  )
}
