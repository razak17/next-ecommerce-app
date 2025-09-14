// "use client";
//
// import { useRouter } from "next/navigation";
// import { useState } from "react";
//
// import { OrderSummary } from "./order-summary";
// import { PayPalPayment } from "./paypal-payment";
// import { ShippingForm } from "./shipping-form";
// import type { CartLineItemSchema } from "@/features/cart/validations/cart";
// import type { ShippingInfoSchema } from "../validations/checkout";
//
// interface CheckoutFlowProps {
//   cartItems: CartLineItemSchema[];
// }
//
// type CheckoutStep = "shipping" | "summary" | "payment" | "success";
//
// export function CheckoutFlow({ cartItems }: CheckoutFlowProps) {
//   const router = useRouter();
//   const [currentStep, setCurrentStep] = useState<CheckoutStep>("shipping");
//   const [shippingInfo, setShippingInfo] = useState<ShippingInfoSchema | null>(
//     null,
//   );
//
//   const subtotal = cartItems.reduce(
//     (acc, item) => acc + Number(item.price) * item.quantity,
//     0,
//   );
//   const shipping = 10;
//   const tax = subtotal * 0.08;
//   const total = subtotal + shipping + tax;
//
//   const handleShippingSubmit = (data: ShippingInfoSchema) => {
//     setShippingInfo(data);
//     setCurrentStep("summary");
//   };
//
//   const handleBackToShipping = () => {
//     setCurrentStep("shipping");
//   };
//
//   const handleProceedToPayment = () => {
//     setCurrentStep("payment");
//   };
//
//   const handleBackToSummary = () => {
//     setCurrentStep("summary");
//   };
//
//   const handlePaymentSuccess = (details: any) => {
//     console.log("Payment successful:", details);
//     setCurrentStep("success");
//     // Here you would typically:
//     // 1. Clear the cart
//     // 2. Save the order to database
//     // 3. Send confirmation email
//     // 4. Redirect to success page
//     setTimeout(() => {
//       router.push("/orders");
//     }, 3000);
//   };
//
//   const handlePaymentError = (error: any) => {
//     console.error("Payment failed:", error);
//     // Handle payment error (show error message, etc.)
//   };
//
//   if (currentStep === "success") {
//     return (
//       <div className="py-16 text-center">
//         <div className="mb-4">
//           <div className="mb-4 inline-flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
//             <svg
//               className="h-8 w-8 text-green-600"
//               fill="none"
//               stroke="currentColor"
//               viewBox="0 0 24 24"
//             >
//               <path
//                 strokeLinecap="round"
//                 strokeLinejoin="round"
//                 strokeWidth={2}
//                 d="M5 13l4 4L19 7"
//               />
//             </svg>
//           </div>
//         </div>
//         <h1 className="mb-2 font-bold text-2xl">Order Successful!</h1>
//         <p className="mb-4 text-muted-foreground">
//           Thank you for your purchase. You will receive a confirmation email
//           shortly.
//         </p>
//         <p className="text-muted-foreground text-sm">
//           Redirecting to your orders...
//         </p>
//       </div>
//     );
//   }
//
//   return (
//     <div className="container mx-auto px-4 py-8">
//       <div className="mb-8">
//         <div className="flex items-center justify-center space-x-4">
//           <div
//             className={`flex items-center ${
//               currentStep === "shipping"
//                 ? "text-primary"
//                 : "text-muted-foreground"
//             }`}
//           >
//             <div
//               className={`flex h-8 w-8 items-center justify-center rounded-full border-2 ${
//                 currentStep === "shipping"
//                   ? "border-primary bg-primary text-primary-foreground"
//                   : "border-muted-foreground"
//               }`}
//             >
//               1
//             </div>
//             <span className="ml-2 font-medium text-sm">Shipping</span>
//           </div>
//           <div className="h-0.5 w-16 bg-muted-foreground/30" />
//           <div
//             className={`flex items-center ${
//               currentStep === "summary"
//                 ? "text-primary"
//                 : "text-muted-foreground"
//             }`}
//           >
//             <div
//               className={`flex h-8 w-8 items-center justify-center rounded-full border-2 ${
//                 currentStep === "summary"
//                   ? "border-primary bg-primary text-primary-foreground"
//                   : "border-muted-foreground"
//               }`}
//             >
//               2
//             </div>
//             <span className="ml-2 font-medium text-sm">Review</span>
//           </div>
//           <div className="h-0.5 w-16 bg-muted-foreground/30" />
//           <div
//             className={`flex items-center ${
//               currentStep === "payment"
//                 ? "text-primary"
//                 : "text-muted-foreground"
//             }`}
//           >
//             <div
//               className={`flex h-8 w-8 items-center justify-center rounded-full border-2 ${
//                 currentStep === "payment"
//                   ? "border-primary bg-primary text-primary-foreground"
//                   : "border-muted-foreground"
//               }`}
//             >
//               3
//             </div>
//             <span className="ml-2 font-medium text-sm">Payment</span>
//           </div>
//         </div>
//       </div>
//
//       <div className="flex justify-center">
//         {currentStep === "shipping" && (
//           <ShippingForm onNext={handleShippingSubmit} />
//         )}
//         {currentStep === "summary" && shippingInfo && (
//           <OrderSummary
//             cartItems={cartItems}
//             shippingInfo={shippingInfo}
//             onBack={handleBackToShipping}
//             onProceedToPayment={handleProceedToPayment}
//           />
//         )}
//         {currentStep === "payment" && (
//           <PayPalPayment
//             total={total}
//             onBack={handleBackToSummary}
//             onSuccess={handlePaymentSuccess}
//             onError={handlePaymentError}
//           />
//         )}
//       </div>
//     </div>
//   );
// }
