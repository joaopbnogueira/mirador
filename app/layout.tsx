import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import I18nAppProvider from "@/components/i18n-provider" // Import the provider

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Mirador Residence Aveiro",
  description: "Luxury 3-Bedroom Apartment in Aveiro",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
          <I18nAppProvider>
            {" "}
            {/* Wrap children with the i18n provider */}
            {children}
          </I18nAppProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
