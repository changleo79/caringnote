"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { useSession } from "next-auth/react"
import AppLayout from "@/components/layout/AppLayout"
import Link from "next/link"
import Image from "next/image"
import toast from "react-hot-toast"
import { ArrowLeft, Package, ShoppingCart, Plus, Minus } from "lucide-react"
import { formatCurrency } from "@/lib/utils"
import { Skeleton } from "@/components/ui/Skeleton"

export default function ProductDetailPage() {
  const params = useParams()
  const router = useRouter()
  const { data: session } = useSession()
  const [product, setProduct] = useState<any>(null)
  const [quantity, setQuantity] = useState(1)
  const [isLoading, setIsLoading] = useState(true)
  const [isAddingToCart, setIsAddingToCart] = useState(false)

  // 상품 로드
  useEffect(() => {
    const loadProduct = async () => {
      try {
        const res = await fetch(`/api/products/${params.id}`)
        const data = await res.json()
        if (res.ok) {
          setProduct(data)
        } else {
          toast.error(data.error || "상품을 불러올 수 없습니다.")
        }
      } catch (error) {
        console.error("Error loading product:", error)
        toast.error("상품을 불러오는 중 오류가 발생했습니다.")
      } finally {
        setIsLoading(false)
      }
    }

    if (session && params.id) {
      loadProduct()
    }
  }, [session, params.id])

  const handleAddToCart = () => {
    // 장바구니 기능은 추후 구현
    toast.success("장바구니 기능은 곧 제공될 예정입니다.")
  }

  if (!session) {
    return null
  }

  if (isLoading) {
    return (
      <AppLayout>
        <div className="section-container py-10">
          <Skeleton variant="rectangular" className="h-96 w-full rounded-xl" />
        </div>
      </AppLayout>
    )
  }

  if (!product) {
    return (
      <AppLayout>
        <div className="section-container py-10">
          <div className="card-notion p-12 text-center">
            <h2 className="text-xl font-bold text-neutral-900 mb-2">
              상품을 찾을 수 없습니다
            </h2>
            <Link href="/shop" className="btn-linear-primary inline-flex items-center gap-2 mt-6">
              <ArrowLeft className="w-4 h-4" />
              쇼핑몰로 돌아가기
            </Link>
          </div>
        </div>
      </AppLayout>
    )
  }

  return (
    <AppLayout>
      <div className="section-container py-10">
        {/* Back Button */}
        <Link
          href="/shop"
          className="inline-flex items-center gap-2 text-sm text-neutral-600 hover:text-neutral-900 mb-8 transition-colors font-medium"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>뒤로가기</span>
        </Link>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Product Image - Notion 스타일 */}
          <div className="card-notion overflow-hidden">
            {product.imageUrl ? (
              <div className="relative w-full aspect-square bg-neutral-50">
                <Image
                  src={product.imageUrl}
                  alt={product.name}
                  fill
                  className="object-contain p-6"
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
              </div>
            ) : (
              <div className="w-full aspect-square flex items-center justify-center bg-neutral-50">
                <Package className="w-32 h-32 text-neutral-300" />
              </div>
            )}
          </div>

          {/* Product Info - Notion 스타일 */}
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-neutral-900 mb-4 tracking-tight">{product.name}</h1>
              <p className="text-3xl font-bold text-neutral-900 mb-6">
                {formatCurrency(product.price)}
              </p>
              {product.description && (
                <p className="text-neutral-700 leading-relaxed">{product.description}</p>
              )}
            </div>

            <div className="card-notion p-6">
              <div className="flex items-center justify-between mb-4">
                <span className="text-sm font-semibold text-neutral-600">재고</span>
                <span className={`font-bold text-lg ${product.stock > 0 ? 'text-emerald-600' : 'text-red-600'}`}>
                  {product.stock > 0 ? `${product.stock}개` : '품절'}
                </span>
              </div>

              {product.stock > 0 && (
                <div className="flex items-center gap-4 mb-6">
                  <span className="text-sm font-semibold text-neutral-800">수량</span>
                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="w-10 h-10 rounded-lg border border-neutral-300 flex items-center justify-center hover:bg-neutral-50 transition-colors"
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                    <span className="w-12 text-center font-semibold">{quantity}</span>
                    <button
                      type="button"
                      onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                      className="w-10 h-10 rounded-lg border border-neutral-300 flex items-center justify-center hover:bg-neutral-50 transition-colors"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}

              <button
                onClick={handleAddToCart}
                disabled={product.stock === 0 || isAddingToCart}
                className="w-full btn-linear-primary inline-flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <ShoppingCart className="w-5 h-5" />
                {product.stock === 0 ? "품절" : "장바구니에 담기"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  )
}
