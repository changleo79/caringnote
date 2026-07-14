"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import Link from "next/link";
import Image from "next/image";
import toast from "react-hot-toast";
import { ArrowLeft, Package, ShoppingCart, Plus, Minus } from "lucide-react";
import { formatCurrency } from "@/lib/utils";

export default function ProductDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { data: session } = useSession();
  const [product, setProduct] = useState<any>(null);
  const [quantity, setQuantity] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [isAddingToCart, setIsAddingToCart] = useState(false);

  useEffect(() => {
    const loadProduct = async () => {
      try {
        const res = await fetch(`/api/products/${params.id}`);
        const data = await res.json();
        if (res.ok) setProduct(data);
        else toast.error(data.error || "상품을 불러올 수 없습니다.");
      } catch {
        toast.error("상품을 불러오는 중 오류가 발생했습니다.");
      } finally {
        setIsLoading(false);
      }
    };

    if (session && params.id) loadProduct();
  }, [session, params.id]);

  const handleAddToCart = async () => {
    if (!product) return;
    setIsAddingToCart(true);
    try {
      const residentsRes = await fetch("/api/residents");
      const residents = await residentsRes.json();
      const residentId = Array.isArray(residents) && residents[0]?.id;
      if (!residentId) {
        toast.error("연결된 어르신이 필요합니다. 가족 연결을 먼저 완료하세요.");
        return;
      }
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          residentId,
          items: [{ productId: product.id, quantity }],
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        toast.error(data.error || "주문에 실패했습니다.");
        return;
      }
      toast.success("주문이 접수되었습니다.");
      router.push("/shop");
    } catch {
      toast.error("주문 중 오류가 발생했습니다.");
    } finally {
      setIsAddingToCart(false);
    }
  };

  if (!session) return null;

  if (isLoading) {
    return (
      <div className="mx-auto max-w-4xl py-16 text-center text-[var(--sn-ink-muted)]">
        불러오는 중…
      </div>
    );
  }

  if (!product) {
    return (
      <div className="mx-auto max-w-xl py-16 text-center">
        <h2 className="page-title">상품을 찾을 수 없습니다</h2>
        <Link href="/shop" className="btn-primary mt-6 inline-flex">
          <ArrowLeft className="h-4 w-4" />
          쇼핑몰로 돌아가기
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-4xl">
      <Link
        href="/shop"
        className="mb-8 inline-flex min-h-[48px] items-center gap-2 text-sm font-medium text-[var(--sn-ink-muted)]"
      >
        <ArrowLeft className="h-4 w-4" />
        쇼핑몰
      </Link>

      <div className="grid gap-10 md:grid-cols-2">
        <div className="relative aspect-square overflow-hidden bg-[var(--sn-surface-muted)]">
          {product.imageUrl ? (
            <Image
              src={product.imageUrl}
              alt={product.name}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 50vw"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center">
              <Package className="h-24 w-24 text-[var(--sn-ink-faint)]" />
            </div>
          )}
        </div>

        <div className="space-y-6">
          <div>
            <h1 className="font-display text-3xl font-semibold tracking-tight text-[var(--sn-ink)]">
              {product.name}
            </h1>
            <p className="mt-3 text-2xl font-semibold text-[var(--sn-ink)]">
              {formatCurrency(product.price)}
            </p>
            {product.description && (
              <p className="mt-4 leading-relaxed text-[var(--sn-ink-muted)]">
                {product.description}
              </p>
            )}
          </div>

          <div className="border-t border-[var(--sn-line)] pt-6">
            <div className="mb-4 flex items-center justify-between text-sm">
              <span className="text-[var(--sn-ink-muted)]">재고</span>
              <span
                className={
                  product.stock > 0
                    ? "font-semibold text-[var(--sn-good)]"
                    : "font-semibold text-[var(--sn-caution)]"
                }
              >
                {product.stock > 0 ? `${product.stock}개` : "품절"}
              </span>
            </div>

            {product.stock > 0 && (
              <div className="mb-6 flex items-center gap-4">
                <span className="text-sm font-medium text-[var(--sn-ink)]">수량</span>
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="flex h-12 w-12 items-center justify-center border border-[var(--sn-line-strong)]"
                  >
                    <Minus className="h-4 w-4" />
                  </button>
                  <span className="w-10 text-center font-semibold">{quantity}</span>
                  <button
                    type="button"
                    onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                    className="flex h-12 w-12 items-center justify-center border border-[var(--sn-line-strong)]"
                  >
                    <Plus className="h-4 w-4" />
                  </button>
                </div>
              </div>
            )}

            <button
              onClick={handleAddToCart}
              disabled={product.stock === 0 || isAddingToCart}
              className="btn-primary w-full"
            >
              <ShoppingCart className="h-5 w-5" />
              {product.stock === 0
                ? "품절"
                : isAddingToCart
                  ? "주문 중…"
                  : "주문하기"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
