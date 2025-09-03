import Link from "next/link";

import { redirects } from "@/lib/constants";

import { Shell } from "@/components/shell";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
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
              <BreadcrumbPage>New Product</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        <Card>
          <CardHeader>
            <CardTitle className="font-bold text-4xl">
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
