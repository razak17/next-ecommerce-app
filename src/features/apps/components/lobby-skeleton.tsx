import { ProductCardSkeleton } from "@/components/product-card-skeleton";
import { Shell } from "@/components/shell";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export function LobbySkeleton() {
  return (
    <>
      <Shell className="max-w-6xl gap-0">
        <section className="space-y-6 pt-14 md:pt-20 lg:pt-24">
          <div className="mb-4 flex max-w-6xl flex-col items-center gap-1 text-center">
            <Skeleton className="h-8 w-48" />
            <Skeleton className="h-4 w-96" />
          </div>
          <div className="grid grid-cols-1 xs:grid-cols-2 gap-4 md:grid-cols-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <Card key={i} className="h-full overflow-hidden">
                <CardContent className="flex aspect-square items-center justify-center p-6">
                  <Skeleton className="size-20" />
                </CardContent>
                <div className="p-4 pt-0">
                  <Skeleton className="h-6 w-full" />
                </div>
              </Card>
            ))}
          </div>
        </section>

        <section className="space-y-6 pt-14 md:pt-20 lg:pt-24">
          <div className="flex items-center justify-between gap-4">
            <div className="flex max-w-[61.25rem] flex-1 flex-col gap-0.5">
              <Skeleton className="h-8 w-48" />
              <Skeleton className="h-4 w-80" />
            </div>
            <Skeleton className="hidden h-10 w-32 sm:flex" />
          </div>
          <div className="space-y-8">
            <div className="grid xs:grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-4">
              {Array.from({ length: 8 }).map((_, i) => (
                <ProductCardSkeleton key={i} />
              ))}
            </div>
            <Skeleton className="mx-auto h-10 w-32 sm:hidden" />
          </div>
        </section>
      </Shell>

      <section className="container space-y-6 bg-primary py-14">
        <div className="flex flex-col items-center space-y-4 text-center">
          <Skeleton className="h-8 w-96 bg-primary-foreground/20" />
          <Skeleton className="h-6 w-80 bg-primary-foreground/20" />
        </div>

        <div className="container grid max-w-6xl grid-cols-1 gap-6 pt-6 sm:grid-cols-2 md:grid-cols-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <div
              key={i}
              className="flex flex-col items-center space-y-2 text-center"
            >
              <Skeleton className="size-12 bg-primary-foreground/20" />
              <Skeleton className="h-6 w-32 bg-primary-foreground/20" />
              <Skeleton className="mt-3 h-4 w-48 bg-primary-foreground/20" />
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
