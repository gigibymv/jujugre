import type { Metadata } from 'next'
import { Geist, Newsreader } from 'next/font/google'
import './globals.css'
import { AppProviders } from './providers'

const geist = Geist({ subsets: ['latin'], variable: '--font-geist-sans' })
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

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body
        className={`${geist.variable} ${newsreader.variable} font-sans antialiased`}
      >
        <AppProviders>{children}</AppProviders>
      </body>
    </html>
  )
}
