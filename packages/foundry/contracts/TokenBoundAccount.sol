// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract TokenBoundAccount {
    address public owner;

    constructor(address _owner) {
        owner = _owner;
    }

    function execute(address to, uint256 value, bytes calldata data) external {
        require(msg.sender == owner, "Not authorized");
        (bool success, ) = to.call{value: value}(data);
        require(success, "Execution failed");
    }
}
