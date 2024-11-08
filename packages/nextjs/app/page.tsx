"use client";

import React, { useState } from "react";
import WorldIDAuth from "~~/components/WorldIDAuth";
import DIDAuth from "~~/components/ui/DIDAuth";
import Passport from "~~/components/ui/Passport";

const LaunchPage = () => {
  const [mainTab, setMainTab] = useState<"did" | "worldid">("did");
  const [userVerified, setUserVerified] = useState(false);

  return (
    <div className="min-h-screen bg-base-200 p-8 flex gap-4 relative mx-auto">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center">
          <div className="flex items-center justify-center gap-4 mb-4">
            <h1 className="text-4xl font-bold">Mint your passport using Decentralized ID or World ID.</h1>
          </div>
        </div>
        <div className="flex gap-4">
          <div className="flex flex-col gap-4 w-full">
            {/* Main Tabs */}
            <div role="tablist" className="tabs tabs-lifted tabs-lg card">
              <a className={`tab ${mainTab === "did" ? "tab-active" : ""}`} onClick={() => setMainTab("did")}>
                Decentralized ID
              </a>
              <div role="tabpanel" className="rounded-box tab-content bg-base-100 shadow-xl border-base-300">
                <DIDAuth onSuccess={() => setUserVerified(true)} />
              </div>
              <a className={`tab ${mainTab === "worldid" ? "tab-active" : ""}`} onClick={() => setMainTab("worldid")}>
                World ID
              </a>
              <div role="tabpanel" className="tab-content">
                <WorldIDAuth onSuccess={() => setUserVerified(true)} />
              </div>
            </div>
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
