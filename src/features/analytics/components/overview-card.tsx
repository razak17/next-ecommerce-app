import { Icons } from "@/components/icons";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

interface OverviewCardProps {
  title: string;
  value: string;
  description: string;
  icon: keyof typeof Icons;
}

export function OverviewCard({
  title,
  value,
  description,
  icon,
}: OverviewCardProps) {
  const Icon = Icons[icon];

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="font-medium text-sm">{title}</CardTitle>
        <Icon className="size-4 text-muted-foreground" aria-hidden="true" />
      </CardHeader>
      <CardContent className="space-y-1">
        <div className="font-bold text-2xl">{value}</div>
        {description && (
          <p className="text-muted-foreground text-xs">{description}</p>
        )}
      </CardContent>
    </Card>
  );
}

export function OverviewCardSkeleton() {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
        <Skeleton className="h-4 w-20" />
        <Skeleton className="size-4" />
      </CardHeader>
      <CardContent className="space-y-2">
        <Skeleton className="h-6 w-12" />
        <Skeleton className="h-4 w-40" />
      </CardContent>
    </Card>
  );
}
