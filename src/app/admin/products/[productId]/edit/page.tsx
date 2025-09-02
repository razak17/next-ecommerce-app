import { notFound } from "next/navigation";

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
import { getProduct } from "@/features/products/queries/products";

interface EditProductPageProps {
  params: Promise<{
    productId: string;
  }>;
}

export default async function EditProductPage({
  params,
}: EditProductPageProps) {
  const { productId } = await params;

  const product = await getProduct(productId);

  if (!product) {
    notFound();
  }

  const promises = Promise.all([getCategories(), getSubcategories()]).then(
    ([categories, subcategories]) => ({ categories, subcategories }),
  );

  return (
    <Shell className="flex flex-col">
      <div className="container mx-auto py-10">
        <Card>
          <CardHeader>
            <CardTitle className="font-bold text-4xl">Edit Product</CardTitle>
            <CardDescription className="text-muted-foreground">
              Update your product information
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ProductForm product={product} promises={promises} />
          </CardContent>
        </Card>
      </div>
    </Shell>
  );
}
