// "use client";
//
// import { PayPalButtons, PayPalScriptProvider } from "@paypal/react-paypal-js";
//
// import { formatPrice } from "@/lib/utils";
//
// import { Button } from "@/components/ui/button";
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
//
// interface PayPalPaymentProps {
//   total: number;
//   onBack: () => void;
//   onSuccess: (details: any) => void;
//   onError?: (error: any) => void;
// }
//
// export function PayPalPayment({
//   total,
//   onBack,
//   onSuccess,
//   onError,
// }: PayPalPaymentProps) {
//   const createOrder = (_data: any, actions: any) => {
//     return actions.order.create({
//       purchase_units: [
//         {
//           amount: {
//             value: total.toFixed(2),
//             currency_code: "USD",
//           },
//         },
//       ],
//     });
//   };
//
//   const onApprove = async (_data: any, actions: any) => {
//     try {
//       const details = await actions.order.capture();
//       onSuccess(details);
//     } catch (error) {
//       console.error("PayPal payment error:", error);
//       onError?.(error);
//     }
//   };
//
//   const handleError = (error: unknown) => {
//     console.error("PayPal error:", error);
//     onError?.(error);
//   };
//
//   return (
//     <div className="mx-auto max-w-md space-y-6">
//       <Card>
//         <CardHeader>
//           <CardTitle>Payment</CardTitle>
//         </CardHeader>
//         <CardContent className="space-y-6">
//           <div className="text-center">
//             <p className="mb-2 text-muted-foreground text-sm">Total Amount</p>
//             <p className="font-bold text-2xl">{formatPrice(total)}</p>
//           </div>
//
//           <div className="space-y-4">
//             <PayPalScriptProvider
//               options={{
//                 clientId: process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID || "",
//                 currency: "USD",
//                 intent: "capture",
//               }}
//             >
//               <PayPalButtons
//                 createOrder={createOrder}
//                 onApprove={onApprove}
//                 onError={handleError}
//                 style={{
//                   layout: "vertical",
//                   color: "gold",
//                   shape: "rect",
//                   label: "paypal",
//                 }}
//               />
//             </PayPalScriptProvider>
//
//             <Button onClick={onBack} variant="outline" className="w-full">
//               Back to Order Summary
//             </Button>
//           </div>
//         </CardContent>
//       </Card>
//
//       <Card>
//         <CardContent className="pt-6">
//           <div className="text-center text-muted-foreground text-sm">
//             <p>Your payment is secured by PayPal</p>
//             <p className="mt-1">
//               You will be redirected to complete your purchase
//             </p>
//           </div>
//         </CardContent>
//       </Card>
//     </div>
//   );
// }
