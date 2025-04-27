import { useEffect, useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface PayoutStatusProps {
  orderId: string;
  buyerEmail?: string;
}

export default function PayoutStatus({ orderId, buyerEmail }: PayoutStatusProps) {
  const [status, setStatus] = useState<string>("Loading...");
  const [txHash, setTxHash] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [notified, setNotified] = useState(false);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    async function fetchStatus() {
      setLoading(true);
      try {
        const res = await fetch(`/api/payments/status/${orderId}`);
        const data = await res.json();
        setStatus(data.message);
        setTxHash(data.tx_hash || null);
        // Notification logic
        if (!notified && data.tx_hash) {
          if (window.Notification && Notification.permission === "granted") {
            new Notification("Payout Sent!", {
              body: `Base Tx Hash: ${data.tx_hash}`,
            });
          } else if (window.Notification && Notification.permission !== "denied") {
            Notification.requestPermission().then(permission => {
              if (permission === "granted") {
                new Notification("Payout Sent!", {
                  body: `Base Tx Hash: ${data.tx_hash}`,
                });
              }
            });
          }
          setNotified(true);
        }
        // Buyer email notification (browser)
        if (buyerEmail && data.paid && data.tx_hash && !notified) {
          alert(`Payment received and payout sent!\nBase Tx Hash: ${data.tx_hash}`);
        }
      } catch (err) {
        setStatus("Error fetching status");
      }
      setLoading(false);
    }
    fetchStatus();
    interval = setInterval(fetchStatus, 5000); // Poll every 5s
    return () => clearInterval(interval);
    // eslint-disable-next-line
  }, [orderId, notified, buyerEmail]);

  // Map status to badge variant (limited to allowed types)
  let badgeVariant: "default" | "secondary" | "destructive" | "outline" | undefined = "outline";
  if (loading) badgeVariant = "secondary";
  else if (status === "Paid") badgeVariant = "default";
  else if (status === "Error fetching status") badgeVariant = "destructive";

  return (
    <Card className="w-full max-w-lg mx-auto mt-8 shadow-lg">
      <CardHeader>
        <CardTitle>Payment & Payout Status</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col gap-2 items-center">
          <Badge variant={badgeVariant}>
            {loading ? "Checking..." : status}
          </Badge>
          {txHash && (
            <div className="flex flex-col items-center mt-2">
              <span className="font-mono text-xs text-muted-foreground">Base Tx Hash:</span>
              <a
                href={`https://basescan.org/tx/${txHash}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 underline break-all text-xs mt-1"
              >
                {txHash}
              </a>
              <Button
                asChild
                size="sm"
                variant="outline"
                className="mt-2"
              >
                <a href={`https://basescan.org/tx/${txHash}`} target="_blank" rel="noopener noreferrer">
                  View on BaseScan
                </a>
              </Button>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
