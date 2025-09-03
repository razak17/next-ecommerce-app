"use client";

import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export function UsersTableSkeleton() {
  return (
    <div className="space-y-4">
      {/* Table skeleton with proper structure */}
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Phone</TableHead>
              <TableHead>Created</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {Array.from({ length: 8 }).map((_, i) => (
              <TableRow key={i} className="animate-pulse">
                {/* Name column with avatar and name */}
                <TableCell>
                  <div className="flex items-center gap-3">
                    <Skeleton className="size-8 flex-shrink-0 rounded-full" />
                    <div className="min-w-0 flex-1 space-y-2">
                      <Skeleton
                        className="h-4 rounded"
                        style={{ width: `${Math.random() * 80 + 60}px` }}
                      />
                      <Skeleton
                        className="h-3 rounded"
                        style={{ width: `${Math.random() * 60 + 40}px` }}
                      />
                    </div>
                  </div>
                </TableCell>

                {/* Email */}
                <TableCell>
                  <Skeleton
                    className="h-4 rounded"
                    style={{ width: `${Math.random() * 100 + 120}px` }}
                  />
                </TableCell>

                {/* Role badge */}
                <TableCell>
                  <Skeleton className="h-6 w-16 rounded-full" />
                </TableCell>

                {/* Status badge */}
                <TableCell>
                  <Skeleton className="h-6 w-20 rounded-full" />
                </TableCell>

                {/* Phone */}
                <TableCell>
                  <Skeleton
                    className="h-4 rounded"
                    style={{ width: `${Math.random() * 40 + 80}px` }}
                  />
                </TableCell>

                {/* Created date */}
                <TableCell>
                  <Skeleton className="h-4 w-20 rounded" />
                </TableCell>

                {/* Actions */}
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Skeleton className="size-8 rounded" />
                    <Skeleton className="size-8 rounded" />
                    <Skeleton className="size-8 rounded" />
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Optional footer with pagination skeleton */}
      <div className="flex items-center justify-between pt-4">
        <Skeleton className="h-4 w-32 rounded" />
        <div className="flex items-center gap-2">
          <Skeleton className="h-8 w-16 rounded" />
          <Skeleton className="h-8 w-8 rounded" />
          <Skeleton className="h-8 w-8 rounded" />
          <Skeleton className="h-8 w-8 rounded" />
          <Skeleton className="h-8 w-16 rounded" />
        </div>
      </div>
    </div>
  );
}
