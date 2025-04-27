require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const { Server } = require('http');
const { Keypair, Server: StellarServer, Asset, TransactionBuilder, Networks } = require('stellar-sdk');
const { ethers } = require('ethers');
const { mintNFTReceipt } = require('./mint-nft');
const { uploadNftMetadata } = require('./upload-nft-metadata');
const { saveTransaction, getAllTransactions, getTransactionsByAddress } = require('./tx-db');
const rateLimit = require('express-rate-limit');
const { body, validationResult } = require('express-validator');

const app = express();
app.use(bodyParser.json());

// === CONFIG ===
const STELLAR_HORIZON_URL = process.env.STELLAR_HORIZON_URL || 'https://horizon-testnet.stellar.org';
const STELLAR_USDC_ISSUER = process.env.STELLAR_USDC_ISSUER || 'GA5ZSE7VJ4QFQG5...'; // TODO: Set real issuer
const BASE_RPC_URL = process.env.BASE_RPC_URL || 'https://base-goerli.public.blastapi.io';
const BASE_PRIVATE_KEY = process.env.BASE_PRIVATE_KEY || '';
const BASE_USDC_ADDRESS = process.env.BASE_USDC_ADDRESS || '';
const NFT_CONTRACT_ADDRESS = process.env.NFT_CONTRACT_ADDRESS || '';
const NFT_STORAGE_API_KEY = process.env.NFT_STORAGE_API_KEY || '';

const stellarServer = new StellarServer(STELLAR_HORIZON_URL);
const provider = new ethers.JsonRpcProvider(BASE_RPC_URL);
const baseWallet = new ethers.Wallet(BASE_PRIVATE_KEY, provider);

// === Rate Limiting ===
const apiLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 30, // limit each IP to 30 requests per windowMs
  message: 'Too many requests, please try again later.'
});
app.use('/api/', apiLimiter);

// === Admin Auth Middleware ===
function requireAdmin(req, res, next) {
  const adminSecret = process.env.ADMIN_SECRET;
  const auth = req.headers['authorization'];
  if (!adminSecret || !auth || auth !== `Bearer ${adminSecret}`) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  next();
}

// === Save to DB on transaction update ===
async function persistTransaction(memo, tx) {
  await saveTransaction({ memo, ...tx });
}

// === 1. Create Stellar Payment Request ===
app.post(
  '/api/payment-request',
  [
    body('buyer').isString().notEmpty(),
    body('amount').isString().notEmpty(),
    body('ticketId').isString().notEmpty(),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
    const { buyer, amount, ticketId } = req.body;
    const memo = Math.random().toString(36).slice(2, 10).toUpperCase();
    await persistTransaction(memo, { status: 'pending', buyer, amount, ticketId });
    res.json({ paymentAddress: process.env.STELLAR_RECEIVER_ADDRESS, memo });
  }
);

// === 2. Poll Stellar for Payment ===
app.get('/api/payment-status/:memo', async (req, res) => {
  const { memo } = req.params;
  getTransactionsByAddress(memo, async (err, rows) => {
    if (err) return res.status(500).json({ error: 'DB error' });
    const tx = rows[0];
    if (!tx) return res.status(404).json({ error: 'Not found' });
    try {
      const payments = await stellarServer.payments()
        .forAccount(process.env.STELLAR_RECEIVER_ADDRESS)
        .order('desc').limit(10).call();
      const found = payments.records.find(
        (p) => p.memo === memo &&
          p.asset_code === 'USDC' &&
          p.asset_issuer === STELLAR_USDC_ISSUER &&
          p.amount === tx.amount
      );
      if (found) {
        await persistTransaction(memo, { ...tx, status: 'confirmed', stellarTxHash: found.transaction_hash });
        res.json({ status: 'confirmed', tx: { ...tx, status: 'confirmed', stellarTxHash: found.transaction_hash } });
      } else {
        res.json({ status: 'pending', tx });
      }
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  });
});

// === 3. Trigger Base Transfer ===
app.post(
  '/api/settle-on-base',
  [
    body('memo').isString().notEmpty(),
    body('seller').isString().notEmpty(),
    body('amount').isString().notEmpty(),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
    const { memo, seller, amount } = req.body;
    getTransactionsByAddress(memo, async (err, rows) => {
      if (err) return res.status(500).json({ error: 'DB error' });
      const tx = rows[0];
      if (!tx) return res.status(404).json({ error: 'Not found' });
      try {
        const baseTx = await baseWallet.sendTransaction({
          to: seller,
          value: ethers.parseEther(amount),
        });
        await baseTx.wait();
        await persistTransaction(memo, { ...tx, baseTxHash: baseTx.hash, status: 'settled' });
        res.json({ status: 'settled', txHash: baseTx.hash });
      } catch (err) {
        res.status(500).json({ error: err.message });
      }
    });
  }
);

// === 4. (Bonus) Mint NFT Receipt with Dynamic Metadata ===
app.post(
  '/api/mint-nft-receipt',
  [
    body('to').isString().notEmpty(),
    body('event').isString().notEmpty(),
    body('ticketId').isString().notEmpty(),
    body('buyer').isString().notEmpty(),
    body('seller').isString().notEmpty(),
    body('imageUrl').isString().notEmpty(),
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
    const { to, event, ticketId, buyer, seller, imageUrl } = req.body;
    try {
      const metadataUri = await uploadNftMetadata({
        apiKey: NFT_STORAGE_API_KEY,
        name: `Ticket #${ticketId} for ${event}`,
        description: `Proof of purchase for event: ${event}, Ticket ID: ${ticketId}`,
        imageUrl,
        attributes: [
          { trait_type: "Event", value: event },
          { trait_type: "Ticket ID", value: ticketId },
          { trait_type: "Buyer", value: buyer },
          { trait_type: "Seller", value: seller },
        ],
      });
      const txHash = await mintNFTReceipt({
        providerUrl: process.env.BASE_RPC_URL,
        privateKey: process.env.BASE_PRIVATE_KEY,
        contractAddress: process.env.NFT_CONTRACT_ADDRESS,
        to,
        metadataUri,
      });
      // Persist NFT tx
      getTransactionsByAddress(ticketId, async (err, rows) => {
        if (!err && rows[0]) {
          await persistTransaction(ticketId, { ...rows[0], nftTxHash: txHash, nftMetadataUri: metadataUri });
        }
      });
      res.json({ status: 'minted', txHash, metadataUri });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }
);

// === 5. Get Transaction Status ===
app.get('/api/transaction/:memo', async (req, res) => {
  const { memo } = req.params;
  getTransactionsByAddress(memo, async (err, rows) => {
    if (err) return res.status(500).json({ error: 'DB error' });
    const tx = rows[0];
    if (!tx) return res.status(404).json({ error: 'Not found' });
    res.json(tx);
  });
});

// === 6. Transaction History by Address ===
app.get('/api/transaction-history/:address', async (req, res) => {
  const { address } = req.params;
  getTransactionsByAddress(address, async (err, rows) => {
    if (err) return res.status(500).json({ error: 'DB error' });
    res.json({ history: rows });
  });
});

// === 7. Admin: View All Transactions ===
app.get('/api/all-transactions', requireAdmin, async (req, res) => {
  getAllTransactions(async (err, rows) => {
    if (err) return res.status(500).json({ error: 'DB error' });
    res.json({ transactions: rows });
  });
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Backend listening on port ${PORT}`);
});
