// // src/app/(frontend)/checkout/page.tsx
// 'use client'

// import React, { useState, useEffect } from 'react'
// import { useRouter } from 'next/navigation'
// import { useCart } from '@/contexts/CartContext'
// import { CheckoutForm } from '@/components/Checkout/CheckoutForm'
// import { OrderSummary } from '@/components/Checkout/OrderSummary'
// import { formatPrice } from '@/utilities/shopHelpers'
// import { ShoppingBag, ArrowLeft, CreditCard } from 'lucide-react'
// import Link from 'next/link'

// interface CheckoutData {
//   // Customer Information
//   email: string
//   firstName: string
//   lastName: string
//   phone: string

//   // Shipping Address
//   shippingAddress: {
//     street: string
//     city: string
//     state: string
//     zipCode: string
//     country: string
//   }

//   // Billing Address
//   billingAddress: {
//     street: string
//     city: string
//     state: string
//     zipCode: string
//     country: string
//   }

//   // Options
//   sameAsBilling: boolean
//   saveInfo: boolean

//   // Payment
//   paymentMethod: 'razorpay' | 'phonepe'
// }

// const initialCheckoutData: CheckoutData = {
//   email: '',
//   firstName: '',
//   lastName: '',
//   phone: '',
//   shippingAddress: {
//     street: '',
//     city: '',
//     state: '',
//     zipCode: '',
//     country: 'IN',
//   },
//   billingAddress: {
//     street: '',
//     city: '',
//     state: '',
//     zipCode: '',
//     country: 'IN',
//   },
//   sameAsBilling: true,
//   saveInfo: false,
//   paymentMethod: 'razorpay',
// }

// export default function CheckoutPage() {
//   const router = useRouter()
//   const { items, totalPrice, totalItems, isLoading } = useCart()
//   const [checkoutData, setCheckoutData] = useState<CheckoutData>(initialCheckoutData)
//   const [isProcessing, setIsProcessing] = useState(false)
//   const [step, setStep] = useState<'details' | 'payment' | 'processing'>('details')

//   // Redirect if cart is empty
//   useEffect(() => {
//     if (!isLoading && items.length === 0) {
//       router.push('/shop')
//     }
//   }, [items, isLoading, router])

//   // Calculate totals (you can add tax and shipping logic here)
//   const subtotal = totalPrice
//   const shipping = subtotal >= 1000 ? 0 : 50 // Free shipping over ₹1000
//   const tax = Math.round(subtotal * 0.18) // 18% GST
//   const total = subtotal + shipping + tax

//   const handleFormSubmit = async (data: CheckoutData) => {
//     setCheckoutData(data)
//     setStep('payment')
//   }

//   const handlePayment = async () => {
//     setIsProcessing(true)
//     setStep('processing')

//     try {
//       // Create order on backend
//       const orderResponse = await fetch('/api/orders/create', {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify({
//           items,
//           checkoutData,
//           subtotal,
//           shipping,
//           tax,
//           total,
//         }),
//       })

//       const order = await orderResponse.json()

//       if (!orderResponse.ok) {
//         throw new Error(order.error || 'Failed to create order')
//       }

//       // Initialize payment based on selected method
//       if (checkoutData.paymentMethod === 'razorpay') {
//         await initiateRazorpayPayment(order)
//       } else if (checkoutData.paymentMethod === 'phonepe') {
//         await initiatePhonePePayment(order)
//       }
//     } catch (error) {
//       console.error('Payment error:', error)
//       alert(error instanceof Error ? error.message : 'Payment failed. Please try again.')
//       setStep('payment')
//     } finally {
//       setIsProcessing(false)
//     }
//   }

//   const initiateRazorpayPayment = async (order: any) => {
//     if (typeof window !== 'undefined' && (window as any).Razorpay) {
//       const options = {
//         key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
//         amount: total * 100, // Convert to paise
//         currency: 'INR',
//         name: 'Vintage Art & Decor',
//         description: `Order for ${totalItems} items`,
//         order_id: order.razorpayOrderId,
//         handler: async (response: any) => {
//           try {
//             // Verify payment on backend
//             const verifyResponse = await fetch('/api/payments/razorpay/verify', {
//               method: 'POST',
//               headers: {
//                 'Content-Type': 'application/json',
//               },
//               body: JSON.stringify({
//                 orderId: order.id,
//                 razorpay_order_id: response.razorpay_order_id,
//                 razorpay_payment_id: response.razorpay_payment_id,
//                 razorpay_signature: response.razorpay_signature,
//               }),
//             })

//             const result = await verifyResponse.json()

//             if (verifyResponse.ok) {
//               // Payment successful
//               router.push(`/order-confirmation/${order.id}`)
//             } else {
//               throw new Error(result.error || 'Payment verification failed')
//             }
//           } catch (error) {
//             console.error('Payment verification error:', error)
//             alert('Payment verification failed. Please contact support.')
//           }
//         },
//         prefill: {
//           name: `${checkoutData.firstName} ${checkoutData.lastName}`,
//           email: checkoutData.email,
//           contact: checkoutData.phone,
//         },
//         theme: {
//           color: '#2563eb',
//         },
//       }

//       const rzp = new (window as any).Razorpay(options)
//       rzp.open()
//     } else {
//       alert('Payment gateway not loaded. Please refresh and try again.')
//     }
//   }

//   const initiatePhonePePayment = async (order: any) => {
//     try {
//       // Redirect to PhonePe payment page
//       const phonePeResponse = await fetch('/api/payments/phonepe/initiate', {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify({
//           orderId: order.id,
//           amount: total,
//           customerInfo: {
//             name: `${checkoutData.firstName} ${checkoutData.lastName}`,
//             email: checkoutData.email,
//             phone: checkoutData.phone,
//           },
//         }),
//       })

//       const phonePeData = await phonePeResponse.json()

//       if (phonePeResponse.ok && phonePeData.redirectUrl) {
//         window.location.href = phonePeData.redirectUrl
//       } else {
//         throw new Error(phonePeData.error || 'Failed to initiate PhonePe payment')
//       }
//     } catch (error) {
//       console.error('PhonePe payment error:', error)
//       alert(error instanceof Error ? error.message : 'PhonePe payment failed')
//     }
//   }

//   if (isLoading) {
//     return (
//       <div className="min-h-screen bg-gray-50">
//         <div className="container mx-auto px-4 py-8">
//           <div className="flex items-center justify-center py-20">
//             <div className="text-center">
//               <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
//               <p className="text-gray-600">Loading checkout...</p>
//             </div>
//           </div>
//         </div>
//       </div>
//     )
//   }

//   if (items.length === 0) {
//     return (
//       <div className="min-h-screen bg-gray-50">
//         <div className="container mx-auto px-4 py-8">
//           <div className="bg-white rounded-lg shadow-sm p-12 text-center">
//             <ShoppingBag className="w-16 h-16 text-gray-300 mx-auto mb-6" />
//             <h2 className="text-2xl font-semibold text-gray-900 mb-4">Your cart is empty</h2>
//             <p className="text-gray-600 mb-8">Add some items to proceed with checkout</p>
//             <Link
//               href="/shop"
//               className="inline-flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors"
//             >
//               <ShoppingBag className="w-5 h-5" />
//               Start Shopping
//             </Link>
//           </div>
//         </div>
//       </div>
//     )
//   }

//   return (
//     <>
//       {/* Load Razorpay script */}
//       <script src="https://checkout.razorpay.com/v1/checkout.js" async />

//       <div className="min-h-screen bg-gray-50">
//         <div className="container mx-auto px-4 py-8">
//           {/* Header */}
//           <div className="flex items-center gap-4 mb-8">
//             <Link
//               href="/cart"
//               className="flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium"
//             >
//               <ArrowLeft className="w-4 h-4" />
//               Back to Cart
//             </Link>
//             <div className="h-6 w-px bg-gray-300"></div>
//             <h1 className="text-3xl font-bold text-gray-900">Checkout</h1>
//           </div>

//           {/* Progress Steps */}
//           <div className="mb-8">
//             <div className="flex items-center">
//               <div
//                 className={`flex items-center ${step === 'details' ? 'text-blue-600' : step === 'payment' || step === 'processing' ? 'text-green-600' : 'text-gray-400'}`}
//               >
//                 <div
//                   className={`w-8 h-8 rounded-full border-2 flex items-center justify-center text-sm font-medium ${step === 'details' ? 'border-blue-600' : step === 'payment' || step === 'processing' ? 'border-green-600 bg-green-600 text-white' : 'border-gray-300'}`}
//                 >
//                   1
//                 </div>
//                 <span className="ml-2 font-medium">Details</span>
//               </div>
//               <div
//                 className={`flex-1 h-px mx-4 ${step === 'payment' || step === 'processing' ? 'bg-green-600' : 'bg-gray-300'}`}
//               ></div>
//               <div
//                 className={`flex items-center ${step === 'payment' ? 'text-blue-600' : step === 'processing' ? 'text-green-600' : 'text-gray-400'}`}
//               >
//                 <div
//                   className={`w-8 h-8 rounded-full border-2 flex items-center justify-center text-sm font-medium ${step === 'payment' ? 'border-blue-600' : step === 'processing' ? 'border-green-600 bg-green-600 text-white' : 'border-gray-300'}`}
//                 >
//                   2
//                 </div>
//                 <span className="ml-2 font-medium">Payment</span>
//               </div>
//             </div>
//           </div>

//           {step === 'details' && (
//             <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
//               <div className="lg:col-span-2">
//                 <CheckoutForm initialData={checkoutData} onSubmit={handleFormSubmit} />
//               </div>
//               <div className="lg:col-span-1">
//                 <OrderSummary
//                   items={items}
//                   subtotal={subtotal}
//                   shipping={shipping}
//                   tax={tax}
//                   total={total}
//                 />
//               </div>
//             </div>
//           )}

//           {step === 'payment' && (
//             <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
//               <div className="lg:col-span-2">
//                 <div className="bg-white rounded-lg shadow-sm p-6">
//                   <h2 className="text-xl font-semibold text-gray-900 mb-6">Payment Method</h2>

//                   <div className="space-y-4 mb-6">
//                     <label className="flex items-center space-x-3 cursor-pointer">
//                       <input
//                         type="radio"
//                         name="paymentMethod"
//                         value="razorpay"
//                         checked={checkoutData.paymentMethod === 'razorpay'}
//                         onChange={(e) =>
//                           setCheckoutData((prev) => ({
//                             ...prev,
//                             paymentMethod: e.target.value as 'razorpay',
//                           }))
//                         }
//                         className="w-4 h-4 text-blue-600"
//                       />
//                       <div className="flex items-center space-x-2">
//                         <CreditCard className="w-5 h-5 text-blue-600" />
//                         <span className="font-medium">Razorpay</span>
//                         <span className="text-sm text-gray-500">(Cards, UPI, Wallets)</span>
//                       </div>
//                     </label>

//                     <label className="flex items-center space-x-3 cursor-pointer">
//                       <input
//                         type="radio"
//                         name="paymentMethod"
//                         value="phonepe"
//                         checked={checkoutData.paymentMethod === 'phonepe'}
//                         onChange={(e) =>
//                           setCheckoutData((prev) => ({
//                             ...prev,
//                             paymentMethod: e.target.value as 'phonepe',
//                           }))
//                         }
//                         className="w-4 h-4 text-blue-600"
//                       />
//                       <div className="flex items-center space-x-2">
//                         <CreditCard className="w-5 h-5 text-purple-600" />
//                         <span className="font-medium">PhonePe</span>
//                         <span className="text-sm text-gray-500">(UPI, Cards, Wallets)</span>
//                       </div>
//                     </label>
//                   </div>

//                   <div className="flex gap-4">
//                     <button
//                       onClick={() => setStep('details')}
//                       className="px-6 py-3 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors"
//                     >
//                       Back to Details
//                     </button>
//                     <button
//                       onClick={handlePayment}
//                       disabled={isProcessing}
//                       className="flex-1 bg-blue-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-blue-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
//                     >
//                       {isProcessing ? 'Processing...' : `Pay ${formatPrice(total)}`}
//                     </button>
//                   </div>
//                 </div>
//               </div>
//               <div className="lg:col-span-1">
//                 <OrderSummary
//                   items={items}
//                   subtotal={subtotal}
//                   shipping={shipping}
//                   tax={tax}
//                   total={total}
//                 />
//               </div>
//             </div>
//           )}

//           {step === 'processing' && (
//             <div className="bg-white rounded-lg shadow-sm p-12 text-center">
//               <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-6"></div>
//               <h2 className="text-2xl font-semibold text-gray-900 mb-4">
//                 Processing your payment...
//               </h2>
//               <p className="text-gray-600">
//                 Please wait while we process your payment. Do not refresh this page.
//               </p>
//             </div>
//           )}
//         </div>
//       </div>
//     </>
//   )
// }
