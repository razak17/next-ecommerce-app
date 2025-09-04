import Link from "next/link";
import { notFound } from "next/navigation";

import { Shell } from "@/components/shell";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { UserForm } from "@/features/users/components/user-form";
import { getUser } from "@/features/users/queries/users";

interface EditUserPageProps {
  params: Promise<{
    userId: string;
  }>;
}

export default async function EditUserPage({ params }: EditUserPageProps) {
  const { userId } = await params;

  const user = await getUser(userId);

  if (!user) {
    notFound();
  }

  return (
    <Shell className="flex flex-col">
      <div className="w-full">
        <Breadcrumb className="mb-6">
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link href="/admin">Admin</Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link href="/admin/users">Users</Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link href={`/admin/users/${user.id}`}>{user.name}</Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>Edit</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        <Card>
          <CardHeader>
            <CardTitle className="font-bold text-2xl">Edit User</CardTitle>
            <CardDescription>
              Update user information and settings
            </CardDescription>
          </CardHeader>
          <CardContent>
            <UserForm user={user} />
          </CardContent>
        </Card>
      </div>
    </Shell>
  );
}
