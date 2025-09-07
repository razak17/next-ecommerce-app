import type { Route } from "next";
import Link from "next/link";

import { Icons } from "@/components/icons";
import { Button } from "@/components/ui/button";
import { siteConfig } from "@/config/site";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col">
      <section className="space-y-6 pt-6 pb-8 md:pt-10 md:pb-12 lg:py-32">
        <div className="container flex max-w-6xl flex-col items-center gap-4 text-center">
          <div className="rounded-full bg-muted px-4 py-1.5 font-medium text-sm">
            Welcome to the future of online shopping
          </div>

          <h1 className="font-bold text-3xl leading-tight tracking-tighter md:text-6xl lg:leading-[1.1]">
            {siteConfig.name}
          </h1>

          <p className="max-w-[750px] text-lg text-muted-foreground sm:text-xl">
            Discover amazing products, enjoy seamless shopping, and get
            everything delivered right to your doorstep. Your perfect shopping
            experience starts here.
          </p>

          <div className="space-x-4">
            <Button size="lg" asChild>
              <Link href="/shop">
                <Icons.store className="mr-2 size-4" />
                Start Shopping
              </Link>
            </Button>
            <Button variant="outline" size="lg" asChild>
              <Link href="/">Learn More</Link>
            </Button>
          </div>
        </div>
      </section>

      <section className="container space-y-6 py-8 md:py-12 lg:py-24">
        <div className="mx-auto flex max-w-[980px] flex-col items-center space-y-4 text-center">
          <h2 className="font-bold text-3xl leading-tight tracking-tighter md:text-5xl">
            Why Choose {siteConfig.name}?
          </h2>
          <p className="max-w-[700px] text-lg text-muted-foreground">
            We provide the best shopping experience with quality products, fast
            delivery, and excellent customer service.
          </p>
        </div>

        <div className="mx-auto grid justify-center gap-4 sm:grid-cols-2 md:max-w-[64rem] md:grid-cols-3">
          <div className="relative overflow-hidden rounded-lg border bg-background p-6">
            <div className="flex items-center space-x-2">
              <Icons.store className="size-8 text-primary" />
              <h3 className="font-bold text-lg">Quality Products</h3>
            </div>
            <p className="mt-3 text-muted-foreground text-sm">
              Carefully curated selection of high-quality products from trusted
              brands and suppliers worldwide.
            </p>
          </div>

          <div className="relative overflow-hidden rounded-lg border bg-background p-6">
            <div className="flex items-center space-x-2">
              <Icons.cart className="size-8 text-primary" />
              <h3 className="font-bold text-lg">Fast Delivery</h3>
            </div>
            <p className="mt-3 text-muted-foreground text-sm">
              Lightning-fast shipping with real-time tracking. Get your orders
              delivered within 24-48 hours.
            </p>
          </div>

          <div className="relative overflow-hidden rounded-lg border bg-background p-6">
            <div className="flex items-center space-x-2">
              <Icons.users className="size-8 text-primary" />
              <h3 className="font-bold text-lg">24/7 Support</h3>
            </div>
            <p className="mt-3 text-muted-foreground text-sm">
              Our dedicated customer support team is available round the clock
              to assist you with any queries.
            </p>
          </div>

          <div className="relative overflow-hidden rounded-lg border bg-background p-6">
            <div className="flex items-center space-x-2">
              <Icons.credit className="size-8 text-primary" />
              <h3 className="font-bold text-lg">Secure Payments</h3>
            </div>
            <p className="mt-3 text-muted-foreground text-sm">
              Shop with confidence using our encrypted payment system supporting
              multiple payment methods.
            </p>
          </div>

          <div className="relative overflow-hidden rounded-lg border bg-background p-6">
            <div className="flex items-center space-x-2">
              <Icons.analytics className="size-8 text-primary" />
              <h3 className="font-bold text-lg">Easy Returns</h3>
            </div>
            <p className="mt-3 text-muted-foreground text-sm">
              Hassle-free 30-day return policy. Not satisfied? Return your
              purchase with no questions asked.
            </p>
          </div>

          <div className="relative overflow-hidden rounded-lg border bg-background p-6">
            <div className="flex items-center space-x-2">
              <Icons.dollarSign className="size-8 text-primary" />
              <h3 className="font-bold text-lg">Best Prices</h3>
            </div>
            <p className="mt-3 text-muted-foreground text-sm">
              Competitive pricing with regular discounts and special offers. Get
              the best value for your money.
            </p>
          </div>
        </div>
      </section>

      <section className="container py-8 md:py-12 lg:py-24">
        <div className="mx-auto flex max-w-[980px] flex-col items-center space-y-4 text-center">
          <h2 className="font-bold text-3xl leading-tight tracking-tighter md:text-5xl">
            Trusted by Thousands
          </h2>
          <p className="max-w-[700px] text-lg text-muted-foreground">
            Join the growing community of satisfied customers who love shopping
            with us.
          </p>
        </div>

        <div className="mx-auto mt-16 grid max-w-5xl grid-cols-1 gap-6 md:grid-cols-3">
          <div className="flex flex-col items-center space-y-2 border-gray-200 border-r px-4 dark:border-gray-800">
            <div className="font-bold text-4xl">10K+</div>
            <div className="text-muted-foreground text-sm">Happy Customers</div>
          </div>
          <div className="flex flex-col items-center space-y-2 border-gray-200 border-r px-4 md:border-r-0 lg:border-r dark:border-gray-800">
            <div className="font-bold text-4xl">50K+</div>
            <div className="text-muted-foreground text-sm">Products Sold</div>
          </div>
          <div className="flex flex-col items-center space-y-2 px-4">
            <div className="font-bold text-4xl">99.9%</div>
            <div className="text-muted-foreground text-sm">
              Satisfaction Rate
            </div>
          </div>
        </div>
      </section>

      <section className="border-t bg-muted/50">
        <div className="container flex flex-col items-center justify-between gap-4 py-10 md:h-24 md:flex-row md:py-0">
          <div className="flex flex-col items-center gap-4 px-8 md:flex-row md:gap-2 md:px-0">
            <Icons.logo className="size-6" />
            <p className="text-center text-sm leading-loose md:text-left">
              Built with ❤️ using Next.js and TypeScript.
            </p>
          </div>
          <div className="flex items-center space-x-4">
            <Button variant="outline" size="sm" asChild>
              <Link
                href={siteConfig.links.github as Route}
                target="_blank"
                rel="noreferrer"
              >
                <Icons.gitHub className="size-4" />
                GitHub
              </Link>
            </Button>
          </div>
        </div>
      </section>

      <section className="container space-y-6 py-8 md:py-12 lg:py-24">
        <div className="mx-auto max-w-[980px] text-center">
          <h2 className="font-bold text-3xl leading-tight tracking-tighter md:text-5xl">
            Ready to Start Shopping?
          </h2>
          <p className="mx-auto mt-4 max-w-[700px] text-lg text-muted-foreground">
            Join thousands of satisfied customers and discover your next
            favorite product today.
          </p>
          <div className="mt-8 space-x-4">
            <Button size="lg" asChild>
              <Link href="/shop">
                <Icons.store className="mr-2 size-4" />
                Browse Products
              </Link>
            </Button>
            <Button variant="outline" size="lg" asChild>
              <Link href="/register">Create Account</Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}
