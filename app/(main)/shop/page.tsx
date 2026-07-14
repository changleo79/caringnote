import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { redirect } from "next/navigation"
import Link from "next/link"
import { ShoppingBag, Package } from "lucide-react"
import { formatCurrency } from "@/lib/utils"
import { prisma } from "@/lib/prisma"
import Image from "next/image"
import { Card, CardContent } from "@/components/ui/Card"

const categoryLabels: Record<string, string> = {
  Daily: "일용품",
  Food: "식품",
  Medical: "의료용품",
  Clothes: "의류",
  Other: "기타",
}

export default async function ShopPage() {
  const session = await getServerSession(authOptions)
  if (!session) redirect("/auth/login")

  let products: Array<{
    id: string
    name: string
    price: number
    stock: number
    category: string
    imageUrl: string | null
  }> = []

  try {
    products = await prisma.product.findMany({
      where: {
        OR: [
          { careCenterId: session.user.careCenterId || null },
          { careCenterId: null },
        ],
      },
      orderBy: { createdAt: "desc" },
      take: 50,
    })
  } catch (error) {
    console.error("Failed to fetch products:", error)
  }

  return (
    <><div className="px-4 sm:px-6 py-8 max-w-5xl">
        <div className="page-header">
          <h1 className="page-title">쇼핑몰</h1>
          <p className="page-description">부모님께 필요한 생필품을 쉽게 구매하세요</p>
        </div>

        {products.length > 0 ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {products.map((product) => (
              <Link key={product.id} href={`/shop/${product.id}`} className="card-interactive overflow-hidden block">
                <div className="relative w-full aspect-square overflow-hidden bg-neutral-100">
                  {product.imageUrl ? (
                    <Image
                      src={product.imageUrl}
                      alt={product.name}
                      fill
                      className="object-cover"
                      sizes="(max-width: 640px) 50vw, 33vw"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <Package className="w-12 h-12 text-neutral-300" />
                    </div>
                  )}
                </div>
                <CardContent>
                  <span className="badge bg-emerald-50 text-emerald-700 mb-2">
                    {categoryLabels[product.category] || product.category}
                  </span>
                  <h3 className="font-semibold text-neutral-900 mb-1 line-clamp-2">{product.name}</h3>
                  <p className="text-subheading text-neutral-900 mb-2">{formatCurrency(product.price)}</p>
                  <span className={`text-caption font-medium ${product.stock > 0 ? "text-emerald-600" : "text-red-500"}`}>
                    {product.stock > 0 ? `재고 ${product.stock}개` : "품절"}
                  </span>
                </CardContent>
              </Link>
            ))}
          </div>
        ) : (
          <Card className="text-center py-16">
            <CardContent>
              <div className="w-16 h-16 bg-emerald-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <ShoppingBag className="w-8 h-8 text-emerald-600" />
              </div>
              <h2 className="text-subheading text-neutral-900 mb-2">등록된 상품이 없습니다</h2>
              <p className="text-body text-neutral-500 max-w-sm mx-auto">
                곧 부모님께 필요한 생필품을 구매할 수 있는 상품들이 등록될 예정입니다
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </>
  )
}
