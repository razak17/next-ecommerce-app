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

export default function ShopPage() {
  return (
    <Shell className="flex h-dvh flex-col">
      <div className="container mx-auto py-6">
        <Breadcrumb className="mb-6">
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link href={redirects.toLanding}>Home</Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>Shop</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </div>

      <section className="flex flex-1 flex-col items-center justify-center font-mono">
        <h1 className="font-bold text-4xl">Shop</h1>
      </section>
    </Shell>
  );
}
