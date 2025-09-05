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
import { getAllCategories } from "@/features/categories/queries/categories";

export default async function AdminCategoriesPage() {
  const categories = await getAllCategories();

  return (
    <Shell>
      <div className="flex w-full flex-col gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="font-bold text-2xl">
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
            <CardTitle className="font-bold text-2xl">
              Categories List
            </CardTitle>
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
