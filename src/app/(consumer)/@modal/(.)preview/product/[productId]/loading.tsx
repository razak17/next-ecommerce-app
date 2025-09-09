import { DialogShell } from "@/components/dialog-shell";
import { PlaceholderImage } from "@/components/placeholder-image";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Skeleton } from "@/components/ui/skeleton";

export default function ProductModalLoading() {
  return (
    <DialogShell className="flex flex-col gap-2 overflow-visible sm:flex-row">
      <Skeleton className="absolute top-4 right-10 size-4" />
      <AspectRatio ratio={16 / 9} className="w-full">
        <PlaceholderImage className="rounded-none" isSkeleton asChild />
      </AspectRatio>
      <div className="w-full space-y-6 p-6 sm:p-10">
        <div className="space-y-2">
          <Skeleton className="h-8 w-3/4" />
          <Skeleton className="h-6 w-20" />
          <Skeleton className="h-5 w-24" />
          <Skeleton className="h-6 w-16" />
        </div>
        <Skeleton className="h-20 w-full" />
      </div>
    </DialogShell>
  );
}
