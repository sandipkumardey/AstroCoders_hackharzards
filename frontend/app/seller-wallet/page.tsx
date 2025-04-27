"use client";
import SellerWalletConnect from "../../components/SellerWalletConnect";
import PayoutStatus from "../../components/PayoutStatus";
import { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

export default function SellerWalletPage() {
  const [orderId, setOrderId] = useState("");
  const [showStatus, setShowStatus] = useState(false);

  return (
    <main className="flex flex-col items-center justify-center min-h-screen bg-background">
      <h1 className="text-2xl font-bold mb-4">Connect Your Base Wallet for Payouts</h1>
      <SellerWalletConnect onWalletConnected={(address) => {
        // TODO: Send address to backend to save as seller payout address
        alert(`Wallet connected: ${address}`);
      }} />
      <Card className="w-full max-w-lg mt-8 shadow-lg">
        <CardHeader>
          <CardTitle>Check Payout Status for Order</CardTitle>
        </CardHeader>
        <CardContent>
          <form
            onSubmit={e => {
              e.preventDefault();
              setShowStatus(true);
            }}
            className="flex flex-col gap-4"
          >
            <Label htmlFor="orderId">Order ID</Label>
            <Input
              id="orderId"
              type="text"
              placeholder="Enter Order ID"
              value={orderId}
              onChange={e => setOrderId(e.target.value)}
              className="mb-2"
            />
            <Button type="submit" disabled={!orderId} className="w-full">
              Check Payout Status
            </Button>
          </form>
          {showStatus && orderId && <PayoutStatus orderId={orderId} />}
        </CardContent>
      </Card>
    </main>
  );
}
