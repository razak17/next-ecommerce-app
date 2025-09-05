"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import { tryCatch } from "@/lib/utils";

import { Icons } from "@/components/icons";
import { Button } from "@/components/ui/button";
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
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import type { Subcategory } from "@/db/schema";
import type { getAllCategories } from "@/features/categories/queries/categories";
import {
  addSubcategory,
  deleteSubcategory,
  updateSubcategory,
} from "../actions/subcategories";
import {
  type CreateSubcategorySchema,
  createSubcategorySchema,
} from "../validations/subcategories";

interface SubcategoryFormProps {
  subcategory?: Subcategory & { categoryName?: string | null };
  categories: Awaited<ReturnType<typeof getAllCategories>>;
  onSuccess?: () => void;
}

export function SubcategoryForm({
  subcategory,
  categories,
  onSuccess,
}: SubcategoryFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const form = useForm<CreateSubcategorySchema>({
    resolver: zodResolver(createSubcategorySchema),
    defaultValues: {
      name: subcategory?.name ?? "",
      slug: subcategory?.slug ?? "",
      description: subcategory?.description ?? "",
      categoryId: subcategory?.categoryId ?? "",
    },
  });

  async function onDelete(id: string) {
    setIsDeleting(true);
    const [data] = await tryCatch(deleteSubcategory(id));
    if (data?.error) {
      toast.error(data.error);
      setIsDeleting(false);
      return;
    }
    toast.success("Subcategory deleted successfully");
    if (onSuccess) {
      onSuccess();
    }
    setIsDeleting(false);
  }

  async function onSubmit(input: CreateSubcategorySchema) {
    setIsLoading(true);
    const action = subcategory
      ? updateSubcategory.bind(null, subcategory.id)
      : addSubcategory;
    const [data] = await tryCatch(action({ ...input }));
    if (data?.error) {
      toast.error(data.error);
      setIsLoading(false);
      return;
    }
    toast.success(
      `Subcategory ${subcategory ? "updated" : "added"} successfully`,
    );
    form.reset();
    if (onSuccess) {
      onSuccess();
    }
    setIsLoading(false);
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="categoryId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Category *</FormLabel>
              <Select value={field.value} onValueChange={field.onChange}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category.id} value={category.id}>
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Subcategory Name *</FormLabel>
                <FormControl>
                  <Input placeholder="Enter subcategory name" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="slug"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Slug *</FormLabel>
                <FormControl>
                  <Input placeholder="subcategory-slug" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Enter subcategory description"
                  className="min-h-[100px]"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex gap-2">
          <Button type="submit" className="w-fit" disabled={isLoading}>
            {isLoading && (
              <Icons.spinner className="mr-2 size-4 animate-spin" />
            )}
            {subcategory ? "Update Subcategory" : "Add Subcategory"}
          </Button>

          {subcategory && (
            <Button
              variant="destructive"
              type="button"
              className="w-fit"
              disabled={isLoading || isDeleting}
              onClick={onDelete.bind(null, subcategory.id)}
            >
              {isDeleting && (
                <Icons.spinner className="mr-2 size-4 animate-spin" />
              )}
              Delete Subcategory
            </Button>
          )}
        </div>
      </form>
    </Form>
  );
}
