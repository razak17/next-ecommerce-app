import { notFound } from "next/navigation";

import { Shell } from "@/components/shell";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { UserForm } from "@/features/users/components/user-form";
import { getUser } from "@/features/users/queries/users";

export default async function EditUserPage({
  params,
}: PageProps<"/admin/users/[userId]/edit">) {
  const { userId } = await params;

  const user = await getUser(userId);

  if (!user) {
    notFound();
  }

  return (
    <Shell className="flex flex-col">
      <div className="w-full">
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
