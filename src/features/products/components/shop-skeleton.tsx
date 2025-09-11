import {
  PageHeader,
  PageHeaderDescription,
  PageHeaderHeading,
} from "@/components/page-header";
import { Shell } from "@/components/shell";
import { Card, CardContent } from "@/components/ui/card";
import { ProductsGrid } from "@/features/products/components/products-grid";

export function ShopSkeleton() {
  return (
    <Shell className="min-h-screen">
      <PageHeader>
        <PageHeaderHeading>Shop</PageHeaderHeading>
        <PageHeaderDescription>
          Discover our collection of products
        </PageHeaderDescription>
      </PageHeader>
      <div className="flex flex-col gap-6 lg:flex-row lg:gap-8">
        <aside className="w-full lg:w-64 lg:shrink-0">
          <Card>
            <CardContent className="p-6">
              <div className="space-y-4">
                <div className="h-4 animate-pulse rounded bg-muted" />
                <div className="h-4 animate-pulse rounded bg-muted" />
                <div className="h-4 animate-pulse rounded bg-muted" />
              </div>
            </CardContent>
          </Card>
        </aside>
        <main className="flex-1">
          <ProductsGrid products={[]} isLoading={true} />
        </main>
      </div>
    </Shell>
  );
}
