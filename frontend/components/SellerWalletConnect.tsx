"use client";
import { useState } from "react";
import { useAccount, useConnect, useDisconnect } from "wagmi";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function SellerWalletConnect({ onWalletConnected }: { onWalletConnected?: (address: string) => void }) {
  const { address, isConnected } = useAccount();
  const { connect, connectors } = useConnect();
  const { disconnect } = useDisconnect();

  // Find the Coinbase Wallet connector
  const coinbaseConnector = connectors.find(c => c.id === "coinbaseWallet");

  const handleConnect = async () => {
    if (coinbaseConnector) {
      await connect({ connector: coinbaseConnector });
      if (address && onWalletConnected) {
        onWalletConnected(address);
      }
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto mt-8 shadow-lg">
      <CardHeader>
        <CardTitle>Seller Wallet</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col items-center gap-4">
          {isConnected && address ? (
            <div className="flex flex-col items-center gap-2">
              <span className="text-green-600 font-bold">Connected:</span>
              <span className="break-all text-muted-foreground text-sm border rounded px-2 py-1 bg-background">
                {address}
              </span>
              <Button variant="destructive" onClick={() => disconnect()}>
                Disconnect
              </Button>
            </div>
          ) : (
            <Button
              variant="default"
              onClick={handleConnect}
              className="w-full"
            >
              Connect Base Wallet
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
