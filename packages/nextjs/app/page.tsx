"use client";

import React, { useState } from "react";
import { FileCheck, Key, Sun, Wallet } from "lucide-react";
import WorldIDAuth from "~~/components/WorldIDAuth";
import { notification } from "~~/utils/scaffold-eth";

const LaunchPage = () => {
  const [loading, setLoading] = useState<"create" | "mint" | "recover">();
  const [mainTab, setMainTab] = useState<"did" | "worldid">("did");
  const [didTab, setDidTab] = useState<"create" | "recover">("create"); // 'create' or 'recover'

  const handleCreateDID = async () => {
    setLoading("create");
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      notification.success("DID created successfully!");
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
    } catch (error) {
      notification.error("Error recovering DID. Please try again.");
    }
    setLoading(undefined);
  };

  const handleMintPassport = async () => {
    setLoading("mint");
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      notification.success("Passport minted successfully!");
    } catch (error) {
      notification.error("Error minting passport. Please try again.");
    }
    setLoading(undefined);
  };

  return (
    <div className="min-h-screen bg-base-200 p-8">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center">
          <div className="flex items-center justify-center gap-4 mb-4">
            <Sun className="w-12 h-12" />
            <h1 className="text-4xl font-bold">Login or create account</h1>
          </div>
          <p className="text-base-content max-w-2xl mx-auto">Connect and verify with Decentralized ID or World ID.</p>
        </div>

        {/* Main Tabs */}
        <div>
          <div className="tabs tabs-boxed justify-center pb-2">
            <a className={`tab ${mainTab === "did" ? "tab-active" : ""}`} onClick={() => setMainTab("did")}>
              Decentralized ID
            </a>
            <a className={`tab ${mainTab === "worldid" ? "tab-active" : ""}`} onClick={() => setMainTab("worldid")}>
              World ID
            </a>
          </div>

          {mainTab === "did" && (
            <div className="space-y-4">
              {/* DID Sub-tabs */}
              <div className="tabs tabs-boxed justify-center mt-4">
                <a className={`tab ${didTab === "create" ? "tab-active" : ""}`} onClick={() => setDidTab("create")}>
                  Create New DID
                </a>
                <a className={`tab ${didTab === "recover" ? "tab-active" : ""}`} onClick={() => setDidTab("recover")}>
                  Recover DID
                </a>
              </div>

              {/* Create DID Card */}
              {didTab === "create" && (
                <div className="card bg-base-100 shadow-xl">
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
              )}

              {/* Recover DID Card */}
              {didTab === "recover" && (
                <div className="card bg-base-100 shadow-xl">
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
              )}

              {/* Passport Minting Card */}
              <div className="card bg-base-100 shadow-xl">
                <div className="card-body">
                  <h2 className="card-title">Mint Your Passport</h2>
                  <p className="text-base-content/70">Create your platform passport linked to your DID</p>

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
                    <button
                      className="btn btn-secondary w-full"
                      onClick={handleMintPassport}
                      disabled={loading === "mint"}
                    >
                      {loading === "mint" ? <span className="loading loading-spinner"></span> : "Mint Passport"}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* World ID Card */}
          {mainTab === "worldid" && (
            <WorldIDAuth />
            // <div className="card bg-base-100 shadow-xl mt-4">
            //   <div className="card-body items-center text-center">
            //     <h2 className="card-title mb-4">Connect and verify with World ID</h2>
            //     <div className="space-y-4 w-full max-w-sm">
            //       <button className="btn btn-primary w-full">Verify with World ID</button>
            //       <div className="divider">OR</div>
            //       <button className="btn btn-outline w-full">Verify with Wallet & World ID</button>
            //       <div className="mt-6 text-sm">
            //         <a href="https://world.org/world-id" className="link link-primary" target="_blank">
            //           Get the WorldID App →
            //         </a>
            //       </div>
            //     </div>
            //   </div>
            // </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default LaunchPage;
