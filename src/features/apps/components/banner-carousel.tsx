"use client";

import Image from "next/image";
import Link from "next/link";
import * as React from "react";

import { cn } from "@/lib/utils";

import { Button } from "@/components/ui/button";
import {
  Carousel,
  type CarouselApi,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

interface CarouselWithPaginationProps {
  items: {
    title: string;
    description: string;
    image: string;
  }[];
}

export default function BannerCarousel({ items }: CarouselWithPaginationProps) {
  const [api, setApi] = React.useState<CarouselApi>();
  const [current, setCurrent] = React.useState(0);
  const [count, setCount] = React.useState(0);

  React.useEffect(() => {
    if (!api) {
      return;
    }

    setCount(api.scrollSnapList().length);
    setCurrent(api.selectedScrollSnap() + 1);

    api.on("select", () => {
      setCurrent(api.selectedScrollSnap() + 1);
    });
  }, [api]);

  return (
    <div className="w-full">
      <Carousel setApi={setApi} className="w-full">
        <CarouselContent className="-ml-0">
          {items.map((slide, index) => (
            <CarouselItem key={index} className="basis-full pl-0">
              <div className="relative flex min-h-[50vh] w-full flex-col items-center justify-center sm:min-h-[70vh] md:h-[calc(100vh-4rem)]">
                <Image
                  src={slide.image}
                  alt={`Banner ${index + 1}`}
                  className="absolute inset-0 hidden h-full w-full object-cover md:block"
                  priority={index === 0}
                  fill
                />
                <div className="absolute inset-0 z-10 hidden bg-black/25 md:block"></div>
                <div className="flex w-full flex-col items-center">
                  <div className="z-10 w-full max-w-6xl px-4">
                    <div className="relative text-center md:max-w-lg md:text-left lg:max-w-xl xl:max-w-2xl">
                      <h1 className="font-bold text-3xl text-black leading-tight sm:text-4xl md:text-5xl md:text-white lg:text-8xl">
                        {slide.title}
                      </h1>
                      <p className="mt-4 text-black text-lg leading-relaxed sm:mt-6 sm:text-xl md:max-w-[450px] md:text-white lg:max-w-[500px]">
                        {slide.description}
                      </p>
                      <div className="mt-6 flex justify-center sm:mt-8 md:justify-start">
                        <Button
                          asChild
                          size="lg"
                          variant="secondary"
                          className="h-14 text-base"
                        >
                          <Link href="/shop">Start Shopping</Link>
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious className="left-4 md:left-8" />
        <CarouselNext className="right-4 md:right-8" />
      </Carousel>
      <div className="mt-4 flex items-center justify-center gap-2">
        {Array.from({ length: count }).map((_, index) => (
          <button
            key={index}
            onClick={() => api?.scrollTo(index)}
            className={cn("h-3.5 w-3.5 rounded-full border-2", {
              "border-primary": current === index + 1,
            })}
          />
        ))}
      </div>
    </div>
  );
}
