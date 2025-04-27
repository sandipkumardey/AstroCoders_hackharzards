"use client";
import { FAQ } from "@/components/faq";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

export default function FAQPage() {
  return (
    <main className="flex flex-col items-center justify-center min-h-screen bg-background">
      <Card className="w-full max-w-5xl mx-auto mt-12 shadow-lg">
        <CardHeader>
          <CardTitle>Frequently Asked Questions</CardTitle>
        </CardHeader>
        <CardContent>
          <FAQ />
        </CardContent>
      </Card>
    </main>
  );
}