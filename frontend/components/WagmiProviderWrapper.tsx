"use client";
import { WagmiProvider } from "wagmi";
import { config } from "../wagmi.config";

export default function WagmiProviderWrapper({ children }: { children: React.ReactNode }) {
  return <WagmiProvider config={config}>{children}</WagmiProvider>;
}
