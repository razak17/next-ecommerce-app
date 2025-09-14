import { Shell } from "@/components/shell";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export function DashboardSkeleton() {
  return (
    <Shell className="flex flex-col gap-6">
      <div className="w-full">
        <div className="mb-8">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="mt-2 h-4 w-80" />
        </div>

        {/* Overview Stats Skeleton */}
        <div className="mb-8 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <Card key={i}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-4 w-4" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-8 w-20" />
                <Skeleton className="mt-1 h-3 w-32" />
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          {/* Recent Orders Skeleton */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <Skeleton className="h-5 w-24" />
                <Skeleton className="mt-1 h-4 w-32" />
              </div>
              <Skeleton className="h-8 w-16" />
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-4 gap-4">
                  <Skeleton className="h-4 w-16" />
                  <Skeleton className="h-4 w-16" />
                  <Skeleton className="h-4 w-16" />
                  <Skeleton className="h-4 w-16" />
                </div>
                {Array.from({ length: 3 }).map((_, i) => (
                  <div key={i} className="grid grid-cols-4 gap-4">
                    <div>
                      <Skeleton className="h-4 w-20" />
                      <Skeleton className="mt-1 h-3 w-24" />
                    </div>
                    <Skeleton className="h-4 w-16" />
                    <Skeleton className="h-5 w-14 rounded-full" />
                    <Skeleton className="h-4 w-12" />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Low Inventory Products Skeleton */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <Skeleton className="h-5 w-28" />
                <Skeleton className="mt-1 h-4 w-36" />
              </div>
              <Skeleton className="h-8 w-24" />
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-3 gap-4">
                  <Skeleton className="h-4 w-16" />
                  <Skeleton className="h-4 w-16" />
                  <Skeleton className="h-4 w-12" />
                </div>
                {Array.from({ length: 3 }).map((_, i) => (
                  <div key={i} className="grid grid-cols-3 gap-4">
                    <Skeleton className="h-4 w-32" />
                    <Skeleton className="h-4 w-20" />
                    <Skeleton className="h-5 w-16 rounded-full" />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions Skeleton */}
        <div className="mt-8">
          <Skeleton className="mb-4 h-6 w-32" />
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <Card key={i}>
                <CardHeader className="pb-3">
                  <div className="flex items-center gap-2">
                    <Skeleton className="h-4 w-4" />
                    <Skeleton className="h-4 w-16" />
                  </div>
                  <Skeleton className="mt-1 h-3 w-32" />
                </CardHeader>
                <CardContent>
                  <Skeleton className="h-9 w-full" />
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </Shell>
  );
}
