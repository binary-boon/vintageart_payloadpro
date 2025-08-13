// src/app/(payload)/api/checkout/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@/payload.config'

export async function POST(request: NextRequest) {
  try {
    const payload = await getPayload({ config })
    const orderData = await request.json()

    // Generate order number
    const timestamp = Date.now()
    const random = Math.floor(Math.random() * 1000)
    const orderNumber = `ORD-${timestamp}-${random.toString().padStart(3, '0')}`

    // Create order in database
    const order = await payload.create({
      collection: 'orders',
      data: {
        orderNumber,
        customerInfo: {
          customerName: orderData.customerInfo.fullName,
          customerEmail: orderData.customerInfo.email,
          customerPhone: orderData.customerInfo.phone,
        },
        shippingAddress: orderData.shippingAddress,
        billingAddress: orderData.billingAddress,
        items: orderData.items,
        pricing: orderData.pricing,
        paymentInfo: {
          paymentMethod: orderData.paymentMethod,
        },
        customerNotes: orderData.customerNotes,
        status: 'pending',
        paymentStatus: orderData.paymentMethod === 'cod' ? 'pending' : 'pending',
      },
    })

    if (orderData.paymentMethod === 'cod') {
      // For COD, just return success
      return NextResponse.json({
        success: true,
        orderId: order.id,
        orderNumber: order.orderNumber,
        message: 'Order created successfully',
      })
    } else {
      // For online payments, return order details for payment processing
      // This is where you'll integrate payment gateways later
      return NextResponse.json({
        success: true,
        orderId: order.id,
        orderNumber: order.orderNumber,
        message: 'Order created, redirect to payment',
        // When you add payment gateways, include payment data here
        requiresPayment: true,
        paymentMethod: orderData.paymentMethod,
      })
    }
  } catch (error) {
    console.error('Checkout error:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to process order',
        message: error instanceof Error ? error.message : 'Unknown error occurred',
      },
      { status: 500 },
    )
  }
}

// // src/app/api/checkout/route.ts
// import { NextRequest, NextResponse } from 'next/server'
// import { getPayload } from 'payload'
// import config from '@/payload.config'
// import crypto from 'crypto'

// // Razorpay integration
// const Razorpay = require('razorpay')

// const razorpay = new Razorpay({
//   key_id: process.env.RAZORPAY_KEY_ID,
//   key_secret: process.env.RAZORPAY_KEY_SECRET,
// })

// // PhonePe configuration
// const PHONEPE_MERCHANT_ID = process.env.PHONEPE_MERCHANT_ID
// const PHONEPE_SALT_KEY = process.env.PHONEPE_SALT_KEY
// const PHONEPE_SALT_INDEX = process.env.PHONEPE_SALT_INDEX || '1'
// const PHONEPE_BASE_URL =
//   process.env.NODE_ENV === 'production'
//     ? 'https://api.phonepe.com/apis/hermes/pg/v1'
//     : 'https://api-preprod.phonepe.com/apis/hermes/pg/v1'

// export async function POST(request: NextRequest) {
//   try {
//     const payload = await getPayload({ config })
//     const orderData = await request.json()

//     // Create order in database
//     const order = await payload.create({
//       collection: 'orders',
//       data: {
//         customerInfo: orderData.customerInfo,
//         shippingAddress: orderData.shippingAddress,
//         billingAddress: orderData.billingAddress,
//         items: orderData.items,
//         pricing: orderData.pricing,
//         paymentInfo: {
//           paymentMethod: orderData.paymentMethod,
//         },
//         notes: {
//           customerNotes: orderData.customerNotes,
//         },
//         status: 'pending',
//         paymentStatus: 'pending',
//       },
//     })

//     const orderId = order.id
//     const amount = Math.round(orderData.pricing.totalAmount * 100) // Convert to paise

//     if (orderData.paymentMethod === 'cod') {
//       // For COD, just return success
//       return NextResponse.json({
//         success: true,
//         orderId,
//         message: 'Order created successfully',
//       })
//     } else if (orderData.paymentMethod === 'razorpay') {
//       // Create Razorpay order
//       const razorpayOrder = await razorpay.orders.create({
//         amount,
//         currency: 'INR',
//         receipt: `order_${orderId}`,
//         notes: {
//           orderId,
//           customerEmail: orderData.customerInfo.email,
//         },
//       })

//       // Update order with payment ID
//       await payload.update({
//         collection: 'orders',
//         id: orderId,
//         data: {
//           paymentInfo: {
//             paymentMethod: 'razorpay',
//             paymentId: razorpayOrder.id,
//           },
//         },
//       })

//       return NextResponse.json({
//         success: true,
//         orderId,
//         paymentData: {
//           razorpayOrderId: razorpayOrder.id,
//           amount,
//           currency: 'INR',
//           name: 'Vintage Art & Decor',
//           description: `Order #${order.orderNumber}`,
//           prefill: {
//             name: orderData.customerInfo.fullName,
//             email: orderData.customerInfo.email,
//             contact: orderData.customerInfo.phone,
//           },
//         },
//       })
//     } else if (orderData.paymentMethod === 'phonepe') {
//       // Create PhonePe payment
//       const transactionId = `T${Date.now()}`
//       const redirectUrl = `${process.env.NEXT_PUBLIC_APP_URL}/payment/callback`
//       const callbackUrl = `${process.env.NEXT_PUBLIC_APP_URL}/api/payment/phonepe/callback`

//       const paymentData = {
//         merchantId: PHONEPE_MERCHANT_ID,
//         merchantTransactionId: transactionId,
//         merchantUserId: `USER_${orderId}`,
//         amount,
//         redirectUrl,
//         redirectMode: 'REDIRECT',
//         callbackUrl,
//         paymentInstrument: {
//           type: 'PAY_PAGE',
//         },
//       }

//       const base64Data = Buffer.from(JSON.stringify(paymentData)).toString('base64')
//       const checksum =
//         crypto
//           .createHash('sha256')
//           .update(base64Data + '/pg/v1/pay' + PHONEPE_SALT_KEY)
//           .digest('hex') +
//         '###' +
//         PHONEPE_SALT_INDEX

//       // Update order with transaction ID
//       await payload.update({
//         collection: 'orders',
//         id: orderId,
//         data: {
//           paymentInfo: {
//             paymentMethod: 'phonepe',
//             paymentId: transactionId,
//           },
//         },
//       })

//       return NextResponse.json({
//         success: true,
//         orderId,
//         paymentUrl: `${PHONEPE_BASE_URL}/pay`,
//         paymentData: {
//           request: base64Data,
//           checksum,
//         },
//       })
//     }

//     throw new Error('Invalid payment method')
//   } catch (error) {
//     console.error('Checkout error:', error)
//     return NextResponse.json({ error: 'Failed to process order' }, { status: 500 })
//   }
// }
