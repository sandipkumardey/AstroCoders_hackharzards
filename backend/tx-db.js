const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const DB_PATH = path.join(__dirname, 'transactions.db');
const db = new sqlite3.Database(DB_PATH);

db.serialize(() => {
  db.run(`CREATE TABLE IF NOT EXISTS transactions (
    memo TEXT PRIMARY KEY,
    buyer TEXT,
    seller TEXT,
    amount TEXT,
    status TEXT,
    stellarTxHash TEXT,
    baseTxHash TEXT,
    nftTxHash TEXT,
    nftMetadataUri TEXT,
    createdAt TEXT DEFAULT CURRENT_TIMESTAMP
  )`);
});

function saveTransaction(tx) {
  db.run(
    `INSERT OR REPLACE INTO transactions (memo, buyer, seller, amount, status, stellarTxHash, baseTxHash, nftTxHash, nftMetadataUri) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [tx.memo, tx.buyer, tx.seller, tx.amount, tx.status, tx.stellarTxHash, tx.baseTxHash, tx.nftTxHash, tx.nftMetadataUri]
  );
}

function getAllTransactions(cb) {
  db.all('SELECT * FROM transactions ORDER BY createdAt DESC', (err, rows) => {
    cb(err, rows);
  });
}

function getTransactionsByAddress(address, cb) {
  db.all('SELECT * FROM transactions WHERE buyer = ? OR seller = ? ORDER BY createdAt DESC', [address, address], (err, rows) => {
    cb(err, rows);
  });
}

module.exports = { saveTransaction, getAllTransactions, getTransactionsByAddress };
