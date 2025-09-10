import { ContentSection } from "@/components/content-section";
import { Icons } from "@/components/icons";
import { ProductCard } from "@/components/product-card";
import { Shell } from "@/components/shell";
import { siteConfig } from "@/config/site";
import BannerCarousel from "@/features/apps/components/banner-carousel";
import { CategoryCard } from "@/features/apps/components/category-card";
import type { getAllCategories } from "@/features/categories/queries/categories";
import type { getFeaturedProducts } from "@/features/products/queries/products";

interface LobbyProps {
  productsPromise: ReturnType<typeof getFeaturedProducts>;
  categoriesPromise: ReturnType<typeof getAllCategories>;
}

export async function Lobby({
  productsPromise,
  categoriesPromise,
}: LobbyProps) {
  const [products, categories] = await Promise.all([
    productsPromise,
    categoriesPromise,
  ]);

  return (
    <div className="flex min-h-screen flex-col">
      <BannerCarousel items={siteConfig.bannerSlides} />

      <Shell className="max-w-6xl gap-0">
        <section className="space-y-6 pt-14 md:pt-20 lg:pt-24">
          <div className="mb-4 flex max-w-6xl flex-col items-center gap-1 text-center">
            <h2 className="font-bold text-2xl leading-[1.1] tracking-wide md:text-3xl">
              Shop by Category
            </h2>
            <p className="max-w-4xl text-balance text-muted-foreground text-sm leading-normal sm:text-base sm:leading-7">
              Explore our diverse range of product categories to find exactly
              what you're looking for.
            </p>
          </div>
          <div className="grid grid-cols-1 xs:grid-cols-2 gap-4 md:grid-cols-4">
            {categories.map((category) => (
              <CategoryCard key={category.name} category={category} />
            ))}
          </div>
        </section>

        <ContentSection
          title="Featured products"
          description="Discover our hand-picked selection of premium products."
          href="/shop"
          linkText="View all products"
          className="pt-14 md:pt-20 lg:pt-24"
        >
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </ContentSection>
      </Shell>

      <section className="bg-muted/30 pt-14 pb-14 md:pt-20 lg:pt-24">
        <div className="container space-y-6">
          <div className="flex flex-col items-center space-y-4 text-center">
            <h2 className="font-bold text-2xl leading-[1.1] tracking-wide md:text-3xl">
              Why Choose {siteConfig.name}?
            </h2>
            <p className="max-w-3xl text-lg text-muted-foreground">
              We provide the best shopping experience with quality products,
              fast delivery, and excellent customer service.
            </p>
          </div>

          <div className="container grid justify-center gap-4 sm:grid-cols-2 md:max-w-6xl md:grid-cols-3">
            {siteConfig.whyChooseUs.map((item, index) => {
              const Icon = Icons[item.icon ?? "store"];
              return (
                <div
                  key={index}
                  className="relative overflow-hidden rounded-lg border bg-background p-6"
                >
                  <div className="flex items-center space-x-2">
                    <Icon className="size-8 text-primary" />
                    <h3 className="font-bold text-lg">{item.title}</h3>
                  </div>
                  <p className="mt-3 text-muted-foreground text-sm">
                    {item.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="bg-primary pt-14 pb-14 md:pt-20 lg:pt-24">
        <div className="container">
          <div className="container grid max-w-6xl grid-cols-2 gap-6 md:grid-cols-4">
            {siteConfig.lobbyStats.map((stat) => (
              <div
                key={stat.label}
                className="flex flex-col items-center space-y-2 text-center"
              >
                <div className="font-bold text-4xl text-primary-foreground">
                  {stat.value}
                </div>
                <div className="text-primary-foreground/80 text-sm">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
