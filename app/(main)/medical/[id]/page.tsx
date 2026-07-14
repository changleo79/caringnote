import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { formatDate } from "@/lib/utils";
import { prisma } from "@/lib/prisma";

const categoryLabels: Record<string, string> = {
  Treatment: "진료",
  Medication: "약물",
  Exam: "검사",
  Symptom: "증상",
  Other: "기타",
};

export default async function MedicalRecordDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/auth/login");

  let record: any = null;

  try {
    record = await prisma.medicalRecord.findUnique({
      where: { id: params.id },
      include: {
        resident: {
          select: { id: true, name: true, roomNumber: true },
        },
        createdBy: {
          select: { id: true, name: true },
        },
      },
    });

    if (record) {
      record = {
        ...record,
        attachments: record.attachments ? JSON.parse(record.attachments) : [],
      };
    }
  } catch (error) {
    console.error("Failed to fetch medical record:", error);
  }

  if (!record) {
    return (
      <div className="mx-auto max-w-xl py-16 text-center">
        <h2 className="page-title">기록을 찾을 수 없습니다</h2>
        <Link href="/medical" className="btn-primary mt-6 inline-flex">
          <ArrowLeft className="h-4 w-4" />
          건강으로 돌아가기
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-xl">
      <Link
        href="/medical"
        className="mb-6 inline-flex min-h-[48px] items-center gap-2 text-sm font-medium text-[var(--sn-ink-muted)]"
      >
        <ArrowLeft className="h-4 w-4" />
        건강
      </Link>

      <p className="text-sm font-medium text-[var(--sn-accent)]">
        {categoryLabels[record.category] || record.category}
      </p>
      <h1 className="mt-2 font-display text-3xl font-semibold tracking-tight text-[var(--sn-ink)]">
        {record.title}
      </h1>
      <p className="mt-3 text-sm text-[var(--sn-ink-muted)]">
        {record.resident.name}
        {record.resident.roomNumber ? ` · ${record.resident.roomNumber}` : ""}
        {" · "}
        {formatDate(record.recordDate)}
      </p>
      <p className="mt-1 text-xs text-[var(--sn-ink-faint)]">
        {record.createdBy.name} · {formatDate(record.createdAt)}
      </p>

      {record.content && (
        <p className="mt-8 whitespace-pre-wrap text-[17px] leading-relaxed text-[var(--sn-ink)]">
          {record.content}
        </p>
      )}

      {record.attachments && record.attachments.length > 0 && (
        <div className="mt-10 border-t border-[var(--sn-line)] pt-6">
          <h3 className="mb-3 text-sm font-semibold text-[var(--sn-ink)]">첨부</h3>
          <ul className="space-y-2">
            {record.attachments.map((attachment: string, index: number) => (
              <li key={index}>
                <a
                  href={attachment}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-[var(--sn-accent)] underline-offset-2 hover:underline"
                >
                  {attachment}
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
