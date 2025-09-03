import { IconEdit } from "@tabler/icons-react";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

import { redirects } from "@/lib/constants";

import { PlaceholderImage } from "@/components/placeholder-image";
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
      <div className="container mx-auto py-10">
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
              <BreadcrumbPage>{product.name}</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="font-bold text-4xl">{product.name}</h1>
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

        <div className="grid gap-8 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Product Image</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="relative aspect-square overflow-hidden rounded-md">
                {product.images?.length ? (
                  <Image
                    src={
                      product.images[0].url ??
                      "/images/product-placeholder.webp"
                    }
                    alt={product.images[0].name}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, 50vw"
                  />
                ) : (
                  <PlaceholderImage className="rounded-none" asChild />
                )}
              </div>
            </CardContent>
          </Card>

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
                  <h3 className="font-medium">Price</h3>
                  <p className="font-bold text-2xl">${product.price}</p>
                </div>
                <div>
                  <h3 className="font-medium">Inventory</h3>
                  <Badge
                    variant={product.inventory > 0 ? "default" : "destructive"}
                  >
                    {product.inventory} in stock
                  </Badge>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Category Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h3 className="font-medium">Category</h3>
                  <Badge variant="secondary">
                    {product.category?.name || "No category"}
                  </Badge>
                </div>
                {product.subcategory && (
                  <div>
                    <h3 className="font-medium">Subcategory</h3>
                    <Badge variant="outline">{product.subcategory.name}</Badge>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Additional Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h3 className="font-medium">Rating</h3>
                  <p className="text-muted-foreground">{product.rating}/5</p>
                </div>
                <div>
                  <h3 className="font-medium">Created</h3>
                  <p className="text-muted-foreground">
                    {product.createdAt.toLocaleDateString()}
                  </p>
                </div>
                {product.updatedAt && (
                  <div>
                    <h3 className="font-medium">Last Updated</h3>
                    <p className="text-muted-foreground">
                      {product.updatedAt.toLocaleDateString()}
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </Shell>
  );
}
