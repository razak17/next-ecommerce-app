import { IconPlus } from "@tabler/icons-react";
import Link from "next/link";
import { Suspense } from "react";

import { redirects } from "@/lib/constants";

import { Shell } from "@/components/shell";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ProductsTable } from "@/features/products/components/products-table";
import { ProductsTableSkeleton } from "@/features/products/components/products-table-skeleton";
import { getAllProducts } from "@/features/products/queries/products";

async function ProductsContent() {
  const products = await getAllProducts();
  if (products.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="font-bold text-2xl">
            No products found
          </CardTitle>
          <CardDescription>
            You haven't created any products yet. Create your first product to
            get started.
          </CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Total Products ({products.length})</CardTitle>
      </CardHeader>
      <CardContent>
        <ProductsTable products={products} />
      </CardContent>
    </Card>
  );
}

export default function ProductsPage() {
  return (
    <Shell className="flex flex-col">
      <div className="w-full">
        <Breadcrumb className="mb-6">
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link href={redirects.adminToDashboard}>Admin</Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>Products</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex flex-col gap-2">
                <CardTitle className="font-bold text-4xl">Products</CardTitle>
                <CardDescription>
                  Manage your product listings and inventory
                </CardDescription>
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
          </CardHeader>
          <CardContent>
            <Suspense fallback={<ProductsTableSkeleton />}>
              <ProductsContent />
            </Suspense>
          </CardContent>
        </Card>
      </div>
    </Shell>
  );
}
