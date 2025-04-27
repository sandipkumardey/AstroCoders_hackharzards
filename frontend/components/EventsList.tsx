"use client";
import Image from "next/image";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

// Example event data (replace with API integration as needed)
const events = [
  {
    id: "1",
    title: "Base Blockchain Summit 2025",
    date: "2025-05-10",
    image: "/images/event1.jpg",
    location: "San Francisco, CA",
    price: "0.05 ETH",
    description: "The premier event for blockchain enthusiasts, developers, and investors on the Base network.",
  },
  {
    id: "2",
    title: "NFT Art Expo",
    date: "2025-06-02",
    image: "/images/event2.jpg",
    location: "New York, NY",
    price: "0.02 ETH",
    description: "Showcasing the latest in NFT art and collectibles. Meet top creators and collectors!",
  },
  {
    id: "3",
    title: "DeFi Unleashed",
    date: "2025-07-15",
    image: "/images/event3.jpg",
    location: "London, UK",
    price: "0.03 ETH",
    description: "A deep dive into decentralized finance, protocols, and the future of money.",
  },
];

export default function EventsList({ onBuy }: { onBuy: (event: any) => void }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {events.map(event => (
        <Card key={event.id} className="flex flex-col h-full shadow-lg">
          <div className="relative w-full h-48">
            <Image src={event.image} alt={event.title} fill className="object-cover rounded-t" />
          </div>
          <CardHeader>
            <CardTitle>{event.title}</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col flex-1 justify-between">
            <div className="mb-4">
              <div className="text-sm text-muted-foreground mb-1">{event.date} • {event.location}</div>
              <div className="text-base font-medium mb-2">{event.price}</div>
              <p className="text-sm text-muted-foreground mb-2">{event.description}</p>
            </div>
            <Button onClick={() => onBuy(event)} className="w-full mt-auto">Buy Ticket</Button>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
