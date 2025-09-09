/** biome-ignore-all lint/correctness/useExhaustiveDependencies: false */
"use client";

import { ChevronDownIcon } from "@radix-ui/react-icons";
import type { Route } from "next";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import * as React from "react";

import { cn, toTitleCase } from "@/lib/utils";

import { MultiSelect } from "@/components/multi-select";
import { PaginationButton } from "@/components/pagination-button";
import { ProductCard } from "@/components/product-card";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import {
  Sheet,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Slider } from "@/components/ui/slider";
import { queryConfig } from "@/config/query";
import type { Product } from "@/db/schema";
import type { getAllCategories } from "@/features/categories/queries/categories";
import type { getSubcategoriesByCategory } from "@/features/subcategories/queries/subcategories";
import { useDebounce } from "@/hooks/use-debounce";
import type { Option } from "@/types";

interface ProductsProps {
  products: Pick<Product, "id" | "name" | "price" | "images" | "inventory">[];
  pageCount: number;
  categories?: string[];
  category?: Awaited<ReturnType<typeof getAllCategories>>[number];
  subcategories?: Awaited<ReturnType<typeof getSubcategoriesByCategory>>;
}

export function Products({
  products,
  pageCount,
  category,
  categories,
  subcategories,
}: ProductsProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = React.useTransition();

  // Search params
  const page = searchParams?.get("page") ?? "1";
  const per_page = searchParams?.get("per_page") ?? "8";
  const sort = searchParams?.get("sort") ?? "createdAt.desc";
  const categoriesParam = searchParams?.get("categories");
  const subcategoriesParam = searchParams?.get("subcategories");

  // Create query string
  const createQueryString = React.useCallback(
    (params: Record<string, string | number | null>) => {
      const newSearchParams = new URLSearchParams(searchParams?.toString());

      for (const [key, value] of Object.entries(params)) {
        if (value === null) {
          newSearchParams.delete(key);
        } else {
          newSearchParams.set(key, String(value));
        }
      }

      return newSearchParams.toString();
    },
    [searchParams],
  );

  // Price filter
  const [priceRange, setPriceRange] = React.useState<[number, number]>([
    0, 500,
  ]);
  const debouncedPrice = useDebounce(priceRange, 500);

  React.useEffect(() => {
    const [min, max] = debouncedPrice;
    startTransition(() => {
      const newQueryString = createQueryString({
        price_range: `${min}-${max}`,
      });

      router.push(`${pathname}?${newQueryString}` as Route, {
        scroll: false,
      });
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedPrice]);

  // Category filter
  const [selectedCategories, setSelectedCategories] = React.useState<
    Option[] | null
  >(
    categoriesParam
      ? categoriesParam.split(".").map((c) => ({
          label: toTitleCase(c),
          value: c,
        }))
      : null,
  );

  React.useEffect(() => {
    startTransition(() => {
      const newQueryString = createQueryString({
        categories: selectedCategories?.length
          ? // Join categories with a dot to make search params prettier
            selectedCategories
              .map((c) => c.value)
              .join(".")
          : null,
      });

      router.push(`${pathname}?${newQueryString}` as Route, {
        scroll: false,
      });
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedCategories]);

  // Subcategory filter
  const [selectedSubcategories, setSelectedSubcategories] = React.useState<
    Option[] | null
  >(
    subcategoriesParam
      ? subcategoriesParam.split(".").map((c) => ({
          label: toTitleCase(c),
          value: c,
        }))
      : null,
  );

  React.useEffect(() => {
    startTransition(() => {
      const newQueryString = createQueryString({
        subcategories: selectedSubcategories?.length
          ? selectedSubcategories.map((s) => s.value).join(".")
          : null,
      });

      router.push(`${pathname}?${newQueryString}` as Route, {
        scroll: false,
      });
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedSubcategories]);

  return (
    <section className="flex flex-col space-y-6">
      <div className="flex items-center space-x-2">
        <Sheet>
          <SheetTrigger asChild>
            <Button aria-label="Filter products" size="sm" disabled={isPending}>
              Filter
            </Button>
          </SheetTrigger>
          <SheetContent className="flex flex-col">
            <SheetHeader className="px-1">
              <SheetTitle>Filters</SheetTitle>
            </SheetHeader>
            <Separator />
            <div className="flex flex-1 flex-col gap-5 overflow-hidden p-1">
              <Card className="space-y-4 rounded-lg p-3">
                <h3 className="font-medium text-foreground text-sm tracking-wide">
                  Price range ($)
                </h3>
                <Slider
                  defaultValue={[0, 500]}
                  max={500}
                  step={1}
                  value={priceRange}
                  onValueChange={(value: typeof priceRange) =>
                    setPriceRange(value)
                  }
                />
                <div className="flex items-center space-x-4">
                  <Input
                    type="number"
                    inputMode="numeric"
                    min={0}
                    max={priceRange[1]}
                    value={priceRange[0]}
                    onChange={(e) => {
                      const value = Number(e.target.value);
                      setPriceRange([value, priceRange[1]]);
                    }}
                  />
                  <span className="text-muted-foreground">-</span>
                  <Input
                    type="number"
                    inputMode="numeric"
                    min={priceRange[0]}
                    max={500}
                    value={priceRange[1]}
                    onChange={(e) => {
                      const value = Number(e.target.value);
                      setPriceRange([priceRange[0], value]);
                    }}
                  />
                </div>
              </Card>
              {categories?.length ? (
                <Card className="space-y-4 rounded-lg p-3">
                  <h3 className="font-medium text-foreground text-sm tracking-wide">
                    Categories
                  </h3>
                  <MultiSelect
                    placeholder="Select categories"
                    selected={selectedCategories}
                    setSelected={setSelectedCategories}
                    options={categories.map((c) => ({
                      label: toTitleCase(c),
                      value: c,
                    }))}
                  />
                </Card>
              ) : null}
              {category ? (
                <Card className="space-y-4 rounded-lg p-3">
                  <h3 className="font-medium text-foreground text-sm tracking-wide">
                    Subcategories
                  </h3>
                  <MultiSelect
                    placeholder="Select subcategories"
                    selected={selectedSubcategories}
                    setSelected={setSelectedSubcategories}
                    options={
                      subcategories?.map((c) => ({
                        label: c.name,
                        value: c.id,
                      })) ?? []
                    }
                  />
                </Card>
              ) : null}
            </div>
            <div>
              <Separator className="my-4" />
              <SheetFooter>
                <Button
                  aria-label="Clear filters"
                  size="sm"
                  className="w-full"
                  onClick={() => {
                    startTransition(() => {
                      router.push(
                        `${pathname}?${createQueryString({
                          price_range: 0 - 100,
                          categories: null,
                          subcategories: null,
                          active: "true",
                        })}` as Route,
                        {
                          scroll: false,
                        },
                      );

                      setPriceRange([0, 100]);
                      setSelectedCategories(null);
                      setSelectedSubcategories(null);
                    });
                  }}
                  disabled={isPending}
                >
                  Clear Filters
                </Button>
              </SheetFooter>
            </div>
          </SheetContent>
        </Sheet>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button aria-label="Sort products" size="sm" disabled={isPending}>
              Sort
              <ChevronDownIcon className="ml-2 size-4" aria-hidden="true" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="w-48">
            <DropdownMenuLabel>Sort by</DropdownMenuLabel>
            <DropdownMenuSeparator />
            {queryConfig.product.sortOptions.map((option) => (
              <DropdownMenuItem
                key={option.label}
                className={cn(option.value === sort && "bg-accent font-bold")}
                onClick={() => {
                  startTransition(() => {
                    router.push(
                      `${pathname}?${createQueryString({
                        sort: option.value,
                      })}` as Route,
                      {
                        scroll: false,
                      },
                    );
                  });
                }}
              >
                {option.label}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      {!isPending && !products.length ? (
        <div className="mx-auto flex max-w-xs flex-col space-y-1.5">
          <h1 className="text-center font-bold text-2xl">No products found</h1>
          <p className="text-center text-muted-foreground">
            Try changing your filters, or check back later for new products
          </p>
        </div>
      ) : null}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
      {products.length ? (
        <PaginationButton
          pageCount={pageCount}
          page={page}
          per_page={per_page}
          sort={sort}
          createQueryString={createQueryString}
        />
      ) : null}
    </section>
  );
}
