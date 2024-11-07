"use client";

import React, { useState } from "react";
import { Key, Wallet } from "lucide-react";
import WorldIDAuth from "~~/components/WorldIDAuth";
import Passport from "~~/components/ui/Passport";
import { notification } from "~~/utils/scaffold-eth";

const LaunchPage = () => {
  const [loading, setLoading] = useState<"create" | "recover">();
  const [mainTab, setMainTab] = useState<"did" | "worldid">("did");
  const [didTab, setDidTab] = useState<"create" | "recover">("create");
  const [userVerified, setUserVerified] = useState(false);

  const handleCreateDID = async () => {
    setLoading("create");
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      notification.success("DID created successfully!");
      setUserVerified(true);
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
      setUserVerified(true);
    } catch (error) {
      notification.error("Error recovering DID. Please try again.");
    }
    setLoading(undefined);
  };

  return (
    <div className="min-h-screen bg-base-200 p-8 flex gap-4 relative mx-auto">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center">
          <div className="flex items-center justify-center gap-4 mb-4">
            <h1 className="text-4xl font-bold">Mint your passport using decentralized ID or World ID.</h1>
          </div>
        </div>
        <div className="flex gap-4">
          <div className="flex flex-col gap-4 w-full">
            {/* Main Tabs */}
            <div role="tablist" className="tabs tabs-lifted tabs-lg card">
              <a className={`tab ${mainTab === "did" ? "tab-active" : ""}`} onClick={() => setMainTab("did")}>
                Decentralized ID
              </a>
              <div role="tabpanel" className=" rounded-box tab-content bg-base-100 shadow-xl border-base-300">
                <div className="card-body">
                  {/* DID Sub-tabs */}
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
                              <p className="text-sm text-base-content/70">
                                Your DID will be linked to a secure smart wallet
                              </p>
                            </div>
                          </div>
                        </div>
                        <div className="card-actions justify-end">
                          <button
                            className="btn btn-primary w-full"
                            onClick={handleCreateDID}
                            disabled={loading === "create"}
                          >
                            {loading === "create" ? <span className="loading loading-spinner"></span> : "Create DID"}
                          </button>
                        </div>
                      </div>
                    </div>
                    {/* Recover DID Card */}
                    <a
                      className={`tab ${didTab === "recover" ? "tab-active" : ""}`}
                      onClick={() => setDidTab("recover")}
                    >
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
                          <button
                            className="btn btn-primary w-full"
                            onClick={handleRecoverDID}
                            disabled={loading === "recover"}
                          >
                            {loading === "recover" ? <span className="loading loading-spinner"></span> : "Recover DID"}
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <a className={`tab ${mainTab === "worldid" ? "tab-active" : ""}`} onClick={() => setMainTab("worldid")}>
                World ID
              </a>
              <div role="tabpanel" className="tab-content">
                <WorldIDAuth onSuccess={() => setUserVerified(true)} />
              </div>
            </div>
            {/* Passport Minting Card */}
            {/* <div className="card bg-base-100 shadow-xl">
              <div className="card-body">
                <h2 className="card-title">Mint Your Passport</h2>
                <div className="space-y-6 my-4">
                  <div className="flex items-center gap-4">
                    <FileCheck className="h-8 w-8 text-success" />
                    <div>
                      <h3 className="font-medium">Digital Passport</h3>
                      <p className="text-sm text-base-content/70">
                        Your passport will be soulbound to your account and secure your assets
                      </p>
                    </div>
                  </div>
                </div>

                <div className="card-actions justify-end">
                  <button className="btn btn-secondary w-full" onClick={handleMintPassport} disabled={!userVerified}>
                    {loading === "mint" ? <span className="loading loading-spinner"></span> : "Mint Passport"}
                  </button>
                </div>
              </div>
            </div> */}
          </div>
          <div className="">
            <Passport userVerified={userVerified} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default LaunchPage;
