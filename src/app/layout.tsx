import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import Navigation from '@/components/Navigation'
import Footer from '@/components/Footer'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: `Finnegan's Open Mic: Open Mic in Hoboken, New Jersey`,
  description: `The homepage for the musicians' open mic at Finnegan's Pub in Hoboken, New Jersey. Every week Sundays at 7pm.`,
  keywords: [
    'open mic', 'open mics', 'hoboken', 'new jersey', 'bergen county', 'hudson county', 'live music',
  ],
  authors: [{ name: 'Darryl Joo' }],

}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.className} bg-dark-bg text-gray-100 min-h-screen flex flex-col`}>
        <Navigation />
        <main className="flex-grow">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  )
}