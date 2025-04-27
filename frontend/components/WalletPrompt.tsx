import { useAccount } from "wagmi";
import SellerWalletConnect from "@/components/SellerWalletConnect";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export function WalletPrompt({ children }: { children: React.ReactNode }) {
  const { isConnected } = useAccount();

  if (!isConnected) {
    return (
      <Card className="w-full max-w-md mx-auto my-12 shadow-lg">
        <CardHeader>
          <CardTitle>Connect Your Wallet</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center gap-4">
            <p className="text-muted-foreground text-center">
              To continue, please connect your wallet. This lets you buy tickets, view events, and more.
            </p>
            <SellerWalletConnect />
          </div>
        </CardContent>
      </Card>
    );
  }

  return <>{children}</>;
}
