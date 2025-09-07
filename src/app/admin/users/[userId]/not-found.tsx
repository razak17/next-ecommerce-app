import { NotFoundCard } from "@/components/not-found-card";
import { Shell } from "@/components/shell";

export default function UserNotFound() {
  return (
    <Shell className="flex min-h-screen flex-col items-center justify-center">
      <div className="container mx-auto max-w-md py-10">
        <NotFoundCard
          title="User Not Found"
          description="The user you're looking for doesn't exist or has been removed."
          dashboardLink="/admin/users"
          dashboardLinkText="Back To Users"
          homeLink="/admin/dashboard"
          homeLinkText="Dashboard"
        />
      </div>
    </Shell>
  );
}
