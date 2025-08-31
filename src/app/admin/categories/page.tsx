import { Shell } from "@/components/shell";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { CreateCategoryForm } from "@/features/categories/components/create-category-form";

export default function AdminCategoriesPage() {
  return (
    <Shell>
      <Card className="mx-auto w-xl">
        <CardHeader>
          <CardTitle>Create New Category</CardTitle>
          <CardDescription>
            Add a new product category to organize your products
          </CardDescription>
        </CardHeader>
        <CardContent>
          <CreateCategoryForm />
        </CardContent>
      </Card>
    </Shell>
  );
}
