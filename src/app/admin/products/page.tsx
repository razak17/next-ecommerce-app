import { IconPlus } from "@tabler/icons-react";
import Link from "next/link";

import { redirects } from "@/lib/constants";

import { Shell } from "@/components/shell";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function ProductsPage() {
  return (
    <Shell className="flex flex-col">
      <div className="container mx-auto py-10">
        <div className="mb-8 flex items-center justify-between">
          <div className="mb-8">
            <h1 className="font-bold text-4xl">Products</h1>
            <p className="text-muted-foreground">
              Manage your product listings and inventory
            </p>
          </div>
          <Button size="lg" asChild>
            <Link
              className="flex w-48 items-center gap-2"
              href={`${redirects.adminToProducts}/new`}
            >
              <IconPlus className="size-4" />
              Add New Product
            </Link>
          </Button>
        </div>
      </div>
    </Shell>
  );
}
