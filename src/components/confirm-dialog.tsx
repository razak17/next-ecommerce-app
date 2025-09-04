"use client";

import { type ReactNode, useTransition } from "react";
import { toast } from "sonner";

import { cn } from "@/lib/utils";

import { Icons } from "./icons";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

interface ConfirmDialogProps {
  title?: string;
  description?: string;
  successMessage?: string;
  children: React.ReactNode;
  onConfirm: () => Promise<{ success: boolean; error: string | null }>;
  onSuccess?: () => void;
}

export const ConfirmDialog = ({
  title = "Delete Item",
  description = "Are you sure you want to delete item? This action cannot be undone.",
  successMessage = "Item deleted successfully",
  children,
  onConfirm,
  onSuccess,
}: ConfirmDialogProps) => {
  const [isLoading, startTransition] = useTransition();

  function performAction() {
    startTransition(async () => {
      const data = await onConfirm();
      if (data.error) {
        toast.error(data.error);
      } else {
        toast.success(successMessage);
        if (onSuccess) {
          onSuccess();
        }
      }
    });
  }

  return (
    <AlertDialog open={isLoading ? true : undefined}>
      <AlertDialogTrigger asChild>{children}</AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{title}</AlertDialogTitle>
          <AlertDialogDescription>{description}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            disabled={isLoading}
            onClick={performAction}
          >
            <LoadingTextSwap isLoading={isLoading}>Delete</LoadingTextSwap>
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

function LoadingTextSwap({
  isLoading,
  children,
}: {
  isLoading: boolean;
  children: ReactNode;
}) {
  return (
    <div className="grid items-center justify-items-center">
      <div
        className={cn(
          "col-start-1 col-end-2 row-start-1 row-end-2",
          isLoading ? "invisible" : "visible",
        )}
      >
        {children}
      </div>
      <div
        className={cn(
          "col-start-1 col-end-2 row-start-1 row-end-2 text-center",
          isLoading ? "visible" : "invisible",
        )}
      >
        <Icons.spinner className="animate-spin" />
      </div>
    </div>
  );
}
