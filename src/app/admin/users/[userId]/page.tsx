import { IconEdit } from "@tabler/icons-react";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

import { Shell } from "@/components/shell";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getUser } from "@/features/users/queries/users";

export default async function UserPage({
  params,
}: PageProps<"/admin/users/[userId]">) {
  const { userId } = await params;

  const user = await getUser(userId);

  if (!user) {
    notFound();
  }

  const getRoleBadgeVariant = (role: string | null) => {
    switch (role) {
      case "admin":
        return "destructive";
      case "consumer":
        return "secondary";
      default:
        return "outline";
    }
  };

  return (
    <Shell className="flex flex-col">
      <div className="w-full">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="font-bold text-2xl">User Info</h1>
            <p className="text-muted-foreground">
              User profile and account information
            </p>
          </div>
          <Button asChild>
            <Link
              href={`/admin/users/${user.id}/edit`}
              className="flex items-center gap-2"
            >
              <IconEdit className="size-4" />
              Edit User
            </Link>
          </Button>
        </div>

        <div className="grid gap-8 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Profile Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-4">
                {user.image && (
                  <Image
                    src={user.image}
                    alt={user.name}
                    width={64}
                    height={64}
                    className="size-16 rounded-full object-cover"
                  />
                )}
                <div>
                  <h3 className="font-medium text-lg">{user.name}</h3>
                  {user.firstName || user.lastName ? (
                    <p className="text-muted-foreground">
                      {[user.firstName, user.lastName]
                        .filter(Boolean)
                        .join(" ")}
                    </p>
                  ) : null}
                </div>
              </div>

              <div>
                <h3 className="font-medium">Email</h3>
                <p className="text-muted-foreground">{user.email}</p>
              </div>

              {user.phone && (
                <div>
                  <h3 className="font-medium">Phone</h3>
                  <p className="text-muted-foreground">{user.phone}</p>
                </div>
              )}

              {user.gender && (
                <div>
                  <h3 className="font-medium">Gender</h3>
                  <p className="text-muted-foreground">{user.gender}</p>
                </div>
              )}
            </CardContent>
          </Card>

          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Account Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h3 className="font-medium">Role</h3>
                  <Badge variant={getRoleBadgeVariant(user.role)}>
                    {user.role || "No role"}
                  </Badge>
                </div>

                <div>
                  <h3 className="font-medium">Email Status</h3>
                  <Badge variant={user.emailVerified ? "default" : "secondary"}>
                    {user.emailVerified ? "Verified" : "Unverified"}
                  </Badge>
                </div>

                <div>
                  <h3 className="font-medium">Account Created</h3>
                  <p className="text-muted-foreground">
                    {user.createdAt.toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </p>
                </div>

                {user.updatedAt && (
                  <div>
                    <h3 className="font-medium">Last Updated</h3>
                    <p className="text-muted-foreground">
                      {user.updatedAt.toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </Shell>
  );
}
