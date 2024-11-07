import React, { useState } from "react";
import Image from "next/image";
import { ImagePlus, Ticket } from "lucide-react";
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
  stamps: Array(3).fill(null),
};

const Passport = ({ userVerified }: { userVerified: boolean }) => {
  const [loading, setLoading] = useState<"create" | "mint" | "recover">();
  const [passportData, setPassportData] = useState<PassportData>();

  const handleMintPassport = async () => {
    setLoading("mint");
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      notification.success("Passport minted successfully!");
      setPassportData(mockedPassport);
    } catch (error) {
      notification.error("Error minting passport. Please try again.");
    }
    setLoading(undefined);
  };

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
          <button className="btn btn-secondary w-full" onClick={handleMintPassport} disabled={!userVerified}>
            {loading === "mint" ? <span className="loading loading-spinner"></span> : "Mint Passport"}
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
