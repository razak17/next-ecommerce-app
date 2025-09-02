"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import Image from "next/image";
import { useRouter } from "next/navigation";
import * as React from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import { redirects } from "@/lib/constants";
import { tryCatch } from "@/lib/utils";

import { FileUploader } from "@/components/file-uploader";
import { Icons } from "@/components/icons";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import type { Product } from "@/db/schema";
import type {
  getCategories,
  getSubcategories,
} from "@/features/categories/queries/categories";
import { useUploadFile } from "@/hooks/use-file-upload";
import type { StoredFile } from "@/types";
import { addProduct, updateProduct } from "../actions/products";
import {
  type CreateProductSchema,
  createProductSchema,
} from "../validations/products";

interface CreateProductFormProps {
  product?: Product;
  promises: Promise<{
    categories: Awaited<ReturnType<typeof getCategories>>;
    subcategories: Awaited<ReturnType<typeof getSubcategories>>;
  }>;
}

export function ProductForm({ product, promises }: CreateProductFormProps) {
  const { categories, subcategories } = React.use(promises);
  const router = useRouter();

  const [isLoading, setIsLoading] = React.useState(false);
  const { uploadFiles, progresses, isUploading } =
    useUploadFile("imageUploader");

  const [existingImages, setExistingImages] = React.useState<StoredFile[]>(
    product?.images ?? [],
  );

  const form = useForm<CreateProductSchema>({
    resolver: zodResolver(createProductSchema),
    defaultValues: {
      name: product?.name ?? "",
      description: product?.description ?? "",
      price: product?.price ?? "",
      inventory: product?.inventory ?? NaN,
      categoryId: product?.categoryId ?? "",
      subcategoryId: product?.subcategoryId ?? "",
    },
  });

  async function onSubmit(input: CreateProductSchema) {
    setIsLoading(true);

    const newlyUploaded = input.images?.length
      ? await uploadFiles(input.images)
      : [];

    const allImages = [...existingImages, ...(newlyUploaded ?? [])];

    const action = product ? updateProduct.bind(null, product.id) : addProduct;
    const [data] = await tryCatch(
      action({
        ...input,
        images: allImages,
      }),
    );
    if (data?.error) {
      toast.error(data.error);
      setIsLoading(false);
      return;
    }
    toast.success(`Product ${product ? "updated" : "added"} successfully`);
    form.reset();
    router.push(redirects.adminToProducts);
    setIsLoading(false);
  }

  return (
    <Form {...form}>
      <form
        className="grid w-full gap-5"
        onSubmit={form.handleSubmit(onSubmit)}
      >
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name *</FormLabel>
              <FormControl>
                <Input placeholder="Type product name here." {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Type product description here."
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex flex-col items-start gap-6 sm:flex-row">
          <FormField
            control={form.control}
            name="categoryId"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel>Category *</FormLabel>
                <Select
                  value={field.value}
                  onValueChange={(value: typeof field.value) =>
                    field.onChange(value)
                  }
                >
                  <FormControl>
                    <SelectTrigger className="capitalize">
                      <SelectValue placeholder={field.value} />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectGroup>
                      {categories.map((option) => (
                        <SelectItem
                          key={option.id}
                          value={option.id}
                          className="capitalize"
                        >
                          {option.name}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="subcategoryId"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel>Subcategory</FormLabel>
                <Select
                  value={field.value?.toString()}
                  onValueChange={field.onChange}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a subcategory" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectGroup>
                      {subcategories.map((option) => (
                        <SelectItem key={option.id} value={option.id}>
                          {option.name}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <div className="flex flex-col items-start gap-6 sm:flex-row">
          <FormField
            control={form.control}
            name="price"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel>Price *</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Type product price here."
                    value={field.value}
                    onChange={field.onChange}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="inventory"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel>Inventory *</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    inputMode="numeric"
                    placeholder="Type product inventory here."
                    value={Number.isNaN(field.value) ? "" : field.value}
                    onChange={(e) => field.onChange(e.target.valueAsNumber)}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <div className="space-y-6">
          {existingImages.length > 0 && (
            <div>
              <h4 className="mb-2 font-medium text-sm">Current Images</h4>
              <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
                {existingImages.map((file, index) => (
                  <div key={file.id} className="group relative aspect-square">
                    <Image
                      src={file.url}
                      alt={file.name}
                      fill
                      sizes="200px"
                      className="rounded-md object-cover"
                    />
                    <Button
                      type="button"
                      variant="destructive"
                      size="sm"
                      className="absolute top-1 right-1 opacity-0 transition-opacity group-hover:opacity-100"
                      onClick={() => {
                        setExistingImages((prev) =>
                          prev.filter((_, i) => i !== index),
                        );
                      }}
                    >
                      ×
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          )}

          <FormField
            control={form.control}
            name="images"
            render={({ field }) => (
              <div className="space-y-6">
                <FormItem className="w-full">
                  <FormLabel>Upload New Images</FormLabel>
                  <FormControl>
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button variant="outline">Upload files</Button>
                      </DialogTrigger>
                      <DialogContent className="sm:max-w-xl">
                        <DialogHeader>
                          <DialogTitle>Upload files</DialogTitle>
                          <DialogDescription>
                            Drag and drop your files here or click to browse.
                          </DialogDescription>
                        </DialogHeader>
                        <FileUploader
                          value={field.value ?? []}
                          onValueChange={field.onChange}
                          maxFiles={4}
                          maxSize={4 * 1024 * 1024}
                          progresses={progresses}
                          disabled={isUploading}
                        />
                      </DialogContent>
                    </Dialog>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              </div>
            )}
          />
        </div>
        <Button
          onClick={() =>
            void form.trigger(["name", "description", "price", "inventory"])
          }
          className="w-fit"
          disabled={isLoading}
        >
          {isLoading && (
            <Icons.spinner
              className="mr-2 size-4 animate-spin"
              aria-hidden="true"
            />
          )}
          {product ? "Update Product" : "Add Product"}
          <span className="sr-only">Add Product</span>
        </Button>
      </form>
    </Form>
  );
}
