// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;

import "forge-std/Script.sol";
import {ERC6551Registry} from "../contracts/ERC6551Registry.sol";

contract DeployERC6551Registry is Script {
    function run() external {
        vm.startBroadcast();

        // Deploy ERC6551Registry
        ERC6551Registry registry = new ERC6551Registry();

        // Output the deployed contract address
        console.log("ERC6551Registry deployed to:", address(registry));

        vm.stopBroadcast();
    }
}
