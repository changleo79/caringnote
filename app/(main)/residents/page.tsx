import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { redirect } from "next/navigation"
import AppLayout from "@/components/layout/AppLayout"
import Link from "next/link"
import { prisma } from "@/lib/prisma"
import { Plus, User, Calendar, MapPin, Edit, Trash2, Users } from "lucide-react"
import Image from "next/image"
import ResidentActions from "./ResidentActions"

export default async function ResidentsPage() {
  const session = await getServerSession(authOptions)

  if (!session) {
    redirect("/auth/login")
  }

  // 요양원 정보 확인 (FAMILY는 연결된 입소자의 요양원 확인)
  let hasCareCenter = false
  if (session.user.role === "ADMIN" || session.user.role === "CAREGIVER") {
    hasCareCenter = !!session.user.careCenterId
  } else if (session.user.role === "FAMILY") {
    // FAMILY는 연결된 입소자가 있는지 확인
    try {
      const residentFamily = await prisma.residentFamily.findFirst({
        where: {
          userId: session.user.id!,
          isApproved: true,
        },
      })
      hasCareCenter = !!residentFamily
    } catch (error) {
      console.error("Failed to check resident family:", error)
    }
  }

  if (!hasCareCenter) {
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
                ? "입소자와 연결되어 있지 않아 입소자 정보를 확인할 수 없습니다. 먼저 입소자와 연결해주세요."
                : "요양원 정보를 설정하여 서비스를 시작할 수 있습니다."}
            </p>
            {session.user.role === "FAMILY" ? (
              <Link
                href="/care-center"
                className="btn-primary inline-flex items-center gap-2"
              >
                요양원 정보 확인하기
              </Link>
            ) : (
              <Link
                href="/care-center"
                className="btn-primary inline-flex items-center gap-2"
              >
                <Building2 className="w-5 h-5" />
                요양원 정보 설정하기
              </Link>
            )}
          </div>
        </div>
      </AppLayout>
    )
  }

  // FAMILY는 연결된 입소자만, CAREGIVER는 모든 입소자
  let residents: any[] = []

  try {
    if (session.user.role === "FAMILY") {
      // 연결된 입소자만 조회
      const residentFamilies = await prisma.residentFamily.findMany({
        where: {
          userId: session.user.id!,
          isApproved: true,
        },
        include: {
          resident: {
            include: {
              careCenter: {
                select: {
                  id: true,
                  name: true,
                },
              },
            },
          },
        },
      })

      residents = residentFamilies.map(rf => rf.resident)
    } else {
      // CAREGIVER는 모든 입소자 조회
      residents = await prisma.resident.findMany({
        where: {
          careCenterId: session.user.careCenterId,
        },
        include: {
          careCenter: {
            select: {
              id: true,
              name: true,
            },
          },
        },
        orderBy: {
          name: "asc",
        },
      })
    }
  } catch (error) {
    console.error("Failed to fetch residents:", error)
  }

  return (
    <AppLayout>
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
              입소자 관리
            </h1>
            <p className="text-gray-600">
              {session.user.role === "FAMILY" 
                ? "연결된 입소자 목록"
                : "요양원 입소자 목록 관리"}
            </p>
          </div>
          {(session.user.role === "CAREGIVER" || session.user.role === "ADMIN") && (
            <Link
              href="/residents/new"
              className="btn-primary inline-flex items-center gap-2"
            >
              <Plus className="w-5 h-5" />
              <span className="hidden sm:inline">입소자 등록</span>
              <span className="sm:hidden">등록</span>
            </Link>
          )}
        </div>

        {/* Residents List */}
        {residents.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {residents.map((resident) => (
              <div
                key={resident.id}
                className="bg-white rounded-2xl shadow-soft border border-gray-100 overflow-hidden card-hover group"
              >
                {/* 프로필 사진 */}
                <div className="relative w-full aspect-[4/3] overflow-hidden bg-gradient-to-br from-primary-100 to-accent-100">
                  {resident.photoUrl ? (
                    <Image
                      src={resident.photoUrl}
                      alt={resident.name}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <User className="w-20 h-20 text-primary-300" />
                    </div>
                  )}
                </div>

                {/* 정보 */}
                <div className="p-5">
                  <h3 className="font-bold text-xl text-gray-900 mb-3 group-hover:text-primary-600 transition-colors">
                    {resident.name}
                  </h3>

                  <div className="space-y-2 text-sm text-gray-600">
                    {resident.roomNumber && (
                      <div className="flex items-center gap-2">
                        <MapPin className="w-4 h-4 text-gray-400" />
                        <span>{resident.roomNumber}호실</span>
                      </div>
                    )}
                    {resident.birthDate && (
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-gray-400" />
                        <span>
                          {new Date(resident.birthDate).toLocaleDateString('ko-KR', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                          })}
                        </span>
                      </div>
                    )}
                    {resident.gender && (
                      <div className="flex items-center gap-2">
                        <Users className="w-4 h-4 text-gray-400" />
                        <span>{resident.gender}</span>
                      </div>
                    )}
                  </div>

                  {/* Actions */}
                  {(session.user.role === "CAREGIVER" || session.user.role === "ADMIN") && (
                    <div className="mt-4 pt-4 border-t border-gray-100 flex gap-2">
                      <Link
                        href={`/residents/${resident.id}/edit`}
                        className="flex-1 px-3 py-2 bg-primary-50 text-primary-700 rounded-lg text-sm font-bold hover:bg-primary-100 transition-colors inline-flex items-center justify-center gap-1.5"
                      >
                        <Edit className="w-4 h-4" />
                        수정
                      </Link>
                      <ResidentActions residentId={resident.id} residentName={resident.name} />
                    </div>
                  )}

                  {/* FAMILY는 상세 보기만 */}
                  {session.user.role === "FAMILY" && (
                    <div className="mt-4 pt-4 border-t border-gray-100">
                      <Link
                        href={`/residents/${resident.id}`}
                        className="block w-full px-3 py-2 bg-primary-600 text-white rounded-lg text-sm font-bold hover:bg-primary-700 transition-colors text-center"
                      >
                        상세 보기
                      </Link>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-3xl shadow-soft border border-gray-100 p-12 text-center">
            <div className="w-24 h-24 bg-gradient-to-br from-primary-100 to-accent-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <User className="w-12 h-12 text-primary-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-3">
              {session.user.role === "FAMILY" 
                ? "연결된 입소자가 없습니다"
                : "등록된 입소자가 없습니다"}
            </h2>
            <p className="text-gray-600 mb-8 max-w-md mx-auto">
              {session.user.role === "FAMILY"
                ? "요양원 직원에게 입소자 연결을 요청해주세요"
                : "첫 번째 입소자를 등록해보세요"}
            </p>
            {(session.user.role === "CAREGIVER" || session.user.role === "ADMIN") && (
              <Link
                href="/residents/new"
                className="btn-primary inline-flex items-center gap-2"
              >
                <Plus className="w-5 h-5" />
                첫 입소자 등록하기
              </Link>
            )}
          </div>
        )}
      </div>
    </AppLayout>
  )
}

