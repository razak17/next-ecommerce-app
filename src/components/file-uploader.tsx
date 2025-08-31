"use client";

import { Cross2Icon, UploadIcon } from "@radix-ui/react-icons";
import Image from "next/image";
import * as React from "react";
import Dropzone, {
  type DropzoneProps,
  type FileRejection,
} from "react-dropzone";
import { toast } from "sonner";

import { cn, formatBytes } from "@/lib/utils";

import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useControllableState } from "@/hooks/use-controllable-state";

interface FileUploaderProps extends React.HTMLAttributes<HTMLDivElement> {
  value?: File[];
  onValueChange?: React.Dispatch<React.SetStateAction<File[]>>;
  onUpload?: (files: File[]) => Promise<void>;
  progresses?: Record<string, number>;
  accept?: DropzoneProps["accept"];
  maxSize?: DropzoneProps["maxSize"];
  maxFiles?: DropzoneProps["maxFiles"];
  multiple?: boolean;
  disabled?: boolean;
  preview?: boolean;
}

export function FileUploader(props: FileUploaderProps) {
  const {
    value: valueProp,
    onValueChange,
    onUpload,
    progresses,
    accept = { "image/*": [] },
    maxSize = 1024 * 1024 * 2,
    maxFiles = 1,
    multiple = false,
    disabled = false,
    preview = true,
    className,
    ...dropzoneProps
  } = props;

  const [files, setFiles] = useControllableState({
    prop: valueProp,
    onChange: onValueChange,
  });
  const onDrop = React.useCallback(
    (acceptedFiles: File[], rejectedFiles: FileRejection[]) => {
      if (!multiple && maxFiles === 1 && acceptedFiles.length > 1) {
        toast.error("Cannot upload more than 1 file at a time");
        return;
      }

      if ((files?.length ?? 0) + acceptedFiles.length > maxFiles) {
        toast.error(`Cannot upload more than ${maxFiles} files`);
        return;
      }

      const newFiles = acceptedFiles.map((file) =>
        Object.assign(file, {
          preview: URL.createObjectURL(file),
        }),
      );

      const updatedFiles = files ? [...files, ...newFiles] : newFiles;

      setFiles(updatedFiles);

      if (rejectedFiles.length > 0) {
        rejectedFiles.forEach(({ file }) => {
          toast.error(`File ${file.name} was rejected`);
        });
      }

      if (
        onUpload &&
        updatedFiles.length > 0 &&
        updatedFiles.length <= maxFiles
      ) {
        const target =
          updatedFiles.length > 0 ? `${updatedFiles.length} files` : `file`;

        toast.promise(onUpload(updatedFiles), {
          loading: `Uploading ${target}...`,
          success: () => {
            setFiles([]);
            return `${target} uploaded`;
          },
          error: `Failed to upload ${target}`,
        });
      }
    },

    [files, maxFiles, multiple, onUpload, setFiles],
  );

  function onRemove(index: number) {
    if (!files) return;
    const newFiles = files.filter((_, i) => i !== index);
    setFiles(newFiles);
    onValueChange?.(newFiles);
  }

  // Revoke preview url when component unmounts
  // biome-ignore lint/correctness/useExhaustiveDependencies: false
  React.useEffect(() => {
    return () => {
      if (!files) return;
      files.forEach((file) => {
        if (isFileWithPreview(file)) {
          URL.revokeObjectURL(file.preview);
        }
      });
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const isDisabled = disabled || (files?.length ?? 0) >= maxFiles;

  return (
    <div className="relative flex flex-col gap-6 overflow-hidden">
      {!files?.length ? (
        <Dropzone
          onDrop={onDrop}
          accept={accept}
          maxSize={maxSize}
          maxFiles={maxFiles}
          multiple={maxFiles > 1 || multiple}
          disabled={isDisabled}
        >
          {({ getRootProps, getInputProps, isDragActive }) => (
            <div
              {...getRootProps()}
              className={cn(
                "group relative grid h-52 w-full cursor-pointer place-items-center rounded-lg border-2 border-muted-foreground/25 border-dashed px-5 py-2.5 text-center transition hover:bg-muted/25",
                "ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
                isDragActive && "border-muted-foreground/50",
                isDisabled && "pointer-events-none opacity-60",
                className,
              )}
              {...dropzoneProps}
            >
              <input {...getInputProps()} />
              {isDragActive ? (
                <div className="flex flex-col items-center justify-center gap-4 sm:px-5">
                  <div className="rounded-full border border-dashed p-3">
                    <UploadIcon
                      className="size-7 text-muted-foreground"
                      aria-hidden="true"
                    />
                  </div>
                  <p className="font-medium text-muted-foreground">
                    Drop the files here
                  </p>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center gap-4 sm:px-5">
                  <div className="rounded-full border border-dashed p-3">
                    <UploadIcon
                      className="size-6 text-muted-foreground"
                      aria-hidden="true"
                    />
                  </div>
                  <div className="space-y-px">
                    <p className="font-medium text-muted-foreground text-sm">
                      {maxFiles > 1
                        ? `Click or drag up to ${maxFiles === Infinity ? "multiple" : maxFiles} files`
                        : "Click or drag a file "}
                      to upload
                    </p>
                    <p className="text-muted-foreground/70 text-sm">
                      Maximum upload size is {formatBytes(maxSize)}
                    </p>
                  </div>
                </div>
              )}
            </div>
          )}
        </Dropzone>
      ) : (
        <div className="space-y-4">
          {preview && files?.length ? (
            <ScrollArea>
              <div className="space-y-4">
                {files?.map((file, index) => (
                  <FileCard
                    key={index}
                    file={file}
                    onRemove={() => onRemove(index)}
                    progress={progresses?.[file.name]}
                  />
                ))}
              </div>
            </ScrollArea>
          ) : null}
        </div>
      )}
    </div>
  );
}

interface FileCardProps {
  file: File;
  onRemove: () => void;
  progress?: number;
}

function FileCard({ file, progress, onRemove }: FileCardProps) {
  return (
    <div className="flex flex-col items-center gap-2">
      <div className="relative aspect-video w-full">
        {isFileWithPreview(file) ? (
          <Image
            src={file.preview}
            alt={file.name}
            fill
            sizes="(min-width: 640px) 640px, 100vw"
            loading="lazy"
            className="rounded-md object-cover"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center rounded-md bg-muted">
            {file.name}
          </div>
        )}
        <Button
          type="button"
          variant="outline"
          size="icon"
          className="-top-0 -right-0 absolute h-8 w-8 rounded-full"
          onClick={onRemove}
        >
          <Cross2Icon className="size-4" aria-hidden="true" />
          <span className="sr-only">Remove file</span>
        </Button>
      </div>
      <div className="flex w-full flex-col gap-2">
        <div className="space-y-px">
          <p className="line-clamp-1 font-medium text-foreground/80 text-sm">
            {file.name}
          </p>
          <p className="text-muted-foreground text-xs">
            {formatBytes(file.size)}
          </p>
        </div>
        {progress ? <Progress value={progress} /> : null}
      </div>
    </div>
  );
}

function isFileWithPreview(file: File): file is File & { preview: string } {
  return "preview" in file && typeof file.preview === "string";
}
