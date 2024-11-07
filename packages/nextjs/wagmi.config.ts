import { abi as passportAbi } from "../foundry/out/MyPassport.sol/MyPassport.json";
import { defineConfig } from "@wagmi/cli";
import { Abi } from "viem";

export default defineConfig({
  out: "src/generated.ts",
  contracts: [
    {
      name: "Passport",
      abi: passportAbi as Abi,
    },
  ],
});
