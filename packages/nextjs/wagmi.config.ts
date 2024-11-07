import { abi as PassportAbi } from "../foundry/out/MyPassport.sol/MyPassport.json";
import { abi as TokenBoundAccountRegistryAbi } from "../foundry/out/TokenBoundAccountRegistry.sol/ERC6551Registry.json";
import { defineConfig } from "@wagmi/cli";
import { Abi } from "viem";

export default defineConfig({
  out: "src/generated.ts",
  contracts: [
    {
      name: "Passport",
      abi: PassportAbi as Abi,
    },
    {
      name: "TokenBoundAccountRegistry",
      abi: TokenBoundAccountRegistryAbi as Abi,
    },
  ],
});
