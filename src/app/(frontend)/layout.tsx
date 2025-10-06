import type { Metadata } from 'next'

import { cn } from '@/utilities/ui'
// Import Google Fonts
import { Aboreto } from 'next/font/google'
import { Montserrat } from 'next/font/google'
// Keep Geist Mono for code if needed
import { GeistMono } from 'geist/font/mono'
import React from 'react'
import Script from 'next/script'

import { AdminBar } from '@/components/AdminBar'
import { Footer } from '@/Footer/Component'
import { Header } from '@/Header/Component'
import { ClientWhatsAppWidget } from '@/components/WhatsAppWidget/ClientWidget'
import { Providers } from '@/providers'
import { InitTheme } from '@/providers/Theme/InitTheme'
import { mergeOpenGraph } from '@/utilities/mergeOpenGraph'
import { draftMode } from 'next/headers'

import './globals.css'
import { getServerSideURL } from '@/utilities/getURL'

// Configure Aboreto for headings
const aboreto = Aboreto({
  subsets: ['latin'],
  variable: '--font-aboreto',
  display: 'swap',
  weight: '400', // Aboreto only has one weight
})
const GTM_ID = 'GTM-NTN6BJNV' // replace if needed
// Configure Montserrat for body text and subheadings
const montserrat = Montserrat({
  subsets: ['latin'],
  variable: '--font-montserrat',
  display: 'swap',
  weight: ['300', '400', '500', '600', '700', '800'], // Multiple weights for flexibility
})

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const { isEnabled } = await draftMode()

  return (
    <html
      className={cn(aboreto.variable, montserrat.variable, GeistMono.variable)}
      lang="en"
      suppressHydrationWarning
    >
      <head>
        {/* Use next/script to inject the GTM inline script safely */}
        <Script
          id="gtm-inline-script"
          strategy="afterInteractive"
          // dangerouslySetInnerHTML is required for raw JS (the GTM snippet)
          dangerouslySetInnerHTML={{
            __html: `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
              new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
              j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
              'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
            })(window,document,'script','dataLayer','${GTM_ID}');`,
          }}
        />

        <InitTheme />
        <link href="/favicon.ico" rel="icon" sizes="32x32" />
        <link href="/favicon.svg" rel="icon" type="image/svg+xml" />
      </head>
      <body>
        {/* noscript iframe must be present for users without JS. Use dangerouslySetInnerHTML */}
        <noscript
          dangerouslySetInnerHTML={{
            __html: `<iframe src="https://www.googletagmanager.com/ns.html?id=${GTM_ID}" height="0" width="0" style="display:none;visibility:hidden"></iframe>`,
          }}
        />

        <Providers>
          <AdminBar
            adminBarProps={{
              preview: isEnabled,
            }}
          />

          <Header />
          {children}
          <Footer />

          {/* WhatsApp Widget - only show on frontend pages */}
          <ClientWhatsAppWidget />
        </Providers>
      </body>
    </html>
  )
}

export const metadata: Metadata = {
  metadataBase: new URL(getServerSideURL()),
  openGraph: mergeOpenGraph(),
  twitter: {
    card: 'summary_large_image',
    creator: '@payloadcms',
  },
}
