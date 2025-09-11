"use client";

import { EmptyCard } from "@/components/empty-card";
import { ProductCard } from "@/components/product-card";
import { ProductCardSkeleton } from "@/components/product-card-skeleton";
import type { StoredFile } from "@/types";

interface Product {
  id: string;
  name: string;
  description: string | null;
  images: StoredFile[] | null;
  category: string | null;
  subcategory: string | null;
  price: string;
  inventory: number;
  rating: number | null;
  isFavorited?: boolean;
  createdAt: Date;
  updatedAt: Date | null;
}

interface ProductsGridProps {
  products: Product[];
  isLoading?: boolean;
}

export function ProductsGrid({ products, isLoading }: ProductsGridProps) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <ProductCardSkeleton key={i} />
        ))}
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <EmptyCard
        title="No products found"
        description="Try adjusting your filters or check back later for new products."
        className="col-span-full"
      />
    );
  }

  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {products.map((product) => (
        <ProductCard
          key={product.id}
          product={{
            id: product.id,
            name: product.name,
            price: product.price,
            images: product.images,
            inventory: product.inventory,
            isFavorited: product.isFavorited,
          }}
        />
      ))}
    </div>
  );
}
