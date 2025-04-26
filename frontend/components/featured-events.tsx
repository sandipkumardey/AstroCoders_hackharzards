"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { ArrowRight, Calendar, MapPin } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export function FeaturedEvents() {
  const [activeTab, setActiveTab] = useState("all")

  const events = [
    {
      id: 1,
      title: "Blockchain Summit 2024",
      category: "conference",
      date: "June 15, 2024",
      location: "San Francisco, CA",
      price: "50 USDC",
      image: "/placeholder.svg?height=400&width=600",
      resale: false,
      featured: true,
    },
    {
      id: 2,
      title: "ETH Global Hackathon",
      category: "hackathon",
      date: "July 10, 2024",
      location: "New York, NY",
      price: "30 USDC",
      image: "/placeholder.svg?height=400&width=600",
      resale: false,
      featured: true,
    },
    {
      id: 3,
      title: "Web3 Music Festival",
      category: "concert",
      date: "August 5, 2024",
      location: "Miami, FL",
      price: "75 USDC",
      image: "/placeholder.svg?height=400&width=600",
      resale: true,
      originalPrice: "60 USDC",
      featured: true,
    },
    {
      id: 4,
      title: "DeFi Conference",
      category: "conference",
      date: "September 20, 2024",
      location: "London, UK",
      price: "45 USDC",
      image: "/placeholder.svg?height=400&width=600",
      resale: false,
      featured: true,
    },
  ]

  const filteredEvents =
    activeTab === "all"
      ? events
      : activeTab === "resale"
        ? events.filter((event) => event.resale)
        : events.filter((event) => event.category === activeTab)

  return (
    <section className="w-full py-12 md:py-24 lg:py-32 bg-gray-50">
      <div className="container px-4 md:px-6 mx-auto">
        <div className="flex flex-col items-center justify-center space-y-4 text-center">
          <div className="inline-flex items-center rounded-full border border-purple-200 bg-purple-50 px-3 py-1 text-sm text-purple-600">
            <span>Featured Events</span>
          </div>
          <div className="space-y-2">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">Discover Amazing Events</h2>
            <p className="max-w-[900px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
              Explore the hottest events with secure blockchain ticketing
            </p>
          </div>
        </div>
        <div className="mx-auto mt-12 max-w-5xl">
          <Tabs defaultValue="all" className="w-full">
            <TabsList className="grid w-full grid-cols-5 mb-8 bg-white/80 backdrop-blur-sm">
              <TabsTrigger value="all" onClick={() => setActiveTab("all")}>
                All
              </TabsTrigger>
              <TabsTrigger value="conference" onClick={() => setActiveTab("conference")}>
                Conferences
              </TabsTrigger>
              <TabsTrigger value="concert" onClick={() => setActiveTab("concert")}>
                Concerts
              </TabsTrigger>
              <TabsTrigger value="hackathon" onClick={() => setActiveTab("hackathon")}>
                Hackathons
              </TabsTrigger>
              <TabsTrigger value="resale" onClick={() => setActiveTab("resale")}>
                Resale
              </TabsTrigger>
            </TabsList>
            <TabsContent value="all" className="w-full">
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                {filteredEvents.map((event) => (
                  <EventCard key={event.id} event={event} />
                ))}
              </div>
            </TabsContent>
            <TabsContent value="conference" className="w-full">
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                {filteredEvents.map((event) => (
                  <EventCard key={event.id} event={event} />
                ))}
              </div>
            </TabsContent>
            <TabsContent value="concert" className="w-full">
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                {filteredEvents.map((event) => (
                  <EventCard key={event.id} event={event} />
                ))}
              </div>
            </TabsContent>
            <TabsContent value="hackathon" className="w-full">
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                {filteredEvents.map((event) => (
                  <EventCard key={event.id} event={event} />
                ))}
              </div>
            </TabsContent>
            <TabsContent value="resale" className="w-full">
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                {filteredEvents.map((event) => (
                  <EventCard key={event.id} event={event} />
                ))}
              </div>
            </TabsContent>
          </Tabs>
          <div className="mt-10 flex justify-center">
            <Button asChild variant="outline" className="border-purple-500 text-purple-600 hover:bg-purple-50">
              <Link href="/events">
                View All Events <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}

function EventCard({ event }) {
  return (
    <Card className="overflow-hidden transition-all hover:shadow-lg group">
      <div className="relative">
        <Image
          src={event.image || "/placeholder.svg"}
          alt={event.title}
          width={600}
          height={400}
          className="object-cover w-full h-48 transition-transform duration-300 group-hover:scale-105"
        />
        {event.resale && (
          <div className="absolute top-2 right-2 bg-purple-600 text-white text-xs font-medium px-2 py-1 rounded">
            Resale
          </div>
        )}
        {event.featured && (
          <div className="absolute top-2 left-2 bg-yellow-500 text-white text-xs font-medium px-2 py-1 rounded">
            Featured
          </div>
        )}
      </div>
      <CardHeader className="p-4">
        <h3 className="text-lg font-bold line-clamp-1">{event.title}</h3>
      </CardHeader>
      <CardContent className="p-4 pt-0 space-y-2">
        <div className="flex items-center text-sm text-gray-500">
          <Calendar className="h-4 w-4 mr-1 text-purple-500" />
          {event.date}
        </div>
        <div className="flex items-center text-sm text-gray-500">
          <MapPin className="h-4 w-4 mr-1 text-purple-500" />
          {event.location}
        </div>
        <div className="flex items-center justify-between mt-2">
          <div>
            <p className="font-bold text-purple-600">{event.price}</p>
            {event.resale && <p className="text-xs text-gray-500 line-through">{event.originalPrice}</p>}
          </div>
        </div>
      </CardContent>
      <CardFooter className="p-4 pt-0">
        <Button asChild className="w-full bg-purple-600 hover:bg-purple-700 group-hover:bg-purple-700">
          <Link href={`/events/${event.id}`}>View Details</Link>
        </Button>
      </CardFooter>
    </Card>
  )
}
