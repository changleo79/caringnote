"use client"

import { useState, useEffect } from "react"
import { Users, User, Building2, Mail, Phone, Calendar, Shield, Search, Filter } from "lucide-react"
import Image from "next/image"
import { formatDate } from "@/lib/utils"

export default function MemberList({ 
  careCenterId, 
  userRole 
}: { 
  careCenterId: string
  userRole: string
}) {
  const [members, setMembers] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [filterRole, setFilterRole] = useState<string>("ALL") // ALL, FAMILY, CAREGIVER
  const [searchQuery, setSearchQuery] = useState("")

  const loadMembers = async () => {
    setIsLoading(true)
    try {
      let url = `/api/care-centers/${careCenterId}/members`
      if (filterRole !== "ALL") {
        url += `?role=${filterRole}`
      }
      const res = await fetch(url)
      if (res.ok) {
        const data = await res.json()
        setMembers(data.members || data || [])
      }
    } catch (error) {
      console.error("Failed to load members:", error)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    loadMembers()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [careCenterId, filterRole])

  // 검색 필터링
  const filteredMembers = members.filter(member => {
    if (!searchQuery) return true
    const query = searchQuery.toLowerCase()
    return (
      member.name?.toLowerCase().includes(query) ||
      member.email?.toLowerCase().includes(query) ||
      member.phone?.includes(query)
    )
  })

  const roleLabels: Record<string, string> = {
    FAMILY: "가족 회원",
    CAREGIVER: "요양원 직원",
    ADMIN: "관리자",
  }

  const roleColors: Record<string, string> = {
    FAMILY: "bg-primary-100 text-primary-700",
    CAREGIVER: "bg-green-100 text-green-700",
    ADMIN: "bg-purple-100 text-purple-700",
  }

  if (isLoading) {
    return (
      <div className="bg-white rounded-3xl shadow-soft border border-gray-100 p-12">
        <div className="text-center py-16">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary-600"></div>
          <p className="mt-4 text-gray-600">회원 목록을 불러오는 중...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-3xl shadow-soft border border-gray-100 overflow-hidden">
      {/* 필터 및 검색 */}
      <div className="p-6 border-b border-gray-100 bg-gradient-to-r from-gray-50 to-white">
        <div className="flex flex-col md:flex-row gap-4">
          {/* 검색 */}
          <div className="flex-1 relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="이름, 이메일, 전화번호로 검색..."
              className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-xl input-focus outline-none transition-all bg-white text-gray-900 font-medium"
            />
          </div>

          {/* 역할 필터 */}
          <div className="flex items-center gap-2">
            <Filter className="w-5 h-5 text-gray-400" />
            <select
              value={filterRole}
              onChange={(e) => setFilterRole(e.target.value)}
              className="px-4 py-3 border-2 border-gray-200 rounded-xl input-focus outline-none transition-all bg-white text-gray-900 font-medium"
            >
              <option value="ALL">전체</option>
              <option value="FAMILY">가족 회원</option>
              <option value="CAREGIVER">요양원 직원</option>
            </select>
          </div>
        </div>
      </div>

      {/* 회원 목록 */}
      <div className="divide-y divide-gray-100">
        {filteredMembers.length > 0 ? (
          filteredMembers.map((member) => (
            <div
              key={member.id}
              className="p-6 hover:bg-gray-50 transition-colors"
            >
              <div className="flex items-center gap-4">
                {/* 프로필 사진 */}
                <div className="relative w-12 h-12 rounded-full overflow-hidden bg-gradient-to-br from-primary-400 to-accent-400 flex items-center justify-center flex-shrink-0">
                  {member.avatarUrl ? (
                    <Image
                      src={member.avatarUrl}
                      alt={member.name}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <User className="w-6 h-6 text-white" />
                  )}
                </div>

                {/* 정보 */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="font-bold text-lg text-gray-900">{member.name}</h3>
                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${roleColors[member.role] || roleColors.FAMILY}`}>
                      {roleLabels[member.role] || member.role}
                    </span>
                  </div>

                  <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600">
                    {member.email && (
                      <div className="flex items-center gap-2">
                        <Mail className="w-4 h-4 text-gray-400" />
                        <span>{member.email}</span>
                      </div>
                    )}
                    {member.phone && (
                      <div className="flex items-center gap-2">
                        <Phone className="w-4 h-4 text-gray-400" />
                        <span>{member.phone}</span>
                      </div>
                    )}
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-gray-400" />
                      <span>가입일: {formatDate(member.createdAt)}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="p-12 text-center">
            <div className="w-20 h-20 bg-gradient-to-br from-gray-100 to-gray-200 rounded-2xl flex items-center justify-center mx-auto mb-5">
              <Users className="w-10 h-10 text-gray-400" />
            </div>
            <p className="text-gray-600">
              {searchQuery ? "검색 결과가 없습니다." : "등록된 회원이 없습니다."}
            </p>
          </div>
        )}
      </div>
    </div>
  )
}

