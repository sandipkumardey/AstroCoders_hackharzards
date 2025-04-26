import Image from "next/image"
import { Star } from "lucide-react"

import { Card, CardContent } from "@/components/ui/card"

export function Testimonials() {
  const testimonials = [
    {
      name: "Alex Johnson",
      role: "Concert Attendee",
      image: "/placeholder.svg?height=100&width=100",
      content:
        "I used to worry about buying resale tickets online. With BlockTix, I can see the entire transaction history and know my ticket is legitimate. Game changer!",
      rating: 5,
    },
    {
      name: "Sarah Williams",
      role: "Event Organizer",
      image: "/placeholder.svg?height=100&width=100",
      content:
        "As an event organizer, BlockTix has eliminated our ticket fraud problems completely. The cross-chain payment system also makes it easy for all our customers.",
      rating: 5,
    },
    {
      name: "Michael Chen",
      role: "Ticket Reseller",
      image: "/placeholder.svg?height=100&width=100",
      content:
        "I can now resell my unused tickets without any hassle. The platform handles all the verification and payment processing automatically. Highly recommend!",
      rating: 4,
    },
  ]

  return (
    <section className="w-full py-12 md:py-24 bg-white">
      <div className="container px-4 md:px-6 mx-auto">
        <div className="flex flex-col items-center justify-center space-y-4 text-center mb-12">
          <div className="inline-flex items-center rounded-full border border-purple-200 bg-purple-50 px-3 py-1 text-sm text-purple-600">
            <span>Testimonials</span>
          </div>
          <div className="space-y-2">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">What Our Users Say</h2>
            <p className="max-w-[900px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
              Don't just take our word for it - hear from people who have experienced the BlockTix difference
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <Card key={index} className="bg-white border-purple-100 hover:shadow-lg transition-all duration-200">
              <CardContent className="p-6">
                <div className="flex items-center space-x-0.5 mb-2">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`h-5 w-5 ${
                        i < testimonial.rating ? "fill-yellow-400 text-yellow-400" : "fill-gray-200 text-gray-200"
                      }`}
                    />
                  ))}
                </div>
                <p className="text-gray-700 italic mb-6">"{testimonial.content}"</p>
                <div className="flex items-center">
                  <div className="relative h-12 w-12 rounded-full overflow-hidden mr-4">
                    <Image
                      src={testimonial.image || "/placeholder.svg"}
                      alt={testimonial.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div>
                    <h4 className="font-semibold">{testimonial.name}</h4>
                    <p className="text-sm text-gray-500">{testimonial.role}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
