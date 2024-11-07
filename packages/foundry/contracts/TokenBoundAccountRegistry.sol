// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "./TokenBoundAccount.sol";

contract ERC6551Registry {
    mapping(address => mapping(uint256 => address)) public tokenBoundAccounts;

    function createAccount(
        address nftContract,
        uint256 tokenId
    ) external returns (address) {
        require(tokenBoundAccounts[nftContract][tokenId] == address(0), "Account already exists");
        TokenBoundAccount account = new TokenBoundAccount(msg.sender);
        tokenBoundAccounts[nftContract][tokenId] = address(account);
        return address(account);
    }
}
