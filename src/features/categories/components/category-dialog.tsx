"use client";

import { useState } from "react";

import { CategoryForm } from "./category-form";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import type { Category } from "@/db/schema";

interface CategoryDialogProps {
  trigger?: React.ReactNode;
  categories?: Category[];
}

export function CategoryDialog({ trigger, categories }: CategoryDialogProps) {
  const [category, setCategory] = useState<Category | undefined>();
  const [open, setOpen] = useState(false);

  const handleSuccess = () => setOpen(false);

  return (
    <div className="space-x-4">
      {categories?.map((category) => (
        <Button
          className="rounded-md border-none px-4 py-2 outline-none hover:bg-primary hover:text-background hover:dark:text-foreground"
          variant="outline"
          key={category.id}
          onClick={() => {
            setCategory(category);
            setOpen(true);
          }}
        >
          {category.name}
        </Button>
      ))}

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>{trigger}</DialogTrigger>
        <DialogContent className="max-h-[92vh] overflow-y-auto sm:max-w-md">
          <DialogHeader className="mb-4">
            <DialogTitle className="text-xl">
              {category ? "Update" : "Add New"} Category
            </DialogTitle>
            <DialogDescription>
              Fill in the details below to{" "}
              {category ? "update" : "create a new"} category.
            </DialogDescription>
          </DialogHeader>
          <CategoryForm category={category} onSuccess={handleSuccess} />
        </DialogContent>
      </Dialog>
    </div>
  );
}
