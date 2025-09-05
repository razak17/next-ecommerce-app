import { Breadcrumbs } from "@/components/breadcrumbs";
import { AuthDropdown } from "@/components/layouts/auth-dropdown";
import { ModeToggle } from "@/components/layouts/mode-toggle";
import { Separator } from "@/components/ui/separator";
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
        <Separator
          orientation="vertical"
          className="mx-2 data-[orientation=vertical]:h-4"
        />
        <Breadcrumbs />
        <div className="flex flex-1 items-center justify-end space-x-4">
          <nav className="flex items-center space-x-2">
            <ModeToggle />
            <AuthDropdown user={user} />
          </nav>
        </div>
      </div>
    </header>
  );
}
