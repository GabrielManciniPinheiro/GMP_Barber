import type { Metadata } from "next"
import localFont from "next/font/local"
import "./globals.css"
import { Toaster } from "sonner"
import Footer from "./_components/footer"
import AuthProvider from "./_providers/auth"

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
})
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
})

export const metadata: Metadata = {
  title: "GMP Barber",
  description:
    "GMP Barber is a cutting-edge web application designed to streamline the management of barber shops. With features like appointment scheduling, customer management, and inventory tracking, GMP Barber empowers barbershop owners to enhance their business operations and provide exceptional service to their clients.",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className="dark">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <AuthProvider>
          <div className="flex h-full flex-col">
            <div className="flex-1">{children}</div>
            <Footer />
          </div>
        </AuthProvider>
        <Toaster />
      </body>
    </html>
  )
}
