import { toast } from "sonner";
import * as z from "zod";

import { unknownError } from "@/lib/constants";

export function getErrorMessage(err: unknown) {
  if (err instanceof z.ZodError) {
    return err.message ?? unknownError;
  } else if (err instanceof Error) {
    return err.message;
  } else {
    return unknownError;
  }
}

export function showErrorToast(err: unknown) {
  const errorMessage = getErrorMessage(err);
  console.log({ errorMessage });

  return toast.error(errorMessage);
}
