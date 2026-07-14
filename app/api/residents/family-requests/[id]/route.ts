import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { requireStaff, writeAuditLog } from "@/lib/access"

export const dynamic = "force-dynamic"

/** 승인 / 거절 */
export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const auth = await requireStaff()
    if (auth.error || !auth.user) {
      return NextResponse.json({ error: auth.error }, { status: auth.status })
    }

    const { action, familyRole } = await req.json()
    if (!["approve", "reject"].includes(action)) {
      return NextResponse.json({ error: "action은 approve 또는 reject" }, { status: 400 })
    }

    const link = await prisma.residentFamily.findUnique({
      where: { id: params.id },
      include: { resident: true, user: true },
    })
    if (!link || link.resident.careCenterId !== auth.user.careCenterId) {
      return NextResponse.json({ error: "요청을 찾을 수 없습니다." }, { status: 404 })
    }

    if (action === "reject") {
      await prisma.residentFamily.delete({ where: { id: params.id } })
      await prisma.notification.create({
        data: {
          userId: link.userId,
          type: "FamilyRejected",
          title: "가족 연결이 거절되었습니다",
          content: `${link.resident.name} 어르신 연결 요청이 거절되었습니다.`,
          relatedId: link.residentId,
          relatedType: "Resident",
        },
      })
      await writeAuditLog({
        action: "family.reject",
        userId: auth.user.id,
        careCenterId: auth.user.careCenterId,
        entityType: "ResidentFamily",
        entityId: params.id,
      })
      return NextResponse.json({ ok: true })
    }

    const updated = await prisma.residentFamily.update({
      where: { id: params.id },
      data: {
        isApproved: true,
        approvedAt: new Date(),
        approvedById: auth.user.id,
        familyRole: familyRole === "PRIMARY" ? "PRIMARY" : link.familyRole,
      },
    })

    // 가족 careCenterId 동기화
    await prisma.user.update({
      where: { id: link.userId },
      data: { careCenterId: link.resident.careCenterId },
    })

    await prisma.notification.create({
      data: {
        userId: link.userId,
        type: "FamilyApproved",
        title: "가족 연결이 승인되었습니다",
        content: `${link.resident.name} 어르신과 연결되었습니다.`,
        relatedId: link.residentId,
        relatedType: "Resident",
      },
    })

    await writeAuditLog({
      action: "family.approve",
      userId: auth.user.id,
      careCenterId: auth.user.careCenterId,
      entityType: "ResidentFamily",
      entityId: params.id,
    })

    return NextResponse.json(updated)
  } catch (error) {
    console.error("PATCH family-requests/[id]", error)
    return NextResponse.json({ error: "처리 실패" }, { status: 500 })
  }
}
