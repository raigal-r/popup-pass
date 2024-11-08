import React, { useEffect, useState } from "react";
import Image from "next/image";
import { passportAbi, tokenBoundAccountRegistryAbi } from "@/src/generated";
import { ImagePlus, Ticket } from "lucide-react";
import { arbitrumSepolia } from "viem/chains";
import { useAccount, useChainId, useSwitchChain, useWriteContract } from "wagmi";
import { CONTRACTS } from "~~/contracts/contants";
import { notification } from "~~/utils/scaffold-eth/notification";

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
  stamps: Array(4).fill(null),
};

const Passport = ({ userVerified }: { userVerified: boolean }) => {
  const [loading, setLoading] = useState<"create" | "mint" | "recover">();
  const [passportData, setPassportData] = useState<PassportData>();
  const [tokenId, setTokenId] = useState<number>();
  const [mintStage, setMintStage] = useState<"passport" | "registry" | "completed">();

  const { address } = useAccount();
  const chainId = useChainId();
  const { switchChain } = useSwitchChain();

  // Contract writing hooks for both interactions
  const {
    writeContractAsync: writePassportContract,
    isPending: isPassportPending,
    error: passportError,
    isSuccess: isPassportSuccess,
    reset: resetPassportWrite,
  } = useWriteContract();

  const {
    writeContractAsync: writeRegistryContract,
    isPending: isRegistryPending,
    error: registryError,
    isSuccess: isRegistrySuccess,
    reset: resetRegistryWrite,
  } = useWriteContract();

  // Handle Passport contract interaction states
  useEffect(() => {
    if (passportError) {
      notification.error(
        `Error minting passport: ${passportError instanceof Error ? passportError.message : "Unknown error occurred"}`,
      );
      setLoading(undefined);
      setMintStage(undefined);
      resetPassportWrite();
    }

    if (isPassportSuccess) {
      notification.success("Passport minted successfully! Creating account...");
      setMintStage("registry");

      // Initiate registry contract interaction
      if (tokenId) {
        const createAccount = async () => {
          try {
            const hash = await writeRegistryContract({
              address: CONTRACTS.REGISTRY,
              abi: tokenBoundAccountRegistryAbi,
              functionName: "createAccount",
              args: [CONTRACTS.PASSPORT, BigInt(tokenId)],
            });
            console.log("Registry Creation Transaction Hash:", hash);
          } catch (error) {
            console.error("Error creating account:", error);
          }
        };
        createAccount();
      }
    }
  }, [passportError, isPassportSuccess, resetPassportWrite, writeRegistryContract, tokenId]);

  // Handle Registry contract interaction states
  useEffect(() => {
    if (registryError) {
      notification.error(
        `Error creating account: ${registryError instanceof Error ? registryError.message : "Unknown error occurred"}`,
      );
      setLoading(undefined);
      setMintStage(undefined);
      resetRegistryWrite();
    }

    if (isRegistrySuccess) {
      notification.success("Account created successfully!");
      setPassportData(mockedPassport);
      setLoading(undefined);
      setMintStage("completed");
      resetRegistryWrite();
    }
  }, [registryError, isRegistrySuccess, resetRegistryWrite]);

  const handleMintPassport = async () => {
    try {
      setLoading("mint");
      setMintStage("passport");

      // Network check
      if (chainId !== arbitrumSepolia.id) {
        await switchChain({ chainId: arbitrumSepolia.id });
        return; // Early return as switchChain will trigger a re-render
      }

      // Generate random tokenId between 1 and 1000
      const newTokenId = Math.floor(Math.random() * 1000) + 1;
      setTokenId(newTokenId);
      const uri = "https://ipfs.io/ipfs/QmPgzuqxyMznqT6hT2AU4LwLYfT75qswVSgi8tYXPnYCoT";

      if (!address) {
        throw new Error("No wallet address found");
      }

      // Write passport contract and log transaction hash
      const hash = await writePassportContract({
        address: CONTRACTS.PASSPORT,
        abi: passportAbi,
        functionName: "mint",
        args: [address, BigInt(newTokenId), uri],
      });
      console.log("Passport Mint Transaction Hash:", hash);
    } catch (error) {
      notification.error(`Error initiating mint: ${error instanceof Error ? error.message : "Unknown error occurred"}`);
      setLoading(undefined);
      setMintStage(undefined);
    }
  };

  const getMintButtonText = () => {
    if (isPassportPending || isRegistryPending) {
      return <span className="loading loading-spinner"></span>;
    }
    if (mintStage === "passport") {
      return "Minting Passport...";
    }
    if (mintStage === "registry") {
      return "Creating Account...";
    }
    return "Mint Passport";
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
            disabled={!userVerified || loading === "mint" || isPassportPending || isRegistryPending}
          >
            {getMintButtonText()}
          </button>
        </div>
      </div>
    );
  }

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
