import { RocketIcon } from "@radix-ui/react-icons";
import type React from "react";

import { cn } from "@/lib/utils";

import { Icons } from "@/components/icons";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

interface AlertCardProps extends React.ComponentPropsWithoutRef<typeof Alert> {
  title?: string;
  description?: string;
  icon?: keyof typeof Icons;
}

export function AlertCard({
  title,
  description,
  icon,
  children,
  className,
  ...props
}: AlertCardProps) {
  const Icon = icon ? Icons[icon] : RocketIcon;

  return (
    <Alert
      className={cn(
        "flex flex-col items-center justify-center space-y-8 p-16",
        className,
      )}
      {...props}
    >
      <div className="flex aspect-square size-fit items-center justify-center rounded-full border border-dashed p-4">
        <Icon className="size-5" />
      </div>
      {children ?? (
        <div className="flex flex-col items-center space-y-2 text-center">
          <AlertTitle className="text-lg">
            {title ?? "No Title Provided"}
          </AlertTitle>
          {description ? (
            <AlertDescription className="text-muted-foreground">
              {description}
            </AlertDescription>
          ) : (
            <div className="flex items-center space-x-2 text-muted-foreground text-sm">
              <AlertDescription>No Description</AlertDescription>
            </div>
          )}
        </div>
      )}
    </Alert>
  );
}
