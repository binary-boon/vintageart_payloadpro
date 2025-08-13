import type { Metadata } from 'next'

import { cn } from '@/utilities/ui'
// Import Google Fonts
import { Aboreto } from 'next/font/google'
import { Montserrat } from 'next/font/google'
// Keep Geist Mono for code if needed
import { GeistMono } from 'geist/font/mono'
import React from 'react'

import { AdminBar } from '@/components/AdminBar'
import { Footer } from '@/Footer/Component'
import { Header } from '@/Header/Component'
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
        <InitTheme />
        <link href="/favicon.ico" rel="icon" sizes="32x32" />
        <link href="/favicon.svg" rel="icon" type="image/svg+xml" />
      </head>
      <body>
        <Providers>
          <AdminBar
            adminBarProps={{
              preview: isEnabled,
            }}
          />

          <Header />
          {children}
          <Footer />
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

// orignal code before new google font change setup -aboreto and monstserrat
//  import type { Metadata } from 'next'

// import { cn } from '@/utilities/ui'
// import { GeistMono } from 'geist/font/mono'
// import { GeistSans } from 'geist/font/sans'
// import React from 'react'

// import { AdminBar } from '@/components/AdminBar'
// import { Footer } from '@/Footer/Component'
// import { Header } from '@/Header/Component'
// import { Providers } from '@/providers'
// import { InitTheme } from '@/providers/Theme/InitTheme'
// import { mergeOpenGraph } from '@/utilities/mergeOpenGraph'
// import { draftMode } from 'next/headers'

// import './globals.css'
// import { getServerSideURL } from '@/utilities/getURL'

// export default async function RootLayout({ children }: { children: React.ReactNode }) {
//   const { isEnabled } = await draftMode()

//   return (
//     <html className={cn(GeistSans.variable, GeistMono.variable)} lang="en" suppressHydrationWarning>
//       <head>
//         <InitTheme />
//         <link href="/favicon.ico" rel="icon" sizes="32x32" />
//         <link href="/favicon.svg" rel="icon" type="image/svg+xml" />
//       </head>
//       <body>
//         <Providers>
//           <AdminBar
//             adminBarProps={{
//               preview: isEnabled,
//             }}
//           />

//           <Header />
//           {children}
//           <Footer />
//         </Providers>
//       </body>
//     </html>
//   )
// }

// export const metadata: Metadata = {
//   metadataBase: new URL(getServerSideURL()),
//   openGraph: mergeOpenGraph(),
//   twitter: {
//     card: 'summary_large_image',
//     creator: '@payloadcms',
//   },
// }
