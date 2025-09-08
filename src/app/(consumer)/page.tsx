import Image from "next/image";
import Link from "next/link";

import { Icons } from "@/components/icons";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import BannerCarousel from "@/features/apps/components/banner-carousel";
import { getAllCategories } from "@/features/categories/queries/categories";

export default async function Home() {
  const categories = await getAllCategories();

  const bannerSlides = [
    {
      image: "/images/banner-0.jpg",
      title: "Next-Gen Mobility",
      description:
        "Power, performance, and style - experience the future of smartphones today.",
    },
    {
      image: "/images/banner-1.jpg",
      title: "Innovation Redefined",
      description:
        "Discover cutting-edge technology designed to enhance your digital lifestyle.",
    },
    {
      image: "/images/banner-2.jpg",
      title: "Premium Experience",
      description:
        "Quality craftsmanship meets modern design for the ultimate user experience.",
    },
  ];

  return (
    <div className="flex min-h-screen flex-col">
      <section className="relative w-full">
        <BannerCarousel items={bannerSlides} />
      </section>

      <section className="space-y-6 pt-6 md:pt-10 lg:pt-22">
        <div className="container flex max-w-6xl flex-col items-center gap-4 text-center">
          <h1 className="font-bold text-3xl tracking-wide md:text-5xl">
            Shop by Category
          </h1>
          <p className="mx-auto max-w-4xl text-center text-sm sm:text-base">
            Explore our diverse range of product categories to find exactly what
            you're looking for.
          </p>
        </div>

        <div className="container">
          <Carousel
            opts={{
              align: "start",
              loop: true,
            }}
            className="mx-auto w-full max-w-6xl p-4"
          >
            <CarouselContent className="-ml-1 md:-ml-4 px-2 py-4">
              {categories.map((category) => (
                <CarouselItem
                  key={category.id}
                  className="basis-1/2 pl-2 md:basis-1/3 md:pl-4 lg:basis-1/4"
                >
                  <Link href={`/shop?category=${category.slug}`}>
                    <Card className="group cursor-pointer transition-all duration-200 hover:scale-105 hover:shadow-lg">
                      <CardHeader className="pb-3">
                        {category.image?.url ? (
                          <div className="relative aspect-square w-full overflow-hidden rounded-lg">
                            <Image
                              src={category.image.url}
                              alt={category.name}
                              fill
                              className="object-cover transition-transform duration-200 group-hover:scale-110"
                              sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
                            />
                          </div>
                        ) : (
                          <div className="relative flex aspect-square w-full items-center justify-center overflow-hidden rounded-lg bg-muted">
                            <Icons.store className="size-12 text-muted-foreground" />
                          </div>
                        )}
                      </CardHeader>
                      <CardContent className="pt-0">
                        <CardTitle className="text-center text-lg transition-colors group-hover:text-primary">
                          {category.name}
                        </CardTitle>
                        {category.description && (
                          <p className="mt-2 line-clamp-2 text-center text-muted-foreground text-sm">
                            {category.description}
                          </p>
                        )}
                      </CardContent>
                    </Card>
                  </Link>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious />
            <CarouselNext />
          </Carousel>
        </div>
      </section>
    </div>
  );
}
