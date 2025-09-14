// "use client";
//
// import Image from "next/image";
//
// import { formatPrice } from "@/lib/utils";
//
// import { Button } from "@/components/ui/button";
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import { Separator } from "@/components/ui/separator";
// import type { CartLineItemSchema } from "@/features/cart/validations/cart";
// import type { ShippingInfoSchema } from "../validations/checkout";
//
// interface OrderSummaryProps {
//   cartItems: CartLineItemSchema[];
//   shippingInfo: ShippingInfoSchema;
//   onBack: () => void;
//   onProceedToPayment: () => void;
// }
//
// export function OrderSummary({
//   cartItems,
//   shippingInfo,
//   onBack,
//   onProceedToPayment,
// }: OrderSummaryProps) {
//   const subtotal = cartItems.reduce(
//     (acc, item) => acc + Number(item.price) * item.quantity,
//     0,
//   );
//   const shipping = 10; // Fixed shipping cost
//   const tax = subtotal * 0.08; // 8% tax
//   const total = subtotal + shipping + tax;
//
//   return (
//     <div className="grid gap-6 lg:grid-cols-2">
//       <div className="space-y-6">
//         <Card>
//           <CardHeader>
//             <CardTitle>Shipping Information</CardTitle>
//           </CardHeader>
//           <CardContent className="space-y-2">
//             <p className="font-medium">
//               {shippingInfo.firstName} {shippingInfo.lastName}
//             </p>
//             <p className="text-muted-foreground text-sm">
//               {shippingInfo.address}
//             </p>
//             <p className="text-muted-foreground text-sm">
//               {shippingInfo.city}, {shippingInfo.postalCode}
//             </p>
//             <p className="text-muted-foreground text-sm">
//               {shippingInfo.country}
//             </p>
//             {shippingInfo.phone && (
//               <p className="text-muted-foreground text-sm">
//                 {shippingInfo.phone}
//               </p>
//             )}
//           </CardContent>
//         </Card>
//
//         <Card>
//           <CardHeader>
//             <CardTitle>Order Items</CardTitle>
//           </CardHeader>
//           <CardContent>
//             <div className="space-y-4">
//               {cartItems.map((item) => (
//                 <div key={item.id} className="flex items-center space-x-4">
//                   {item.images?.[0] && (
//                     <div className="relative h-16 w-16 overflow-hidden rounded-lg border">
//                       <Image
//                         src={item.images[0].url}
//                         alt={item.name}
//                         className="h-full w-full object-cover"
//                         fill
//                         sizes="(max-width: 64px) 100vw, 64px"
//                       />
//                     </div>
//                   )}
//                   <div className="flex-1 space-y-1">
//                     <h4 className="font-medium">{item.name}</h4>
//                     <p className="text-muted-foreground text-sm">
//                       Quantity: {item.quantity}
//                     </p>
//                   </div>
//                   <div className="text-right">
//                     <p className="font-medium">
//                       {formatPrice(Number(item.price) * item.quantity)}
//                     </p>
//                   </div>
//                 </div>
//               ))}
//             </div>
//           </CardContent>
//         </Card>
//       </div>
//
//       <div className="space-y-6">
//         <Card>
//           <CardHeader>
//             <CardTitle>Order Summary</CardTitle>
//           </CardHeader>
//           <CardContent className="space-y-4">
//             <div className="space-y-2">
//               <div className="flex justify-between">
//                 <span>Subtotal</span>
//                 <span>{formatPrice(subtotal)}</span>
//               </div>
//               <div className="flex justify-between">
//                 <span>Shipping</span>
//                 <span>{formatPrice(shipping)}</span>
//               </div>
//               <div className="flex justify-between">
//                 <span>Tax</span>
//                 <span>{formatPrice(tax)}</span>
//               </div>
//               <Separator />
//               <div className="flex justify-between font-medium">
//                 <span>Total</span>
//                 <span>{formatPrice(total)}</span>
//               </div>
//             </div>
//
//             <div className="space-y-2 pt-4">
//               <Button onClick={onProceedToPayment} className="w-full" size="lg">
//                 Proceed to Payment
//               </Button>
//               <Button
//                 onClick={onBack}
//                 variant="outline"
//                 className="w-full"
//                 size="lg"
//               >
//                 Back to Shipping
//               </Button>
//             </div>
//           </CardContent>
//         </Card>
//       </div>
//     </div>
//   );
// }
