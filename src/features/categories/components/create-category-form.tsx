"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import { getErrorMessage } from "@/lib/handle-error";

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
import { Textarea } from "@/components/ui/textarea";
import { useUploadFile } from "@/hooks/use-file-upload";
import { addCategory } from "../actions/categories";
import {
  type CreateCategorySchema,
  createCategorySchema,
} from "../validations/categories";

export function CreateCategoryForm() {
  const [isLoading, setIsLoading] = useState(false);
  const { uploadFiles, progresses, uploadedFiles, isUploading } = useUploadFile(
    "imageUploader",
    { defaultUploadedFiles: [] },
  );

  const form = useForm<CreateCategorySchema>({
    resolver: zodResolver(createCategorySchema),
    defaultValues: {
      name: "",
      slug: "",
      description: "",
      image: null,
    },
  });

  async function onSubmit(input: CreateCategorySchema) {
    setIsLoading(true);

    toast.promise(
      uploadFiles(input.image ?? []).then((uploaded) => {
        return addCategory({
          ...input,
          image: uploaded ? uploaded[0] : null,
        });
      }),
      {
        loading: "Creating category...",
        success: () => {
          form.reset();
          setIsLoading(false);
          return "Category added successfully!";
        },
        error: (err) => {
          setIsLoading(false);
          return getErrorMessage(err);
        },
      },
    );
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Category Name</FormLabel>
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
              <FormLabel>Slug</FormLabel>
              <FormControl>
                <Input placeholder="category-slug" {...field} />
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
              <FormLabel>Description (Optional)</FormLabel>
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

        <FormField
          control={form.control}
          name="image"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Image URL (Optional)</FormLabel>
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
                      maxFiles={1}
                      maxSize={4 * 1024 * 1024}
                      progresses={progresses}
                      disabled={isUploading}
                    />
                  </DialogContent>
                </Dialog>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" className="w-fit" disabled={isLoading}>
          {isLoading && <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />}
          Add Category
        </Button>
      </form>
    </Form>
  );
}
