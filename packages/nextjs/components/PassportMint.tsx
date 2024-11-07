import React, { useState } from "react";
import { ethers } from "ethers";

// Define Arbitrum Sepolia contract address and ABI
const contractAddress = "0x30d3123dbD81d9ebB099E415365d630fd39B89ea";
const contractABI = ["function safeMint(address to, uint256 tokenId, string uri) public"];

// Your deployed ERC6551Registry contract address
const registryAddress = "0xcfc4D8923970D10254f540d9953c9448697bC68a";
// ABI for the ERC6551Registry contract
const ERC6551RegistryABI = ["function createAccount(address nftContract, uint256 tokenId) external returns (address)"];

const delay = ms => new Promise(resolve => setTimeout(resolve, ms));

const MintNFTButton = () => {
  const [minting, setMinting] = useState(false);
  const [message, setMessage] = useState("");

  // Generate a random tokenId between 1 and 1000
  const getRandomTokenId = () => Math.floor(Math.random() * 1000) + 1;

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
      // Uncomment this if you want to ensure the correct network
      // if (chainId !== 421613) {
      //   setMessage("Please connect to the Arbitrum Sepolia network.");
      //   return;
      // }

      const signer = provider.getSigner();
      const nftContract = new ethers.Contract(contractAddress, contractABI, signer);
      const registryContract = new ethers.Contract(registryAddress, ERC6551RegistryABI, signer);

      // Token details
      const tokenId = getRandomTokenId();
      const uri = "https://ipfs.io/ipfs/QmPgzuqxyMznqT6hT2AU4LwLYfT75qswVSgi8tYXPnYCoT"; // Replace with actual metadata URI

      setMinting(true);
      setMessage("Minting in progress...");

      // Call safeMint function on the contract
      const mintTx = await nftContract.safeMint(await signer.getAddress(), tokenId, uri);
      await mintTx.wait();

      setMessage("Minting successful! Transaction hash: " + mintTx.hash);
      await delay(10000); // Delay for 5 seconds (adjust as necessary)

      try {
        // Get the owner of the NFT (ensure the sender is the owner)
        // const owner = await nftContract.ownerOf(tokenId);
        // const sender = await signer.getAddress();

        // if (owner.toLowerCase() !== sender.toLowerCase()) {
        //   console.error("You are not the owner of this token.");
        //   return;
        // }

        // Call createAccount on the ERC6551Registry contract to create a Token Bound Account
        console.log("Creating Token Bound Account...");
        const createAccountTx = await registryContract.createAccount(contractAddress, tokenId);
        const receipt = await createAccountTx.wait();

        console.log("Token Bound Account created successfully!");
        console.log("Receipt:", receipt); // This is the address of the created Token Bound Account
      } catch (error) {
        console.error("Error creating Token Bound Account:", error);
        setMessage("Error creating Token Bound Account: " + error.message);
      }
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
