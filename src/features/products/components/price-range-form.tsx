import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

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

const priceRangeSchema = z
  .object({
    minPrice: z
      .string()
      .min(1, "Min price is required")
      .refine((val) => !Number.isNaN(Number(val)) && Number(val) >= 0, {
        message: "Min price must be a valid number greater than or equal to 0",
      }),
    maxPrice: z
      .string()
      .min(1, "Max price is required")
      .refine((val) => !Number.isNaN(Number(val)) && Number(val) >= 0, {
        message: "Max price must be a valid number greater than or equal to 0",
      }),
  })
  .refine((data) => Number(data.minPrice) <= Number(data.maxPrice), {
    message: "Min price must be less than or equal to max price",
    path: ["maxPrice"],
  });

interface PriceRangeFormProps {
  minPrice: number;
  maxPrice: number;
  updateFilters: (key: string, value: string | null) => void;
}

export function PriceRangeForm({
  minPrice,
  maxPrice,
  updateFilters,
}: PriceRangeFormProps) {
  const onSubmitPriceFilter = (values: z.infer<typeof priceRangeSchema>) => {
    const min = Number(values.minPrice);
    const max = Number(values.maxPrice);
    updateFilters("price_range", `${min}-${max}`);
  };

  const form = useForm<z.infer<typeof priceRangeSchema>>({
    resolver: zodResolver(priceRangeSchema),
    defaultValues: {
      minPrice: minPrice.toString(),
      maxPrice: maxPrice.toString(),
    },
  });

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmitPriceFilter)}
        className="space-y-4"
      >
        <div className="grid grid-cols-2 gap-2">
          <FormField
            control={form.control}
            name="minPrice"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-xs">Min</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    step="1"
                    placeholder="0"
                    className="h-8"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="maxPrice"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-xs">Max</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    step="1"
                    placeholder="0"
                    className="h-8"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <Button type="submit" className="w-full" size="sm">
          Apply Price Filter
        </Button>
      </form>
    </Form>
  );
}
