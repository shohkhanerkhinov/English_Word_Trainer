import type { Metadata } from 'next'
import { GeistSans } from 'geist/font/sans'
import { GeistMono } from 'geist/font/mono'
import { Analytics } from '@vercel/analytics/next'
import './globals.css'

export const metadata: Metadata = {
  title: 'English Word Trainer',
  icons: {
    icon: '/icon.png',
    apple: '/icon.png',
    other: [
      {
        rel: 'mask-icon',
        url: '/icon.png',
        color: '#000000',
      },
    ],
  },
  generator: 'shohjahon',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`font-sans ${GeistSans.variable} ${GeistMono.variable}`}>
        {children}
        <Analytics />
      </body>
    </html>
  )
}
