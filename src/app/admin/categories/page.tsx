import Link from "next/link";

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
import { CategoryDialog } from "@/features/categories/components/category-dialog";
import { CategoryForm } from "@/features/categories/components/category-form";
import { getCategories } from "@/features/categories/queries/categories";

export default async function AdminCategoriesPage() {
  const categories = await getCategories();

  return (
    <Shell>
      <div className="container mx-auto flex flex-col gap-6 py-10">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link href={redirects.adminToDashboard}>Admin</Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>Categories</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        <Card>
          <CardHeader>
            <CardTitle className="font-bold text-4xl">
              Create New Category
            </CardTitle>
            <CardDescription>
              Add a new product category to organize your products
            </CardDescription>
          </CardHeader>
          <CardContent>
            <CategoryForm />
          </CardContent>
        </Card>
        <Card className="mx-auto w-full">
          <CardHeader>
            <CardTitle>Categories</CardTitle>
            <CardDescription>List of categories</CardDescription>
          </CardHeader>
          <CardContent>
            <CategoryDialog categories={categories} />
          </CardContent>
        </Card>
      </div>
    </Shell>
  );
}
