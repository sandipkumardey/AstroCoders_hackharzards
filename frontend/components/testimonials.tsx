import Image from "next/image"
import { Star } from "lucide-react"
import { useRef, useEffect } from "react"

import { Card, CardContent } from "@/components/ui/card"

export function Testimonials() {
  const testimonials = [
    {
      name: "Amit Sharma",
      role: "Concert Attendee",
      image: "/placeholder.svg?height=100&width=100",
      content:
        "I used to worry about buying resale tickets online. With BlockTix, I can see the entire transaction history and know my ticket is legitimate. Game changer!",
      rating: 5,
    },
    {
      name: "Priya Singh",
      role: "Event Organizer",
      image: "/placeholder.svg?height=100&width=100",
      content:
        "As an event organizer, BlockTix has eliminated our ticket fraud problems completely. The cross-chain payment system also makes it easy for all our customers.",
      rating: 5,
    },
    {
      name: "Rahul Verma",
      role: "Ticket Reseller",
      image: "/placeholder.svg?height=100&width=100",
      content:
        "I can now resell my unused tickets without any hassle. The platform handles all the verification and payment processing automatically. Highly recommend!",
      rating: 4,
    },
    {
      name: "Sneha Patel",
      role: "Music Festival Fan",
      image: "/placeholder.svg?height=100&width=100",
      content:
        "BlockTix made it so easy to buy tickets for my favorite festival. The UI is slick and the ticket was in my wallet instantly!",
      rating: 5,
    },
    {
      name: "Vikram Rao",
      role: "Sports Enthusiast",
      image: "/placeholder.svg?height=100&width=100",
      content:
        "No more ticket scams! I love the QR preview and the fact that I can resell easily if plans change.",
      rating: 5,
    },
    {
      name: "Ananya Iyer",
      role: "Theater Lover",
      image: "/placeholder.svg?height=100&width=100",
      content:
        "The dark mode and animations make BlockTix a joy to use. Accessibility is top notch!",
      rating: 5,
    },
  ]

  const scrollRef = useRef<HTMLDivElement>(null)
  let isDown = false
  let startX = 0
  let scrollLeft = 0

  // Drag-to-scroll logic
  function handleMouseDown(e: React.MouseEvent<HTMLDivElement>) {
    isDown = true
    startX = e.pageX - (scrollRef.current?.offsetLeft || 0)
    scrollLeft = scrollRef.current?.scrollLeft || 0
    document.body.style.cursor = 'grabbing'
  }
  function handleMouseLeave() {
    isDown = false
    document.body.style.cursor = ''
  }
  function handleMouseUp() {
    isDown = false
    document.body.style.cursor = ''
  }
  function handleMouseMove(e: React.MouseEvent<HTMLDivElement>) {
    if (!isDown) return
    e.preventDefault()
    const x = e.pageX - (scrollRef.current?.offsetLeft || 0)
    const walk = (x - startX) * 1.5 // scroll-fast
    if (scrollRef.current) {
      scrollRef.current.scrollLeft = scrollLeft - walk
    }
  }

  // Auto-scroll logic (continuous, infinite loop)
  useEffect(() => {
    const el = scrollRef.current
    if (!el) return
    let frame: number
    let autoScroll = true
    const scrollSpeed = 0.8
    function step() {
      if (!autoScroll || !el) return
      // If at or near end, jump back to start for infinite loop
      if (el.scrollLeft + el.offsetWidth >= el.scrollWidth - 1) {
        el.scrollLeft = 0
      } else {
        el.scrollLeft += scrollSpeed
      }
      frame = requestAnimationFrame(step)
    }
    frame = requestAnimationFrame(step)
    // Pause on hover/focus
    function pause() { autoScroll = false }
    function resume() { autoScroll = true; frame = requestAnimationFrame(step) }
    el.addEventListener('mouseenter', pause)
    el.addEventListener('mouseleave', resume)
    el.addEventListener('focusin', pause)
    el.addEventListener('focusout', resume)
    return () => {
      cancelAnimationFrame(frame)
      el.removeEventListener('mouseenter', pause)
      el.removeEventListener('mouseleave', resume)
      el.removeEventListener('focusin', pause)
      el.removeEventListener('focusout', resume)
    }
  }, [])

  return (
    <section className="w-full py-12 md:py-24 bg-white dark:bg-black relative">
      <div className="container px-4 md:px-6 mx-auto">
        <div className="flex flex-col items-center justify-center space-y-4 text-center mb-12">
          <div className="inline-flex items-center rounded-full border border-purple-200 bg-purple-50 px-3 py-1 text-sm text-purple-600 dark:bg-purple-950 dark:border-purple-900">
            <span>Testimonials</span>
          </div>
          <div className="space-y-2">
            <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">What Our Users Say</h2>
            <p className="max-w-[900px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed dark:text-gray-300">
              Don't just take our word for it - hear from people who have experienced the BlockTix difference
            </p>
          </div>
        </div>
        <div className="relative">
          {/* Left fade */}
          <div className="pointer-events-none absolute left-0 top-0 h-full w-12 z-10 bg-gradient-to-r from-white dark:from-black to-transparent" />
          {/* Right fade */}
          <div className="pointer-events-none absolute right-0 top-0 h-full w-12 z-10 bg-gradient-to-l from-white dark:from-black to-transparent" />
          <div
            ref={scrollRef}
            className="flex gap-8 overflow-x-auto pb-4 snap-x snap-mandatory cursor-grab scroll-smooth testimonials-scroll"
            style={{ WebkitOverflowScrolling: 'touch' }}
            onMouseDown={handleMouseDown}
            onMouseLeave={handleMouseLeave}
            onMouseUp={handleMouseUp}
            onMouseMove={handleMouseMove}
            tabIndex={0}
            aria-label="User testimonials carousel"
          >
            {testimonials.map((testimonial, index) => (
              <Card
                key={index}
                className="min-w-[320px] max-w-[340px] snap-center bg-white dark:bg-black border-purple-100 dark:border-purple-900 hover:shadow-lg transition-all duration-200 hover:-translate-y-1"
                tabIndex={0}
                aria-label={`Testimonial from ${testimonial.name}`}
              >
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
                  <p className="text-gray-700 dark:text-gray-300 italic mb-6">"{testimonial.content}"</p>
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
                      <h4 className="font-semibold dark:text-white">{testimonial.name}</h4>
                      <p className="text-sm text-gray-500 dark:text-gray-400">{testimonial.role}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
        <style jsx global>{`
          .testimonials-scroll::-webkit-scrollbar {
            height: 8px;
            background: transparent;
          }
          .testimonials-scroll::-webkit-scrollbar-thumb {
            background: #a78bfa33;
            border-radius: 8px;
          }
        `}</style>
      </div>
    </section>
  )
}
