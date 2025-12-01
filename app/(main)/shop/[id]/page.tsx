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
        <div className="container mx-auto px-4 py-8 max-w-4xl">
          <Skeleton variant="rectangular" className="h-96 w-full" />
        </div>
      </AppLayout>
    )
  }

  if (!product) {
    return (
      <AppLayout>
        <div className="container mx-auto px-4 py-8 max-w-4xl">
          <div className="bg-white rounded-3xl shadow-soft border border-gray-100 p-12 text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-3">
              상품을 찾을 수 없습니다
            </h2>
            <Link href="/shop" className="btn-primary inline-flex items-center gap-2 mt-4">
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
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Back Button */}
        <Link
          href="/shop"
          className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 mb-6 transition-colors group"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          <span>뒤로가기</span>
        </Link>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Product Image */}
          <div className="bg-white rounded-3xl shadow-soft border border-gray-100 overflow-hidden">
            {product.imageUrl ? (
              <div className="relative w-full aspect-square">
                <Image
                  src={product.imageUrl}
                  alt={product.name}
                  fill
                  className="object-contain"
                  sizes="(max-width: 768px) 100vw, 50vw"
                />
              </div>
            ) : (
              <div className="w-full aspect-square flex items-center justify-center bg-gray-50">
                <Package className="w-32 h-32 text-gray-300" />
              </div>
            )}
          </div>

          {/* Product Info */}
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-4">{product.name}</h1>
              <p className="text-3xl font-bold text-gray-900 mb-6">
                {formatCurrency(product.price)}
              </p>
              {product.description && (
                <p className="text-gray-700 leading-relaxed">{product.description}</p>
              )}
            </div>

            <div className="pt-6 border-t border-gray-200">
              <div className="flex items-center justify-between mb-4">
                <span className="text-sm text-gray-600">재고</span>
                <span className={`font-semibold ${product.stock > 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {product.stock > 0 ? `${product.stock}개` : '품절'}
                </span>
              </div>

              {product.stock > 0 && (
                <div className="flex items-center gap-4 mb-6">
                  <span className="text-sm font-semibold text-gray-800">수량</span>
                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={() => setQuantity(Math.max(1, quantity - 1))}
                      className="w-10 h-10 rounded-xl border border-gray-300 flex items-center justify-center hover:bg-gray-50 transition-colors"
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                    <span className="w-12 text-center font-semibold">{quantity}</span>
                    <button
                      type="button"
                      onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                      className="w-10 h-10 rounded-xl border border-gray-300 flex items-center justify-center hover:bg-gray-50 transition-colors"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}

              <button
                onClick={handleAddToCart}
                disabled={product.stock === 0 || isAddingToCart}
                className="w-full btn-primary inline-flex items-center justify-center gap-2 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700"
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

