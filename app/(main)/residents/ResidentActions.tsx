"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import toast from "react-hot-toast"
import { Trash2 } from "lucide-react"

export default function ResidentActions({ 
  residentId, 
  residentName 
}: { 
  residentId: string
  residentName: string
}) {
  const router = useRouter()
  const [isDeleting, setIsDeleting] = useState(false)

  const handleDelete = async () => {
    if (!confirm(`정말로 "${residentName}" 입소자를 삭제하시겠습니까?\n연결된 가족이 있다면 먼저 연결을 해제해야 합니다.`)) {
      return
    }

    setIsDeleting(true)

    try {
      const res = await fetch(`/api/residents/${residentId}`, {
        method: "DELETE",
      })

      const data = await res.json()

      if (res.ok) {
        toast.success("입소자가 삭제되었습니다.")
        router.refresh()
      } else {
        toast.error(data.error || "입소자 삭제에 실패했습니다.")
      }
    } catch (error) {
      console.error("Error deleting resident:", error)
      toast.error("입소자 삭제 중 오류가 발생했습니다.")
    } finally {
      setIsDeleting(false)
    }
  }

  return (
    <button
      onClick={handleDelete}
      disabled={isDeleting}
      className="flex-1 px-3 py-2 bg-red-50 text-red-700 rounded-lg text-sm font-bold hover:bg-red-100 transition-colors inline-flex items-center justify-center gap-1.5 disabled:opacity-50 disabled:cursor-not-allowed"
    >
      <Trash2 className="w-4 h-4" />
      삭제
    </button>
  )
}

