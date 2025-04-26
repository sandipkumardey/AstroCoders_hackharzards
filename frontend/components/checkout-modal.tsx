"use client"

import { useState } from "react"
import { CheckCircle, CreditCard, Info, Loader2, QrCode, Wallet } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export function CheckoutModal({ isOpen, onClose, event }) {
  const [quantity, setQuantity] = useState("1")
  const [ticketType, setTicketType] = useState("General Admission")
  const [checkoutStep, setCheckoutStep] = useState("details")
  const [paymentMethod, setPaymentMethod] = useState("stellar")
  const [isProcessing, setIsProcessing] = useState(false)
  const [isComplete, setIsComplete] = useState(false)

  const handleProceedToPayment = () => {
    setCheckoutStep("payment")
  }

  const handleCompletePayment = () => {
    setIsProcessing(true)
    // Simulate payment processing
    setTimeout(() => {
      setIsProcessing(false)
      setIsComplete(true)
      setCheckoutStep("confirmation")
    }, 2000)
  }

  const handleClose = () => {
    if (isComplete) {
      // Reset state for next time
      setCheckoutStep("details")
      setIsComplete(false)
    }
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{isComplete ? "Purchase Complete" : "Purchase Tickets"}</DialogTitle>
          <DialogDescription>
            {isComplete ? "Your ticket has been secured on the blockchain." : `Secure your tickets for ${event.title}`}
          </DialogDescription>
        </DialogHeader>

        {checkoutStep === "details" && (
          <div className="space-y-6">
            <div>
              <h3 className="text-sm font-medium mb-2">Select Ticket Type</h3>
              <Select value={ticketType} onValueChange={setTicketType}>
                <SelectTrigger>
                  <SelectValue placeholder="Select ticket type" />
                </SelectTrigger>
                <SelectContent>
                  {event.ticketTypes
                    .filter((ticket) => ticket.available)
                    .map((ticket) => (
                      <SelectItem key={ticket.id} value={ticket.name}>
                        {ticket.name} - {ticket.price}
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <h3 className="text-sm font-medium mb-2">Quantity</h3>
              <Select value={quantity} onValueChange={setQuantity}>
                <SelectTrigger>
                  <SelectValue placeholder="Select quantity" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">1</SelectItem>
                  <SelectItem value="2">2</SelectItem>
                  <SelectItem value="3">3</SelectItem>
                  <SelectItem value="4">4</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="bg-gray-50 p-4 rounded-lg space-y-2">
              <div className="flex justify-between">
                <span>Ticket Price</span>
                <span>50 USDC × {quantity}</span>
              </div>
              <div className="flex justify-between">
                <span>Service Fee</span>
                <span>5 USDC × {quantity}</span>
              </div>
              <Separator className="my-2" />
              <div className="flex justify-between font-bold">
                <span>Total</span>
                <span>{(55 * Number.parseInt(quantity)).toFixed(2)} USDC</span>
              </div>
            </div>

            <div className="bg-purple-50 p-4 rounded-lg border border-purple-100">
              <div className="flex items-start">
                <Info className="h-5 w-5 text-purple-600 mr-2 mt-0.5" />
                <div>
                  <h4 className="font-bold text-purple-700">Blockchain-Secured Tickets</h4>
                  <p className="text-sm text-purple-700">
                    Your purchase will be secured on the blockchain, ensuring ticket authenticity and preventing fraud.
                  </p>
                </div>
              </div>
            </div>

            <Button className="w-full bg-purple-600 hover:bg-purple-700" onClick={handleProceedToPayment}>
              Proceed to Payment
            </Button>
          </div>
        )}

        {checkoutStep === "payment" && (
          <div className="space-y-6">
            <Tabs defaultValue="stellar" onValueChange={setPaymentMethod}>
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="stellar">Stellar USDC</TabsTrigger>
                <TabsTrigger value="card">Credit Card</TabsTrigger>
              </TabsList>
              <TabsContent value="stellar" className="space-y-4 mt-4">
                <div className="bg-blue-50 p-4 rounded-lg">
                  <div className="flex items-start">
                    <Wallet className="h-5 w-5 text-blue-600 mr-2 mt-0.5" />
                    <div>
                      <h4 className="font-bold text-blue-700">Pay with Stellar USDC</h4>
                      <p className="text-sm text-blue-700 mb-2">
                        Send exactly {(55 * Number.parseInt(quantity)).toFixed(2)} USDC to the address below or scan the
                        QR code.
                      </p>
                      <div className="bg-white p-4 rounded border border-blue-200 text-center">
                        <div className="mx-auto w-48 h-48 bg-gray-100 flex items-center justify-center mb-2">
                          <QrCode className="h-32 w-32 text-blue-900" />
                        </div>
                        <p className="text-xs font-mono break-all select-all">
                          GBCXYZABC123456789DEFGHIJKLMNOPQRSTUVWXYZ
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </TabsContent>
              <TabsContent value="card" className="space-y-4 mt-4">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <div className="flex items-start">
                    <CreditCard className="h-5 w-5 text-gray-600 mr-2 mt-0.5" />
                    <div>
                      <h4 className="font-bold">Pay with Credit Card</h4>
                      <p className="text-sm text-gray-700 mb-2">
                        We'll convert your payment to Stellar USDC automatically.
                      </p>
                      <div className="space-y-4">
                        <div>
                          <label className="text-sm font-medium">Card Number</label>
                          <input
                            type="text"
                            placeholder="1234 5678 9012 3456"
                            className="w-full p-2 border rounded-md mt-1"
                          />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="text-sm font-medium">Expiry Date</label>
                            <input type="text" placeholder="MM/YY" className="w-full p-2 border rounded-md mt-1" />
                          </div>
                          <div>
                            <label className="text-sm font-medium">CVC</label>
                            <input type="text" placeholder="123" className="w-full p-2 border rounded-md mt-1" />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </TabsContent>
            </Tabs>

            <div className="bg-gray-50 p-4 rounded-lg space-y-2">
              <div className="flex justify-between font-bold">
                <span>Total</span>
                <span>{(55 * Number.parseInt(quantity)).toFixed(2)} USDC</span>
              </div>
            </div>

            <Button
              className="w-full bg-purple-600 hover:bg-purple-700"
              onClick={handleCompletePayment}
              disabled={isProcessing}
            >
              {isProcessing ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Processing...
                </>
              ) : (
                `Complete Payment (${paymentMethod === "stellar" ? "Stellar USDC" : "Credit Card"})`
              )}
            </Button>
          </div>
        )}

        {checkoutStep === "confirmation" && (
          <div className="space-y-6 text-center">
            <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>

            <div>
              <h3 className="text-xl font-bold">Purchase Complete!</h3>
              <p className="text-gray-500 mt-1">Your ticket has been secured on the blockchain</p>
            </div>

            <div className="bg-gray-50 p-6 rounded-lg">
              <div className="mx-auto w-48 h-48 bg-white border flex items-center justify-center mb-4">
                <QrCode className="h-32 w-32" />
              </div>
              <p className="text-sm font-medium">Blockchain Ticket ID:</p>
              <p className="text-xs font-mono break-all select-all bg-gray-100 p-2 rounded">
                0x1a2b3c4d5e6f7g8h9i0j1k2l3m4n5o6p7q8r9s0t
              </p>
            </div>

            <div className="bg-blue-50 p-4 rounded-lg text-left">
              <div className="flex items-start">
                <Info className="h-5 w-5 text-blue-600 mr-2 mt-0.5" />
                <div>
                  <h4 className="font-bold text-blue-700">What happens next?</h4>
                  <ul className="text-sm text-blue-700 list-disc pl-5 mt-1 space-y-1">
                    <li>Your ticket is now secured on the blockchain</li>
                    <li>The seller will receive payment in Base-native tokens</li>
                    <li>You'll receive a confirmation email with your ticket details</li>
                    <li>Present this QR code at the event for entry</li>
                  </ul>
                </div>
              </div>
            </div>

            <Button className="w-full bg-purple-600 hover:bg-purple-700" onClick={handleClose}>
              Done
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}
