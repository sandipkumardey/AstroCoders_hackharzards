"use client";
import { ReactNode } from "react";
import { OnchainKitProvider } from "@coinbase/onchainkit";
import { useAccount } from "wagmi";
import { base } from "viem/chains";

interface CrossChainWalletProviderProps {
  children: ReactNode;
}

export default function CrossChainWalletProvider({ children }: CrossChainWalletProviderProps) {
  const { address, isConnected } = useAccount();

  return (
    <OnchainKitProvider chain={base}>
      <div>
        {isConnected ? (
          <p>Wallet Connected: {address}</p>
        ) : (
          <button>Connect Wallet</button>
        )}
        {children}
      </div>
    </OnchainKitProvider>
  );
}
