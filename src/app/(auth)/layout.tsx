import { headers } from "next/headers";
import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";

import { auth } from "@/lib/auth";

import { siteConfig } from "@/config/site";
import { UserRole } from "@/types";

export default async function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  //
  // if (session && session.user.role === UserRole.Admin) {
  //   redirect("/admin/dashboard");
  // } else if (session && session.user.role !== UserRole.Admin) {
  //   redirect("/");
  // }

  return (
    <div className="relative grid min-h-screen grid-cols-1 overflow-hidden lg:grid-cols-2">
      <Link
        href="/"
        className="absolute top-6 left-8 z-20 flex items-center font-bold text-foreground/80 text-lg tracking-tight transition-colors hover:text-foreground"
      >
        <span>{siteConfig.name}</span>
      </Link>
      <main className="-translate-x-1/2 -translate-y-1/2 absolute top-1/2 left-1/2 flex w-full items-center lg:static lg:top-0 lg:left-0 lg:flex lg:translate-x-0 lg:translate-y-0">
        {children}
      </main>
      <div className="relative aspect-video size-full">
        <Image
          src="/images/auth-layout.jpg"
          alt="A skateboarder dropping into a bowl"
          fill
          className="absolute inset-0 object-cover"
          priority
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background to-black/80 lg:to-black/40" />
        <div className="absolute right-4 bottom-4 z-20 line-clamp-1 rounded-md bg-muted px-3 py-1.5 text-muted-foreground text-sm">
          Photo by{" "}
          <a
            href="https://unsplash.com/@a_myth?utm_content=creditCopyText&utm_medium=referral&utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText"
            className="underline transition-colors hover:text-foreground"
          >
            a_myth
          </a>
          {" on "}
          <a
            href="https://unsplash.com/photos/three-black-and-grey-laptops-y7T1lYkfg0c?utm_source=unsplash&utm_medium=referral&utm_content=creditCopyText"
            className="underline transition-colors hover:text-foreground"
          >
            Unsplash
          </a>
        </div>
      </div>
    </div>
  );
}
