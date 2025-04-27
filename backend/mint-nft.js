const { ethers } = require('ethers');

// Minimal ERC721 ABI for minting
const ERC721_ABI = [
  "function safeMint(address to, string memory uri) public returns (uint256)",
];

async function mintNFTReceipt({
  providerUrl,
  privateKey,
  contractAddress,
  to,
  metadataUri,
}) {
  const provider = new ethers.JsonRpcProvider(providerUrl);
  const wallet = new ethers.Wallet(privateKey, provider);
  const contract = new ethers.Contract(contractAddress, ERC721_ABI, wallet);
  const tx = await contract.safeMint(to, metadataUri);
  await tx.wait();
  return tx.hash;
}

module.exports = { mintNFTReceipt };
