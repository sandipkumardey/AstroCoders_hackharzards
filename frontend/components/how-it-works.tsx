import { CheckCircle, Shield, Ticket, Wallet } from "lucide-react"

export function HowItWorks() {
  return (
    <section className="w-full py-12 md:py-24 lg:py-32 bg-white">
      <div className="container px-4 md:px-6 mx-auto">
        <div className="flex flex-col items-center justify-center space-y-4 text-center mb-12">
          <div className="inline-flex items-center rounded-full border border-purple-200 bg-purple-50 px-3 py-1 text-sm text-purple-600">
            <span>Simple Process</span>
          </div>
          <div className="space-y-2">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">How It Works</h2>
            <p className="max-w-[900px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
              Our blockchain-powered platform ensures secure transactions and prevents ticket scams
            </p>
          </div>
        </div>

        <div className="relative">
          {/* Connection lines for desktop */}
          <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-gradient-to-r from-purple-200 via-purple-400 to-purple-200 hidden lg:block"></div>

          <div className="mx-auto grid max-w-5xl grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3 mt-12 relative">
            <div className="flex flex-col items-center space-y-4 rounded-lg border border-purple-100 bg-white p-6 shadow-sm relative z-10 hover:shadow-md transition-all">
              <div className="bg-purple-100 p-3 rounded-full">
                <Ticket className="h-8 w-8 text-purple-600" />
              </div>
              <span className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-purple-600 text-white text-xs font-bold px-2 py-1 rounded-full">
                Step 1
              </span>
              <h3 className="text-xl font-bold">Buy Tickets</h3>
              <p className="text-center text-gray-500">
                Purchase event tickets using Stellar USDC. Each ticket is backed by blockchain technology for
                authenticity.
              </p>
              <ul className="space-y-2 text-sm text-gray-500">
                <li className="flex items-center">
                  <CheckCircle className="mr-2 h-4 w-4 text-green-500" />
                  Pay with Stellar USDC
                </li>
                <li className="flex items-center">
                  <CheckCircle className="mr-2 h-4 w-4 text-green-500" />
                  Receive digital ticket with QR code
                </li>
                <li className="flex items-center">
                  <CheckCircle className="mr-2 h-4 w-4 text-green-500" />
                  Optional NFT receipt on Base
                </li>
              </ul>
            </div>

            <div className="flex flex-col items-center space-y-4 rounded-lg border border-purple-100 bg-white p-6 shadow-sm relative z-10 hover:shadow-md transition-all">
              <div className="bg-purple-100 p-3 rounded-full">
                <Wallet className="h-8 w-8 text-purple-600" />
              </div>
              <span className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-purple-600 text-white text-xs font-bold px-2 py-1 rounded-full">
                Step 2
              </span>
              <h3 className="text-xl font-bold">Sell Tickets</h3>
              <p className="text-center text-gray-500">
                Event organizers and resellers receive payments in Base-native tokens like USDC or ETH.
              </p>
              <ul className="space-y-2 text-sm text-gray-500">
                <li className="flex items-center">
                  <CheckCircle className="mr-2 h-4 w-4 text-green-500" />
                  Receive Base-native tokens
                </li>
                <li className="flex items-center">
                  <CheckCircle className="mr-2 h-4 w-4 text-green-500" />
                  Cross-chain payment processing
                </li>
                <li className="flex items-center">
                  <CheckCircle className="mr-2 h-4 w-4 text-green-500" />
                  Automatic settlement
                </li>
              </ul>
            </div>

            <div className="flex flex-col items-center space-y-4 rounded-lg border border-purple-100 bg-white p-6 shadow-sm relative z-10 hover:shadow-md transition-all">
              <div className="bg-purple-100 p-3 rounded-full">
                <Shield className="h-8 w-8 text-purple-600" />
              </div>
              <span className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-purple-600 text-white text-xs font-bold px-2 py-1 rounded-full">
                Step 3
              </span>
              <h3 className="text-xl font-bold">Secure Reselling</h3>
              <p className="text-center text-gray-500">
                Resell tickets safely through our platform. When a resold ticket is purchased, the original QR becomes
                invalid and a new one is issued.
              </p>
              <ul className="space-y-2 text-sm text-gray-500">
                <li className="flex items-center">
                  <CheckCircle className="mr-2 h-4 w-4 text-green-500" />
                  No scams or fraud
                </li>
                <li className="flex items-center">
                  <CheckCircle className="mr-2 h-4 w-4 text-green-500" />
                  Original ticket invalidated
                </li>
                <li className="flex items-center">
                  <CheckCircle className="mr-2 h-4 w-4 text-green-500" />
                  New QR code for buyer
                </li>
              </ul>
            </div>
          </div>
        </div>

        <div className="mt-16 flex justify-center">
          <div className="rounded-lg border border-purple-100 bg-white p-8 max-w-3xl shadow-sm">
            <h3 className="text-xl font-bold mb-6 text-center">Cross-Chain Payment Flow</h3>
            <div className="relative">
              {/* Connection line */}
              <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-gradient-to-r from-purple-200 via-purple-400 to-purple-200"></div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center relative">
                <div className="text-center p-6 bg-white rounded-lg shadow-sm border border-purple-100 relative z-10">
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-purple-600 text-white text-xs font-bold px-2 py-1 rounded-full">
                    Step 1
                  </div>
                  <div className="bg-purple-50 p-3 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-4">
                    <Ticket className="h-6 w-6 text-purple-600" />
                  </div>
                  <div className="font-bold mb-2">Buyer Checkout</div>
                  <div className="text-sm text-gray-500">Buyer selects tickets and proceeds to checkout</div>
                </div>

                <div className="text-center p-6 bg-white rounded-lg shadow-sm border border-purple-100 relative z-10">
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-purple-600 text-white text-xs font-bold px-2 py-1 rounded-full">
                    Step 2
                  </div>
                  <div className="bg-purple-50 p-3 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-4">
                    <Wallet className="h-6 w-6 text-purple-600" />
                  </div>
                  <div className="font-bold mb-2">Payment</div>
                  <div className="text-sm text-gray-500">Buyer sends Stellar USDC to complete purchase</div>
                </div>

                <div className="text-center p-6 bg-white rounded-lg shadow-sm border border-purple-100 relative z-10">
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-purple-600 text-white text-xs font-bold px-2 py-1 rounded-full">
                    Step 3
                  </div>
                  <div className="bg-purple-50 p-3 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-4">
                    <Shield className="h-6 w-6 text-purple-600" />
                  </div>
                  <div className="font-bold mb-2">Settlement</div>
                  <div className="text-sm text-gray-500">Seller receives Base tokens and buyer gets ticket</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
