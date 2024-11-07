import React, { useState } from "react";
import Link from "next/link";
import { IDKitWidget, ISuccessResult, VerificationLevel } from "@worldcoin/idkit";
import { notification } from "~~/utils/scaffold-eth";

interface WorldIDVerificationProps {
  merkle_root: string;
  nullifier_hash: string;
  proof: string;
  verification_level: string;
  signal?: string;
}

const WorldIDAuth: React.FC = () => {
  const [loading, setLoading] = useState<boolean>(false);

  const handleVerify = async (proof: WorldIDVerificationProps): Promise<void> => {
    setLoading(true);
    try {
      const response = await fetch("/api/auth/worldcoin", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(proof),
      });

      const data = await response.json();
      console.log(data);
      if (data.code === "success") {
        notification.success("Successfully verified with World ID!");
      } else {
        notification.error("Verification failed. Please try again.");
      }
    } catch (error) {
      notification.error("Error during verification. Please try again.");
      console.error("Error during verification:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card bg-base-100 shadow-xl mt-4">
      <div className="card-body items-center text-center">
        <h2 className="card-title mb-4">Connect and verify with World ID</h2>
        <div className="space-y-4 w-full max-w-sm">
          <IDKitWidget
            app_id={`app_${process.env.NEXT_PUBLIC_WLD_APP_ID}`}
            action={process.env.NEXT_PUBLIC_WC_ACTION || ""}
            onSuccess={(result: ISuccessResult) => console.log(result)}
            handleVerify={handleVerify}
            verification_level={VerificationLevel.Device}
          >
            {({ open }: { open: () => void }) => (
              <button onClick={open} disabled={loading} className="btn btn-primary w-full">
                {loading ? <span className="loading loading-spinner"></span> : "Verify with World ID"}
              </button>
            )}
          </IDKitWidget>

          <div className="divider">OR</div>

          <button
            className="btn btn-outline w-full"
            onClick={() => notification.info("Wallet connection coming soon!")}
          >
            Verify with Wallet & World ID
          </button>

          <div className="mt-6 text-sm">
            <Link href="https://world.org/world-id" className="link link-primary" target="_blank">
              Get the WorldID App →
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WorldIDAuth;
