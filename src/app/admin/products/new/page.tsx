import { Shell } from "@/components/shell";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { getAllCategories } from "@/features/categories/queries/categories";
import { ProductForm } from "@/features/products/components/product-form";
import { getAllSubcategories } from "@/features/subcategories/queries/subcategories";

export default function AdminProductsPage() {
  const promises = Promise.all([
    getAllCategories(),
    getAllSubcategories(),
  ]).then(([categories, subcategories]) => ({ categories, subcategories }));

  return (
    <Shell>
      <div className="w-full">
        <Card>
          <CardHeader>
            <CardTitle className="font-bold text-2xl">
              Create New Product
            </CardTitle>
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
