import React from 'react'
import '../styles/global.css'
import '../styles/prism.css'
// eslint-disable-next-line camelcase
import { Inter, Space_Grotesk } from 'next/font/google'
import type { Metadata } from 'next'
import { ClerkProvider } from '@clerk/nextjs'
import ThemeProvider from '../context/ThemeProvider'

export const metadata: Metadata = {
  title: 'devoverflow',
  description: 'A stackoverflow clone for developers',
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
