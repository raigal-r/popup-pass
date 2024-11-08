// components/DelegatorButton.tsx
import { useState } from "react";
import { ethers } from "ethers";

const DelegatorButton = () => {
  const [loading, setLoading] = useState(false);
  const [delegatorAddress, setDelegatorAddress] = useState<string>("");

  // Replace with your deployed ERC6551 contract address and ABI
  const contractAddress = "YOUR_CONTRACT_ADDRESS";
  const contractABI = [
    // Add the necessary ABI functions from your contract
    "function addDelegator(address delegator) external",
    "function removeDelegator(address delegator) external",
  ];

  const handleDelegate = async () => {
    if (!delegatorAddress) return alert("Please enter a valid address");

    try {
      setLoading(true);

      // Get signer and contract
      // Request MetaMask connection
      await window.ethereum.request({ method: "eth_requestAccounts" });

      // Ensure we're on Arbitrum Sepolia Network
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const { chainId } = await provider.getNetwork();
      const signer = provider.getSigner();
      const contract = new ethers.Contract(contractAddress, contractABI, signer);

      // Call the addDelegator function
      const tx = await contract.addDelegator(delegatorAddress);
      await tx.wait(); // Wait for transaction to be mined

      alert(`Delegated successfully to ${delegatorAddress}`);
    } catch (error) {
      console.error("Error delegating:", error);
      alert("Delegation failed!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <input
        type="text"
        value={delegatorAddress}
        onChange={e => setDelegatorAddress(e.target.value)}
        placeholder="Enter delegator address"
        className="p-2 border rounded-md"
      />
      <button onClick={handleDelegate} disabled={loading} className="bg-blue-500 text-white p-2 rounded-md">
        {loading ? "Delegating..." : "Delegate"}
      </button>
    </div>
  );
};

export default DelegatorButton;
