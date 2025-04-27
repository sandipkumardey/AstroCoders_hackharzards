import { useAccount } from "wagmi";
import { useEffect, useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "@/components/ui/use-toast";
import { Ticket, Share2, Info, Filter } from "lucide-react";
import TransferTicketModal from "@/components/TransferTicketModal";

// Simulated API fetch for tickets
async function fetchMyTickets(address: string) {
  if (!address) return [];
  await new Promise(r => setTimeout(r, 1200)); // simulate loading
  // Example tickets (replace with real API)
  return [
    {
      id: "TICK-001",
      event: "Base Blockchain Summit 2025",
      date: "2025-05-10",
      status: "Active",
      qr: "/images/qr1.png",
      seat: "A12",
      price: "0.05 ETH",
    },
    {
      id: "TICK-002",
      event: "NFT Art Expo",
      date: "2025-06-02",
      status: "Used",
      qr: "/images/qr2.png",
      seat: "B5",
      price: "0.02 ETH",
    },
  ];
}

const statusOptions = ["All", "Active", "Used"];

export default function MyTicketsDashboard() {
  const { address, isConnected } = useAccount();
  const [tickets, setTickets] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showDetails, setShowDetails] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState("All");
  const [transferModalOpen, setTransferModalOpen] = useState(false);
  const [transferTicket, setTransferTicket] = useState<any>(null);
  const [transferLoading, setTransferLoading] = useState(false);

  useEffect(() => {
    if (!isConnected || !address) return;
    setLoading(true);
    setError("");
    fetchMyTickets(address)
      .then(setTickets)
      .catch(() => setError("Failed to fetch tickets."))
      .finally(() => setLoading(false));
  }, [isConnected, address]);

  const handleResell = (ticket: any) => {
    toast({
      title: "Resell Initiated",
      description: `You have started reselling ticket ${ticket.id}.`,
      variant: "default",
    });
    // open resell modal here if desired
  };

  const handleTransfer = (ticket: any) => {
    setTransferTicket(ticket);
    setTransferModalOpen(true);
  };

  const handleTransferConfirm = async (ticket: any, recipient: string) => {
    setTransferLoading(true);
    try {
      // Simulate transfer
      await new Promise(r => setTimeout(r, 1200));
      toast({
        title: "Transfer Successful",
        description: `Ticket ${ticket.id} transferred to ${recipient}.`,
        variant: "default",
      });
      setTransferModalOpen(false);
      setTransferTicket(null);
    } catch {
      toast({
        title: "Transfer Failed",
        description: "There was an error transferring your ticket.",
        variant: "destructive",
      });
    } finally {
      setTransferLoading(false);
    }
  };

  const filteredTickets = statusFilter === "All"
    ? tickets
    : tickets.filter(t => t.status === statusFilter);

  if (!isConnected) {
    return null;
  }

  return (
    <section className="w-full max-w-4xl mx-auto my-12">
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle>My Tickets</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4 mb-6">
            <Filter className="text-muted-foreground w-5 h-5" />
            <span className="text-sm text-muted-foreground">Filter by status:</span>
            <select
              className="border rounded px-2 py-1 text-sm"
              value={statusFilter}
              onChange={e => setStatusFilter(e.target.value)}
            >
              {statusOptions.map(opt => (
                <option key={opt} value={opt}>{opt}</option>
              ))}
            </select>
          </div>
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[1, 2].map(i => (
                <Skeleton key={i} className="h-40 w-full rounded-lg" />
              ))}
            </div>
          ) : error ? (
            <div className="text-red-600 text-center py-8">{error}</div>
          ) : filteredTickets.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">No tickets found.</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {filteredTickets.map(ticket => (
                <Card key={ticket.id} className="flex flex-row items-center gap-4 p-4">
                  <div className="flex-shrink-0">
                    <img src={ticket.qr} alt="QR Code" className="w-24 h-24 rounded border" />
                  </div>
                  <div className="flex-1">
                    <div className="font-semibold text-lg flex items-center gap-2">
                      <Ticket className="text-purple-500 w-5 h-5" /> {ticket.event}
                    </div>
                    <div className="text-sm text-muted-foreground mb-1">{ticket.date} • Seat: {ticket.seat}</div>
                    <div className="text-xs mb-2">ID: {ticket.id}</div>
                    <div className="text-xs mb-2">Status: <span className={ticket.status === "Active" ? "text-green-600" : "text-gray-500"}>{ticket.status}</span></div>
                    <div className="text-xs mb-2">Price: {ticket.price}</div>
                    <div className="flex gap-2 mt-2">
                      {ticket.status === "Active" && (
                        <Button size="sm" variant="outline" onClick={() => handleResell(ticket)}>
                          Resell Ticket
                        </Button>
                      )}
                      <Button size="sm" variant="outline" onClick={() => handleTransfer(ticket)}>
                        <Share2 className="w-4 h-4 mr-1" /> Transfer
                      </Button>
                      <Button size="sm" variant="ghost" onClick={() => setShowDetails(ticket.id)}>
                        <Info className="w-4 h-4 mr-1" /> Details
                      </Button>
                    </div>
                    {showDetails === ticket.id && (
                      <div className="mt-2 p-2 bg-muted rounded text-xs">
                        <div><b>Event:</b> {ticket.event}</div>
                        <div><b>Date:</b> {ticket.date}</div>
                        <div><b>Seat:</b> {ticket.seat}</div>
                        <div><b>Ticket ID:</b> {ticket.id}</div>
                        <div><b>Status:</b> {ticket.status}</div>
                        <div><b>Price:</b> {ticket.price}</div>
                        <Button size="sm" className="mt-2" onClick={() => setShowDetails(null)}>
                          Close
                        </Button>
                      </div>
                    )}
                  </div>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
      <TransferTicketModal
        open={transferModalOpen}
        ticket={transferTicket}
        onClose={() => setTransferModalOpen(false)}
        onTransfer={handleTransferConfirm}
        loading={transferLoading}
      />
    </section>
  );
}
