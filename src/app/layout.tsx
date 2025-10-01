import Wide from '@/components/Containers/Wide'
import Footer from '@/components/Footer/Footer'
import Header from '@/components/Header/Header'
import { Metadata } from 'next'
import { Open_Sans, Russo_One } from "next/font/google"
import "./globals.css"
import "./themes.css"

const russoOne = Russo_One({
  weight: "400",
  variable: "--font-russo-one",
  subsets: ["latin"],
})

const openSans = Open_Sans({
  variable: "--font-open-sans",
  subsets: ["latin"],
})

export const metadata: Metadata = {
  metadataBase: new URL('https://military-focus.vercel.app'),
  title: 'СВО: новости, аналитика и хроника специальной военной операции 2025',
  description: 'Следите за хроникой событий СВО от непосредственного участника! Новости, аналитика и личный опыт — только проверенная информация из первых рук.',
  keywords: 'СВО, новости, аналитика, хроника, специальная военная операция, военные новости 2025, события на фронте',
  openGraph: {
    type: 'website',
    locale: 'ru_RU',
    url: 'https://military-focus.vercel.app',
    siteName: 'СВО Новости',
    title: 'СВО: новости, аналитика и хроника специальной военной операции 2025',
    description: 'Следите за хроникой событий СВО от непосредственного участника! Новости, аналитика и личный опыт — только проверенная информация из первых рук.',
    images: [
      {
        url: '/banner.jpg',
        width: 1200,
        height: 600,
        alt: 'СВО Новости',
      }
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'СВО: новости, аналитика и хроника специальной военной операции 2025',
    description: 'Следите за хроникой событий СВО от непосредственного участника!',
    images: ['/banner.jpg'],
  }
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="ru">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no" />
      </head>
      <body
        className={`${russoOne.variable} ${openSans.variable} antialiased`}
      >
        <Wide>
          <Header />
          {children}
          <Footer />
        </Wide>
      </body>
    </html>
  )
}
