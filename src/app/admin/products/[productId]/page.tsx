import { IconEdit } from "@tabler/icons-react";
import Link from "next/link";
import { notFound } from "next/navigation";

import { redirects } from "@/lib/constants";
import { formatPrice } from "@/lib/utils";

import { ProductImageCarousel } from "@/components/product-image-carousel";
import { Rating } from "@/components/rating";
import { Shell } from "@/components/shell";
import { Badge } from "@/components/ui/badge";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { getProduct } from "@/features/products/queries/products";

interface ProductPageProps {
  params: Promise<{
    productId: string;
  }>;
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { productId } = await params;

  const product = await getProduct(productId);

  if (!product) {
    notFound();
  }

  return (
    <Shell className="flex flex-col">
      <div className="w-full">
        <Breadcrumb className="mb-6">
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link href={redirects.adminToDashboard}>Admin</Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link href={redirects.adminToProducts}>Products</Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage className="max-w-[100px] truncate">
                {product.name}
              </BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

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
              <div className="flex max-w-lg flex-col gap-2">
                <Tooltip>
                  <TooltipTrigger>
                    <h1 className="truncate font-bold text-4xl">
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
            </div>
          </div>
        </div>
      </div>
    </Shell>
  );
}
