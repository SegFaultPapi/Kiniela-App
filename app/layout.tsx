import type { Metadata } from 'next'
import { GeistSans } from 'geist/font/sans'
import { GeistMono } from 'geist/font/mono'
import { Analytics } from '@vercel/analytics/next'
import { FarcasterProvider } from '@/components/farcaster-provider'
import './globals.css'

export const metadata: Metadata = {
  title: 'Kiniela - Prediction Markets',
  description: 'Plataforma de mercados de predicción en Base Network',
  generator: 'Kiniela App',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`font-sans ${GeistSans.variable} ${GeistMono.variable}`}>
        <FarcasterProvider>
          {children}
        </FarcasterProvider>
        <Analytics />
      </body>
    </html>
  )
}
