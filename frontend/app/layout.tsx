import { Inter } from "next/font/google"
import Link from "next/link"
import { Bell, Menu, Search, User } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ThemeProvider } from "@/components/theme-provider"

import "./globals.css"
import { Suspense } from "react"

const inter = Inter({ subsets: ["latin"] })

export const metadata = {
  title: "BlockTix - Blockchain Event Ticketing Platform",
  description: "Secure event tickets with blockchain technology",
    generator: 'v0.dev'
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="light">
          <div className="flex flex-col min-h-screen">
            <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
              <div className="container flex h-16 items-center">
                <Link href="/" className="flex items-center gap-2 font-bold text-xl">
                  <span className="text-purple-600">Block</span>
                  <span>Tix</span>
                </Link>
                <div className="hidden md:flex items-center gap-5 text-sm font-medium ml-10">
                  <Link href="/events" className="transition-colors hover:text-foreground/80">
                    Events
                  </Link>
                  <Link href="/resale" className="transition-colors hover:text-foreground/80">
                    Resale Market
                  </Link>
                  <Link href="/how-it-works" className="transition-colors hover:text-foreground/80">
                    How It Works
                  </Link>
                </div>
                <div className="flex items-center ml-auto gap-4">
                  <Suspense fallback={<div>Loading search...</div>}>
                    <form className="hidden md:flex items-center">
                      <div className="relative">
                        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                        <Input type="search" placeholder="Search events..." className="w-64 pl-8 bg-background" />
                      </div>
                    </form>
                  </Suspense>
                  <Button variant="ghost" size="icon" className="hidden md:flex">
                    <Bell className="h-5 w-5" />
                    <span className="sr-only">Notifications</span>
                  </Button>
                  <Button variant="ghost" size="icon" className="hidden md:flex">
                    <User className="h-5 w-5" />
                    <span className="sr-only">Account</span>
                  </Button>
                  <Button className="hidden md:flex bg-purple-600 hover:bg-purple-700">Connect Wallet</Button>
                  <Button variant="ghost" size="icon" className="md:hidden">
                    <Menu className="h-5 w-5" />
                    <span className="sr-only">Toggle menu</span>
                  </Button>
                </div>
              </div>
            </header>
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
