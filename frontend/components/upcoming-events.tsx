import Image from "next/image"
import Link from "next/link"
import { Calendar, MapPin } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"

export function UpcomingEvents() {
  const events = [
    {
      id: 5,
      title: "NFT Art Exhibition",
      date: "October 5, 2024",
      location: "Berlin, Germany",
      price: "25 USDC",
      image: "/placeholder.svg?height=400&width=600",
      description: "Explore the intersection of traditional art and blockchain technology at this unique exhibition.",
    },
    {
      id: 6,
      title: "Crypto Gaming Tournament",
      date: "November 12, 2024",
      location: "Tokyo, Japan",
      price: "40 USDC",
      image: "/placeholder.svg?height=400&width=600",
      description: "Compete in the world's largest blockchain gaming tournament with prizes in cryptocurrency.",
    },
    {
      id: 7,
      title: "Web3 Developer Conference",
      date: "December 8, 2024",
      location: "Singapore",
      price: "60 USDC",
      image: "/placeholder.svg?height=400&width=600",
      description: "Connect with leading developers and learn about the latest advancements in Web3 technology.",
    },
  ]

  return (
    <section className="w-full py-12 md:py-24 lg:py-32 bg-gray-100">
      <div className="container px-4 md:px-6 mx-auto">
        <div className="flex flex-col items-center justify-center space-y-4 text-center">
          <div className="space-y-2">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-5xl">Upcoming Events</h2>
            <p className="max-w-[900px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
              Don't miss these exciting upcoming events with secure blockchain ticketing
            </p>
          </div>
        </div>
        <div className="mx-auto grid max-w-5xl grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3 mt-12">
          {events.map((event) => (
            <Card key={event.id} className="overflow-hidden transition-all hover:shadow-lg">
              <div className="relative">
                <Image
                  src={event.image || "/placeholder.svg"}
                  alt={event.title}
                  width={600}
                  height={400}
                  className="object-cover w-full h-48"
                />
              </div>
              <CardHeader className="p-4">
                <h3 className="text-lg font-bold">{event.title}</h3>
              </CardHeader>
              <CardContent className="p-4 pt-0 space-y-2">
                <p className="text-sm text-gray-500">{event.description}</p>
                <div className="flex items-center text-sm text-gray-500 mt-4">
                  <Calendar className="h-4 w-4 mr-1" />
                  {event.date}
                </div>
                <div className="flex items-center text-sm text-gray-500">
                  <MapPin className="h-4 w-4 mr-1" />
                  {event.location}
                </div>
                <div className="flex items-center justify-between mt-2">
                  <p className="font-bold text-purple-600">{event.price}</p>
                </div>
              </CardContent>
              <CardFooter className="p-4 pt-0">
                <Button asChild className="w-full bg-purple-600 hover:bg-purple-700">
                  <Link href={`/events/${event.id}`}>View Details</Link>
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
