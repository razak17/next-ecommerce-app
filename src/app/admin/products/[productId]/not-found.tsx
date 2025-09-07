import { NotFoundCard } from "@/components/not-found-card";
import { Shell } from "@/components/shell";

export default function ProductNotFound() {
  return (
    <Shell className="flex min-h-screen flex-col items-center justify-center">
      <div className="container mx-auto max-w-md py-10">
        <NotFoundCard
          title="Product Not Found"
          description="The specific product you're looking for doesn't exist, has been deleted, or you don't have permission to access it."
          dashboardLink="/admin/products"
          dashboardLinkText="View All Products"
          homeLink="/admin/dashboard"
          homeLinkText="Dashboard"
        />
      </div>
    </Shell>
  );
}
