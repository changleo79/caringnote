import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { isStaff, requireSession, requireStaff, writeAuditLog } from "@/lib/access"

export const dynamic = "force-dynamic"

/** 시설: 대기 중 가족 요청 목록 / 가족: 내 요청 목록 */
export async function GET() {
  try {
    const auth = await requireSession()
    if (auth.error || !auth.user) {
      return NextResponse.json({ error: auth.error }, { status: auth.status })
    }

    if (isStaff(auth.user.role)) {
      if (!auth.user.careCenterId) {
        return NextResponse.json({ error: "요양원 정보가 필요합니다." }, { status: 400 })
      }
      const requests = await prisma.residentFamily.findMany({
        where: {
          isApproved: false,
          resident: { careCenterId: auth.user.careCenterId },
        },
        include: {
          resident: { select: { id: true, name: true, roomNumber: true, photoUrl: true } },
          user: { select: { id: true, name: true, email: true, phone: true } },
        },
        orderBy: { createdAt: "desc" },
      })
      return NextResponse.json(requests)
    }

    const mine = await prisma.residentFamily.findMany({
      where: { userId: auth.user.id },
      include: {
        resident: {
          select: {
            id: true,
            name: true,
            roomNumber: true,
            photoUrl: true,
            careCenter: { select: { name: true } },
          },
        },
      },
      orderBy: { createdAt: "desc" },
    })
    return NextResponse.json(mine)
  } catch (error) {
    console.error("GET family-requests", error)
    return NextResponse.json({ error: "조회 실패" }, { status: 500 })
  }
}

/** 가족이 어르신 연결 요청 */
export async function POST(req: NextRequest) {
  try {
    const auth = await requireSession()
    if (auth.error || !auth.user) {
      return NextResponse.json({ error: auth.error }, { status: auth.status })
    }
    if (isStaff(auth.user.role)) {
      return NextResponse.json({ error: "가족 계정만 요청할 수 있습니다." }, { status: 403 })
    }

    const { residentId, relationship, familyRole } = await req.json()
    if (!residentId || !relationship) {
      return NextResponse.json({ error: "어르신과 관계는 필수입니다." }, { status: 400 })
    }

    const resident = await prisma.resident.findUnique({ where: { id: residentId } })
    if (!resident) {
      return NextResponse.json({ error: "어르신을 찾을 수 없습니다." }, { status: 404 })
    }

    const link = await prisma.residentFamily.upsert({
      where: { residentId_userId: { residentId, userId: auth.user.id } },
      create: {
        residentId,
        userId: auth.user.id,
        relationship,
        familyRole: familyRole === "PRIMARY" ? "PRIMARY" : "VIEWER",
        isApproved: false,
      },
      update: {
        relationship,
        familyRole: familyRole === "PRIMARY" ? "PRIMARY" : "VIEWER",
        isApproved: false,
        approvedAt: null,
        approvedById: null,
      },
    })

    // 시설 직원에게 알림
    const staff = await prisma.user.findMany({
      where: {
        careCenterId: resident.careCenterId,
        role: { in: ["CAREGIVER", "ADMIN"] },
      },
      select: { id: true },
    })
    if (staff.length) {
      await prisma.notification.createMany({
        data: staff.map((s) => ({
          userId: s.id,
          type: "FamilyRequest",
          title: "가족 연결 요청",
          content: `${auth.user!.name || "보호자"}님이 ${resident.name} 어르신 연결을 요청했습니다.`,
          relatedId: link.id,
          relatedType: "ResidentFamily",
        })),
      })
    }

    return NextResponse.json(link, { status: 201 })
  } catch (error) {
    console.error("POST family-requests", error)
    return NextResponse.json({ error: "요청 실패" }, { status: 500 })
  }
}
