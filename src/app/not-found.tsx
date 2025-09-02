import { NotFoundCard } from "@/components/not-found-card";
import { Shell } from "@/components/shell";

export default function NotFound() {
  return (
    <Shell className="flex min-h-screen flex-col items-center justify-center">
      <div className="container mx-auto max-w-md py-10">
        <NotFoundCard />
      </div>
    </Shell>
  );
}
