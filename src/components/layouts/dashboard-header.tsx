import { AuthDropdown } from "@/components/layouts/auth-dropdown";
import type { SessionUser } from "@/types";
import { SidebarTrigger } from "../ui/sidebar";

interface DashboardHeaderProps {
  user: SessionUser | null;
}

export function DashboardHeader({ user }: DashboardHeaderProps) {
  return (
    <header className="sticky top-0 z-50 w-full border-border/60 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center">
        <SidebarTrigger className="size-5" />
        <div className="flex flex-1 items-center justify-end space-x-4">
          <nav className="flex items-center space-x-2">
            <AuthDropdown user={user} />
          </nav>
        </div>
      </div>
    </header>
  );
}
