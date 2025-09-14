// "use client";
//
// import { zodResolver } from "@hookform/resolvers/zod";
// import { useState } from "react";
// import { useForm } from "react-hook-form";
//
// import { Button } from "@/components/ui/button";
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import {
//   Form,
//   FormControl,
//   FormField,
//   FormItem,
//   FormLabel,
//   FormMessage,
// } from "@/components/ui/form";
// import { Input } from "@/components/ui/input";
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/ui/select";
// import {
//   type ShippingInfoSchema,
//   shippingInfoSchema,
// } from "../validations/checkout";
//
// const countries = [
//   { value: "US", label: "United States" },
//   { value: "CA", label: "Canada" },
//   { value: "GB", label: "United Kingdom" },
//   { value: "DE", label: "Germany" },
//   { value: "FR", label: "France" },
//   { value: "GH", label: "Ghana" },
//   { value: "NG", label: "Nigeria" },
//   // Add more countries as needed
// ];
//
// interface ShippingFormProps {
//   onNext: (data: ShippingInfoSchema) => void;
// }
//
// export function ShippingForm({ onNext }: ShippingFormProps) {
//   const [isLoading, setIsLoading] = useState(false);
//
//   const form = useForm<ShippingInfoSchema>({
//     resolver: zodResolver(shippingInfoSchema),
//     defaultValues: {
//       firstName: "",
//       lastName: "",
//       address: "",
//       city: "",
//       postalCode: "",
//       country: "",
//       phone: "",
//     },
//   });
//
//   const onSubmit = async (data: ShippingInfoSchema) => {
//     setIsLoading(true);
//     try {
//       onNext(data);
//     } finally {
//       setIsLoading(false);
//     }
//   };
//
//   return (
//     <Card className="w-full max-w-2xl">
//       <CardHeader>
//         <CardTitle>Shipping Information</CardTitle>
//       </CardHeader>
//       <CardContent>
//         <Form {...form}>
//           <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
//             <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
//               <FormField
//                 control={form.control}
//                 name="firstName"
//                 render={({ field }) => (
//                   <FormItem>
//                     <FormLabel>First Name</FormLabel>
//                     <FormControl>
//                       <Input placeholder="John" {...field} />
//                     </FormControl>
//                     <FormMessage />
//                   </FormItem>
//                 )}
//               />
//               <FormField
//                 control={form.control}
//                 name="lastName"
//                 render={({ field }) => (
//                   <FormItem>
//                     <FormLabel>Last Name</FormLabel>
//                     <FormControl>
//                       <Input placeholder="Doe" {...field} />
//                     </FormControl>
//                     <FormMessage />
//                   </FormItem>
//                 )}
//               />
//             </div>
//
//             <FormField
//               control={form.control}
//               name="address"
//               render={({ field }) => (
//                 <FormItem>
//                   <FormLabel>Address</FormLabel>
//                   <FormControl>
//                     <Input placeholder="123 Main Street" {...field} />
//                   </FormControl>
//                   <FormMessage />
//                 </FormItem>
//               )}
//             />
//
//             <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
//               <FormField
//                 control={form.control}
//                 name="city"
//                 render={({ field }) => (
//                   <FormItem>
//                     <FormLabel>City</FormLabel>
//                     <FormControl>
//                       <Input placeholder="New York" {...field} />
//                     </FormControl>
//                     <FormMessage />
//                   </FormItem>
//                 )}
//               />
//               <FormField
//                 control={form.control}
//                 name="postalCode"
//                 render={({ field }) => (
//                   <FormItem>
//                     <FormLabel>Postal Code</FormLabel>
//                     <FormControl>
//                       <Input placeholder="10001" {...field} />
//                     </FormControl>
//                     <FormMessage />
//                   </FormItem>
//                 )}
//               />
//             </div>
//
//             <FormField
//               control={form.control}
//               name="country"
//               render={({ field }) => (
//                 <FormItem>
//                   <FormLabel>Country</FormLabel>
//                   <Select
//                     onValueChange={field.onChange}
//                     defaultValue={field.value}
//                   >
//                     <FormControl>
//                       <SelectTrigger>
//                         <SelectValue placeholder="Select a country" />
//                       </SelectTrigger>
//                     </FormControl>
//                     <SelectContent>
//                       {countries.map((country) => (
//                         <SelectItem key={country.value} value={country.value}>
//                           {country.label}
//                         </SelectItem>
//                       ))}
//                     </SelectContent>
//                   </Select>
//                   <FormMessage />
//                 </FormItem>
//               )}
//             />
//
//             <FormField
//               control={form.control}
//               name="phone"
//               render={({ field }) => (
//                 <FormItem>
//                   <FormLabel>Phone Number (Optional)</FormLabel>
//                   <FormControl>
//                     <Input placeholder="+1 (555) 000-0000" {...field} />
//                   </FormControl>
//                   <FormMessage />
//                 </FormItem>
//               )}
//             />
//
//             <Button type="submit" className="w-full" disabled={isLoading}>
//               {isLoading ? "Processing..." : "Continue to Order Summary"}
//             </Button>
//           </form>
//         </Form>
//       </CardContent>
//     </Card>
//   );
// }
