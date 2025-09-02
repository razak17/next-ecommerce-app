import { IconPlus } from "@tabler/icons-react";
import Link from "next/link";
import { Suspense } from "react";

import { redirects } from "@/lib/constants";

import { Shell } from "@/components/shell";
import { Button } from "@/components/ui/button";
import { ProductsTable } from "@/features/products/components/products-table";
import { ProductsTableSkeleton } from "@/features/products/components/products-table-skeleton";
import { getAllProducts } from "@/features/products/queries/products";

async function ProductsContent() {
  const products = await getAllProducts();
  return <ProductsTable products={products} />;
}

export default function ProductsPage() {
  return (
    <Shell className="flex flex-col">
      <div className="container mx-auto py-10">
        <div className="mb-8 flex items-center justify-between">
          <div className="mb-8">
            <h1 className="font-bold text-4xl">Products</h1>
            <p className="text-muted-foreground">
              Manage your product listings and inventory
            </p>
          </div>
          <Button asChild>
            <Link
              className="flex items-center gap-2"
              href={`${redirects.adminToProducts}/new`}
            >
              <IconPlus className="size-4" />
              Add New Product
            </Link>
          </Button>
        </div>
        <Suspense fallback={<ProductsTableSkeleton />}>
          <ProductsContent />
        </Suspense>
      </div>
    </Shell>
  );
}
