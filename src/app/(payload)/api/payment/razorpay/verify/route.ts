// // src/app/api/payment/razorpay/verify/route.ts
// import { NextRequest, NextResponse } from 'next/server'
// import { getPayload } from 'payload'
// import config from '@/payload.config'
// import crypto from 'crypto'

// export async function POST(request: NextRequest) {
//   try {
//     const { razorpay_order_id, razorpay_payment_id, razorpay_signature, orderId } =
//       await request.json()

//     // Verify signature
//     const body = razorpay_order_id + '|' + razorpay_payment_id
//     const expectedSignature = crypto
//       .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET!)
//       .update(body.toString())
//       .digest('hex')

//     if (expectedSignature !== razorpay_signature) {
//       return NextResponse.json({ error: 'Invalid signature' }, { status: 400 })
//     }

//     const payload = await getPayload({ config })

//     // Update order status
//     await payload.update({
//       collection: 'orders',
//       id: orderId,
//       data: {
//         paymentStatus: 'paid',
//         status: 'processing',
//         paymentInfo: {
//           paymentMethod: 'razorpay',
//           paymentId: razorpay_payment_id,
//           paymentDetails: {
//             razorpay_order_id,
//             razorpay_payment_id,
//             razorpay_signature,
//           },
//         },
//       },
//     })

//     return NextResponse.json({
//       success: true,
//       message: 'Payment verified successfully',
//     })
//   } catch (error) {
//     console.error('Payment verification error:', error)
//     return NextResponse.json({ error: 'Payment verification failed' }, { status: 500 })
//   }
// }
