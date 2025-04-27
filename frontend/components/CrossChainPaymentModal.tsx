import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { Loader2, CheckCircle, XCircle } from "lucide-react";
import axios from "axios";
import toast from "react-hot-toast";
// @ts-ignore
import { QRCodeCanvas } from "qrcode.react";

interface CrossChainPaymentModalProps {
  open: boolean;
  onClose: () => void;
  onSuccess: (txHash: string) => void;
  onError: (error: string) => void;
  selectedTicket: any;
  selectedEvent: any;
  userStellarAddress: string;
  sellerWalletAddress: string;
}

// Helper: Generate NFT metadata for a ticket
function buildNftMetadata({ event, ticketId, buyer, seller, imageUrl }: any) {
  return {
    name: `Ticket #${ticketId} for ${event}`,
    description: `Proof of purchase for event: ${event}, Ticket ID: ${ticketId}`,
    imageUrl,
    event,
    ticketId,
    buyer,
    seller,
  };
}

export default function CrossChainPaymentModal({ open, onClose, onSuccess, onError, selectedTicket, selectedEvent, userStellarAddress, sellerWalletAddress }: CrossChainPaymentModalProps) {
  const [stellarAddr, setStellarAddr] = useState("");
  const [amount, setAmount] = useState("");
  const [step, setStep] = useState<"idle" | "pending" | "success" | "error">("idle");
  const [txHash, setTxHash] = useState("");
  const [error, setError] = useState("");
  const [paymentMemo, setPaymentMemo] = useState<string | null>(null);
  const [paymentQR, setPaymentQR] = useState<string | null>(null);
  const [polling, setPolling] = useState(false);
  const [baseTxHash, setBaseTxHash] = useState<string | null>(null);
  const [mintingNFT, setMintingNFT] = useState(false);
  const [nftTxHash, setNftTxHash] = useState<string | null>(null);
  const [nftError, setNftError] = useState<string | null>(null);
  const [nftMetadataUri, setNftMetadataUri] = useState<string | null>(null);
  const [nftImageUrl, setNftImageUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // 1. Request payment instructions from backend
  const handleCreatePaymentRequest = async () => {
    try {
      setLoading(true);
      setError(null);
      // Use real ticket/event/user data (for demo, hardcode)
      const ticketId = selectedTicket?.id || '12345';
      const event = selectedEvent?.name || 'Demo Event';
      const buyer = userStellarAddress || 'G...STELLAR';
      const resp = await axios.post("/api/payment-request", {
        buyer,
        amount,
        ticketId,
      });
      setPaymentQR(`stellar:${resp.data.paymentAddress}?memo=${resp.data.memo}`);
      setPaymentMemo(resp.data.memo);
      setStep("pending");
      toast.success("Payment request created!");
    } catch (err: any) {
      setError("Failed to create payment request.");
      toast.error("Failed to create payment request.");
    } finally {
      setLoading(false);
    }
  };

  // 2. Poll backend for payment confirmation
  useEffect(() => {
    if (!polling || !paymentMemo) return;
    let interval: any = null;
    interval = setInterval(async () => {
      try {
        const resp = await axios.get(`/api/payment-status/${paymentMemo}`);
        if (resp.data.status === "confirmed") {
          setPolling(false);
          // 3. Settle on Base
          const settleResp = await axios.post("/api/settle-on-base", {
            memo: paymentMemo,
            seller: sellerWalletAddress,
            amount,
          });
          setBaseTxHash(settleResp.data.txHash);
          setStep("success");
          setTxHash(settleResp.data.txHash);
          onSuccess(settleResp.data.txHash);
        }
      } catch (err) {
        // ignore polling errors
      }
    }, 3500);
    return () => clearInterval(interval);
  }, [polling, paymentMemo, amount, onSuccess, sellerWalletAddress]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await handleCreatePaymentRequest();
  };

  const handleClose = () => {
    setStep("idle");
    setStellarAddr("");
    setAmount("");
    setTxHash("");
    setError("");
    setPaymentMemo(null);
    setPaymentQR(null);
    setPolling(false);
    setBaseTxHash(null);
    setMintingNFT(false);
    setNftTxHash(null);
    setNftError(null);
    setNftMetadataUri(null);
    setNftImageUrl(null);
    onClose();
  };

  // NFT Mint Handler
  const handleMintNFT = async () => {
    setMintingNFT(true);
    setNftError(null);
    try {
      // Use real ticket/event/user data (for demo, hardcode)
      const ticketId = selectedTicket?.id || '12345';
      const event = selectedEvent?.name || 'Demo Event';
      const buyer = userStellarAddress || 'G...STELLAR';
      const seller = sellerWalletAddress || '0xSellerWalletAddress';
      const imageUrl = selectedTicket?.imageUrl || 'https://placehold.co/400x400?text=Ticket';
      const resp = await axios.post("/api/mint-nft-receipt", {
        to: seller,
        event,
        ticketId,
        buyer,
        seller,
        imageUrl,
      });
      setNftTxHash(resp.data.txHash);
      setNftMetadataUri(resp.data.metadataUri);
      toast.success("NFT receipt minted!");
    } catch (err: any) {
      setNftError("Failed to mint NFT receipt.");
      toast.error("Failed to mint NFT receipt.");
    } finally {
      setMintingNFT(false);
    }
  };

  useEffect(() => {
    if (nftMetadataUri) {
      axios.get(nftMetadataUri)
        .then(res => setNftImageUrl(res.data.image?.replace('ipfs://', 'https://ipfs.io/ipfs/')))
        .catch(() => setNftImageUrl(null));
    }
  }, [nftMetadataUri]);

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Cross-Chain Payment (Stellar → Base)</DialogTitle>
        </DialogHeader>
        {step === "idle" && (
          <form onSubmit={handleSubmit} className="space-y-4 mt-2">
            <div>
              <label className="block text-sm font-medium mb-1">Your Stellar Address</label>
              <input
                type="text"
                className="w-full border rounded px-3 py-2"
                placeholder="G..."
                value={stellarAddr}
                onChange={e => setStellarAddr(e.target.value)}
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Amount (USDC on Stellar)</label>
              <input
                type="number"
                className="w-full border rounded px-3 py-2"
                placeholder="10"
                value={amount}
                onChange={e => setAmount(e.target.value)}
                min="0.1"
                step="0.1"
                required
              />
            </div>
            <DialogFooter>
              <Button type="button" variant="ghost" onClick={handleClose}>Cancel</Button>
              <Button type="submit" className="bg-blue-600" disabled={loading}>Request Payment</Button>
            </DialogFooter>
          </form>
        )}
        {paymentQR && step === "pending" && (
          <div className="flex flex-col items-center justify-center py-4">
            <div className="mb-2">Scan or send payment using your Stellar wallet:</div>
            <div className="bg-gray-100 p-2 rounded mb-2 break-all text-xs">
              <b>Destination:</b> {paymentQR.split('?')[0].replace('stellar:', '')}<br />
              <b>Memo:</b> {paymentMemo}
            </div>
            <QRCodeCanvas value={paymentQR} size={148} className="my-2" />
            <div className="text-blue-600 text-xs mb-2">Waiting for payment confirmation on Stellar...</div>
            <Loader2 className="animate-spin text-blue-600 mb-3" size={36} />
          </div>
        )}
        {step === "success" && (
          <div className="flex flex-col items-center justify-center py-8">
            <CheckCircle className="text-green-600 mb-3" size={40} />
            <div className="text-lg font-semibold mb-2">Payment Complete!</div>
            <div className="text-sm mb-1">Base Tx Hash: <span className="font-mono">{baseTxHash}</span></div>
            <a
              href={`https://basescan.org/tx/${baseTxHash}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 underline text-sm mb-2"
            >
              View on BaseScan
            </a>
            <Button onClick={handleMintNFT} disabled={mintingNFT || !!nftTxHash} className="mt-2 bg-purple-600 text-white">
              {mintingNFT ? "Minting NFT..." : nftTxHash ? "NFT Minted!" : "Mint NFT Receipt"}
            </Button>
            {nftTxHash && (
              <div className="mt-2 text-green-600 text-xs">
                NFT Minted! Tx: <a href={`https://basescan.org/tx/${nftTxHash}`} target="_blank" rel="noopener noreferrer" className="underline">{nftTxHash}</a>
                {nftMetadataUri && (
                  <>
                    <br />Metadata: <a href={nftMetadataUri} target="_blank" rel="noopener noreferrer" className="underline">View Metadata</a>
                  </>
                )}
                {nftImageUrl && (
                  <div className="mt-2"><img src={nftImageUrl} alt="NFT preview" className="rounded w-40 h-40 object-cover border mx-auto" /></div>
                )}
              </div>
            )}
            {nftError && <div className="text-red-600 text-xs mt-1">{nftError}</div>}
            <Button onClick={handleClose} className="mt-4">Close</Button>
          </div>
        )}
        {step === "error" && (
          <div className="flex flex-col items-center justify-center py-8">
            <XCircle className="text-red-600 mb-3" size={40} />
            <div className="text-lg font-semibold mb-2">Transaction Failed</div>
            <div className="text-sm text-red-600 mb-2">{error}</div>
            <Button onClick={handleClose}>Close</Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
