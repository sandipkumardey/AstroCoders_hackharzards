"use client"
import Link from "next/link"
import Image from "next/image"
import { ArrowRight, Calendar, CheckCircle, Shield, Ticket, Wallet, Zap } from "lucide-react"
import { useRef, useEffect, useState } from "react"
import { useAccount } from "wagmi";

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { EventsSection } from "@/components/EventsSection"
import { HowItWorks } from "@/components/how-it-works"
import { Testimonials } from "@/components/testimonials"
import { FAQ } from "@/components/faq"
import BuyTicketModal from "@/components/BuyTicketModal";
import { ResellModal } from "@/components/resell-modal";
import { toast } from "@/components/ui/use-toast";
import { WalletPrompt } from "@/components/WalletPrompt";
import SellerWalletConnect from "@/components/SellerWalletConnect";
import MyTicketsDashboard from "@/components/MyTicketsDashboard";
import CrossChainPaymentModal from "@/components/CrossChainPaymentModal";
import TransactionHistory from "@/components/TransactionHistory";
import AdminTransactions from "@/components/AdminTransactions";

// Simulated wallet connect and role logic
const ADMIN_WALLET = "0xAdminWalletAddress";
const ORGANIZER_WALLET = "0xOrganizerWalletAddress";

// Fetch tickets for the connected wallet
async function fetchMyTickets(wallet: string) {
  if (!wallet) return [];
  const res = await fetch(`/api/tickets?wallet=${wallet}`);
  if (!res.ok) throw new Error('Failed to fetch tickets');
  const data = await res.json();
  return data.tickets || [];
}

// Fetch user role for the connected wallet
async function fetchUserRole(wallet: string) {
  if (!wallet) return null;
  const res = await fetch(`/api/users/me?wallet=${wallet}`);
  if (!res.ok) throw new Error('Failed to fetch user role');
  const data = await res.json();
  return data.user?.role || null;
}

export default function Home() {
  // Wallet connection state
  const [wallet, setWallet] = useState<string | null>(null);
  const [role, setRole] = useState<"admin" | "organizer" | "user" | null>(null);
  const [myTickets, setMyTickets] = useState<any[]>([]);
  const [ticketsLoading, setTicketsLoading] = useState(false);
  const [ticketsError, setTicketsError] = useState("");
  const [resellModalOpen, setResellModalOpen] = useState(false);
  const [resellTicket, setResellTicket] = useState<any>(null);
  const [resellLoading, setResellLoading] = useState(false);
  const [purchaseLoading, setPurchaseLoading] = useState(false);
  const [transferModalOpen, setTransferModalOpen] = useState(false);
  const [transferTicket, setTransferTicket] = useState<any>(null);
  const [transferWallet, setTransferWallet] = useState("");
  const [transferLoading, setTransferLoading] = useState(false);
  const [showDialog, setShowDialog] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<any | null>(null);
  const [isBuying, setIsBuying] = useState(false);
  const [buySuccess, setBuySuccess] = useState(false);
  const [crossChainOpen, setCrossChainOpen] = useState(false);
  const [lastCrossTx, setLastCrossTx] = useState<string | null>(null);

  const { address } = useAccount();

  // Simulate wallet connect modal (UI only)
  function handleConnectWallet() {
    // For demo: cycle through sample wallets
    if (!wallet) {
      setWallet(ADMIN_WALLET);
      setRole("admin");
    } else if (wallet === ADMIN_WALLET) {
      setWallet(ORGANIZER_WALLET);
      setRole("organizer");
    } else {
      setWallet("0xUserWalletAddress");
      setRole("user");
    }
  }
  function handleDisconnect() {
    setWallet(null);
    setRole(null);
  }

  // Fetch tickets and user role when wallet changes
  useEffect(() => {
    if (!wallet) {
      setMyTickets([]);
      setRole(null);
      return;
    }
    setTicketsLoading(true);
    setTicketsError("");
    fetchMyTickets(wallet)
      .then(setMyTickets)
      .catch(() => setTicketsError("Failed to load tickets."))
      .finally(() => setTicketsLoading(false));
    fetchUserRole(wallet)
      .then(setRole)
      .catch(() => setRole(null));
  }, [wallet]);

  // Sticky section highlight logic
  const [activeSection, setActiveSection] = useState('')
  const sectionIds = ["how-it-works", "events", "benefits", "faq", "about"]
  const sectionRefs = useRef({})

  useEffect(() => {
    const handleScroll = () => {
      let found = ''
      for (let id of sectionIds) {
        const el = document.getElementById(id)
        if (el) {
          const rect = el.getBoundingClientRect()
          if (rect.top <= 80 && rect.bottom > 80) {
            found = id
            break
          }
        }
      }
      setActiveSection(found)
    }
    window.addEventListener('scroll', handleScroll, { passive: true })
    handleScroll()
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  async function handleResell(ticket: any) {
    setResellTicket(ticket);
    setResellModalOpen(true);
  }

  async function handleResellSubmit(ticket: any, price: string) {
    setResellLoading(true);
    try {
      const res = await fetch('/api/tickets/resell', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ticketId: ticket.id, price }),
      });
      if (!res.ok) {
        const error = await res.json();
        toast({
          title: 'Resell Failed',
          description: error.error || 'Failed to list ticket for resale',
          variant: 'destructive',
        });
        throw new Error(error.error || 'Failed to list ticket for resale');
      }
      toast({
        title: 'Ticket Listed for Resale',
        description: `Your ticket for ${ticket.eventName || ticket.eventTitle || ticket.event || 'the event'} is now listed at ${price} USDC.`,
      });
      // Optionally refresh tickets list
      fetchMyTickets(wallet!).then(setMyTickets);
    } finally {
      setResellLoading(false);
      setResellModalOpen(false);
    }
  }

  async function handlePurchase(ticket: any) {
    setPurchaseLoading(true);
    try {
      const res = await fetch('/api/tickets/purchase', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ticketId: ticket.id, buyer_wallet: wallet, price: ticket.price }),
      });
      if (!res.ok) {
        const error = await res.json();
        toast({
          title: 'Purchase Failed',
          description: error.detail || 'Failed to purchase ticket',
          variant: 'destructive',
        });
        throw new Error(error.detail || 'Failed to purchase ticket');
      }
      toast({
        title: 'Ticket Purchased',
        description: `You have purchased the ticket for ${ticket.price} USDC.`,
      });
      fetchMyTickets(wallet!).then(setMyTickets);
    } finally {
      setPurchaseLoading(false);
    }
  }

  function handleTransfer(ticket: any) {
    setTransferTicket(ticket);
    setTransferModalOpen(true);
    setTransferWallet("");
  }

  async function handleTransferSubmit() {
    if (!transferWallet) return;
    setTransferLoading(true);
    try {
      const res = await fetch('/api/tickets/transfer', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ticketId: transferTicket.id, to_wallet: transferWallet }),
      });
      if (!res.ok) {
        const error = await res.json();
        toast({
          title: 'Transfer Failed',
          description: error.detail || 'Failed to transfer ticket',
          variant: 'destructive',
        });
        throw new Error(error.detail || 'Failed to transfer ticket');
      }
      toast({
        title: 'Ticket Transferred',
        description: `Ticket transferred to ${transferWallet}.`,
      });
      fetchMyTickets(wallet!).then(setMyTickets);
      setTransferModalOpen(false);
      setTransferTicket(null);
      setTransferWallet("");
    } finally {
      setTransferLoading(false);
    }
  }

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

  const handleCrossChainSuccess = (txHash: string) => {
    setLastCrossTx(txHash);
    toast({
      title: "Cross-chain Payment Successful!",
      description: `Tx Hash: ${txHash}`,
      variant: "default",
    });
  };
  const handleCrossChainError = (err: string) => {
    toast({
      title: "Cross-chain Payment Failed",
      description: err,
      variant: "destructive",
    });
  };

  return (
    <div className="flex flex-col min-h-screen scroll-smooth">
      {/* Wallet banner */}
      <div className="w-full bg-gradient-to-r from-purple-900 to-purple-600 text-white text-xs md:text-sm py-2 px-4 flex items-center justify-between">
        <div>
          {wallet ? (
            <span>Wallet connected: <span className="font-mono">{wallet}</span> ({role})</span>
          ) : (
            <span>Connect your wallet to unlock personalized features.</span>
          )}
        </div>
        <div>
          {wallet ? (
            <Button size="sm" variant="outline" className="text-purple-700 bg-white border-white hover:bg-purple-100 hover:text-purple-900" onClick={handleDisconnect}>
              Disconnect
            </Button>
          ) : (
            <Button size="sm" className="bg-white text-purple-900 hover:bg-purple-100" onClick={handleConnectWallet}>
              Connect Wallet
            </Button>
          )}
        </div>
      </div>
      {/* My Tickets Section */}
      {wallet && (
        <section className="container mx-auto my-12 p-6 bg-white rounded-lg shadow-md">
          <h2 className="text-2xl font-bold mb-4 flex items-center">
            <span className="mr-2">🎟️</span> My Tickets
          </h2>
          {ticketsLoading ? (
            <div className="text-gray-500">Loading your tickets...</div>
          ) : ticketsError ? (
            <div className="text-red-600">{ticketsError}</div>
          ) : myTickets.length === 0 ? (
            <div className="text-gray-500">No tickets found for your wallet.</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Event</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">QR Code</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {myTickets.map((ticket) => (
                    <tr key={ticket.id}>
                      <td className="px-6 py-4 whitespace-nowrap font-semibold">{ticket.eventName || ticket.eventTitle || ticket.event || '—'}</td>
                      <td className="px-6 py-4 whitespace-nowrap">{ticket.date || '—'}</td>
                      <td className="px-6 py-4 whitespace-nowrap">{ticket.type || ticket.ticketType || 'General'}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${ticket.status === 'active' ? 'bg-green-100 text-green-800' : ticket.status === 'resale' ? 'bg-purple-100 text-purple-800' : 'bg-gray-100 text-gray-800'}`}>{ticket.status || 'active'}</span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {/* Show QR code if available */}
                        {ticket.qrCodeUrl ? (
                          <a href={ticket.qrCodeUrl} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">View QR</a>
                        ) : (
                          <span className="text-gray-400">N/A</span>
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {/* Purchase button for resale tickets */}
                        {ticket.status === 'resale' && (
                          <button
                            className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded text-xs font-semibold mr-2"
                            onClick={() => handlePurchase(ticket)}
                          >
                            Buy
                          </button>
                        )}
                        {/* Transfer button for owned tickets */}
                        {ticket.status === 'active' && (
                          <button
                            className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded text-xs font-semibold mr-2"
                            onClick={() => handleTransfer(ticket)}
                          >
                            Transfer
                          </button>
                        )}
                        {/* Resell button for owned tickets */}
                        <button
                          className="bg-purple-600 hover:bg-purple-700 text-white px-3 py-1 rounded text-xs font-semibold disabled:opacity-50"
                          disabled={ticket.status !== 'active'}
                          onClick={() => handleResell(ticket)}
                        >
                          Resell
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      )}
      {/* Example: Only show "Create Event" if organizer or admin */}
      {(role === "organizer" || role === "admin") && (
        <section className="w-full py-8 bg-blue-50 dark:bg-blue-900 border-b border-blue-200 dark:border-blue-800">
          <div className="container px-4 md:px-6 mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="text-lg font-semibold text-blue-900 dark:text-blue-100">Organizer Tools</div>
            <Button className="bg-blue-700 hover:bg-blue-800 text-white">Create Event</Button>
          </div>
        </section>
      )}
      {/* Example: Only show "Admin Tools" if admin */}
      {role === "admin" && (
        <section className="w-full py-8 bg-green-50 dark:bg-green-900 border-b border-green-200 dark:border-green-800">
          <div className="container px-4 md:px-6 mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="text-lg font-semibold text-green-900 dark:text-green-100">Admin Tools</div>
            <Button className="bg-green-700 hover:bg-green-800 text-white">Admin Dashboard</Button>
          </div>
        </section>
      )}
      {/* Existing landing page sections */}
      {/* Hero Section */}
      <section id="hero" className="relative w-full py-12 md:py-24 lg:py-32 xl:py-48 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-black to-purple-950 z-0">
          <div className="absolute inset-0 opacity-20 mix-blend-overlay">
            <Image
              src="/placeholder.svg?height=1080&width=1920"
              alt="Background"
              fill
              className="object-cover"
              priority
            />
          </div>
        </div>
        {/* Animated circles */}
        <div className="absolute top-1/4 right-1/4 w-64 h-64 bg-purple-600/30 rounded-full filter blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 left-1/3 w-96 h-96 bg-blue-600/20 rounded-full filter blur-3xl animate-pulse delay-700"></div>
        <div className="container px-4 md:px-6 mx-auto relative z-10">
          <div className="grid gap-6 lg:grid-cols-[1fr_400px] lg:gap-12 xl:grid-cols-[1fr_600px]">
            <div className="flex flex-col justify-center space-y-4">
              <div className="inline-flex items-center rounded-full border border-purple-200/30 bg-purple-900/20 px-3 py-1 text-sm text-purple-200 backdrop-blur-sm">
                <span className="mr-2 rounded-full bg-purple-500 px-1.5 py-0.5 text-xs text-white">New</span>
                <span>Secure reselling with blockchain technology</span>
              </div>
              <div className="space-y-2">
                <h1 className="text-3xl font-bold tracking-tighter sm:text-5xl xl:text-6xl/none text-white">
                  The Future of{" "}
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-purple-600">
                    Event Ticketing
                  </span>{" "}
                  is Here
                </h1>
                <p className="max-w-[600px] text-gray-300 md:text-xl">
                  Buy, sell, and resell event tickets with confidence using our cross-chain payment system. No more
                  scams, no more worries.
                </p>
              </div>
              <div className="flex flex-col gap-2 min-[400px]:flex-row">
                <Button asChild size="lg" className="bg-gradient-to-r from-purple-600 to-purple-800 hover:from-purple-700 hover:to-purple-900 border-0">
                  <a href="#events" onClick={e => scrollToSection(e, '#events')}>
                    Explore Events <ArrowRight className="ml-2 h-4 w-4" />
                  </a>
                </Button>
                <Button asChild variant="outline" size="lg" className="border-purple-500 text-purple-300 hover:bg-purple-900/20">
                  <a href="#how-it-works" onClick={e => scrollToSection(e, '#how-it-works')}>How It Works</a>
                </Button>
              </div>
              <div className="flex flex-wrap items-center gap-4 text-sm text-gray-400 mt-4">
                <div className="flex items-center space-x-1 bg-white/5 backdrop-blur-sm px-3 py-1 rounded-full">
                  <Ticket className="h-4 w-4 text-purple-400" />
                  <span>Secure Tickets</span>
                </div>
                <div className="flex items-center space-x-1 bg-white/5 backdrop-blur-sm px-3 py-1 rounded-full">
                  <Zap className="h-4 w-4 text-purple-400" />
                  <span>Cross-Chain Payments</span>
                </div>
                <div className="flex items-center space-x-1 bg-white/5 backdrop-blur-sm px-3 py-1 rounded-full">
                  <Calendar className="h-4 w-4 text-purple-400" />
                  <span>NFT Receipts</span>
                </div>
              </div>
            </div>
            <div className="relative lg:pl-6 mt-8 lg:mt-0">
              <div className="relative overflow-hidden rounded-xl border border-purple-500/20 bg-gradient-to-b from-purple-900/80 to-black/80 shadow-2xl backdrop-blur-sm">
                <div className="absolute inset-0 bg-grid-white/5 bg-[size:20px_20px] opacity-10"></div>
                <div className="p-6">
                  <div className="space-y-2 text-center">
                    <div className="inline-flex items-center rounded-full border border-purple-500/30 bg-purple-500/10 px-3 py-1 text-sm text-purple-300 backdrop-blur-sm mb-2">
                      <span className="animate-pulse mr-1 h-2 w-2 rounded-full bg-purple-400"></span>
                      Live Now
                    </div>
                    <h3 className="text-xl font-bold text-white">Blockchain Summit 2024</h3>
                    <p className="text-gray-300">San Francisco, CA • June 15, 2024</p>
                  </div>
                  <div className="mt-6 space-y-4">
                    <div className="flex justify-between">
                      <span className="text-gray-400">Date</span>
                      <span className="text-white">June 15, 2024</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Location</span>
                      <span className="text-white">Moscone Center</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Price</span>
                      <span className="text-white font-bold">50 USDC</span>
                    </div>
                    <div className="relative">
                      <div className="absolute -inset-0.5 bg-gradient-to-r from-purple-500 to-purple-700 rounded-lg blur opacity-30 group-hover:opacity-100 transition duration-1000 group-hover:duration-200 animate-pulse"></div>
                      <Button className="relative w-full bg-gradient-to-r from-purple-600 to-purple-800 hover:from-purple-700 hover:to-purple-900 border-0">
                        Buy Tickets
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
              <div className="absolute -bottom-6 -left-6 h-24 w-24 rounded-full bg-purple-600/40 blur-[50px]" />
              <div className="absolute -top-6 -right-6 h-24 w-24 rounded-full bg-blue-600/40 blur-[50px]" />
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="w-full py-12 md:py-16 bg-white">
        <div className="container px-4 md:px-6 mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div className="space-y-2">
              <h3 className="text-3xl md:text-4xl font-bold text-purple-600">10K+</h3>
              <p className="text-sm md:text-base text-gray-500">Events Hosted</p>
            </div>
            <div className="space-y-2">
              <h3 className="text-3xl md:text-4xl font-bold text-purple-600">50K+</h3>
              <p className="text-sm md:text-base text-gray-500">Tickets Sold</p>
            </div>
            <div className="space-y-2">
              <h3 className="text-3xl md:text-4xl font-bold text-purple-600">99.9%</h3>
              <p className="text-sm md:text-base text-gray-500">Secure Transactions</p>
            </div>
            <div className="space-y-2">
              <h3 className="text-3xl md:text-4xl font-bold text-purple-600">0%</h3>
              <p className="text-sm md:text-base text-gray-500">Fraud Rate</p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works">
        <HowItWorks />
      </section>

      {/* Wallet Prompt and Events Section */}
      <WalletPrompt>
        <section id="events">
          <SellerWalletConnect />
          <EventsSection onBuy={handleBuy} />
        </section>
      </WalletPrompt>

      {/* Benefits Section */}
      <section id="benefits" className="w-full py-12 md:py-24 bg-gray-50">
        <div className="container px-4 md:px-6 mx-auto">
          <div className="flex flex-col items-center justify-center space-y-4 text-center mb-12">
            <div className="inline-flex items-center rounded-full border border-purple-200 bg-purple-50 px-3 py-1 text-sm text-purple-600">
              <span>Why Choose BlockTix</span>
            </div>
            <div className="space-y-2">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">The BlockTix Advantage</h2>
              <p className="max-w-[900px] text-gray-500 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                Our blockchain-powered platform offers benefits that traditional ticketing can't match
              </p>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="bg-white border-purple-100 hover:shadow-lg transition-all duration-200 hover:-translate-y-1">
              <CardContent className="p-6">
                <div className="rounded-full w-12 h-12 bg-purple-100 flex items-center justify-center mb-4">
                  <Shield className="h-6 w-6 text-purple-600" />
                </div>
                <h3 className="text-xl font-bold mb-2">Fraud-Proof Reselling</h3>
                <p className="text-gray-500">
                  Our blockchain technology automatically invalidates original tickets when resold, eliminating fraud
                  and scams.
                </p>
                <ul className="mt-4 space-y-2">
                  <li className="flex items-start">
                    <CheckCircle className="mr-2 h-4 w-4 text-green-500 mt-0.5" />
                    <span className="text-sm">Automatic ticket validation</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="mr-2 h-4 w-4 text-green-500 mt-0.5" />
                    <span className="text-sm">New QR codes for buyers</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="mr-2 h-4 w-4 text-green-500 mt-0.5" />
                    <span className="text-sm">Transparent transaction history</span>
                  </li>
                </ul>
              </CardContent>
            </Card>
            <Card className="bg-white border-purple-100 hover:shadow-lg transition-all duration-200 hover:-translate-y-1">
              <CardContent className="p-6">
                <div className="rounded-full w-12 h-12 bg-purple-100 flex items-center justify-center mb-4">
                  <Wallet className="h-6 w-6 text-purple-600" />
                </div>
                <h3 className="text-xl font-bold mb-2">Cross-Chain Payments</h3>
                <p className="text-gray-500">
                  Pay with Stellar USDC while sellers receive Base-native tokens, creating a seamless experience across
                  blockchains.
                </p>
                <ul className="mt-4 space-y-2">
                  <li className="flex items-start">
                    <CheckCircle className="mr-2 h-4 w-4 text-green-500 mt-0.5" />
                    <span className="text-sm">Multiple payment options</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="mr-2 h-4 w-4 text-green-500 mt-0.5" />
                    <span className="text-sm">Automatic currency conversion</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="mr-2 h-4 w-4 text-green-500 mt-0.5" />
                    <span className="text-sm">Instant settlement</span>
                  </li>
                </ul>
              </CardContent>
            </Card>
            <Card className="bg-white border-purple-100 hover:shadow-lg transition-all duration-200 hover:-translate-y-1">
              <CardContent className="p-6">
                <div className="rounded-full w-12 h-12 bg-purple-100 flex items-center justify-center mb-4">
                  <Ticket className="h-6 w-6 text-purple-600" />
                </div>
                <h3 className="text-xl font-bold mb-2">NFT Receipts</h3>
                <p className="text-gray-500">
                  Receive digital collectibles as proof of purchase that can also unlock exclusive perks and
                  experiences.
                </p>
                <ul className="mt-4 space-y-2">
                  <li className="flex items-start">
                    <CheckCircle className="mr-2 h-4 w-4 text-green-500 mt-0.5" />
                    <span className="text-sm">Digital memorabilia</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="mr-2 h-4 w-4 text-green-500 mt-0.5" />
                    <span className="text-sm">Exclusive holder benefits</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="mr-2 h-4 w-4 text-green-500 mt-0.5" />
                    <span className="text-sm">Tradable on NFT marketplaces</span>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section>
        <Testimonials />
      </section>

      {/* FAQ Section */}
      <section id="faq">
        <FAQ />
      </section>

      {/* About Section */}
      <section id="about" className="w-full py-12 md:py-24 bg-white dark:bg-black">
        <div className="container px-4 md:px-6 mx-auto text-center">
          <h1 className="text-3xl md:text-5xl font-bold text-purple-700 dark:text-purple-400 mb-8">About BlockTix</h1>
          <p className="max-w-2xl mx-auto text-lg md:text-xl text-gray-600 dark:text-gray-300 mb-6">
            BlockTix is a next-generation, blockchain-powered event ticketing and reselling platform. We ensure secure, cross-chain payments and fraud-proof reselling, empowering both organizers and attendees.
          </p>
          <p className="max-w-2xl mx-auto text-base md:text-lg text-gray-500 dark:text-gray-400">
            Built with Stellar, Base, and NFT technology, BlockTix is reimagining how the world experiences live events—making tickets more accessible, tradable, and secure.
          </p>
        </div>
      </section>

      {/* CTA Section */}
      <section className="w-full py-12 md:py-24 bg-purple-900 relative overflow-hidden">
        <div className="absolute inset-0 bg-grid-white/5 bg-[size:20px_20px] opacity-10"></div>
        <div className="absolute -top-24 -right-24 h-64 w-64 rounded-full bg-purple-700/30 blur-3xl"></div>
        <div className="absolute -bottom-24 -left-24 h-64 w-64 rounded-full bg-purple-700/30 blur-3xl"></div>
        <div className="container px-4 md:px-6 mx-auto relative">
          <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <div className="space-y-2">
              <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl text-white">
                Ready to Experience the Future of Ticketing?
              </h2>
              <p className="max-w-[600px] text-purple-200 md:text-xl/relaxed lg:text-base/relaxed xl:text-xl/relaxed">
                Join thousands of event-goers who have already made the switch to secure blockchain ticketing.
              </p>
            </div>
            <div className="flex flex-col gap-2 min-[400px]:flex-row mt-6">
              <Button asChild size="lg" className="bg-white text-purple-900 hover:bg-gray-100">
                <a href="#events" onClick={e => scrollToSection(e, '#events')}>
                  Browse Events <ArrowRight className="ml-2 h-4 w-4" />
                </a>
              </Button>
              <Button asChild variant="outline" size="lg" className="border-white text-white hover:bg-purple-800/20">
                <a href="#how-it-works" onClick={e => scrollToSection(e, '#how-it-works')}>Learn More</a>
              </Button>
            </div>
          </div>
        </div>
      </section>
      <section className="w-full flex justify-center mt-6">
        <Button className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-lg shadow-lg" onClick={() => setCrossChainOpen(true)}>
          Cross-Chain Payment (Stellar → Base)
        </Button>
      </section>
      <MyTicketsDashboard />
      <TransactionHistory address={address || ""} />
      <AdminTransactions />
      <ResellModal
        open={resellModalOpen}
        ticket={resellTicket}
        onClose={() => setResellModalOpen(false)}
        onResell={handleResellSubmit}
      />
      {transferModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-96 shadow-lg">
            <h3 className="text-lg font-bold mb-2">Transfer Ticket</h3>
            <p className="mb-4">Enter the wallet address to transfer your ticket to:</p>
            <input
              className="w-full border px-3 py-2 rounded mb-4"
              type="text"
              placeholder="Recipient Wallet Address"
              value={transferWallet}
              onChange={e => setTransferWallet(e.target.value)}
            />
            <div className="flex gap-2">
              <button
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
                onClick={handleTransferSubmit}
                disabled={transferLoading || !transferWallet}
              >
                {transferLoading ? 'Transferring...' : 'Transfer'}
              </button>
              <button
                className="bg-gray-300 hover:bg-gray-400 text-gray-800 px-4 py-2 rounded"
                onClick={() => setTransferModalOpen(false)}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
      <BuyTicketModal
        open={showDialog}
        event={selectedEvent}
        isBuying={isBuying}
        buySuccess={buySuccess}
        onClose={() => setShowDialog(false)}
        onConfirmBuy={handleConfirmBuy}
      />
      <CrossChainPaymentModal
        open={crossChainOpen}
        onClose={() => setCrossChainOpen(false)}
        onSuccess={handleCrossChainSuccess}
        onError={handleCrossChainError}
      />
    </div>
  )
}

function scrollToSection(e: React.MouseEvent<HTMLAnchorElement, MouseEvent>, href: string) {
  e.preventDefault()
  const id = href.replace('#', '')
  const el = document.getElementById(id)
  if (el) {
    el.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }
}

function Navbar({ activeSection }: { activeSection: string }) {
  const navLinks = [
    { href: "#how-it-works", label: "How It Works" },
    { href: "#events", label: "Events" },
    { href: "#benefits", label: "Benefits" },
    { href: "#faq", label: "FAQ" },
    { href: "#about", label: "About" },
  ]
  return (
    <nav className="sticky top-0 z-50 w-full bg-white/80 dark:bg-black/80 backdrop-blur border-b border-purple-100 dark:border-purple-900">
      <div className="container mx-auto px-4 flex h-16 items-center justify-between">
        <a href="#hero" onClick={e => scrollToSection(e, '#hero')} className="font-bold text-xl text-purple-700 dark:text-purple-400">BlockTix</a>
        <div className="flex gap-6 text-base font-medium">
          {navLinks.map(link => (
            <a
              key={link.href}
              href={link.href}
              onClick={e => scrollToSection(e, link.href)}
              className={`hover:text-purple-600 transition-colors ${activeSection === link.href.replace('#', '') ? 'text-purple-700 dark:text-purple-300 font-bold underline underline-offset-8' : ''}`}
            >
              {link.label}
            </a>
          ))}
        </div>
        <Button size="sm" className="bg-gradient-to-r from-purple-600 to-purple-800 text-white">Connect Wallet</Button>
      </div>
    </nav>
  )
}
