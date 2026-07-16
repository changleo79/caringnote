import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import { Package } from "lucide-react";
import { formatCurrency } from "@/lib/utils";
import { prisma } from "@/lib/prisma";
import Image from "next/image";
import { PageHeader } from "@/components/calm/PageHeader";
import { EmptyState } from "@/components/calm/EmptyState";

const categoryLabels: Record<string, string> = {
  Daily: "일용품",
  Food: "식품",
  Medical: "의료용품",
  Clothes: "의류",
  Other: "기타",
};

export default async function ShopPage() {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/auth/login");

  let products: Array<{
    id: string;
    name: string;
    price: number;
    stock: number;
    category: string;
    imageUrl: string | null;
  }> = [];

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
    });
  } catch (error) {
    console.error("Failed to fetch products:", error);
  }

  return (
    <div className="mx-auto max-w-5xl">
      <PageHeader title="쇼핑몰" description="부모님께 필요한 생필품" />

      {products.length > 0 ? (
        <div className="grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-3">
          {products.map((product) => (
            <Link key={product.id} href={`/shop/${product.id}`} className="block group">
              <div className="relative aspect-square overflow-hidden bg-[var(--sn-surface-muted)]">
                {product.imageUrl ? (
                  <Image
                    src={product.imageUrl}
                    alt={product.name}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-[1.02]"
                    sizes="(max-width: 640px) 50vw, 33vw"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center">
                    <Package className="h-10 w-10 text-[var(--sn-ink-faint)]" />
                  </div>
                )}
              </div>
              <p className="mt-3 text-xs text-[var(--sn-ink-faint)]">
                {categoryLabels[product.category] || product.category}
              </p>
              <h3 className="mt-1 line-clamp-2 font-semibold text-[var(--sn-ink)]">
                {product.name}
              </h3>
              <p className="mt-1 text-[var(--sn-ink)]">{formatCurrency(product.price)}</p>
              <p
                className={`mt-1 text-sm ${
                  product.stock > 0 ? "text-[var(--sn-ink-muted)]" : "text-[var(--sn-caution)]"
                }`}
              >
                {product.stock > 0 ? `재고 ${product.stock}개` : "품절"}
              </p>
            </Link>
          ))}
        </div>
      ) : (
        <EmptyState
          title="등록된 상품이 없습니다"
          description="곧 필요한 생필품을 구매할 수 있습니다."
        />
      )}
    </div>
  );
}
