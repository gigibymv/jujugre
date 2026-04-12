import type { Metadata } from 'next'
import { Geist } from 'next/font/google'
import './globals.css'
import { AppProviders } from './providers'

const geist = Geist({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Jujugre — GRE Tutor',
  description:
    'Personal GRE prep: 12-week study plan, error tracking, and rigorous quant coaching.',
  icons: {
    icon: [{ url: '/icon.svg', type: 'image/svg+xml' }],
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`font-sans antialiased ${geist.className}`}>
        <AppProviders>{children}</AppProviders>
      </body>
    </html>
  )
}
