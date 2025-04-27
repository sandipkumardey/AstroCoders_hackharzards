import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { CheckCircle } from "lucide-react";

interface BuyTicketModalProps {
  open: boolean;
  event: any;
  isBuying: boolean;
  buySuccess: boolean;
  onClose: () => void;
  onConfirmBuy: () => Promise<void>;
}

export default function BuyTicketModal({ open, event, isBuying, buySuccess, onClose, onConfirmBuy }: BuyTicketModalProps) {
  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Buy Ticket</DialogTitle>
        </DialogHeader>
        {event && !buySuccess && (
          <div className="mb-4">
            <div className="font-semibold text-lg mb-1">{event.title}</div>
            <div className="text-sm text-muted-foreground mb-1">{event.date} • {event.location}</div>
            <div className="text-base font-medium mb-2">{event.price}</div>
            <p className="text-sm text-muted-foreground mb-2">{event.description}</p>
          </div>
        )}
        <DialogFooter>
          {buySuccess ? (
            <div className="flex flex-col items-center w-full">
              <CheckCircle className="text-green-500 mb-2" size={40} />
              <div className="text-lg font-semibold mb-2">Purchase Successful!</div>
              <Button variant="default" className="w-full" onClick={onClose}>
                Close
              </Button>
            </div>
          ) : (
            <Button
              className="w-full"
              onClick={onConfirmBuy}
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
  );
}
