import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { redirect } from "next/navigation"
import AppLayout from "@/components/layout/AppLayout"
import { prisma } from "@/lib/prisma"
import { Building2, MapPin, Phone, Mail, FileText, Edit, ArrowLeft } from "lucide-react"
import Link from "next/link"
import Image from "next/image"

export default async function CareCenterPage() {
  const session = await getServerSession(authOptions)

  if (!session) {
    redirect("/auth/login")
  }

  // 사용자의 요양원 정보 조회
  let careCenter: any = null
  let careCenterId: string | null = null

  try {
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: {
        role: true,
        careCenterId: true,
      },
    })

    if (user) {
      // ADMIN/CAREGIVER: 직접 연결된 요양원
      if (user.role === "ADMIN" || user.role === "CAREGIVER") {
        careCenterId = user.careCenterId
      }

      // FAMILY: 연결된 입소자의 요양원
      if (user.role === "FAMILY") {
        const residentFamily = await prisma.residentFamily.findFirst({
          where: {
            userId: session.user.id!,
            isApproved: true,
          },
          include: {
            resident: {
              select: {
                careCenterId: true,
              },
            },
          },
          orderBy: {
            createdAt: "desc",
          },
        })

        if (residentFamily) {
          careCenterId = residentFamily.resident.careCenterId
        }
      }

      // 요양원 정보 조회
      if (careCenterId) {
        careCenter = await prisma.careCenter.findUnique({
          where: { id: careCenterId },
          select: {
            id: true,
            name: true,
            address: true,
            phone: true,
            email: true,
            description: true,
            logoUrl: true,
            createdAt: true,
            updatedAt: true,
          },
        })
      }
    }
  } catch (error) {
    console.error("Failed to fetch care center:", error)
  }

  // 요양원 정보가 없는 경우
  if (!careCenter) {
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
              {session.user.role === "FAMILY"
                ? "입소자와 연결되어 있지 않아 요양원 정보를 확인할 수 없습니다. 먼저 입소자와 연결해주세요."
                : "요양원 정보를 설정하여 서비스를 시작할 수 있습니다."}
            </p>
            {(session.user.role === "CAREGIVER" || session.user.role === "ADMIN") && (
              <div className="flex gap-3 justify-center">
                <Link
                  href="/care-center/edit"
                  className="btn-primary inline-flex items-center gap-2"
                >
                  <Building2 className="w-5 h-5" />
                  요양원 정보 설정하기
                </Link>
                <Link
                  href="/dashboard"
                  className="px-6 py-3 bg-gray-100 text-gray-700 rounded-xl font-bold hover:bg-gray-200 transition-colors inline-flex items-center gap-2"
                >
                  <ArrowLeft className="w-5 h-5" />
                  대시보드로
                </Link>
              </div>
            )}
            {session.user.role === "FAMILY" && (
              <Link
                href="/residents"
                className="btn-primary inline-flex items-center gap-2"
              >
                입소자 연결하기
              </Link>
            )}
          </div>
        </div>
      </AppLayout>
    )
  }

  // 수정 권한 확인
  const canEdit = session.user.role === "ADMIN" || 
    (session.user.role === "CAREGIVER" && session.user.careCenterId === careCenter.id)

  return (
    <AppLayout>
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between flex-wrap gap-4">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
              요양원 정보
            </h1>
            <p className="text-gray-600">
              {session.user.role === "FAMILY"
                ? "입소자가 속한 요양원 정보"
                : "요양원 기본 정보"}
            </p>
          </div>
          {canEdit && (
            <Link
              href={`/care-center/edit`}
              className="btn-primary inline-flex items-center gap-2"
            >
              <Edit className="w-5 h-5" />
              <span className="hidden sm:inline">정보 수정</span>
              <span className="sm:hidden">수정</span>
            </Link>
          )}
        </div>

        {/* 요양원 정보 카드 */}
        <div className="bg-white rounded-3xl shadow-soft border border-gray-100 overflow-hidden">
          {/* 로고 섹션 */}
          {careCenter.logoUrl && (
            <div className="relative w-full h-48 bg-gradient-to-br from-primary-100 to-accent-100">
              <Image
                src={careCenter.logoUrl}
                alt={careCenter.name}
                fill
                className="object-contain p-6"
                sizes="(max-width: 768px) 100vw, 1200px"
              />
            </div>
          )}

          {/* 정보 섹션 */}
          <div className="p-8 md:p-12">
            {/* 요양원 이름 */}
            <div className="mb-8">
              <div className="flex items-center gap-3 mb-3">
                <Building2 className="w-6 h-6 text-primary-600" />
                <h2 className="text-2xl md:text-3xl font-bold text-gray-900">
                  {careCenter.name}
                </h2>
              </div>
            </div>

            {/* 상세 정보 */}
            <div className="space-y-6">
              {/* 주소 */}
              {careCenter.address && (
                <div className="flex items-start gap-4">
                  <MapPin className="w-5 h-5 text-gray-400 mt-1 flex-shrink-0" />
                  <div>
                    <p className="text-sm text-gray-500 mb-1">주소</p>
                    <p className="text-gray-900 font-medium">{careCenter.address}</p>
                  </div>
                </div>
              )}

              {/* 전화번호 */}
              {careCenter.phone && (
                <div className="flex items-start gap-4">
                  <Phone className="w-5 h-5 text-gray-400 mt-1 flex-shrink-0" />
                  <div>
                    <p className="text-sm text-gray-500 mb-1">전화번호</p>
                    <a
                      href={`tel:${careCenter.phone}`}
                      className="text-primary-600 hover:text-primary-700 font-medium"
                    >
                      {careCenter.phone}
                    </a>
                  </div>
                </div>
              )}

              {/* 이메일 */}
              {careCenter.email && (
                <div className="flex items-start gap-4">
                  <Mail className="w-5 h-5 text-gray-400 mt-1 flex-shrink-0" />
                  <div>
                    <p className="text-sm text-gray-500 mb-1">이메일</p>
                    <a
                      href={`mailto:${careCenter.email}`}
                      className="text-primary-600 hover:text-primary-700 font-medium"
                    >
                      {careCenter.email}
                    </a>
                  </div>
                </div>
              )}

              {/* 설명 */}
              {careCenter.description && (
                <div className="flex items-start gap-4">
                  <FileText className="w-5 h-5 text-gray-400 mt-1 flex-shrink-0" />
                  <div className="flex-1">
                    <p className="text-sm text-gray-500 mb-2">설명</p>
                    <p className="text-gray-700 whitespace-pre-wrap leading-relaxed">
                      {careCenter.description}
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* 하단 정보 */}
            <div className="mt-8 pt-8 border-t border-gray-100 text-sm text-gray-500">
              <p>
                등록일: {new Date(careCenter.createdAt).toLocaleDateString('ko-KR', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </p>
              {careCenter.updatedAt && careCenter.updatedAt !== careCenter.createdAt && (
                <p className="mt-1">
                  최종 수정: {new Date(careCenter.updatedAt).toLocaleDateString('ko-KR', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  )
}

