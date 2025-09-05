import { notFound } from "next/navigation";

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
import { getProductWithVariants } from "@/features/products/queries/products";
import { getAllSubcategories } from "@/features/subcategories/queries/subcategories";

interface EditProductPageProps {
  params: Promise<{
    productId: string;
  }>;
}

export default async function EditProductPage({
  params,
}: EditProductPageProps) {
  const { productId } = await params;

  const product = await getProductWithVariants(productId);

  if (!product) {
    notFound();
  }

  const promises = Promise.all([
    getAllCategories(),
    getAllSubcategories(),
  ]).then(([categories, subcategories]) => ({ categories, subcategories }));

  return (
    <Shell className="flex flex-col">
      <div className="w-full">
        <Card>
          <CardHeader>
            <CardTitle className="font-bold text-2xl">Edit Product</CardTitle>
            <CardDescription>Update your product information</CardDescription>
          </CardHeader>
          <CardContent>
            <ProductForm product={product} promises={promises} />
          </CardContent>
        </Card>
      </div>
    </Shell>
  );
}
