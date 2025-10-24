import type { Metadata } from 'next'
import { GeistSans } from 'geist/font/sans'
import { GeistMono } from 'geist/font/mono'
import { Analytics } from '@vercel/analytics/next'
import { FarcasterProvider } from '@/components/farcaster-provider'
import './globals.css'

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: 'Kiniela - Prediction Markets',
    description: 'Plataforma de mercados de predicción en Base Network',
    generator: 'Kiniela App',
      other: {
      'fc:miniapp': JSON.stringify({
          version: 'next',
          imageUrl: 'https://your-app.com/embed-image',
          button: {
              title: `Launch Your App Name`,
              action: {
                  type: 'launch_miniapp',
                  name: 'Your App Name',
                  url: 'https://your-app.com',
                  splashImageUrl: 'https://your-app.com/splash-image',
                  splashBackgroundColor: '#000000',
              },
          },
      }),
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
        <FarcasterProvider>
          {children}
        </FarcasterProvider>
        <Analytics />
      </body>
    </html>
  )
}
