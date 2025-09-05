"use client";

import { IconEdit, IconTrash, IconUser } from "@tabler/icons-react";
import Link from "next/link";

import { redirects } from "@/lib/constants";

import { ConfirmDialog } from "@/components/confirm-dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { User } from "@/db/schema/users";
import { deleteUser } from "../actions/users";

interface UsersTableProps {
  users: User[];
}

export function UsersTable({ users }: UsersTableProps) {
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
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Role</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Phone</TableHead>
            <TableHead>Created</TableHead>
            <TableHead className="w-[120px]">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {users.length === 0 ? (
            <TableRow>
              <TableCell colSpan={7} className="py-8 text-center">
                <div className="flex flex-col items-center gap-2">
                  <IconUser className="size-8 text-muted-foreground" />
                  <p className="text-muted-foreground">No users found</p>
                </div>
              </TableCell>
            </TableRow>
          ) : (
            users.map((user) => (
              <TableRow key={user.id}>
                <TableCell>
                  <div className="flex items-center gap-2 py-3">
                    <Avatar className="size-10 rounded-full">
                      <AvatarImage
                        src={user?.image ? user?.image : undefined}
                        alt={user.name}
                      />
                      <AvatarFallback className="rounded-full text-sidebar-accent-foreground">
                        {user?.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium">{user.name}</p>
                    </div>
                  </div>
                </TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>
                  <Badge variant={getRoleBadgeVariant(user.role)}>
                    {user.role || "No role"}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Badge variant={user.emailVerified ? "default" : "secondary"}>
                    {user.emailVerified ? "Verified" : "Unverified"}
                  </Badge>
                </TableCell>
                <TableCell>{user.phone || "—"}</TableCell>
                <TableCell>{user.createdAt.toLocaleDateString()}</TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Button asChild variant="ghost" size="sm">
                      <Link href={`${redirects.adminToUsers}/${user.id}`}>
                        <IconUser className="size-4" />
                        <span className="sr-only">View user</span>
                      </Link>
                    </Button>
                    <Button asChild variant="ghost" size="sm">
                      <Link href={`${redirects.adminToUsers}/${user.id}/edit`}>
                        <IconEdit className="size-4" />
                        <span className="sr-only">Edit user</span>
                      </Link>
                    </Button>
                    <ConfirmDialog
                      title="Delete User"
                      description={`Are you sure you want to delete "${user.name}"? This action cannot be undone.`}
                      successMessage="User deleted successfully"
                      onConfirm={deleteUser.bind(null, user.id)}
                    >
                      <Button variant="ghost" size="sm">
                        <IconTrash className="size-4" />
                        <span className="sr-only">Delete user</span>
                      </Button>
                    </ConfirmDialog>
                  </div>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );
}
