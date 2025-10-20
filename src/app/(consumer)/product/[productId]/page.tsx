import type { Metadata } from "next";
import { headers } from "next/headers";
import { notFound } from "next/navigation";

import { auth } from "@/lib/auth";
import { formatPrice, toTitleCase } from "@/lib/utils";

import { ProductCard } from "@/components/product-card";
import { ProductImageCarousel } from "@/components/product-image-carousel";
import { Shell } from "@/components/shell";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { env } from "@/env.js";
import { FavoriteButton } from "@/features/favorites/components/favorite-button";
import { AddToCartForm } from "@/features/products/components/add-to-cart-form";
import {
  getOtherProducts,
  getProduct,
  getProductForMetaData,
} from "@/features/products/queries/products";
import { ReviewStats } from "@/features/reviews/components/review-stats";
import { ReviewsList } from "@/features/reviews/components/reviews-list";
import {
  getProductReviewStats,
  getProductReviews,
  getUserReviewForProduct,
} from "@/features/reviews/queries/reviews";

export async function generateMetadata({
  params,
}: PageProps<"/product/[productId]">): Promise<Metadata> {
  const { productId } = await params;

  const product = await getProductForMetaData(productId);

  if (!product) {
    return {};
  }

  return {
    metadataBase: new URL(env.NEXT_PUBLIC_APP_URL),
    title: toTitleCase(product.name),
    description: product.description,
  };
}

export default async function ProductPage({
  params,
  searchParams,
}: PageProps<"/product/[productId]">) {
  const { productId } = await params;

  const product = await getProduct(productId);

  if (!product) {
    notFound();
  }

  const session = await auth.api.getSession({
    headers: await headers(),
  });

  const [otherProducts, reviews, reviewStats, userReview] = await Promise.all([
    getOtherProducts(productId),
    getProductReviews(productId, await searchParams),
    getProductReviewStats(productId),
    session?.user
      ? getUserReviewForProduct(session.user.id, productId)
      : Promise.resolve(null),
  ]);

  return (
    <Shell className="pb-12 md:pb-14">
      <div className="flex flex-col gap-8 md:flex-row md:gap-16">
        <ProductImageCarousel
          className="w-full md:w-1/2"
          images={product.images ?? []}
          options={{
            loop: true,
          }}
        />
        <Separator className="mt-4 md:hidden" />
        <div className="flex w-full flex-col gap-4 md:w-1/2">
          <div className="space-y-2">
            <h2 className="line-clamp-1 font-bold text-2xl">{product.name}</h2>
            <p className="text-base text-muted-foreground">
              {formatPrice(product.price)}
            </p>
          </div>
          <Separator className="my-1.5" />
          <div className="flex items-center justify-between">
            <p className="text-base text-muted-foreground">
              {product.inventory} in stock
            </p>
            <FavoriteButton
              isFavorited={product.isFavorited}
              productId={product.id}
              size="icon"
              variant="secondary"
              className="size-8"
            />
          </div>
          <AddToCartForm productId={productId} showBuyNow={true} />
          <Separator className="mt-5" />
          <Accordion
            type="single"
            collapsible
            className="w-full"
            defaultValue="description"
          >
            <AccordionItem value="description" className="border-none">
              <AccordionTrigger>Description</AccordionTrigger>
              <AccordionContent>
                {product.description ??
                  "No description is available for this product."}
              </AccordionContent>
            </AccordionItem>
          </Accordion>
          <Separator className="md:hidden" />
        </div>
      </div>
      {/* Reviews Section */}
      <div className="space-y-6">
        <Separator />
        <div className="grid gap-6 md:grid-cols-3">
          <div className="md:col-span-1">
            <ReviewStats
              totalReviews={reviewStats.totalReviews}
              averageRating={reviewStats.averageRating}
              ratingDistribution={reviewStats.ratingDistribution}
            />
          </div>
          <div className="md:col-span-2">
            <ReviewsList
              productId={productId}
              initialReviews={reviews}
              currentUserId={session?.user.id ?? undefined}
              userRole={session?.user.role ?? undefined}
              userExistingReview={userReview}
            />
          </div>
        </div>
      </div>

      {otherProducts && otherProducts?.length > 0 ? (
        <div className="space-y-6 overflow-hidden">
          <h2 className="line-clamp-1 flex-1 font-bold text-2xl">
            More products
          </h2>
          <ScrollArea className="pb-3.5">
            <div className="flex gap-4">
              {otherProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  className="min-w-[260px]"
                />
              ))}
            </div>
          </ScrollArea>
        </div>
      ) : null}
    </Shell>
  );
}
