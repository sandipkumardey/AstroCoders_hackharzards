import { useAccount } from "wagmi";
import EventsList from "@/components/EventsList";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export function EventsSection({ onBuy }: { onBuy: (event: any) => void }) {
  const { isConnected } = useAccount();

  if (!isConnected) {
    return (
      <Card className="w-full max-w-3xl mx-auto my-12 shadow-lg">
        <CardHeader>
          <CardTitle>Events</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center gap-4">
            <p className="text-muted-foreground text-center">
              Connect your wallet to view and purchase event tickets.
            </p>
            <Button variant="default" disabled>
              Connect Wallet Required
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <section className="w-full max-w-6xl mx-auto my-12">
      <h2 className="text-2xl font-bold mb-6 text-center">Available Events</h2>
      <EventsList onBuy={onBuy} />
    </section>
  );
}
