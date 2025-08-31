import { Shell } from "@/components/shell";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  getCategories,
  getSubcategories,
} from "@/features/categories/queries/categories";
import { CreateProductForm } from "@/features/products/components/create-product-form";

export default function AdminProductsPage() {
  const promises = Promise.all([getCategories(), getSubcategories()]).then(
    ([categories, subcategories]) => ({ categories, subcategories }),
  );

  return (
    <Shell>
      <Card className="mx-auto w-xl">
        <CardHeader>
          <CardTitle>Create New Product</CardTitle>
          <CardDescription>Add a new product to your inventory</CardDescription>
        </CardHeader>
        <CardContent>
          <CreateProductForm promises={promises} />
        </CardContent>
      </Card>
    </Shell>
  );
}
