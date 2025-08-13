// // src/app/api/payment/phonepe/callback/route.ts
// import { NextRequest, NextResponse } from 'next/server'
// import { getPayload } from 'payload'
// import config from '@/payload.config'
// import crypto from 'crypto'

// export async function POST(request: NextRequest) {
//   try {
//     const body = await request.json()
//     const { response } = body

//     // Decode and verify PhonePe response
//     const base64Response = Buffer.from(response, 'base64').toString('utf-8')
//     const responseData = JSON.parse(base64Response)

//     // Verify checksum (implement based on PhonePe documentation)
//     const receivedChecksum = request.headers.get('X-VERIFY')
//     const expectedChecksum = crypto
//       .createHash('sha256')
//       .update(response + '/pg/v1/status/' + responseData.data.merchantId + '/' + responseData.data.merchantTransactionId + process.env.PHONEPE_SALT_KEY)
//       .digest('hex') + '###' + process.env.PHONEPE_SALT_INDEX

//     if (receivedChecksum !== expectedChecksum) {
//       return NextResponse.json(
//         { error: 'Invalid checksum' },
//         { status: 400 }
//       )
//     }

//     const payload = await getPayload({ config })
//     const transactionId = responseData.data.merchantTransactionId

//     // Find order by transaction ID
//     const orders = await payload.find({
//       collection: 'orders',
//       where: {
//         'paymentInfo.paymentId': {
//           equals: transactionId,
//         },
//       },
//     })

//     if (orders.docs.length === 0) {
//       return NextResponse.json(
//         { error: 'Order not found' },
//         { status: 404 }
//       )
//     }

//     const order = orders.docs[0]

//     // Update order based on payment status
//     const updateData: any = {
//       paymentInfo: {
//         paymentMethod: 'phonepe',
//         paymentId: transactionId,
//         paymentDetails: responseData,
//       },
//     }

//     if (responseData.success && responseData.data.state === 'COMPLETED') {
//       updateData.paymentStatus = 'paid'
//       updateData.status = 'processing'
//     } else {
//       updateData.paymentStatus = 'failed'
//     }

//     await payload.update({
//       collection: 'orders',
//       id: order.id,
//       data: updateData,
//     })

//     return NextResponse.json({
//       success: true,
//       message: 'Payment status updated',
//     })
//   } catch (error) {
//     console.error('PhonePe callback error:', error)
//     return NextResponse.json(
//       { error: 'Callback processing failed' },
//       { status: 500 }
//     )
//   }
// }

// // src/utils/payment.ts
// export const initializeRazorpay = (options: any, orderId: string) => {
//   return new Promise((resolve) => {
//     const script = document.createElement('script')
//     script.src = 'https://checkout.razorpay.com/v1/checkout.js'
//     script.onload = () => {
//       const razorpay = new (window as any).Razorpay({
//         ...options,
//         handler: async function (response: any) {
//           try {
//             // Verify payment
//             const verifyResponse = await fetch('/api/payment/razorpay/verify', {
//               method: 'POST',
//               headers: {
//                 'Content-Type': 'application/json',
//               },
//               body: JSON.stringify({
//                 ...response,
//                 orderId,
//               }),
//             })

//             if (verifyResponse.ok) {
//               window.location.href = `/order-confirmation/${orderId}?payment=success`
//             } else {
//               window.location.href = `/order-confirmation/${orderId}?payment=failed`
//             }
//           } catch (error) {
//             console.error('Payment verification failed:', error)
//             window.location.href = `/order-confirmation/${orderId}?payment=failed`
//           }
//         },
//         modal: {
//           ondismiss: function() {
//             window.location.href = `/order-confirmation/${orderId}?payment=cancelled`
//           }
//         }
//       })
//       razorpay.open()
//       resolve(razorpay)
//     }
//     document.body.appendChild(script)
//   })
// }

// // src/components/PaymentStatus.tsx
// 'use client'

// import React, { useEffect } from 'react'
// import { useSearchParams } from 'next/navigation'
// import { CheckCircle, XCircle, AlertCircle } from 'lucide-react'

// interface PaymentStatusProps {
//   orderId: string
// }

// export const PaymentStatus: React.FC<PaymentStatusProps> = ({ orderId }) => {
//   const searchParams = useSearchParams()
//   const paymentStatus = searchParams?.get('payment')

//   useEffect(() => {
//     // Clear cart from localStorage on successful payment
//     if (paymentStatus === 'success') {
//       localStorage.removeItem('cart')
//     }
//   }, [paymentStatus])

//   if (paymentStatus === 'success') {
//     return (
//       <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
//         <div className="flex items-center gap-3">
//           <CheckCircle className="w-6 h-6 text-green-600" />
//           <div>
//             <h3 className="font-semibold text-green-800">Payment Successful</h3>
//             <p className="text-green-700">Your payment has been processed successfully.</p>
//           </div>
//         </div>
//       </div>
//     )
//   }

//   if (paymentStatus === 'failed') {
//     return (
//       <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
//         <div className="flex items-center gap-3">
//           <XCircle className="w-6 h-6 text-red-600" />
//           <div>
//             <h3 className="font-semibold text-red-800">Payment Failed</h3>
//             <p className="text-red-700">There was an issue processing your payment. Please try again or contact support.</p>
//           </div>
//         </div>
//       </div>
//     )
//   }

//   if (paymentStatus === 'cancelled') {
//     return (
//       <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
//         <div className="flex items-center gap-3">
//           <AlertCircle className="w-6 h-6 text-yellow-600" />
//           <div>
//             <h3 className="font-semibold text-yellow-800">Payment Cancelled</h3>
//             <p className="text-yellow-700">You cancelled the payment. You can try again or contact support if you need help.</p>
//           </div>
//         </div>
//       </div>
//     )
//   }

//   return null
// }