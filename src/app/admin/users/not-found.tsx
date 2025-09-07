import { NotFoundCard } from "@/components/not-found-card";
import { Shell } from "@/components/shell";

export default function UsersNotFound() {
  return (
    <Shell className="flex min-h-screen flex-col items-center justify-center">
      <div className="container mx-auto max-w-md py-10">
        <NotFoundCard
          title="Users Not Found"
          description="The users page you're looking for doesn't exist."
          homeLink="/admin/dashboard"
          homeLinkText="Dashboard"
        />
      </div>
    </Shell>
  );
}
