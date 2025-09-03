import { IconPlus } from "@tabler/icons-react";
import Link from "next/link";
import { Suspense } from "react";

import { redirects } from "@/lib/constants";

import { Shell } from "@/components/shell";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { UsersTable } from "@/features/users/components/users-table";
import { UsersTableSkeleton } from "@/features/users/components/users-table-skeleton";
import { getAllUsers } from "@/features/users/queries/users";

async function UsersContent() {
  const users = await getAllUsers();
  if (users.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="font-bold text-2xl">No users found</CardTitle>
          <CardDescription>
            You haven't created any users yet. Create your first users to get
            started.
          </CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Total Users ({users.length})</CardTitle>
      </CardHeader>
      <CardContent>
        <UsersTable users={users} />
      </CardContent>
    </Card>
  );
}

export default function UsersPage() {
  return (
    <Shell className="flex flex-col">
      <div className="container mx-auto py-10">
        <Breadcrumb className="mb-6">
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link href={redirects.adminToDashboard}>Admin</Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>Users</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex flex-col gap-2">
                <CardTitle className="font-bold text-4xl">Users</CardTitle>
                <CardDescription className="text-muted-foreground">
                  Manage user accounts and permissions
                </CardDescription>
              </div>
              <Button asChild>
                <Link
                  className="flex items-center gap-2"
                  href={`${redirects.adminToUsers}/new`}
                >
                  <IconPlus className="size-4" />
                  Add New User
                </Link>
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <Suspense fallback={<UsersTableSkeleton />}>
              <UsersContent />
            </Suspense>
          </CardContent>
        </Card>
      </div>
    </Shell>
  );
}
