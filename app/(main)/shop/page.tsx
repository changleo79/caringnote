import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { redirect } from "next/navigation"
import AppLayout from "@/components/layout/AppLayout"
import { ShoppingBag, Package } from "lucide-react"

export default async function ShopPage() {
  const session = await getServerSession(authOptions)

  if (!session) {
    redirect("/auth/login")
  }

  return (
    <AppLayout>
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
            쇼핑몰
          </h1>
          <p className="text-gray-600">
            부모님께 필요한 생필품을 쉽게 구매하세요
          </p>
        </div>

        {/* Empty State */}
        <div className="bg-white rounded-3xl shadow-soft border border-gray-100 p-12 text-center">
          <div className="w-24 h-24 bg-gradient-to-br from-green-100 to-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <ShoppingBag className="w-12 h-12 text-green-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-3">
            쇼핑몰 준비 중
          </h2>
          <p className="text-gray-600 mb-8 max-w-md mx-auto">
            곧 부모님께 필요한 생필품을 쉽게 구매할 수 있는 쇼핑몰이 제공될 예정입니다
          </p>
        </div>
      </div>
    </AppLayout>
  )
}

