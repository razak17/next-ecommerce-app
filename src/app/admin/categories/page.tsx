import { Shell } from "@/components/shell";
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
      <Card className="mx-auto w-full">
        <CardHeader>
          <CardTitle>Create New Category</CardTitle>
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
    </Shell>
  );
}
