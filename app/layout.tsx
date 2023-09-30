import React from 'react'
import '../styles/global.css'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'devoverflow',
  description: 'A stackoverflow clone for developers',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
