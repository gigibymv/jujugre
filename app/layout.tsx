import type { Metadata } from 'next'
import { Lexend, Newsreader } from 'next/font/google'
import './globals.css'
import { AppProviders } from './providers'

const lexend = Lexend({
  subsets: ['latin'],
  variable: '--font-lexend',
  display: 'swap',
})
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
        className={`${lexend.variable} ${newsreader.variable} font-sans antialiased`}
      >
        <AppProviders>{children}</AppProviders>
      </body>
    </html>
  )
}
