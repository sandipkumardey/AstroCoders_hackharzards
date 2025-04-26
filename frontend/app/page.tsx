import Link from "next/link"
import Image from "next/image"
import { ArrowRight, Calendar, CheckCircle, Shield, Ticket, Wallet, Zap } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { FeaturedEvents } from "@/components/featured-events"
import { HowItWorks } from "@/components/how-it-works"
import { Testimonials } from "@/components/testimonials"
import { FAQ } from "@/components/faq"

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative w-full py-12 md:py-24 lg:py-32 xl:py-48 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-black to-purple-950 z-0">
          <div className="absolute inset-0 opacity-20 mix-blend-overlay">
            <Image
              src="/placeholder.svg?height=1080&width=1920"
              alt="Background"
              fill
              className="object-cover"
              priority
            />
          </div>
        </div>

        {/* Animated circles */}
        <div className="absolute top-1/4 right-1/4 w-64 h-64 bg-purple-600/30 rounded-full filter blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 left-1/3 w-96 h-96 bg-blue-600/20 rounded-full filter blur-3xl animate-pulse delay-700"></div>

        <div className="container px-4 md:px-6 mx-auto relative z-10">
          <div className="grid gap-6 lg:grid-cols-[1fr_400px] lg:gap-12 xl:grid-cols-[1fr_600px]">
            <div className="flex flex-col justify-center space-y-4">
              <div className="inline-flex items-center rounded-full border border-purple-200/30 bg-purple-900/20 px-3 py-1 text-sm text-purple-200 backdrop-blur-sm">
                <span className="mr-2 rounded-full bg-purple-500 px-1.5 py-0.5 text-xs text-white">New</span>
                <span>Secure reselling with blockchain technology</span>
              </div>
              <div className="space-y-2">
                <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none text-white">
                  The Future of{" "}
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-purple-600">
                    Event Ticketing
                  </span>{" "}
                  is Here
                </h1>
                <p className="max-w-[600px] text-gray-300 md:text-xl">
                  Buy, sell, and resell event tickets with confidence using our cross-chain payment system. No more
                  scams, no more worries.
                </p>
              </div>
              <div className="flex flex-col gap-2 min-[400px]:flex-row">
                <Button
                  asChild
                  size="lg"
                  className="bg-gradient-to-r from-purple-600 to-purple-800 hover:from-purple-700 hover:to-purple-900 border-0"
                >
                  <Link href="/events">
                    Explore Events <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
                <Button
                  asChild
                  variant="outline"
                  size="lg"
                  className="border-purple-500 text-purple-300 hover:bg-purple-900/20"
                >
                  <Link href="/how-it-works">How It Works</Link>
                </Button>
              </div>
              <div className="flex flex-wrap items-center gap-4 text-sm text-gray-400 mt-4">
                <div className="flex items-center space-x-1 bg-white/5 backdrop-blur-sm px-3 py-1 rounded-full">
                  <Ticket className="h-4 w-4 text-purple-400" />
                  <span>Secure Tickets</span>
                </div>
                <div className="flex items-center space-x-1 bg-white/5 backdrop-blur-sm px-3 py-1 rounded-full">
                  <Zap className="h-4 w-4 text-purple-400" />
                  <span>Cross-Chain Payments</span>
                </div>
                <div className="flex items-center space-x-1 bg-white/5 backdrop-blur-sm px-3 py-1 rounded-full">
                  <Calendar className="h-4 w-4 text-purple-400" />
                  <span>NFT Receipts</span>
                </div>
              </div>
            </div>
            <div className="relative lg:pl-6 mt-8 lg:mt-0">
              <div className="relative overflow-hidden rounded-xl border border-purple-500/20 bg-gradient-to-b from-purple-900/80 to-black/80 shadow-2xl backdrop-blur-sm">
                <div className="absolute inset-0 bg-grid-white/5 bg-[size:20px_20px] opacity-10"></div>
                <div className="p-6">
                  <div className="space-y-2 text-center">
                    <div className="inline-flex items-center rounded-full border border-purple-500/30 bg-purple-500/10 px-3 py-1 text-sm text-purple-300 backdrop-blur-sm mb-2">
                      <span className="animate-pulse mr-1 h-2 w-2 rounded-full bg-purple-400"></span>
                      Live Now
                    </div>
                    <h3 className="text-xl font-bold text-white">Blockchain Summit 2024</h3>
                    <p className="text-gray-300">San Francisco, CA • June 15, 2024</p>
                  </div>
                  <div className="mt-6 space-y-4">
                    <div className="flex justify-between">
                      <span className="text-gray-400">Date</span>
                      <span className="text-white">June 15, 2024</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Location</span>
                      <span className="text-white">Moscone Center</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Price</span>
                      <span className="text-white font-bold">50 USDC</span>
                    </div>
                    <div className="relative">
                      <div className="absolute -inset-0.5 bg-gradient-to-r from-purple-500 to-purple-700 rounded-lg blur opacity-30 group-hover:opacity-100 transition duration-1000 group-hover:duration-200 animate-pulse"></div>
                      <Button className="relative w-full bg-gradient-to-r from-purple-600 to-purple-800 hover:from-purple-700 hover:to-purple-900 border-0">
                        Buy Tickets
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
              <div className="absolute -bottom-6 -left-6 h-24 w-24 rounded-full bg-purple-600/40 blur-[50px]" />
              <div className="absolute -top-6 -right-6 h-24 w-24 rounded-full bg-blue-600/40 blur-[50px]" />
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="w-full py-12 md:py-16 bg-white">
        <div className="container px-4 md:px-6 mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div className="space-y-2">
              <h3 className="text-3xl md:text-4xl font-bold text-purple-600">10K+</h3>
              <p className="text-sm md:text-base text-gray-500">Events Hosted</p>
            </div>
            <div className="space-y-2">
              <h3 className="text-3xl md:text-4xl font-bold text-purple-600">50K+</h3>
              <p className="text-sm md:text-base text-gray-500">Tickets Sold</p>
            </div>
            <div className="space-y-2">
              <h3 className="text-3xl md:text-4xl font-bold text-purple-600">99.9%</h3>
              <p className="text-sm md:text-base text-gray-500">Secure Transactions</p>
            </div>
            <div className="space-y-2">
              <h3 className="text-3xl md:text-4xl font-bold text-purple-600">0%</h3>
              <p className="text-sm md:text-base text-gray-500">Fraud Rate</p>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="w-full py-12 md:py-24 bg-gray-50">
        <div className="container px-4 md:px-6 mx-auto">
          <div className="flex flex-col items-center justify-center space-y-4 text-center mb-12">
            <div className="inline-flex items-center rounded-full border border-purple-200 bg-purple-50 px-3 py-1 text-sm text-purple-600">
              <span>Why Choose BlockTix</span>
            </div>
            <div className="space-y-2">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">The BlockTix Advantage</h2>
              <p className="max-w-[900px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                Our blockchain-powered platform offers benefits that traditional ticketing can't match
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="bg-white border-purple-100 hover:shadow-lg transition-all duration-200 hover:-translate-y-1">
              <CardContent className="p-6">
                <div className="rounded-full w-12 h-12 bg-purple-100 flex items-center justify-center mb-4">
                  <Shield className="h-6 w-6 text-purple-600" />
                </div>
                <h3 className="text-xl font-bold mb-2">Fraud-Proof Reselling</h3>
                <p className="text-gray-500">
                  Our blockchain technology automatically invalidates original tickets when resold, eliminating fraud
                  and scams.
                </p>
                <ul className="mt-4 space-y-2">
                  <li className="flex items-start">
                    <CheckCircle className="mr-2 h-4 w-4 text-green-500 mt-0.5" />
                    <span className="text-sm">Automatic ticket validation</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="mr-2 h-4 w-4 text-green-500 mt-0.5" />
                    <span className="text-sm">New QR codes for buyers</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="mr-2 h-4 w-4 text-green-500 mt-0.5" />
                    <span className="text-sm">Transparent transaction history</span>
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card className="bg-white border-purple-100 hover:shadow-lg transition-all duration-200 hover:-translate-y-1">
              <CardContent className="p-6">
                <div className="rounded-full w-12 h-12 bg-purple-100 flex items-center justify-center mb-4">
                  <Wallet className="h-6 w-6 text-purple-600" />
                </div>
                <h3 className="text-xl font-bold mb-2">Cross-Chain Payments</h3>
                <p className="text-gray-500">
                  Pay with Stellar USDC while sellers receive Base-native tokens, creating a seamless experience across
                  blockchains.
                </p>
                <ul className="mt-4 space-y-2">
                  <li className="flex items-start">
                    <CheckCircle className="mr-2 h-4 w-4 text-green-500 mt-0.5" />
                    <span className="text-sm">Multiple payment options</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="mr-2 h-4 w-4 text-green-500 mt-0.5" />
                    <span className="text-sm">Automatic currency conversion</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="mr-2 h-4 w-4 text-green-500 mt-0.5" />
                    <span className="text-sm">Instant settlement</span>
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card className="bg-white border-purple-100 hover:shadow-lg transition-all duration-200 hover:-translate-y-1">
              <CardContent className="p-6">
                <div className="rounded-full w-12 h-12 bg-purple-100 flex items-center justify-center mb-4">
                  <Ticket className="h-6 w-6 text-purple-600" />
                </div>
                <h3 className="text-xl font-bold mb-2">NFT Receipts</h3>
                <p className="text-gray-500">
                  Receive digital collectibles as proof of purchase that can also unlock exclusive perks and
                  experiences.
                </p>
                <ul className="mt-4 space-y-2">
                  <li className="flex items-start">
                    <CheckCircle className="mr-2 h-4 w-4 text-green-500 mt-0.5" />
                    <span className="text-sm">Digital memorabilia</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="mr-2 h-4 w-4 text-green-500 mt-0.5" />
                    <span className="text-sm">Exclusive holder benefits</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="mr-2 h-4 w-4 text-green-500 mt-0.5" />
                    <span className="text-sm">Tradable on NFT marketplaces</span>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <HowItWorks />

      {/* Featured Events */}
      <FeaturedEvents />

      {/* Testimonials */}
      <Testimonials />

      {/* FAQ Section */}
      <FAQ />

      {/* CTA Section */}
      <section className="w-full py-12 md:py-24 bg-purple-900 relative overflow-hidden">
        <div className="absolute inset-0 bg-grid-white/5 bg-[size:20px_20px] opacity-10"></div>
        <div className="absolute -top-24 -right-24 h-64 w-64 rounded-full bg-purple-700/30 blur-3xl"></div>
        <div className="absolute -bottom-24 -left-24 h-64 w-64 rounded-full bg-purple-700/30 blur-3xl"></div>

        <div className="container px-4 md:px-6 mx-auto relative">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <div className="space-y-2">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl text-white">
                Ready to Experience the Future of Ticketing?
              </h2>
              <p className="max-w-[600px] text-purple-200 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                Join thousands of event-goers who have already made the switch to secure blockchain ticketing.
              </p>
            </div>
            <div className="flex flex-col gap-2 min-[400px]:flex-row mt-6">
              <Button asChild size="lg" className="bg-white text-purple-900 hover:bg-gray-100">
                <Link href="/events">
                  Browse Events <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="border-white text-white hover:bg-purple-800/20">
                <Link href="/how-it-works">Learn More</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
