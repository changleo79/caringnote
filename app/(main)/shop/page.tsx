import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { redirect } from "next/navigation"
import AppLayout from "@/components/layout/AppLayout"
import Link from "next/link"
import { ShoppingBag, Package } from "lucide-react"
import { formatCurrency } from "@/lib/utils"
import { prisma } from "@/lib/prisma"
import Image from "next/image"

const categoryLabels: Record<string, string> = {
  Daily: "일용품",
  Food: "식품",
  Medical: "의료용품",
  Clothes: "의류",
  Other: "기타",
}

export default async function ShopPage() {
  const session = await getServerSession(authOptions)

  if (!session) {
    redirect("/auth/login")
  }

  // 상품 목록 가져오기
  let products: any[] = []
  
  try {
    products = await prisma.product.findMany({
      where: {
        OR: [
          { careCenterId: session.user.careCenterId || null },
          { careCenterId: null }, // 공통 상품
        ],
      },
      orderBy: {
        createdAt: "desc",
      },
      take: 50,
    })
  } catch (error) {
    console.error("Failed to fetch products:", error)
  }

  return (
    <AppLayout>
      <div className="section-container py-10">
        {/* Header - Notion 스타일 */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-neutral-900 mb-2 tracking-tight">
            쇼핑몰
          </h1>
          <p className="text-neutral-600">
            부모님께 필요한 생필품을 쉽게 구매하세요
          </p>
        </div>

        {/* Products Grid - Notion 스타일 */}
        {products.length > 0 ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {products.map((product) => (
              <Link
                key={product.id}
                href={`/shop/${product.id}`}
                className="card-notion overflow-hidden card-hover-linear group"
              >
                {/* Product Image */}
                <div className="relative w-full aspect-square overflow-hidden bg-neutral-100">
                  {product.imageUrl ? (
                    <Image
                      src={product.imageUrl}
                      alt={product.name}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                      sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <Package className="w-12 h-12 text-neutral-300" />
                    </div>
                  )}
                </div>
                
                {/* Product Info */}
                <div className="p-5">
                  <div className="mb-2">
                    <span className="text-xs bg-emerald-50 text-emerald-700 px-2.5 py-1 rounded font-medium">
                      {categoryLabels[product.category] || product.category}
                    </span>
                  </div>
                  <h3 className="font-semibold text-neutral-900 mb-2 line-clamp-2 group-hover:text-emerald-600 transition-colors">
                    {product.name}
                  </h3>
                  <p className="text-xl font-bold text-neutral-900 mb-3">
                    {formatCurrency(product.price)}
                  </p>
                  <div className="pt-3 border-t border-neutral-100">
                    <span className={`text-xs font-medium ${product.stock > 0 ? 'text-emerald-600' : 'text-red-600'}`}>
                      {product.stock > 0 ? `재고 ${product.stock}개` : '품절'}
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="card-notion p-12 text-center">
            <div className="w-16 h-16 bg-emerald-100 rounded-lg flex items-center justify-center mx-auto mb-4">
              <ShoppingBag className="w-8 h-8 text-emerald-600" />
            </div>
            <h2 className="text-xl font-bold text-neutral-900 mb-2">
              등록된 상품이 없습니다
            </h2>
            <p className="text-sm text-neutral-600 mb-6 max-w-md mx-auto">
              곧 부모님께 필요한 생필품을 구매할 수 있는 상품들이 등록될 예정입니다
            </p>
          </div>
        )}
      </div>
    </AppLayout>
  )
}
