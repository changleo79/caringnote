import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { redirect } from "next/navigation"
import Link from "next/link"
import { Plus } from "lucide-react"
import { formatDate } from "@/lib/utils"
import { prisma } from "@/lib/prisma"
import { PageHeader } from "@/components/calm/PageHeader"

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
    plainExplain: string | null
    category: string
    recordDate: Date
    resident: { id: string; name: string }
  }> = []

  try {
    if (session.user.careCenterId) {
      records = await prisma.medicalRecord.findMany({
        where: { resident: { careCenterId: session.user.careCenterId } },
        include: { resident: { select: { id: true, name: true } } },
        orderBy: { recordDate: "desc" },
        take: 100,
      })
    }
  } catch (error) {
    console.error("Failed to fetch medical records:", error)
  }

  const isStaff = session.user.role === "CAREGIVER" || session.user.role === "ADMIN"

  return (
    <div className="mx-auto max-w-xl px-4 py-8 sm:px-6">
      <PageHeader
        title="건강"
        description="쉬운 말로 먼저, 자세한 기록은 그다음."
        action={
          isStaff ? (
            <Link href="/medical/new" className="btn-primary shrink-0">
              <Plus className="h-5 w-5" />
              작성
            </Link>
          ) : null
        }
      />

      {records.length === 0 ? (
        <p className="py-12 text-center text-[var(--sn-ink-muted)]">아직 건강 기록이 없습니다.</p>
      ) : (
        <ul className="divide-y divide-[var(--sn-line)]">
          {records.map((record) => (
            <li key={record.id}>
              <Link href={`/medical/${record.id}`} className="block py-5 transition hover:bg-[var(--sn-bg-elevated)]">
                <div className="flex items-center justify-between gap-3">
                  <span className="badge-neutral">{categoryLabels[record.category] || record.category}</span>
                  <span className="text-xs text-[var(--sn-ink-faint)]">{formatDate(record.recordDate)}</span>
                </div>
                <p className="mt-2 font-display text-lg font-semibold tracking-tight">{record.title}</p>
                <p className="mt-1 text-[var(--sn-ink)]">
                  {record.plainExplain || record.content}
                </p>
                <p className="mt-2 text-sm text-[var(--sn-ink-faint)]">{record.resident.name}</p>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
