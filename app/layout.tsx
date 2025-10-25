import type { Metadata } from 'next'
import { GeistSans } from 'geist/font/sans'
import { GeistMono } from 'geist/font/mono'
import { Analytics } from '@vercel/analytics/next'
import { Providers } from '@/lib/providers'
import './globals.css'

export async function generateMetadata(): Promise<Metadata> {
  const URL = process.env.NEXT_PUBLIC_URL || 'https://v0-kiniela-app.vercel.app';
  
  return {
    title: 'Kiniela - Prediction Markets',
    description: 'Plataforma de mercados de predicción en Base Network',
    generator: 'Kiniela App',
    other: {
      'fc:miniapp': JSON.stringify({
        version: '1',
        imageUrl: `${URL}/kiniela_logo.png`,
        button: {
          title: 'Launch Kiniela',
          action: {
            type: 'launch_miniapp',
            name: 'Kiniela',
            url: URL,
            splashImageUrl: `${URL}/splash.png`,
            splashBackgroundColor: '#000000',
          },
        },
      }),
      'base:manifest': `${URL}/.well-known/farcaster.json`,
    },
  };
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`font-sans ${GeistSans.variable} ${GeistMono.variable}`}>
        <Providers>
          {children}
        </Providers>
        <Analytics />
      </body>
    </html>
  )
}
