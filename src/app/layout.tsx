import Wide from '@/components/Containers/Wide'
import Footer from '@/components/Footer/Footer'
import Header from '@/components/Header/Header'
import type { Metadata } from "next"
import { Open_Sans, Russo_One } from "next/font/google"
import "./globals.css"

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
  title: "СВО: новости, аналитика и хроника специальной военной операции 2025",
  description: "Следите за хроникой событий СВО от непосредственного участника! Новости, аналитика и личный опыт — только проверенная информация из первых рук.",
  keywords: "СВО, новости, аналитика, хроника, специальная военная операция, военные новости 2025, события на фронте",
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: 'any' },
      { url: '/favicon.png', type: 'image/png' }
    ],
  },
  openGraph: {
    title: "СВО: новости, аналитика и хроника специальной военной операции 2025",
    description: "Следите за хроникой событий СВО от непосредственного участника! Новости, аналитика и личный опыт — только проверенная информация из первых рук.",
    images: ['/og-image.jpg'],
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="ru">
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
