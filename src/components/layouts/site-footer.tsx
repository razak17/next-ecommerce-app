import type { Route } from "next";
import Link from "next/link";

import { cn } from "@/lib/utils";

import { ModeToggle } from "./mode-toggle";
import { siteConfig } from "@/config/site";
import { Icons } from "../icons";
import { Shell } from "../shell";
import { buttonVariants } from "../ui/button";

export function SiteFooter() {
  return (
    <footer className="w-full border-t bg-background">
      <Shell>
        <section className="flex w-full flex-col justify-between gap-10 lg:flex-row lg:gap-20">
          <div className="flex items-center gap-4">
            <Icons.visa className="size-12" />
            <Icons.paypal className="size-12" />
            <Icons.mastercard className="size-12" />
          </div>
          <p className="text-muted-foreground text-sm">
            &copy; copyright {new Date().getFullYear()} - Evershop, All rights
            reserved.
          </p>
        </section>
        <section className="flex items-center space-x-4">
          <div className="flex-1 text-left text-muted-foreground text-sm leading-loose">
            Built by{" "}
            <Link
              href="https://twitter.com/razak17"
              target="_blank"
              rel="noreferrer"
              className="font-semibold transition-colors hover:text-foreground"
            >
              Razak Mo
              <span className="sr-only">Twitter</span>
            </Link>
            .
          </div>
          <div className="flex items-center space-x-1">
            <Link
              href={siteConfig.links.github as Route}
              target="_blank"
              rel="noreferrer"
              className={cn(
                buttonVariants({
                  size: "icon",
                  variant: "ghost",
                }),
              )}
            >
              <Icons.gitHub className="size-4" aria-hidden="true" />
              <span className="sr-only">GitHub</span>
            </Link>
            <ModeToggle />
          </div>
        </section>
      </Shell>
    </footer>
  );
}
