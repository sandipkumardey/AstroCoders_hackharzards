"use client";
import { useState } from "react";
import EventsList from "@/components/EventsList";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

export default function EventsPage() {
  const [selectedEvent, setSelectedEvent] = useState<any | null>(null);
  const [showDialog, setShowDialog] = useState(false);
  const [isBuying, setIsBuying] = useState(false);
  const [buySuccess, setBuySuccess] = useState(false);

  const handleBuy = (event: any) => {
    setSelectedEvent(event);
    setShowDialog(true);
    setBuySuccess(false);
  };

  const handleConfirmBuy = async () => {
    setIsBuying(true);
    // Simulate async purchase (replace with real logic)
    setTimeout(() => {
      setIsBuying(false);
      setBuySuccess(true);
    }, 1500);
  };

  return (
    <main className="container mx-auto py-12 min-h-screen">
      <h1 className="text-3xl font-bold mb-8 text-center">Events</h1>
      <EventsList onBuy={handleBuy} />
      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Buy Ticket</DialogTitle>
          </DialogHeader>
          {selectedEvent && (
            <div className="mb-4">
              <div className="font-semibold text-lg mb-1">{selectedEvent.title}</div>
              <div className="text-sm text-muted-foreground mb-1">{selectedEvent.date} • {selectedEvent.location}</div>
              <div className="text-base font-medium mb-2">{selectedEvent.price}</div>
              <p className="text-sm text-muted-foreground mb-2">{selectedEvent.description}</p>
            </div>
          )}
          <DialogFooter>
            {buySuccess ? (
              <Button variant="default" className="w-full" onClick={() => setShowDialog(false)}>
                Purchase Successful!
              </Button>
            ) : (
              <Button
                className="w-full"
                onClick={handleConfirmBuy}
                disabled={isBuying}
                aria-busy={isBuying}
                aria-label="Confirm Purchase"
              >
                {isBuying ? "Processing..." : "Confirm Purchase"}
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </main>
  );
}