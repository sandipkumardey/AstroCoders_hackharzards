"use client";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Users, Globe, ShieldCheck, Ticket } from "lucide-react";

export default function AboutPage() {
  return (
    <main className="flex flex-col items-center justify-center min-h-screen bg-background">
      <Card className="w-full max-w-4xl mx-auto mt-12 shadow-lg">
        <CardHeader>
          <CardTitle>About BlockTix</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-8 items-center md:items-start">
            <div className="flex-1 space-y-4">
              <p className="text-lg text-muted-foreground">
                <span className="font-semibold text-primary">BlockTix</span> is a decentralized event ticketing platform built on the Base blockchain. We empower event organizers and attendees by providing a secure, transparent, and fraud-proof way to buy, sell, and manage event tickets.
              </p>
              <ul className="space-y-3 mt-6">
                <li className="flex items-center gap-3">
                  <Ticket className="text-purple-500" />
                  <span>Immutable blockchain records prevent ticket fraud and scalping.</span>
                </li>
                <li className="flex items-center gap-3">
                  <ShieldCheck className="text-green-500" />
                  <span>Secure, wallet-based access for both buyers and sellers.</span>
                </li>
                <li className="flex items-center gap-3">
                  <Globe className="text-blue-500" />
                  <span>Open, global marketplace for events of all sizes.</span>
                </li>
                <li className="flex items-center gap-3">
                  <Users className="text-orange-500" />
                  <span>Community-driven innovation and transparent governance.</span>
                </li>
              </ul>
            </div>
            <div className="flex-1 flex flex-col items-center justify-center">
              <img src="/images/about-blocktix.svg" alt="BlockTix illustration" className="w-64 h-64 object-contain" />
            </div>
          </div>
        </CardContent>
      </Card>
    </main>
  );
}