import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useState } from "react";

interface TransferTicketModalProps {
  open: boolean;
  ticket: any;
  onClose: () => void;
  onTransfer: (ticket: any, recipient: string) => Promise<void>;
  loading: boolean;
}

export default function TransferTicketModal({ open, ticket, onClose, onTransfer, loading }: TransferTicketModalProps) {
  const [recipient, setRecipient] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!recipient || recipient.length < 6) {
      setError("Enter a valid wallet address.");
      return;
    }
    await onTransfer(ticket, recipient);
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Transfer Ticket</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 mt-2">
          <div>
            <label className="block text-sm font-medium mb-1">Recipient Wallet Address</label>
            <input
              type="text"
              className="w-full border rounded px-3 py-2"
              placeholder="0x..."
              value={recipient}
              onChange={e => setRecipient(e.target.value)}
              required
            />
            {error && <div className="text-red-600 text-xs mt-1">{error}</div>}
          </div>
          <DialogFooter>
            <Button type="button" variant="ghost" onClick={onClose} disabled={loading}>Cancel</Button>
            <Button type="submit" className="bg-blue-600" disabled={loading || !recipient}>
              {loading ? "Transferring..." : "Transfer"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
