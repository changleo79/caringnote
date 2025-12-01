import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { redirect } from "next/navigation"
import AppLayout from "@/components/layout/AppLayout"
import { Bell } from "lucide-react"

export default async function NotificationsPage() {
  const session = await getServerSession(authOptions)

  if (!session) {
    redirect("/auth/login")
  }

  return (
    <AppLayout>
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
            알림
          </h1>
          <p className="text-gray-600">
            중요한 소식을 놓치지 마세요
          </p>
        </div>

        {/* Empty State */}
        <div className="bg-white rounded-3xl shadow-soft border border-gray-100 p-12 text-center">
          <div className="w-24 h-24 bg-gradient-to-br from-amber-100 to-orange-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <Bell className="w-12 h-12 text-amber-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-3">
            알림이 없습니다
          </h2>
          <p className="text-gray-600 mb-8 max-w-md mx-auto">
            새로운 알림이 도착하면 여기에 표시됩니다
          </p>
        </div>
      </div>
    </AppLayout>
  )
}

