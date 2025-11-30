import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { redirect } from "next/navigation"
import AppLayout from "@/components/layout/AppLayout"
import { prisma } from "@/lib/prisma"
import { Users, User, Building2, Mail, Phone, Calendar, Shield } from "lucide-react"
import MemberList from "./MemberList"
import Link from "next/link"

export default async function CareCenterMembersPage() {
  const session = await getServerSession(authOptions)

  if (!session) {
    redirect("/auth/login")
  }

  // CAREGIVER 또는 ADMIN만 접근 가능
  if (session.user.role !== "CAREGIVER" && session.user.role !== "ADMIN") {
    return (
      <AppLayout>
        <div className="container mx-auto px-4 py-8 max-w-7xl">
          <div className="bg-white rounded-3xl shadow-soft border border-gray-100 p-12 text-center">
            <p className="text-gray-600">요양원 회원 관리는 직원만 접근할 수 있습니다.</p>
          </div>
        </div>
      </AppLayout>
    )
  }

  if (!session.user.careCenterId) {
    return (
      <AppLayout>
        <div className="container mx-auto px-4 py-8 max-w-7xl">
          <div className="bg-white rounded-3xl shadow-soft border border-gray-100 p-12 text-center">
            <div className="w-24 h-24 bg-gradient-to-br from-primary-100 to-accent-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <Building2 className="w-12 h-12 text-primary-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-3">
              요양원 정보가 필요합니다
            </h2>
            <p className="text-gray-600 mb-8 max-w-md mx-auto">
              요양원 정보를 설정하여 회원 관리를 시작할 수 있습니다.
            </p>
            <Link
              href="/care-center"
              className="btn-primary inline-flex items-center gap-2"
            >
              <Building2 className="w-5 h-5" />
              요양원 정보 설정하기
            </Link>
          </div>
        </div>
      </AppLayout>
    )
  }

  const careCenterId = session.user.careCenterId

  // 요양원 정보 조회
  const careCenter = await prisma.careCenter.findUnique({
    where: { id: careCenterId },
    select: {
      id: true,
      name: true,
    },
  })

  // 회원 통계
  let memberStats = {
    total: 0,
    family: 0,
    caregiver: 0,
  }

  try {
    const [total, family, caregiver] = await Promise.all([
      prisma.user.count({
        where: { careCenterId: careCenterId },
      }),
      prisma.user.count({
        where: {
          careCenterId: careCenterId,
          role: "FAMILY",
        },
      }),
      prisma.user.count({
        where: {
          careCenterId: careCenterId,
          role: "CAREGIVER",
        },
      }),
    ])

    memberStats = { total, family, caregiver }
  } catch (error) {
    console.error("Failed to fetch member stats:", error)
  }

  return (
    <AppLayout>
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
            회원 관리
          </h1>
          <p className="text-gray-600">
            {careCenter?.name} 회원 관리
          </p>
        </div>

        {/* 통계 카드 */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-2xl shadow-soft border border-gray-100 p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center">
                <Users className="w-6 h-6 text-white" />
              </div>
            </div>
            <p className="text-sm text-gray-600 font-medium mb-1">전체 회원</p>
            <p className="text-3xl font-black text-gray-900">{memberStats.total}</p>
          </div>

          <div className="bg-white rounded-2xl shadow-soft border border-gray-100 p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-primary-500 to-primary-600 rounded-xl flex items-center justify-center">
                <User className="w-6 h-6 text-white" />
              </div>
            </div>
            <p className="text-sm text-gray-600 font-medium mb-1">가족 회원</p>
            <p className="text-3xl font-black text-gray-900">{memberStats.family}</p>
          </div>

          <div className="bg-white rounded-2xl shadow-soft border border-gray-100 p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center">
                <Building2 className="w-6 h-6 text-white" />
              </div>
            </div>
            <p className="text-sm text-gray-600 font-medium mb-1">요양원 직원</p>
            <p className="text-3xl font-black text-gray-900">{memberStats.caregiver}</p>
          </div>
        </div>

        {/* 회원 목록 */}
        <MemberList careCenterId={careCenterId} userRole={session.user.role} />
      </div>
    </AppLayout>
  )
}

