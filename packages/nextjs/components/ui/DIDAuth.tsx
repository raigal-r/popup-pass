import React, { useState } from "react";
import { VerificationSuccess } from "./VerificationSuccess";
import { CheckCircle, Key, Wallet } from "lucide-react";
import { notification } from "~~/utils/scaffold-eth";

// DID verification component
export const DIDAuth = ({ onSuccess }: { onSuccess?: () => void }) => {
  const [loading, setLoading] = useState<"create" | "recover">();
  const [isVerified, setIsVerified] = useState<boolean>(false);
  const [didTab, setDidTab] = useState<"create" | "recover">("create");

  const handleCreateDID = async () => {
    setLoading("create");
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      notification.success("DID created successfully!");
      setIsVerified(true);
      onSuccess?.();
    } catch (error) {
      notification.error("Error creating DID. Please try again.");
    }
    setLoading(undefined);
  };

  const handleRecoverDID = async () => {
    setLoading("recover");
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      notification.success("DID recovered successfully!");
      setIsVerified(true);
      onSuccess?.();
    } catch (error) {
      notification.error("Error recovering DID. Please try again.");
    }
    setLoading(undefined);
  };

  const VerificationContent = () => (
    <div role="tablist" className="tabs tabs-lifted tabs-sm">
      {/* Create DID Card */}
      <a className={`tab ${didTab === "create" ? "tab-active" : ""}`} onClick={() => setDidTab("create")}>
        Create New DID
      </a>
      <div role="tabpanel" className=" bg-base-100 shadow-xl tab-content border-base-300 rounded-box p-6">
        <div className="card-body">
          <h2 className="card-title">Create New DID</h2>
          <p className="text-base-content/70">Start fresh with a new Decentralized Identifier</p>
          <div className="space-y-6 my-4">
            <div className="flex items-center gap-4">
              <Key className="h-8 w-8 text-success" />
              <div>
                <h3 className="font-medium">Generate Your DID</h3>
                <p className="text-sm text-base-content/70">
                  Create a unique identifier that you&apos;ll use across the platform
                </p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <Wallet className="h-8 w-8 text-success" />
              <div>
                <h3 className="font-medium">Setup Smart Wallet</h3>
                <p className="text-sm text-base-content/70">Your DID will be linked to a secure smart wallet</p>
              </div>
            </div>
          </div>
          <div className="card-actions justify-end">
            <button className="btn btn-primary w-full" onClick={handleCreateDID} disabled={loading === "create"}>
              {loading === "create" ? <span className="loading loading-spinner"></span> : "Create DID"}
            </button>
          </div>
        </div>
      </div>
      {/* Recover DID Card */}
      <a className={`tab ${didTab === "recover" ? "tab-active" : ""}`} onClick={() => setDidTab("recover")}>
        Recover DID
      </a>
      <div role="tabpanel" className="tab-content border-base-300 rounded-box p-6 bg-base-100 shadow-xl">
        <div className="card-body">
          <h2 className="card-title">Recover Existing DID</h2>
          <p className="text-base-content/70">Recover access to your existing DID and assets</p>

          <div className="space-y-6 my-4">
            <div className="flex items-center gap-4">
              <Key className="h-8 w-8 text-success" />
              <div>
                <h3 className="font-medium">Verify Identity</h3>
                <p className="text-sm text-base-content/70">Provide proof to recover your DID</p>
              </div>
            </div>
          </div>
          <div className="card-actions justify-end">
            <button className="btn btn-primary w-full" onClick={handleRecoverDID} disabled={loading === "recover"}>
              {loading === "recover" ? <span className="loading loading-spinner"></span> : "Recover DID"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="card-body ">{!isVerified ? <VerificationContent /> : <VerificationSuccess method="DID" />}</div>
  );
};

export default DIDAuth;
