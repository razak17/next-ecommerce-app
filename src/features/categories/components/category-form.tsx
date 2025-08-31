"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import { getErrorMessage } from "@/lib/handle-error";

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
import { Textarea } from "@/components/ui/textarea";
import type { Category } from "@/db/schema";
import {
  addCategory,
  deleteCategory,
  updateCategory,
} from "../actions/categories";
import {
  type CreateCategorySchema,
  createCategorySchema,
} from "../validations/categories";

interface CategoryFormProps {
  category?: Category;
  onSuccess?: () => void;
}

export function CategoryForm({ category, onSuccess }: CategoryFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const form = useForm<CreateCategorySchema>({
    resolver: zodResolver(createCategorySchema),
    defaultValues: {
      name: category?.name ?? "",
      slug: category?.slug ?? "",
      description: category?.description ?? "",
    },
  });

  async function onDelete(id: string) {
    setIsDeleting(true);
    try {
      const response = await deleteCategory(id);
      if (response.error) {
        toast.error("Failed to delete category");
        return;
      }
      toast.success(`Category deleted successfully`);
      form.reset();
      if (onSuccess) {
        onSuccess();
      }
    } catch (error) {
      console.error("Error delete category:", error);
      toast.error(getErrorMessage(error));
    } finally {
      setIsDeleting(false);
    }
  }

  async function onSubmit(input: CreateCategorySchema) {
    setIsLoading(true);
    const action = category
      ? updateCategory.bind(null, category.id)
      : addCategory;
    try {
      const response = await action({
        ...input,
      });
      if (response.error) {
        toast.error(response.error);
        return;
      }
      toast.success(`Category ${category ? "updated" : "added"} successfully`);
      form.reset();
      if (onSuccess) {
        onSuccess();
      }
    } catch (error) {
      console.error("Category error", error);
      toast.error(getErrorMessage(error));
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Category Name *</FormLabel>
                <FormControl>
                  <Input placeholder="Enter category name" {...field} />
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
                  <Input placeholder="category-slug" {...field} />
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
                  placeholder="Enter category description"
                  className="min-h-[100px]"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" className="w-fit" disabled={isLoading}>
          {isLoading && <Icons.spinner className="size-4 animate-spin" />}
          {category ? "Update Category" : "Add Category"}
        </Button>
        {category && (
          <Button
            variant="destructive"
            type="button"
            className="ml-2 w-fit"
            disabled={isLoading || isDeleting}
            onClick={onDelete.bind(null, category.id)}
          >
            {isDeleting && (
              <Icons.spinner className="mr-2 size-4 animate-spin" />
            )}
            Delete Category
          </Button>
        )}
      </form>
    </Form>
  );
}
