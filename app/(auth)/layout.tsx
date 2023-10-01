import React from 'react'

export const metadata = {
  title: 'Authentication',
}

const Layout = ({
  children
}: {
  children: React.ReactNode
}) => {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}

export default Layout