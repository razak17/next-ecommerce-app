"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import Image from "next/image";
import { useRouter } from "next/navigation";
import * as React from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

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
import type { getAllCategories } from "@/features/categories/queries/categories";
import type { getAllSubcategories } from "@/features/subcategories/queries/subcategories";
import { useUploadFile } from "@/hooks/use-file-upload";
import type { StoredFile } from "@/types";
import { addProduct, updateProduct } from "../actions/products";
import type { getProductWithVariants } from "../queries/products";
import {
  type CreateProductSchema,
  createProductSchema,
} from "../validations/products";

interface CreateProductFormProps {
  product?: Product | Awaited<ReturnType<typeof getProductWithVariants>>;
  promises: Promise<{
    categories: Awaited<ReturnType<typeof getAllCategories>>;
    subcategories: Awaited<ReturnType<typeof getAllSubcategories>>;
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

  // Transform variant data for form
  const transformVariantsForForm = React.useCallback(() => {
    if (!product || !("variants" in product) || !product.variants) {
      return [];
    }

    // Group variants by variant name
    const variantGroups = new Map<
      string,
      Array<{
        value: string;
        price: string;
        inventory: number;
      }>
    >();

    for (const productVariant of product.variants) {
      const variantName = productVariant.variant.name;
      if (!variantGroups.has(variantName)) {
        variantGroups.set(variantName, []);
      }

      // Get stock info for each variant value
      const variantValues = productVariant.productVariantValues.map((pv) => {
        return {
          value: pv.value,
          price: pv.price.toString(),
          inventory: pv.stock?.quantity ?? 0,
        };
      });

      const existingGroup = variantGroups.get(variantName);
      if (existingGroup) {
        existingGroup.push(...variantValues);
      }
    }

    // Convert to form format
    return Array.from(variantGroups.entries()).map(([name, values]) => ({
      name,
      values,
    }));
  }, [product]);

  const form = useForm<CreateProductSchema>({
    resolver: zodResolver(createProductSchema),
    defaultValues: {
      name: product?.name ?? "",
      description: product?.description ?? "",
      price: product?.price ?? "",
      inventory: product?.inventory ?? NaN,
      categoryId: product?.categoryId ?? "",
      subcategoryId: product?.subcategoryId ?? "",
      variants: transformVariantsForForm(),
    },
  });

  const selectedCategoryId = form.watch("categoryId");

  const filteredSubcategories = React.useMemo(() => {
    if (!selectedCategoryId) return [];
    return subcategories.filter(
      (subcategory) => subcategory.categoryId === selectedCategoryId,
    );
  }, [selectedCategoryId, subcategories]);

  React.useEffect(() => {
    const currentSubcategoryId = form.getValues("subcategoryId");
    if (currentSubcategoryId && selectedCategoryId) {
      const isSubcategoryValid = filteredSubcategories.some(
        (sub) => sub.id === currentSubcategoryId,
      );
      if (!isSubcategoryValid) {
        form.setValue("subcategoryId", "");
      }
    }
  }, [selectedCategoryId, filteredSubcategories, form]);

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
    router.push("/admin/products");
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
                  disabled={
                    !selectedCategoryId || filteredSubcategories.length === 0
                  }
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue
                        placeholder={
                          !selectedCategoryId
                            ? "Select a category first"
                            : filteredSubcategories.length === 0
                              ? "No subcategories available"
                              : "Select a subcategory"
                        }
                      />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectGroup>
                      {filteredSubcategories.map((option) => (
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

        {/* Variants Section */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-medium text-lg">Product Variants</h3>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => {
                const currentVariants = form.getValues("variants") || [];
                form.setValue("variants", [
                  ...currentVariants,
                  {
                    name: "",
                    values: [{ value: "", price: "", inventory: 0 }],
                  },
                ]);
              }}
            >
              Add Variant
            </Button>
          </div>

          <FormField
            control={form.control}
            name="variants"
            render={() => (
              <div className="space-y-6">
                {form.watch("variants")?.map((variant, variantIndex) => (
                  <div
                    key={variantIndex}
                    className="space-y-4 rounded-lg border p-4"
                  >
                    <div className="flex justify-between">
                      <FormField
                        control={form.control}
                        name={`variants.${variantIndex}.name`}
                        render={({ field }) => (
                          <FormItem className="mr-4 flex-1">
                            <FormLabel>
                              Variant Name (e.g., Size, Color)
                            </FormLabel>
                            <FormControl>
                              <Input
                                placeholder="Enter variant name"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <div className="flex flex-col justify-end">
                        <Button
                          type="button"
                          variant="destructive"
                          size="sm"
                          className="h-9"
                          onClick={() => {
                            const currentVariants =
                              form.getValues("variants") || [];
                            form.setValue(
                              "variants",
                              currentVariants.filter(
                                (_, index) => index !== variantIndex,
                              ),
                            );
                          }}
                        >
                          Remove Variant
                        </Button>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <FormLabel>Variant Values</FormLabel>
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            const currentVariants =
                              form.getValues("variants") || [];
                            const updatedVariants = [...currentVariants];
                            updatedVariants[variantIndex].values.push({
                              value: "",
                              price: "",
                              inventory: 0,
                            });
                            form.setValue("variants", updatedVariants);
                          }}
                        >
                          Add Value
                        </Button>
                      </div>

                      {variant.values.map((_, valueIndex) => (
                        <div
                          key={valueIndex}
                          className="grid grid-cols-4 items-end gap-4"
                        >
                          <FormField
                            control={form.control}
                            name={`variants.${variantIndex}.values.${valueIndex}.value`}
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Value</FormLabel>
                                <FormControl>
                                  <Input
                                    placeholder="e.g., Small, Red"
                                    {...field}
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={form.control}
                            name={`variants.${variantIndex}.values.${valueIndex}.price`}
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Price</FormLabel>
                                <FormControl>
                                  <Input placeholder="0.00" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={form.control}
                            name={`variants.${variantIndex}.values.${valueIndex}.inventory`}
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Inventory</FormLabel>
                                <FormControl>
                                  <Input
                                    type="number"
                                    placeholder="0"
                                    value={
                                      Number.isNaN(field.value)
                                        ? ""
                                        : field.value
                                    }
                                    onChange={(e) =>
                                      field.onChange(e.target.valueAsNumber)
                                    }
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <Button
                            type="button"
                            variant="destructive"
                            className="h-9"
                            size="sm"
                            onClick={() => {
                              const currentVariants =
                                form.getValues("variants") || [];
                              const updatedVariants = [...currentVariants];
                              updatedVariants[variantIndex].values =
                                updatedVariants[variantIndex].values.filter(
                                  (_, index) => index !== valueIndex,
                                );
                              form.setValue("variants", updatedVariants);
                            }}
                          >
                            Remove
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          />
        </div>
        <Button
          onClick={() =>
            void form.trigger([
              "name",
              "description",
              "price",
              "inventory",
              "variants",
            ])
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
        </Button>
      </form>
    </Form>
  );
}
