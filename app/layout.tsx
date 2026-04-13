import type { Metadata, Viewport } from 'next'
import { Newsreader } from 'next/font/google'
import './globals.css'
import { AppProviders } from './providers'

const newsreader = Newsreader({
  subsets: ['latin'],
  variable: '--font-newsreader',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'Jujugre — GRE Tutor',
  description:
    'Personal GRE prep: 12-week study plan, error tracking, and rigorous quant coaching.',
  icons: {
    icon: [{ url: '/icon.svg', type: 'image/svg+xml' }],
  },
}

/** Lets iOS use env(safe-area-inset-*) so content clears the home indicator & toolbars. */
export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className="min-h-dvh bg-[#f9f8f3]">
      <body
        className={`${newsreader.variable} min-h-dvh bg-[#f9f8f3] font-sans antialiased`}
      >
        <AppProviders>{children}</AppProviders>
      </body>
    </html>
  )
}
