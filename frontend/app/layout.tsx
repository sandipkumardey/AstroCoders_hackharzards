import { Inter } from "next/font/google"
import Link from "next/link"
import { ThemeProvider } from "@/components/theme-provider"

import "./globals.css"
import { Suspense } from "react"

const inter = Inter({ subsets: ["latin"] })

export const metadata = {
  title: "BlockTix - Blockchain Event Ticketing Platform",
  description: "Secure event tickets with blockchain technology",
    generator: 'v0.dev'
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className} suppressHydrationWarning>
        <ThemeProvider attribute="class" defaultTheme="light">
          <div className="flex flex-col min-h-screen">
            <Suspense fallback={<div>Loading...</div>}>
              <main className="flex-1">{children}</main>
            </Suspense>
            <footer className="border-t py-6 md:py-10">
              <div className="container flex flex-col items-center justify-between gap-4 md:flex-row">
                <div className="flex flex-col items-center gap-4 md:items-start">
                  <Link href="/" className="flex items-center gap-2 font-bold text-xl">
                    <span className="text-purple-600">Block</span>
                    <span>Tix</span>
                  </Link>
                  <p className="text-center text-sm text-muted-foreground md:text-left">
                    &copy; 2024 BlockTix. All rights reserved.
                  </p>
                </div>
                <div className="flex gap-4">
                  <Link href="/terms" className="text-sm text-muted-foreground underline underline-offset-4">
                    Terms
                  </Link>
                  <Link href="/privacy" className="text-sm text-muted-foreground underline underline-offset-4">
                    Privacy
                  </Link>
                  <Link href="/contact" className="text-sm text-muted-foreground underline underline-offset-4">
                    Contact
                  </Link>
                </div>
              </div>
            </footer>
          </div>
        </ThemeProvider>
      </body>
    </html>
  )
}
