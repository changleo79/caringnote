import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { redirect } from "next/navigation"
import AppLayout from "@/components/layout/AppLayout"
import Link from "next/link"
import { Heart, Plus, Calendar, FileText } from "lucide-react"
import { formatDate } from "@/lib/utils"
import { prisma } from "@/lib/prisma"
import { Card, CardContent } from "@/components/ui/Card"

const categoryLabels: Record<string, string> = {
  Treatment: "진료",
  Medication: "약물",
  Exam: "검사",
  Symptom: "증상",
  Other: "기타",
}

export default async function MedicalPage() {
  const session = await getServerSession(authOptions)
  if (!session) redirect("/auth/login")

  let records: Array<{
    id: string
    title: string
    content: string
    category: string
    recordDate: Date
    resident: { id: string; name: string }
  }> = []

  try {
    if (session.user.careCenterId) {
      records = await prisma.medicalRecord.findMany({
        where: { resident: { careCenterId: session.user.careCenterId } },
        include: {
          resident: { select: { id: true, name: true } },
        },
        orderBy: { recordDate: "desc" },
        take: 100,
      })
    }
  } catch (error) {
    console.error("Failed to fetch medical records:", error)
  }

  return (
    <AppLayout>
      <div className="px-4 sm:px-6 py-8 max-w-5xl">
        <div className="page-header flex items-center justify-between gap-4">
          <div>
            <h1 className="page-title">의료 정보</h1>
            <p className="page-description">부모님의 건강 상태를 투명하게 확인하세요</p>
          </div>
          <Link href="/medical/new" className="btn-primary flex-shrink-0">
            <Plus className="w-5 h-5" />
            <span className="hidden sm:inline">기록 작성</span>
          </Link>
        </div>

        {records.length > 0 ? (
          <div className="grid md:grid-cols-2 gap-4">
            {records.map((record) => (
              <Link key={record.id} href={`/medical/${record.id}`} className="card-interactive block">
                <CardContent>
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <span className="badge bg-red-50 text-red-700">
                        {categoryLabels[record.category] || record.category}
                      </span>
                      <span className="text-caption text-neutral-400">{record.resident.name}</span>
                    </div>
                    <FileText className="w-5 h-5 text-red-300" />
                  </div>
                  <h3 className="text-body font-semibold text-neutral-900 mb-2">{record.title}</h3>
                  {record.content && (
                    <p className="text-caption text-neutral-500 mb-3 line-clamp-2">{record.content}</p>
                  )}
                  <div className="flex items-center gap-1.5 text-caption text-neutral-400">
                    <Calendar className="w-3.5 h-3.5" />
                    {formatDate(record.recordDate)}
                  </div>
                </CardContent>
              </Link>
            ))}
          </div>
        ) : (
          <Card className="text-center py-16">
            <CardContent>
              <div className="w-16 h-16 bg-red-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Heart className="w-8 h-8 text-red-500" />
              </div>
              <h2 className="text-subheading text-neutral-900 mb-2">아직 의료 기록이 없습니다</h2>
              <p className="text-body text-neutral-500 mb-6 max-w-sm mx-auto">
                첫 번째 의료 기록을 작성하여 부모님의 건강 정보를 관리해보세요
              </p>
              <Link href="/medical/new" className="btn-primary inline-flex">
                <Plus className="w-5 h-5" />
                첫 의료 기록 작성하기
              </Link>
            </CardContent>
          </Card>
        )}
      </div>
    </AppLayout>
  )
}
