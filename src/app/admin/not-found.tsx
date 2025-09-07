import { NotFoundCard } from "@/components/not-found-card";
import { Shell } from "@/components/shell";

export default function AdminNotFound() {
  return (
    <Shell className="flex min-h-screen flex-col items-center justify-center">
      <div className="container mx-auto max-w-md py-10">
        <NotFoundCard
          title="Admin Page Not Found"
          description="The admin page you're looking for doesn't exist or you don't have permission to access it."
          dashboardLink="/admin/dashboard"
          dashboardLinkText="Admin Dashboard"
        />
      </div>
    </Shell>
  );
}
