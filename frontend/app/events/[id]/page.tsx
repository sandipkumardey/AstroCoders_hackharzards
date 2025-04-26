"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { ArrowLeft, Calendar, Clock, Info, MapPin, Share2, Shield, Ticket } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { CheckoutModal } from "@/components/checkout-modal"

export default function EventPage({ params }) {
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false)

  // Mock event data - in a real app, this would be fetched from an API
  const event = {
    id: params.id,
    title: "Blockchain Summit 2024",
    date: "June 15, 2024",
    time: "9:00 AM - 6:00 PM",
    location: "Moscone Center, San Francisco, CA",
    price: "50 USDC",
    image: "/placeholder.svg?height=600&width=1200",
    description:
      "Join the world's leading blockchain experts for a day of insights, networking, and innovation. The Blockchain Summit 2024 brings together developers, entrepreneurs, investors, and enthusiasts to explore the latest trends and advancements in blockchain technology.",
    organizer: "Blockchain Foundation",
    ticketTypes: [
      {
        id: 1,
        name: "General Admission",
        price: "50 USDC",
        description: "Access to all keynotes and exhibition area",
        available: true,
      },
      {
        id: 2,
        name: "VIP Pass",
        price: "150 USDC",
        description: "Priority seating, exclusive networking session, and swag bag",
        available: true,
      },
      {
        id: 3,
        name: "Workshop Pass",
        price: "75 USDC",
        description: "General admission plus access to technical workshops",
        available: false,
      },
    ],
    resaleTickets: [
      {
        id: 101,
        type: "General Admission",
        price: "65 USDC",
        originalPrice: "50 USDC",
        seller: "0x1a2b...3c4d",
        available: true,
      },
      {
        id: 102,
        type: "VIP Pass",
        price: "180 USDC",
        originalPrice: "150 USDC",
        seller: "0x5e6f...7g8h",
        available: true,
      },
    ],
  }

  return (
    <div className="flex flex-col min-h-screen">
      <div className="relative h-[300px] md:h-[400px] w-full">
        <Image src={event.image || "/placeholder.svg"} alt={event.title} fill className="object-cover" />
        <div className="absolute inset-0 bg-black bg-opacity-50" />
        <div className="absolute top-4 left-4">
          <Button
            variant="outline"
            size="sm"
            asChild
            className="bg-black/50 border-white/20 text-white hover:bg-black/70"
          >
            <Link href="/events">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Events
            </Link>
          </Button>
        </div>
        <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
          <h1 className="text-3xl md:text-4xl font-bold">{event.title}</h1>
          <div className="flex flex-wrap gap-4 mt-2">
            <div className="flex items-center">
              <Calendar className="h-5 w-5 mr-2" />
              {event.date}
            </div>
            <div className="flex items-center">
              <Clock className="h-5 w-5 mr-2" />
              {event.time}
            </div>
            <div className="flex items-center">
              <MapPin className="h-5 w-5 mr-2" />
              {event.location}
            </div>
          </div>
        </div>
      </div>

      <div className="container px-4 md:px-6 mx-auto py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <Tabs defaultValue="details">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="details">Details</TabsTrigger>
                <TabsTrigger value="tickets">Tickets</TabsTrigger>
                <TabsTrigger value="resale">Resale Market</TabsTrigger>
              </TabsList>
              <TabsContent value="details" className="mt-6">
                <div className="space-y-6">
                  <div>
                    <h2 className="text-2xl font-bold mb-4">About This Event</h2>
                    <p className="text-gray-700">{event.description}</p>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold mb-2">Organizer</h3>
                    <p className="text-gray-700">{event.organizer}</p>
                  </div>
                  <div className="bg-purple-50 p-4 rounded-lg border border-purple-100">
                    <div className="flex items-start">
                      <Shield className="h-5 w-5 text-purple-600 mr-2 mt-0.5" />
                      <div>
                        <h4 className="font-bold text-purple-700">Blockchain-Secured Event</h4>
                        <p className="text-sm text-purple-700">
                          This event uses our secure blockchain ticketing system. All tickets are verified on-chain and
                          cannot be counterfeited.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </TabsContent>
              <TabsContent value="tickets" className="mt-6">
                <h2 className="text-2xl font-bold mb-4">Available Tickets</h2>
                <div className="space-y-4">
                  {event.ticketTypes.map((ticket) => (
                    <Card key={ticket.id} className={`border ${!ticket.available ? "border-gray-200 bg-gray-50" : ""}`}>
                      <CardContent className="p-4">
                        <div className="flex justify-between items-start">
                          <div>
                            <h3 className="font-bold text-lg">{ticket.name}</h3>
                            <p className="text-sm text-gray-500">{ticket.description}</p>
                          </div>
                          <div className="text-right">
                            <p className="font-bold text-purple-600">{ticket.price}</p>
                            {!ticket.available && (
                              <span className="text-xs bg-gray-200 text-gray-700 px-2 py-1 rounded">Sold Out</span>
                            )}
                          </div>
                        </div>
                        {ticket.available && (
                          <Button
                            className="w-full mt-4 bg-purple-600 hover:bg-purple-700"
                            onClick={() => setIsCheckoutOpen(true)}
                          >
                            Buy Ticket
                          </Button>
                        )}
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>
              <TabsContent value="resale" className="mt-6">
                <div className="space-y-6">
                  <div className="flex items-start space-x-2 bg-blue-50 p-4 rounded-lg border border-blue-100">
                    <Info className="h-5 w-5 text-blue-600 mt-0.5" />
                    <div>
                      <h4 className="font-bold text-blue-700">Secure Resale Market</h4>
                      <p className="text-sm text-blue-700">
                        All resale tickets are verified on the blockchain. When you purchase a resold ticket, the
                        original is automatically invalidated and you receive a new, valid ticket with a unique QR code.
                      </p>
                    </div>
                  </div>

                  <h2 className="text-2xl font-bold mb-4">Available Resale Tickets</h2>
                  <div className="space-y-4">
                    {event.resaleTickets.map((ticket) => (
                      <Card key={ticket.id} className="border">
                        <CardContent className="p-4">
                          <div className="flex justify-between items-start">
                            <div>
                              <h3 className="font-bold text-lg">{ticket.type}</h3>
                              <p className="text-sm text-gray-500">Seller: {ticket.seller}</p>
                            </div>
                            <div className="text-right">
                              <p className="font-bold text-purple-600">{ticket.price}</p>
                              <p className="text-xs text-gray-500 line-through">{ticket.originalPrice}</p>
                            </div>
                          </div>
                          <Button
                            className="w-full mt-4 bg-purple-600 hover:bg-purple-700"
                            onClick={() => setIsCheckoutOpen(true)}
                          >
                            Buy Resale Ticket
                          </Button>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </div>

          <div className="lg:col-span-1">
            <Card>
              <CardContent className="p-6">
                <h3 className="text-xl font-bold mb-4">Event Summary</h3>
                <div className="space-y-4">
                  <div className="flex justify-between">
                    <span className="text-gray-500">Date</span>
                    <span className="font-medium">{event.date}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Time</span>
                    <span className="font-medium">{event.time}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Location</span>
                    <span className="font-medium">{event.location}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-500">Starting at</span>
                    <span className="font-bold text-purple-600">{event.price}</span>
                  </div>
                  <Button className="w-full bg-purple-600 hover:bg-purple-700" onClick={() => setIsCheckoutOpen(true)}>
                    <Ticket className="mr-2 h-4 w-4" />
                    Get Tickets
                  </Button>
                  <Button variant="outline" className="w-full">
                    <Share2 className="mr-2 h-4 w-4" />
                    Share Event
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      <CheckoutModal isOpen={isCheckoutOpen} onClose={() => setIsCheckoutOpen(false)} event={event} />
    </div>
  )
}
