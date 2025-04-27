import { useEffect, useState } from "react";
import axios from "axios";

export default function AdminTransactions() {
  const [transactions, setTransactions] = useState<any>({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    setLoading(true);
    setError("");
    axios.get("/api/all-transactions")
      .then(res => setTransactions(res.data.transactions))
      .catch(() => setError("Failed to load transactions."))
      .finally(() => setLoading(false));
  }, []);

  return (
    <section className="w-full max-w-4xl mx-auto my-8">
      <h2 className="text-xl font-bold mb-4">All Transactions (Admin)</h2>
      {loading ? (
        <div className="text-muted-foreground">Loading...</div>
      ) : error ? (
        <div className="text-red-600">{error}</div>
      ) : Object.keys(transactions).length === 0 ? (
        <div className="text-muted-foreground">No transactions found.</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full border text-xs">
            <thead>
              <tr className="bg-muted">
                <th className="py-2 px-3">Memo</th>
                <th className="py-2 px-3">Buyer</th>
                <th className="py-2 px-3">Seller</th>
                <th className="py-2 px-3">Amount</th>
                <th className="py-2 px-3">Status</th>
                <th className="py-2 px-3">Stellar Tx</th>
                <th className="py-2 px-3">Base Tx</th>
                <th className="py-2 px-3">NFT Tx</th>
                <th className="py-2 px-3">NFT Metadata</th>
              </tr>
            </thead>
            <tbody>
              {Object.entries(transactions).map(([memo, tx]: any) => (
                <tr key={memo} className="border-t">
                  <td className="py-1 px-3 font-mono">{memo}</td>
                  <td className="py-1 px-3 font-mono">{tx.buyer}</td>
                  <td className="py-1 px-3 font-mono">{tx.seller}</td>
                  <td className="py-1 px-3">{tx.amount}</td>
                  <td className="py-1 px-3">{tx.status}</td>
                  <td className="py-1 px-3 font-mono text-xs">{tx.stellarTxHash}</td>
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
                  <td className="py-1 px-3">
                    {tx.nftMetadataUri ? (
                      <a href={tx.nftMetadataUri} className="text-green-600 underline" target="_blank" rel="noopener noreferrer">Metadata</a>
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
