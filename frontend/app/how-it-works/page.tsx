"use client";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Zap, Ticket, Wallet, CheckCircle } from "lucide-react";

const steps = [
  {
    icon: <Wallet className="text-blue-500 w-8 h-8" />, 
    title: "Connect Wallet",
    desc: "Securely connect your crypto wallet to get started. No sign-up required!",
  },
  {
    icon: <Ticket className="text-purple-500 w-8 h-8" />,
    title: "Browse & Buy Tickets",
    desc: "Explore events and purchase tickets directly on the blockchain.",
  },
  {
    icon: <Zap className="text-yellow-500 w-8 h-8" />,
    title: "Instant Access",
    desc: "Receive your ticket as an NFT instantly, ready to use or resell.",
  },
  {
    icon: <CheckCircle className="text-green-500 w-8 h-8" />,
    title: "Enjoy & Resell",
    desc: "Attend the event or resell your ticket securely on BlockTix.",
  },
];

export default function HowItWorksPage() {
  return (
    <main className="flex flex-col items-center justify-center min-h-screen bg-background">
      <Card className="w-full max-w-4xl mx-auto mt-12 shadow-lg">
        <CardHeader>
          <CardTitle>How It Works</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-8">
            {steps.map((step, i) => (
              <div key={i} className="flex flex-col items-center text-center p-6 bg-muted rounded-lg shadow">
                <div className="mb-3">{step.icon}</div>
                <div className="font-semibold text-lg mb-1">{step.title}</div>
                <div className="text-muted-foreground text-sm">{step.desc}</div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </main>
  );
}