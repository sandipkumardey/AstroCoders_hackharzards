"use client";
import { useState } from "react";
import { Dialog, DialogContent, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface ResellModalProps {
  open: boolean;
  onClose: () => void;
  ticket: any;
  onResell: (ticket: any, price: string) => Promise<void>;
}

export function ResellModal({ open, onClose, ticket, onResell }: ResellModalProps) {
  const [price, setPrice] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      await onResell(ticket, price);
      onClose();
    } catch (err: any) {
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogTitle>Resell Ticket</DialogTitle>
        <DialogDescription>
          Set a resale price for your ticket to <b>{ticket?.eventName || ticket?.eventTitle || ticket?.event || 'this event'}</b>.
        </DialogDescription>
        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          <input
            type="number"
            placeholder="Enter resale price (USDC)"
            className="w-full border rounded px-3 py-2"
            value={price}
            onChange={e => setPrice(e.target.value)}
            min="1"
            required
          />
          {error && <div className="text-red-600 text-sm">{error}</div>}
          <DialogFooter>
            <Button type="button" variant="ghost" onClick={onClose} disabled={loading}>Cancel</Button>
            <Button type="submit" className="bg-purple-600" disabled={loading || !price}>
              {loading ? "Listing..." : "List for Resale"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
