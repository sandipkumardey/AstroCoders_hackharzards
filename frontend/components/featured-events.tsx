"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { ArrowRight, Calendar, MapPin, X, Loader2, QrCode, Wallet, Ticket } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

// Event type for TypeScript
export type Event = {
  id: string;
  title: string;
  description: string;
  date: string;
  location: string;
  price: number;
  status: string;
  image: string;
  organizer: string;
  ticketsAvailable: number;
  resale?: boolean;
  originalPrice?: number;
  featured?: boolean;
  category?: string;
};

// Fetch mock events from API
async function fetchEvents(): Promise<Event[]> {
  const res = await fetch("/api/events");
  if (!res.ok) throw new Error("Failed to fetch events");
  const data = await res.json();
  return data.events;
}

export function FeaturedEvents() {
  const [activeTab, setActiveTab] = useState("all")
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [events, setEvents] = useState<Event[]>([])
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null)
  const [showBuyModal, setShowBuyModal] = useState(false)
  const [showResellModal, setShowResellModal] = useState(false)
  const [showQRModal, setShowQRModal] = useState(false)
  const [showWalletModal, setShowWalletModal] = useState(false)

  useEffect(() => {
    setLoading(true)
    setError("")
    fetchEvents()
      .then(evts => {
        setEvents(evts)
        setLoading(false)
      })
      .catch(() => {
        setError("Failed to load events.")
        setLoading(false)
      })
  }, [])

  const filteredEvents =
    activeTab === "all"
      ? events
      : activeTab === "resale"
        ? events.filter((event) => event.resale)
        : events.filter((event) => event.category === activeTab)

  // Loading state
  if (loading) {
    return (
      <section className="w-full py-24 flex flex-col items-center justify-center">
        <Loader2 className="h-10 w-10 animate-spin text-purple-600 mb-4" />
        <p className="text-lg text-purple-600">Loading events...</p>
      </section>
    )
  }
  // Error state
  if (error) {
    return (
      <section className="w-full py-24 flex flex-col items-center justify-center">
        <p className="text-lg text-red-600">{error}</p>
        <Button onClick={() => window.location.reload()} className="mt-4">Retry</Button>
      </section>
    )
  }

  return (
    <section className="w-full py-12 md:py-24 lg:py-32 bg-gray-50 dark:bg-zinc-900">
      <div className="container px-4 md:px-6 mx-auto">
        <div className="flex flex-col items-center justify-center space-y-4 text-center">
          <div className="inline-flex items-center rounded-full border border-purple-200 bg-purple-50 px-3 py-1 text-sm text-purple-600 dark:border-purple-700 dark:bg-purple-900/30">
            <span>Featured Events</span>
          </div>
          <div className="space-y-2">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">Discover Amazing Events</h2>
            <p className="max-w-[900px] text-gray-500 dark:text-gray-300 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
              Explore the hottest events with secure blockchain ticketing
            </p>
          </div>
        </div>
        <div className="mx-auto mt-12 max-w-5xl">
          <Tabs defaultValue="all" className="w-full">
            <TabsList className="grid w-full grid-cols-5 mb-8 bg-white/80 dark:bg-zinc-800/80 backdrop-blur-sm">
              <TabsTrigger value="all" onClick={() => setActiveTab("all")}>All</TabsTrigger>
              <TabsTrigger value="conference" onClick={() => setActiveTab("conference")}>Conferences</TabsTrigger>
              <TabsTrigger value="concert" onClick={() => setActiveTab("concert")}>Concerts</TabsTrigger>
              <TabsTrigger value="hackathon" onClick={() => setActiveTab("hackathon")}>Hackathons</TabsTrigger>
              <TabsTrigger value="resale" onClick={() => setActiveTab("resale")}>Resale</TabsTrigger>
            </TabsList>
            {["all", "conference", "concert", "hackathon", "resale"].map(tab => (
              <TabsContent key={tab} value={tab} className="w-full">
                {filteredEvents.length === 0 ? (
                  <div className="py-16 text-center text-gray-400 dark:text-gray-500">
                    No events found for this category.
                  </div>
                ) : (
                  <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                    {filteredEvents.map((event) => (
                      <EventCard
                        key={event.id}
                        event={event}
                        onClick={() => setSelectedEvent(event)}
                        aria-label={`View details for ${event.title}`}
                      />
                    ))}
                  </div>
                )}
              </TabsContent>
            ))}
          </Tabs>
          <div className="mt-10 flex justify-center gap-4">
            <Button asChild variant="outline" className="border-purple-500 text-purple-600 hover:bg-purple-50 dark:border-purple-700 dark:text-purple-300">
              <Link href="/events">
                View All Events <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button variant="ghost" onClick={() => setShowWalletModal(true)} aria-label="Connect Wallet">
              <Wallet className="mr-2 h-5 w-5" /> Connect Wallet
            </Button>
          </div>
        </div>
      </div>

      {/* Event Details Modal */}
      <Modal open={!!selectedEvent} onClose={() => setSelectedEvent(null)} ariaLabel="Event Details">
        {selectedEvent && (
          <div className="p-6">
            <div className="flex flex-col items-center">
              <Image
                src={selectedEvent.image || "/placeholder.svg"}
                alt={selectedEvent.title}
                width={400}
                height={260}
                className="rounded-lg object-cover mb-4"
              />
              <h3 className="text-2xl font-bold mb-2 text-center">{selectedEvent.title}</h3>
              <div className="flex items-center text-sm text-gray-500 dark:text-gray-400 mb-2">
                <Calendar className="h-4 w-4 mr-1 text-purple-500" /> {selectedEvent.date}
                <span className="mx-2">•</span>
                <MapPin className="h-4 w-4 mr-1 text-purple-500" /> {selectedEvent.location}
              </div>
              <p className="text-base text-gray-700 dark:text-gray-200 mb-4 text-center">{selectedEvent.description}</p>
              <div className="mb-4">
                <span className="font-bold text-purple-600 dark:text-purple-400 text-lg">{selectedEvent.price}</span>
                {selectedEvent.resale && (
                  <span className="ml-2 text-xs text-gray-500 line-through">{selectedEvent.originalPrice}</span>
                )}
              </div>
              <div className="flex flex-col gap-3 w-full">
                <Button className="w-full bg-purple-600 hover:bg-purple-700" onClick={() => {setShowBuyModal(true); setSelectedEvent(null);}}>
                  <Ticket className="mr-2 h-5 w-5" /> Buy Ticket
                </Button>
                {selectedEvent.resale && (
                  <Button variant="outline" className="w-full border-purple-500 text-purple-600 dark:border-purple-700 dark:text-purple-300" onClick={() => {setShowResellModal(true); setSelectedEvent(null);}}>
                    Resell Ticket
                  </Button>
                )}
                <Button variant="ghost" className="w-full" onClick={() => {setShowQRModal(true); setSelectedEvent(null);}}>
                  <QrCode className="mr-2 h-5 w-5" /> Preview QR Code
                </Button>
              </div>
            </div>
          </div>
        )}
      </Modal>

      {/* Buy Ticket Modal */}
      <Modal open={showBuyModal} onClose={() => setShowBuyModal(false)} ariaLabel="Buy Ticket">
        <div className="p-6">
          <h3 className="text-xl font-bold mb-4">Buy Ticket</h3>
          <form className="flex flex-col gap-4">
            <input className="border rounded px-3 py-2 focus:outline-none focus:ring focus:ring-purple-400 dark:bg-zinc-800" placeholder="Your Name" />
            <input className="border rounded px-3 py-2 focus:outline-none focus:ring focus:ring-purple-400 dark:bg-zinc-800" placeholder="Email Address" />
            <Button className="w-full bg-purple-600 hover:bg-purple-700">Proceed to Pay</Button>
          </form>
        </div>
      </Modal>

      {/* Resell Ticket Modal */}
      <Modal open={showResellModal} onClose={() => setShowResellModal(false)} ariaLabel="Resell Ticket">
        <div className="p-6">
          <h3 className="text-xl font-bold mb-4">Resell Your Ticket</h3>
          <form className="flex flex-col gap-4">
            <input className="border rounded px-3 py-2 focus:outline-none focus:ring focus:ring-purple-400 dark:bg-zinc-800" placeholder="Ticket ID" />
            <input className="border rounded px-3 py-2 focus:outline-none focus:ring focus:ring-purple-400 dark:bg-zinc-800" placeholder="Set Resale Price (USDC)" />
            <Button className="w-full bg-purple-600 hover:bg-purple-700">List for Resale</Button>
          </form>
        </div>
      </Modal>

      {/* QR Code Modal */}
      <Modal open={showQRModal} onClose={() => setShowQRModal(false)} ariaLabel="QR Code Preview">
        <div className="p-6 flex flex-col items-center">
          <h3 className="text-xl font-bold mb-4">Your Ticket QR Code</h3>
          <div className="bg-white p-4 rounded-lg shadow border mb-4 dark:bg-zinc-800">
            {/* Placeholder QR code */}
            <Image src="/qr-placeholder.svg" alt="QR Code" width={160} height={160} className="mx-auto" />
          </div>
          <Button className="w-full bg-purple-600 hover:bg-purple-700" onClick={() => setShowQRModal(false)}>Done</Button>
        </div>
      </Modal>

      {/* Wallet Connect Modal */}
      <Modal open={showWalletModal} onClose={() => setShowWalletModal(false)} ariaLabel="Connect Wallet">
        <div className="p-6 flex flex-col items-center">
          <h3 className="text-xl font-bold mb-4">Connect Your Wallet</h3>
          <Button className="w-full bg-purple-600 hover:bg-purple-700 mb-2" onClick={() => setShowWalletModal(false)}>
            <Wallet className="mr-2 h-5 w-5" /> Connect with MetaMask
          </Button>
          <Button className="w-full bg-gray-200 dark:bg-zinc-700 mb-2" onClick={() => setShowWalletModal(false)}>
            <Wallet className="mr-2 h-5 w-5" /> Connect with WalletConnect
          </Button>
          <Button className="w-full bg-gray-200 dark:bg-zinc-700" onClick={() => setShowWalletModal(false)}>
            <Wallet className="mr-2 h-5 w-5" /> Connect with Coinbase Wallet
          </Button>
        </div>
      </Modal>
    </section>
  )
}

function EventCard({ event, onClick, ...props }: { event: Event; onClick: () => void }) {
  return (
    <Card
      className="overflow-hidden transition-all hover:shadow-lg group cursor-pointer focus:outline-none focus:ring-2 focus:ring-purple-500 animate-cardin"
      tabIndex={0}
      role="button"
      aria-label={props["aria-label"]}
      onClick={onClick}
      onKeyDown={e => e.key === "Enter" && onClick()}
    >
      <div className="relative">
        <Image
          src={event.image || "/placeholder.svg"}
          alt={event.title}
          width={600}
          height={400}
          className="object-cover w-full h-48 transition-transform duration-300 group-hover:scale-105"
        />
        {event.resale && (
          <div className="absolute top-2 right-2 bg-purple-600 text-white text-xs font-medium px-2 py-1 rounded animate-bounce">
            Resale
          </div>
        )}
        {event.featured && (
          <div className="absolute top-2 left-2 bg-yellow-500 text-white text-xs font-medium px-2 py-1 rounded animate-pulse">
            Featured
          </div>
        )}
      </div>
      <CardHeader className="p-4">
        <h3 className="text-lg font-bold line-clamp-1">{event.title}</h3>
      </CardHeader>
      <CardContent className="p-4 pt-0 space-y-2">
        <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
          <Calendar className="h-4 w-4 mr-1 text-purple-500" />
          {event.date}
        </div>
        <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
          <MapPin className="h-4 w-4 mr-1 text-purple-500" />
          {event.location}
        </div>
        <div className="flex items-center justify-between mt-2">
          <div>
            <p className="font-bold text-purple-600 dark:text-purple-400">{event.price}</p>
            {event.resale && <p className="text-xs text-gray-500 line-through">{event.originalPrice}</p>}
          </div>
        </div>
      </CardContent>
      <CardFooter className="p-4 pt-0">
        <Button className="w-full bg-purple-600 hover:bg-purple-700 group-hover:bg-purple-700" tabIndex={-1}>
          View Details
        </Button>
      </CardFooter>
    </Card>
  )
}

// Modal UI component
function Modal({ open, onClose, children, ariaLabel }: { open: boolean; onClose: () => void; children: React.ReactNode; ariaLabel: string }) {
  if (!open) return null;
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm animate-fadein"
      aria-modal="true"
      role="dialog"
      tabIndex={-1}
      aria-label={ariaLabel}
      onClick={onClose}
    >
      <div
        className="bg-white dark:bg-zinc-900 rounded-lg shadow-xl max-w-lg w-full mx-4 relative animate-modalin"
        onClick={e => e.stopPropagation()}
      >
        <button
          aria-label="Close"
          className="absolute top-3 right-3 text-zinc-400 hover:text-purple-600 focus:outline-none focus:ring"
          onClick={onClose}
        >
          <X className="h-6 w-6" />
        </button>
        {children}
      </div>
    </div>
  )
}
