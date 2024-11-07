import React, { useEffect, useState } from "react";
import Image from "next/image";
import { passportAbi } from "@/src/generated";
import { ImagePlus, Ticket } from "lucide-react";
import { arbitrumSepolia } from "viem/chains";
import { useAccount, useChainId, useSwitchChain, useWriteContract } from "wagmi";
import { notification } from "~~/utils/scaffold-eth/notification";

const CONTRACT_ADDRESS = "0xd9145CCE52D386f254917e481eB44e9943F39138";

type Stamp = {
  id: string;
  imageUrl?: string;
};

type PassportData = {
  src: string;
  stamps: Stamp[];
};

const mockedPassport = {
  src: "/passport_raigal.jpg",
  stamps: Array(3).fill(null),
};

const Passport = ({ userVerified }: { userVerified: boolean }) => {
  const [loading, setLoading] = useState<"create" | "mint" | "recover">();
  const [passportData, setPassportData] = useState<PassportData>();

  const { address } = useAccount();
  const chainId = useChainId();
  const { switchChain } = useSwitchChain();

  // Separate contract writing logic
  const { writeContract, isPending, error: contractError, isSuccess, reset: resetContractWrite } = useWriteContract();

  // Handle contract interaction states
  useEffect(() => {
    if (contractError) {
      notification.error(
        `Error minting passport: ${contractError instanceof Error ? contractError.message : "Unknown error occurred"}`,
      );
      setLoading(undefined);
      resetContractWrite();
    }

    if (isSuccess) {
      notification.success("Passport minted successfully!");
      setPassportData(mockedPassport);
      setLoading(undefined);
      resetContractWrite();
    }
  }, [contractError, isSuccess, resetContractWrite]);

  const handleMintPassport = async () => {
    try {
      setLoading("mint");

      // Network check
      if (chainId !== arbitrumSepolia.id) {
        await switchChain({ chainId: arbitrumSepolia.id });
        return; // Early return as switchChain will trigger a re-render
      }

      // Generate random tokenId between 1 and 1000
      const tokenId = Math.floor(Math.random() * 1000) + 1;
      const uri = "https://ipfs.io/ipfs/QmPgzuqxyMznqT6hT2AU4LwLYfT75qswVSgi8tYXPnYCoT";

      if (!address) {
        throw new Error("No wallet address found");
      }

      // Write contract
      writeContract({
        address: CONTRACT_ADDRESS,
        abi: passportAbi,
        functionName: "safeMint",
        args: [address, BigInt(tokenId), uri],
      });
    } catch (error) {
      notification.error(`Error initiating mint: ${error instanceof Error ? error.message : "Unknown error occurred"}`);
      setLoading(undefined);
    }
  };

  // Render empty passport state
  if (!passportData) {
    return (
      <div className="sticky card card-compact bg-base-100 shadow-xl top-4 left-0 w-64">
        <figure className="rounded-2xl bg-gray-100 h-64 flex items-center justify-center">
          <div className="flex flex-col items-center justify-center text-gray-400">
            <Ticket size={48} className="mb-2" />
            <span className="text-sm font-medium">No passport</span>
          </div>
        </figure>
        <div className="card-body p-4">
          <button
            className="btn btn-secondary w-full"
            onClick={handleMintPassport}
            disabled={!userVerified || loading === "mint" || isPending}
          >
            {loading === "mint" || isPending ? <span className="loading loading-spinner"></span> : "Mint Passport"}
          </button>
        </div>
      </div>
    );
  }

  // Render passport with stamps
  return (
    <div className="sticky card card-compact bg-base-100 shadow-xl top-4 left-0 w-64">
      <figure className="rounded-2xl">
        {passportData.src ? (
          <Image src={passportData.src} alt="passport image" width={256} height={512} />
        ) : (
          <div className="bg-gray-100 h-64 flex items-center justify-center">
            <div className="flex flex-col items-center justify-center text-gray-400">
              <ImagePlus size={32} className="mb-2" />
              <span className="text-sm">No Image Available</span>
            </div>
          </div>
        )}
      </figure>
      <div className="card-body p-4">
        <div className="grid grid-cols-3 gap-2">
          {passportData.stamps?.map((stamp, index) => (
            <div
              key={stamp?.id || index}
              className="aspect-square rounded-lg border-2 border-dashed border-gray-300 flex items-center justify-center bg-gray-50 hover:bg-gray-100 transition-colors duration-200"
            >
              {stamp?.imageUrl ? (
                <Image
                  src={stamp.imageUrl}
                  alt={`Stamp ${index + 1}`}
                  width={64}
                  height={64}
                  className="w-full h-full object-cover rounded-lg"
                />
              ) : (
                <div className="flex flex-col items-center justify-center text-gray-400">
                  <ImagePlus size={20} className="mb-1" />
                  <span className="text-xs">Stamp {index + 1}</span>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Passport;