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
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { getCategories } from "@/features/categories/queries/categories";
import { SubcategoryDialog } from "@/features/subcategories/components/subcategory-dialog";
import { SubcategoryForm } from "@/features/subcategories/components/subcategory-form";
import { getSubcategories } from "@/features/subcategories/queries/subcategories";

export default async function AdminSubcategoriesPage() {
  const [subcategories, categories] = await Promise.all([
    getSubcategories(),
    getCategories(),
  ]);

  return (
    <Shell>
      <div className="flex w-full flex-col gap-6">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link href={redirects.adminToDashboard}>Admin</Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>Subcategories</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        <div className="flex flex-col gap-6 md:flex-row">
          <Card className="flex-1">
            <CardHeader>
              <CardTitle className="font-bold text-2xl">
                Create New Subcategory
              </CardTitle>
              <CardDescription>
                Add a new product subcategory to organize your products
              </CardDescription>
            </CardHeader>
            <CardContent>
              <SubcategoryForm categories={categories} />
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="font-bold text-2xl">
                Subcategories List
              </CardTitle>
              <CardDescription>
                Manage your product subcategories{" "}
              </CardDescription>
            </div>
          </CardHeader>
          <CardContent>
            <Suspense fallback={<div>Loading...</div>}>
              <SubcategoryDialog
                categories={categories}
                subcategories={subcategories}
              />
            </Suspense>
          </CardContent>
        </Card>
      </div>
    </Shell>
  );
}
