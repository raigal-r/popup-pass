// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;

import "forge-std/Script.sol";
import {ERC6551Account} from "../contracts/ERC6551Account.sol";
import {ExecutableContract} from "../contracts/ERC6551Account.sol";

contract DeployERC6551Account is Script {
    function run() external {
        vm.startBroadcast();

        // Deploy ExecutableContract which inherits ERC6551Account
        ExecutableContract executableContract = new ExecutableContract();

        // Output the deployed contract address
        console.log("ExecutableContract deployed to:", address(executableContract));

        vm.stopBroadcast();
    }
}
