import type { Metadata } from "next";

import {
  PageHeader,
  PageHeaderDescription,
  PageHeaderHeading,
} from "@/components/page-header";
import { Shell } from "@/components/shell";
import { env } from "@/env.js";
import { LogOutButtons } from "@/features/auth/components/logout-buttons";

export const metadata: Metadata = {
  metadataBase: new URL(env.NEXT_PUBLIC_APP_URL),
  title: "Log out",
  description: "Log out of your account",
};

export default function LogoutPage() {
  return (
    <Shell className="max-w-md">
      <PageHeader className="text-center">
        <PageHeaderHeading size="sm">Log out</PageHeaderHeading>
        <PageHeaderDescription size="sm">
          Are you sure you want to log out?
        </PageHeaderDescription>
      </PageHeader>
      <LogOutButtons />
    </Shell>
  );
}
