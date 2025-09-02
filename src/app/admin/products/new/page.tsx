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
import { ProductForm } from "@/features/products/components/product-form";

export default function AdminProductsPage() {
  const promises = Promise.all([getCategories(), getSubcategories()]).then(
    ([categories, subcategories]) => ({ categories, subcategories }),
  );

  return (
    <Shell>
      <div className="container mx-auto py-10">
        <Card>
          <CardHeader>
            <CardTitle>Create New Product</CardTitle>
            <CardDescription>
              Add a new product to your inventory
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ProductForm promises={promises} />
          </CardContent>
        </Card>
      </div>
    </Shell>
  );
}
