import { NotFoundCard } from "@/components/not-found-card";
import { Shell } from "@/components/shell";

export default function ProductsNotFound() {
  return (
    <Shell className="flex min-h-screen flex-col items-center justify-center">
      <div className="container mx-auto max-w-md py-10">
        <NotFoundCard
          title="Product Not Found"
          description="The product you're looking for doesn't exist or has been deleted."
          homeLink="/admin/dashboard"
          homeLinkText="Dashboard"
        />
      </div>
    </Shell>
  );
}
