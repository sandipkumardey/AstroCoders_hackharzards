import { useEffect, useState } from "react";
import axios from "axios";

export default function TransactionHistory({ address }: { address: string }) {
  const [history, setHistory] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!address) return;
    setLoading(true);
    setError("");
    axios.get(`/api/transaction-history/${address}`)
      .then(res => setHistory(res.data.history))
      .catch(() => setError("Failed to load history."))
      .finally(() => setLoading(false));
  }, [address]);

  if (!address) return null;

  return (
    <section className="w-full max-w-3xl mx-auto my-8">
      <h2 className="text-xl font-bold mb-4">Transaction History</h2>
      {loading ? (
        <div className="text-muted-foreground">Loading...</div>
      ) : error ? (
        <div className="text-red-600">{error}</div>
      ) : history.length === 0 ? (
        <div className="text-muted-foreground">No transactions found.</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full border text-sm">
            <thead>
              <tr className="bg-muted">
                <th className="py-2 px-3">Type</th>
                <th className="py-2 px-3">Amount</th>
                <th className="py-2 px-3">Status</th>
                <th className="py-2 px-3">Stellar Memo</th>
                <th className="py-2 px-3">Base Tx</th>
                <th className="py-2 px-3">NFT Tx</th>
              </tr>
            </thead>
            <tbody>
              {history.map((tx, i) => (
                <tr key={i} className="border-t">
                  <td className="py-1 px-3">{tx.type}</td>
                  <td className="py-1 px-3">{tx.amount}</td>
                  <td className="py-1 px-3">{tx.status}</td>
                  <td className="py-1 px-3 font-mono text-xs">{tx.memo}</td>
                  <td className="py-1 px-3">
                    {tx.baseTxHash ? (
                      <a href={`https://basescan.org/tx/${tx.baseTxHash}`} className="text-blue-600 underline" target="_blank" rel="noopener noreferrer">View</a>
                    ) : "-"}
                  </td>
                  <td className="py-1 px-3">
                    {tx.nftTxHash ? (
                      <a href={`https://basescan.org/tx/${tx.nftTxHash}`} className="text-purple-600 underline" target="_blank" rel="noopener noreferrer">View</a>
                    ) : "-"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}
