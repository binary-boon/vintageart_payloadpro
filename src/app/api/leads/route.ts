// src/app/(frontend)/api/leads/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { getPayloadHMR } from '@payloadcms/next/utilities'
import configPromise from '@payload-config'

export async function POST(request: NextRequest) {
  try {
    const payload = await getPayloadHMR({
      config: configPromise,
    })

    const body = await request.json()

    // Validate required fields
    const requiredFields = ['customerName', 'email', 'phone', 'products']
    for (const field of requiredFields) {
      if (!body[field]) {
        return NextResponse.json({ error: `Missing required field: ${field}` }, { status: 400 })
      }
    }

    // Validate products array
    if (!Array.isArray(body.products) || body.products.length === 0) {
      return NextResponse.json({ error: 'At least one product is required' }, { status: 400 })
    }

    // Create the lead in Payload CMS
    const lead = await payload.create({
      collection: 'leads',
      data: {
        customerName: body.customerName,
        email: body.email,
        phone: body.phone,
        company: body.company || '',
        address: {
          street: body.address?.street || '',
          city: body.address?.city || '',
          state: body.address?.state || '',
          postalCode: body.address?.postalCode || '',
          country: body.address?.country || 'India',
        },
        products: body.products.map((item: any) => ({
          product: item.product,
          quantity: item.quantity || 1,
          customRequirements: item.customRequirements || '',
        })),
        projectDetails: {
          projectType: body.projectDetails?.projectType || '',
          budget: body.projectDetails?.budget || '',
          timeline: body.projectDetails?.timeline || '',
          deliveryAddress: body.projectDetails?.deliveryAddress || '',
        },
        additionalRequirements: body.additionalRequirements || '',
        hearAboutUs: body.hearAboutUs || '',
        status: 'new',
        priority: 'medium',
      },
    })

    // Optional: Send notification email to admin
    // You can integrate with your preferred email service here
    try {
      await sendLeadNotificationEmail(lead)
    } catch (emailError) {
      console.error('Failed to send notification email:', emailError)
      // Don't fail the request if email fails
    }

    return NextResponse.json(
      {
        success: true,
        leadId: lead.id,
        message: 'Quote request submitted successfully',
      },
      { status: 201 },
    )
  } catch (error) {
    console.error('Error creating lead:', error)
    return NextResponse.json({ error: 'Failed to submit quote request' }, { status: 500 })
  }
}

// Optional: Function to send notification email
async function sendLeadNotificationEmail(lead: any) {
  // This is a placeholder for email integration
  // You can use services like:
  // - Nodemailer with SMTP
  // - SendGrid
  // - Resend
  // - Amazon SES

  const emailData = {
    to: process.env.ADMIN_EMAIL || 'admin@vintageart.com',
    subject: `New Quote Request from ${lead.customerName}`,
    html: `
      <h2>New Quote Request</h2>
      <p><strong>Customer:</strong> ${lead.customerName}</p>
      <p><strong>Email:</strong> ${lead.email}</p>
      <p><strong>Phone:</strong> ${lead.phone}</p>
      <p><strong>Company:</strong> ${lead.company || 'N/A'}</p>
      <p><strong>Products:</strong> ${lead.products?.length || 0} items</p>
      <p><strong>Project Type:</strong> ${lead.projectDetails?.projectType || 'N/A'}</p>
      <p><strong>Budget:</strong> ${lead.projectDetails?.budget || 'N/A'}</p>
      <p><strong>Timeline:</strong> ${lead.projectDetails?.timeline || 'N/A'}</p>
      
      <p><a href="${process.env.NEXT_PUBLIC_SERVER_URL}/admin/collections/leads/${lead.id}">View in Admin Panel</a></p>
    `,
  }

  // Implement your email sending logic here
  console.log('Email notification would be sent:', emailData)
}

export async function GET(request: NextRequest) {
  return NextResponse.json({ message: 'Use POST method to submit leads' }, { status: 405 })
}
