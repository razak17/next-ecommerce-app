"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import type { z } from "zod";

import { useUploadThing } from "@/lib/uploadthing";
import { getInitials, toTitleCase } from "@/lib/utils";

import { Icons } from "@/components/icons";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
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
import { PhoneInput } from "@/components/ui/phone-input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { User } from "@/db/schema";
import { UserGender } from "@/types";
import { updateProfile } from "../actions/profile";
import { updateProfileSchema } from "../validations/auth";

interface ProfileFormProps {
  user: User;
}

export function ProfileForm({ user }: ProfileFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [imagePreview, setImagePreview] = useState<string>(user.image || "");

  const { startUpload } = useUploadThing("imageUploader");

  const form = useForm<z.infer<typeof updateProfileSchema>>({
    resolver: zodResolver(updateProfileSchema),
    defaultValues: {
      firstName: user.firstName || "",
      lastName: user.lastName || "",
      name: user.name || "",
      email: user.email,
      phone: user.phone || "",
      gender: user.gender || undefined,
      image: user.image || "",
    },
  });

  async function handleImageUpload(file: File) {
    try {
      setIsUploadingImage(true);
      const uploadedFiles = await startUpload([file]);

      if (uploadedFiles?.length) {
        const imageUrl = uploadedFiles[0].ufsUrl;
        setImagePreview(imageUrl);
        form.setValue("image", imageUrl);
        toast.success("Image uploaded successfully");
      }
    } catch (error) {
      toast.error("Failed to upload image");
      console.error("Image upload error:", error);
    } finally {
      setIsUploadingImage(false);
    }
  }

  async function onSubmit(values: z.infer<typeof updateProfileSchema>) {
    setIsLoading(true);

    const data = await updateProfile(values);

    if (data?.error) {
      toast.success(data?.error);
      setIsLoading(false);
      return;
    }

    toast.error("Profile updated successfully.");
    setIsLoading(false);
  }

  return (
    <Form {...form}>
      <form className="space-y-6" onSubmit={form.handleSubmit(onSubmit)}>
        <div className="flex flex-col items-center space-y-4">
          <Avatar className="h-24 w-24">
            <AvatarImage src={imagePreview || user.image || undefined} />
            <AvatarFallback className="text-lg">
              {getInitials({
                firstName: user.firstName,
                lastName: user.lastName,
              })}
            </AvatarFallback>
          </Avatar>

          <div className="flex flex-col items-center">
            <label htmlFor="image-upload" className="cursor-pointer">
              <Button
                type="button"
                variant="outline"
                size="sm"
                disabled={isUploadingImage}
                asChild
              >
                <span>
                  {isUploadingImage && (
                    <Icons.spinner
                      className="mr-2 size-4 animate-spin"
                      aria-hidden="true"
                    />
                  )}
                  {isUploadingImage ? "Uploading..." : "Change Image"}
                </span>
              </Button>
            </label>
            <input
              id="image-upload"
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) {
                  handleImageUpload(file);
                }
              }}
            />
            <p className="mt-1 text-muted-foreground text-xs">
              JPG, PNG up to 4MB
            </p>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <FormField
            control={form.control}
            name="firstName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>First Name</FormLabel>
                <FormControl>
                  <Input placeholder="First name" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="lastName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Last Name</FormLabel>
                <FormControl>
                  <Input placeholder="Last name" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input disabled placeholder="email@example.com" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid gap-4 md:grid-cols-2">
          <FormField
            control={form.control}
            name="phone"
            render={({ field }) => (
              <FormItem className="flex flex-col items-start">
                <FormLabel>Phone number</FormLabel>
                <FormControl className="w-full">
                  <PhoneInput
                    placeholder="Placeholder"
                    {...field}
                    defaultCountry="US"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="gender"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Gender</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select gender" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {Object.values(UserGender).map((gender) => (
                      <SelectItem key={gender} value={gender}>
                        {toTitleCase(gender)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <Button type="submit" disabled={isLoading} className="w-full">
          {isLoading && (
            <Icons.spinner
              className="mr-2 size-4 animate-spin"
              aria-hidden="true"
            />
          )}
          Update Profile
        </Button>
      </form>
    </Form>
  );
}
