import { IconEdit } from "@tabler/icons-react";
import Link from "next/link";
import { notFound } from "next/navigation";

import { redirects } from "@/lib/constants";
import { formatPrice } from "@/lib/utils";

import { ProductImageCarousel } from "@/components/product-image-carousel";
import { Rating } from "@/components/rating";
import { Shell } from "@/components/shell";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { getProductWithVariants } from "@/features/products/queries/products";

interface ProductPageProps {
  params: Promise<{
    productId: string;
  }>;
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { productId } = await params;

  const product = await getProductWithVariants(productId);

  if (!product) {
    notFound();
  }

  return (
    <Shell className="flex flex-col">
      <div className="w-full">
        <div className="flex flex-col gap-8 md:flex-row md:gap-16">
          <ProductImageCarousel
            className="w-full md:w-1/2"
            images={product.images ?? []}
            options={{
              loop: true,
            }}
          />
          <Separator className="mt-4 md:hidden" />
          <div className="flex w-full flex-col gap-4 md:w-1/2">
            <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between xl:gap-2">
              <div className="flex max-w-sm flex-col gap-2">
                <Tooltip>
                  <TooltipTrigger>
                    <h1 className="truncate font-bold text-2xl">
                      {product.name}
                    </h1>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>{product.name}</p>
                  </TooltipContent>
                </Tooltip>
                <p className="text-muted-foreground">
                  Product details and information
                </p>
              </div>
              <Button asChild>
                <Link
                  href={`${redirects.adminToProducts}/${product.id}/edit`}
                  className="flex items-center gap-2"
                >
                  <IconEdit className="size-4" />
                  Edit Product
                </Link>
              </Button>
            </div>

            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Basic Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h3 className="font-medium">Name</h3>
                    <p className="text-muted-foreground">{product.name}</p>
                  </div>
                  {product.description && (
                    <div>
                      <h3 className="font-medium">Description</h3>
                      <p className="text-muted-foreground">
                        {product.description}
                      </p>
                    </div>
                  )}
                  <div>
                    <h3 className="font-medium">Rating</h3>
                    <p className="text-muted-foreground">{product.rating}/5</p>
                    <Rating rating={Math.round(product.rating / 5)} />
                  </div>
                  <div>
                    <h3 className="font-medium">Price</h3>
                    <p className="font-bold text-2xl">
                      {formatPrice(product.price)}
                    </p>
                  </div>
                  <div>
                    <h3 className="font-medium">Inventory</h3>
                    <Badge
                      variant={
                        product.inventory > 0 ? "default" : "destructive"
                      }
                    >
                      {product.inventory} in stock
                    </Badge>
                  </div>
                  <div>
                    <h3 className="font-medium">Category</h3>
                    <Badge variant="secondary">
                      {product.category?.name || "No category"}
                    </Badge>
                  </div>
                  {product.subcategory && (
                    <div>
                      <h3 className="font-medium">Subcategory</h3>
                      <Badge variant="outline">
                        {product.subcategory.name}
                      </Badge>
                    </div>
                  )}
                </CardContent>
              </Card>

              {product.variants && product.variants.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle>Product Variants</CardTitle>
                    <Badge variant="outline" className="text-xs">
                      {product.variants.length} type(s)
                    </Badge>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {product.variants.map((productVariant) => (
                      <div key={productVariant.id} className="space-y-4">
                        <div className="flex items-center gap-2">
                          <h4 className="font-medium text-lg">
                            {productVariant.variant.name}
                          </h4>
                          <Badge variant="outline">
                            {productVariant.productVariantValues.length} options
                          </Badge>
                        </div>
                        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                          {productVariant.productVariantValues.map(
                            (variantValue, index) => (
                              <div
                                key={`${productVariant.id}-${index}`}
                                className="space-y-2 rounded-lg border p-4"
                              >
                                <div>
                                  <h5 className="font-medium">
                                    {variantValue.value}
                                  </h5>
                                  <p className="text-muted-foreground text-sm">
                                    {formatPrice(variantValue.price)}
                                  </p>
                                </div>
                                <div className="flex items-center gap-2">
                                  <Badge
                                    variant={
                                      variantValue.stock.quantity > 0
                                        ? "default"
                                        : "destructive"
                                    }
                                    className="text-xs"
                                  >
                                    {variantValue.stock.quantity} in stock
                                  </Badge>
                                </div>
                              </div>
                            ),
                          )}
                        </div>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </div>
      </div>
    </Shell>
  );
}
