// src/app/(frontend)/order-confirmation/[orderId]/page.tsx
import { getPayload } from 'payload'
import config from '@/payload.config'
import { notFound } from 'next/navigation'
import { OrderConfirmationClient } from './OrderConfirmationClient'

interface PageProps {
  params: {
    orderId: string
  }
}

export default async function OrderConfirmationPage({ params }: PageProps) {
  const { orderId } = params

  try {
    const payload = await getPayload({ config })

    const order = await payload.findByID({
      collection: 'orders',
      id: orderId,
    })

    if (!order) {
      notFound()
    }

    return <OrderConfirmationClient order={order} />
  } catch (error) {
    console.error('Error fetching order:', error)
    notFound()
  }
}

export async function generateMetadata({ params }: PageProps) {
  const { orderId } = params

  try {
    const payload = await getPayload({ config })
    const order = await payload.findByID({
      collection: 'orders',
      id: orderId,
    })

    return {
      title: `Order Confirmation - ${order.orderNumber}`,
      description: 'Your order has been received and is being processed.',
    }
  } catch {
    return {
      title: 'Order Confirmation',
      description: 'Order confirmation details',
    }
  }
}
