import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { UserRole } from "@prisma/client"

export type SessionUser = {
  id: string
  email?: string | null
  name?: string | null
  role: string
  careCenterId?: string | null
}

export function isStaff(role?: string | null) {
  return role === UserRole.CAREGIVER || role === UserRole.ADMIN
}

export async function requireSession() {
  const session = await getServerSession(authOptions)
  if (!session?.user?.id) {
    return { error: "인증이 필요합니다.", status: 401 as const, session: null, user: null }
  }
  return { error: null, status: 200 as const, session, user: session.user as SessionUser }
}

export async function requireStaff() {
  const result = await requireSession()
  if (result.error || !result.user) return result
  if (!isStaff(result.user.role)) {
    return { error: "시설 직원만 접근할 수 있습니다.", status: 403 as const, session: null, user: null }
  }
  if (!result.user.careCenterId) {
    return { error: "요양원 정보가 필요합니다. 시설 설정을 완료하세요.", status: 400 as const, session: null, user: null }
  }
  return result
}

/** 가족이 승인된 어르신 ID 목록 */
export async function getApprovedResidentIds(userId: string) {
  const links = await prisma.residentFamily.findMany({
    where: { userId, isApproved: true },
    select: { residentId: true },
  })
  return links.map((l) => l.residentId)
}

/** 어르신 접근 가능 여부 (직원=같은 시설, 가족=승인된 연결) */
export async function canAccessResident(user: SessionUser, residentId: string) {
  const resident = await prisma.resident.findUnique({
    where: { id: residentId },
    select: { id: true, careCenterId: true },
  })
  if (!resident) return { ok: false as const, reason: "어르신을 찾을 수 없습니다.", resident: null }

  if (isStaff(user.role)) {
    if (user.careCenterId !== resident.careCenterId) {
      return { ok: false as const, reason: "다른 시설의 어르신입니다.", resident: null }
    }
    return { ok: true as const, reason: null, resident }
  }

  const link = await prisma.residentFamily.findUnique({
    where: { residentId_userId: { residentId, userId: user.id } },
  })
  if (!link?.isApproved) {
    return { ok: false as const, reason: "승인된 가족 연결이 필요합니다.", resident: null }
  }
  return { ok: true as const, reason: null, resident }
}

export async function writeAuditLog(params: {
  action: string
  userId?: string | null
  careCenterId?: string | null
  entityType?: string
  entityId?: string
  meta?: unknown
}) {
  try {
    await prisma.auditLog.create({
      data: {
        action: params.action,
        userId: params.userId || undefined,
        careCenterId: params.careCenterId || undefined,
        entityType: params.entityType,
        entityId: params.entityId,
        meta: params.meta ? JSON.stringify(params.meta) : undefined,
      },
    })
  } catch (e) {
    console.error("audit log failed", e)
  }
}
