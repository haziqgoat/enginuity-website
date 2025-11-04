import type { Metadata } from 'next'
import { GeistSans } from 'geist/font/sans'
import { GeistMono } from 'geist/font/mono'
import { Analytics } from '@vercel/analytics/next'
import { Toaster } from '@/components/ui/toaster'
import { ChatBot } from '@/components/chatbot'
import { Navigation } from '@/components/navigation'
import './globals.css'

export const metadata: Metadata = {
  title: 'HNZ Consult Sdn Bhd',
  description: 'HNZ Consult Sdn Bhd - Engineering Solutions and Consultancy Services',
  generator: 'Next.js',
  icons: {
    icon: '/favicon.ico',
  },
}

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: 'cover',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`font-sans ${GeistSans.variable} ${GeistMono.variable}`}>
        <Navigation />
        {children}
        <ChatBot />
        <Toaster />
        <Analytics />
      </body>
    </html>
  )
}