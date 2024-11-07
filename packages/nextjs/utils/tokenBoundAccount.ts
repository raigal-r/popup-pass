import { ethers } from "ethers";

// Your deployed ERC6551Registry contract address
const registryAddress = "0xcfc4D8923970D10254f540d9953c9448697bC68a";

// Your deployed NFT contract address
const nftContractAddress = "0x30d3123dbD81d9ebB099E415365d630fd39B89ea"; // Your actual NFT contract address

// ABI for the ERC6551Registry contract
const ERC6551RegistryABI = [
  "function createAccount(address nftContract, uint256 tokenId) external returns (address)"
];

// ABI for the ERC721 contract (simplified for minting and getting the token)
const ERC721ABI = [
  "function ownerOf(uint256 tokenId) external view returns (address)",
  "function mint(address to) external returns (uint256)"
];

// Create a provider (e.g., Infura, Alchemy, or directly from MetaMask)
const provider = new ethers.providers.Web3Provider(window.ethereum);

// Get the signer (your MetaMask or other Web3 wallet)
const signer = provider.getSigner();

// Create contract instances for ERC6551Registry and ERC721
const registryContract = new ethers.Contract(registryAddress, ERC6551RegistryABI, signer);
const nftContract = new ethers.Contract(nftContractAddress, ERC721ABI, signer);

async function createTokenBoundAccount(tokenId: number) {
  try {
    // Get the owner of the NFT (make sure the sender is the owner)
    const owner = await nftContract.ownerOf(tokenId);
    const sender = await signer.getAddress();

    if (owner.toLowerCase() !== sender.toLowerCase()) {
      console.error("You are not the owner of this token.");
      return;
    }

    // Call createAccount on the ERC6551Registry contract to create a Token Bound Account
    console.log("Creating Token Bound Account...");
    const tx = await registryContract.createAccount(nftContractAddress, tokenId);
    const receipt = await tx.wait();

    console.log("Token Bound Account created successfully!");
    console.log("Account Address:", receipt.logs[0].address); // This is the address of the created Token Bound Account
  } catch (error) {
    console.error("Error creating Token Bound Account:", error);
  }
}

// Example: Calling createTokenBoundAccount with token ID 1 (replace with your actual tokenId)
//createTokenBoundAccount(1); Number it's the Token ID
