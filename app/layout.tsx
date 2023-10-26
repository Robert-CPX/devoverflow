import React from 'react'
import '../styles/global.css'
import '../styles/prism.css'
// eslint-disable-next-line camelcase
import { Inter, Space_Grotesk } from 'next/font/google'
import type { Metadata } from 'next'
import { ClerkProvider } from '@clerk/nextjs'
import ThemeProvider from '../context/ThemeProvider'

export const metadata: Metadata = {
  title: {
    default: 'devoverflow',
    template: '%s | devoverflow',
  },
  description: 'A stackoverflow-like project made with 🔥',
  twitter: {
    card: 'summary_large_image',
    title: 'devoverflow',
    description: 'A stackoverflow-like project made with 🔥',
    creator: '@Robert-CPX',
    images: ['/assets/images/logo.png'],
  },
  openGraph: {
    title: 'devoverflow',
    description: 'A stackoverflow-like project made with 🔥',
    url: 'https://devstackoverflow.vercel.app/',
    siteName: 'devoverflow',
    images: [
      {
        url: '/assets/images/logo.png',
        width: 273,
        height: 46,
      }
    ],
    locale: 'en_US',
    type: 'website',
  },
}

const inter = Inter({
  subsets: ['latin'],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
  variable: '--font-inter',
})

const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  weight: ["300", "400", "500", "600", "700"],
  variable: '--font-spaceGrotesk',
})

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={`${inter.variable} ${spaceGrotesk.variable}`}>
      <body>
        <ThemeProvider>
          <ClerkProvider>
            {children}
          </ClerkProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
