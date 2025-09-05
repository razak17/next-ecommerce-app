"use client";

import { IconEdit, IconEye, IconTrash } from "@tabler/icons-react";
import Image from "next/image";
import Link from "next/link";

import { redirects } from "@/lib/constants";

import { ConfirmDialog } from "@/components/confirm-dialog";
import { PlaceholderImage } from "@/components/placeholder-image";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { StoredFile } from "@/types";
import { deleteProduct } from "../actions/products";

interface Product {
  id: string;
  name: string;
  description: string | null;
  images: StoredFile[] | null;
  category: string | null;
  subcategory: string | null;
  price: string;
  inventory: number;
  rating: number;
  createdAt: Date;
  updatedAt: Date | null;
}

interface ProductsTableProps {
  products: Product[];
}

export function ProductsTable({ products }: ProductsTableProps) {
  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Image</TableHead>
            <TableHead>Name</TableHead>
            <TableHead>Category</TableHead>
            <TableHead>Price</TableHead>
            <TableHead>Inventory</TableHead>
            <TableHead>Rating</TableHead>
            <TableHead>Created</TableHead>
            <TableHead className="w-[120px]">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {products.map((product) => (
            <TableRow key={product.id}>
              <TableCell>
                <div className="relative size-16 overflow-hidden rounded-md">
                  {product.images?.length ? (
                    <Image
                      src={
                        product.images[0].url ??
                        "/images/product-placeholder.webp"
                      }
                      alt={product.images[0].name}
                      fill
                      className="object-cover"
                      sizes="(max-width: 64px) 100vw, 64px"
                    />
                  ) : (
                    <PlaceholderImage className="rounded-none" asChild />
                  )}
                </div>
              </TableCell>
              <TableCell className="font-medium">
                <div className="max-w-[200px] truncate">{product.name}</div>
                {product.description && (
                  <div className="max-w-[200px] truncate text-muted-foreground text-sm">
                    {product.description}
                  </div>
                )}
              </TableCell>
              <TableCell>
                <div className="space-y-1">
                  {product.category && (
                    <Badge variant="secondary">{product.category}</Badge>
                  )}
                  {product.subcategory && (
                    <Badge variant="outline" className="block w-fit">
                      {product.subcategory}
                    </Badge>
                  )}
                </div>
              </TableCell>
              <TableCell>${product.price}</TableCell>
              <TableCell>
                <Badge
                  variant={product.inventory > 0 ? "default" : "destructive"}
                >
                  {product.inventory} in stock
                </Badge>
              </TableCell>
              <TableCell>
                <div className="flex items-center">
                  <span className="text-sm">{product.rating}/5</span>
                </div>
              </TableCell>
              <TableCell>
                {product.createdAt
                  ? new Date(product.createdAt).toLocaleDateString()
                  : "N/A"}
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-2">
                  <Button variant="ghost" size="sm" asChild>
                    <Link href={`${redirects.adminToProducts}/${product.id}`}>
                      <IconEye className="size-4" />
                      <span className="sr-only">View product</span>
                    </Link>
                  </Button>
                  <Button variant="ghost" size="sm" asChild>
                    <Link
                      href={`${redirects.adminToProducts}/${product.id}/edit`}
                    >
                      <IconEdit className="size-4" />
                      <span className="sr-only">Edit product</span>
                    </Link>
                  </Button>
                  <ConfirmDialog
                    title="Delete Product"
                    description={`Are you sure you want to delete "${product.name}"? This action cannot be undone.`}
                    successMessage="Product deleted successfully"
                    onConfirm={deleteProduct.bind(null, product.id)}
                  >
                    <Button variant="ghost" size="sm">
                      <IconTrash className="size-4" />
                      <span className="sr-only">Delete product</span>
                    </Button>
                  </ConfirmDialog>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
