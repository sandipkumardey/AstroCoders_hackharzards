const { NFTStorage, File } = require('nft.storage');
const fetch = require('node-fetch');

async function uploadNftMetadata({
  apiKey,
  name,
  description,
  imageUrl,
  attributes = [],
}) {
  const nftStorage = new NFTStorage({ token: apiKey });
  let imageFile = undefined;
  if (imageUrl) {
    // Fetch and convert image to File
    const res = await fetch(imageUrl);
    const buf = await res.buffer();
    imageFile = new File([buf], 'ticket.png', { type: 'image/png' });
  }
  const metadata = {
    name,
    description,
    image: imageFile,
    attributes,
  };
  const cid = await nftStorage.store(metadata);
  return `https://ipfs.io/ipfs/${cid.ipnft}/metadata.json`;
}

module.exports = { uploadNftMetadata };
