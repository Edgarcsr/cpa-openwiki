import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'

import { openwikiConfig } from '#content/openwiki.config'

import './globals.css'

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
})

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
})

export const metadata: Metadata = {
  title: {
    default: openwikiConfig.name,
    template: `%s | ${openwikiConfig.name}`,
  },
  description: openwikiConfig.description,
}

export default function RootLayout({ children }: LayoutProps<'/'>) {
  return (
    <html
      lang={openwikiConfig.locale}
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col">{children}</body>
    </html>
  )
}
