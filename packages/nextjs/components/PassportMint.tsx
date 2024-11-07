import React, { useState } from "react";
import { ethers } from "ethers";

// Define Arbitrum Sepolia contract address and ABI
const contractAddress = "0x30d3123dbD81d9ebB099E415365d630fd39B89ea";
const contractABI = ["function safeMint(address to, uint256 tokenId, string uri) public"];

const MintNFTButton = () => {
  const [minting, setMinting] = useState(false);
  const [message, setMessage] = useState("");

  // Mint NFT function
  const mintNFT = async () => {
    if (!window.ethereum) {
      setMessage("MetaMask not detected.");
      return;
    }

    try {
      // Request MetaMask connection
      await window.ethereum.request({ method: "eth_requestAccounts" });

      // Ensure we're on Arbitrum Sepolia Network
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const { chainId } = await provider.getNetwork();
      if (chainId !== 421613) {
        // Arbitrum Sepolia chain ID
        setMessage("Please connect to the Arbitrum Sepolia network.");
        return;
      }

      const signer = provider.getSigner();
      const nftContract = new ethers.Contract(contractAddress, contractABI, signer);

      // Token details
      const tokenId = 1; // Make sure to use a unique ID each time
      const uri = "https://ipfs.io/ipfs/QmPgzuqxyMznqT6hT2AU4LwLYfT75qswVSgi8tYXPnYCoT"; // Replace with actual metadata URI

      setMinting(true);
      setMessage("Minting in progress...");

      // Call safeMint function on the contract
      const tx = await nftContract.safeMint(await signer.getAddress(), tokenId, uri);
      await tx.wait();

      setMessage("Minting successful! Transaction hash: " + tx.hash);
    } catch (error) {
      console.error("Minting failed:", error);
      setMessage("Minting failed: " + error.message);
    } finally {
      setMinting(false);
    }
  };

  return (
    <div>
      <button onClick={mintNFT} disabled={minting}>
        {minting ? "Minting..." : "Mint NFT"}
      </button>
      {message && <p>{message}</p>}
    </div>
  );
};

export default MintNFTButton;
