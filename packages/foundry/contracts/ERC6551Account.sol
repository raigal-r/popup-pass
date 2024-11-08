// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/utils/cryptography/SignatureChecker.sol";
import "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import "@openzeppelin/contracts/interfaces/IERC1271.sol";
import "../interfaces/IERC6551Account.sol";
import "../interfaces/IERC6551Executable.sol";

/// @dev Adding MetaMask Delegation Toolkit into the ERC6551 Account
abstract contract ERC6551Account is IERC165, IERC1271, IERC6551Account, IERC6551Executable {
    uint256 public state;
    address public owner;

    // Mapping to track delegators
    mapping(address => bool) public delegators;

    receive() external payable {}

    // Constructor to set owner
    constructor() {
        owner = msg.sender;
    }

    // Only owner can add or remove delegators
    modifier onlyOwner() {
        require(msg.sender == owner, "Not the owner");
        _;
    }

    // Add a new delegator
    function addDelegator(address delegator) external onlyOwner {
        delegators[delegator] = true;
    }

    // Remove an existing delegator
    function removeDelegator(address delegator) external onlyOwner {
        delegators[delegator] = false;
    }

    // Check if an address is a delegator
    function isDelegator(address addr) internal view returns (bool) {
        return delegators[addr];
    }

    // Execute operation with delegation support
    function execute(
        address to,
        uint256 value,
        bytes calldata data,
        uint256 operation
    ) external payable override returns (bytes memory) {
        address signer = msg.sender;

        // Ensure that the caller is either a valid signer or an authorized delegator
        bool isSignerValid = isValidSigner(signer);  // Implement actual signer validation logic
        bool isDelegatorValid = isDelegator(signer);

        require(isSignerValid || isDelegatorValid, "Unauthorized signer or delegator");

        bytes memory result;

        if (operation == 0) {
            // CALL operation
            (bool success, bytes memory callResult) = to.call{value: value}(data);
            require(success, "CALL failed");
            result = callResult;
        } else if (operation == 1) {
            // DELEGATECALL operation
            (bool success, bytes memory delegateResult) = to.delegatecall(data);
            require(success, "DELEGATECALL failed");
            result = delegateResult;
        } else if (operation == 2) {
            // CREATE operation (if applicable)
            // Handle CREATE logic here
        } else if (operation == 3) {
            // CREATE2 operation (if applicable)
            // Handle CREATE2 logic here
        } else {
            revert("Invalid operation");
        }

        return result;
    }

    // Example of how to check if a signer is valid
    function isValidSigner(address signer) internal view returns (bool) {
        return signer == getOwner();
    }

    // Implement isValidSignature for EIP1271 support
    function isValidSignature(bytes32 hash, bytes memory signature)
        external
        view
        override
        returns (bytes4 magicValue)
    {
        bool isValid = SignatureChecker.isValidSignatureNow(getOwner(), hash, signature);
        if (isValid) {
            return IERC1271.isValidSignature.selector;
        }
        return "";
    }

    // Supports ERC165 interface checks
    function supportsInterface(bytes4 interfaceId) external pure override returns (bool) {
        return (interfaceId == type(IERC165).interfaceId ||
            interfaceId == type(IERC6551Account).interfaceId ||
            interfaceId == type(IERC6551Executable).interfaceId);
    }

    // Returns the owner of the account
    function getOwner() public view returns (address) {
        (uint256 chainId, address tokenContract, uint256 tokenId) = token();
        if (chainId != block.chainid) return address(0);
        return IERC721(tokenContract).ownerOf(tokenId);
    }

    // Returns account metadata (just an example)
    function token()
        public
        view
        returns (
            uint256,
            address,
            uint256
        )
    {
        bytes memory footer = new bytes(0x60);
        assembly {
            extcodecopy(address(), add(footer, 0x20), 0x4d, 0x60)
        }
        return abi.decode(footer, (uint256, address, uint256));
    }
}

// Add MetaMask Delegation specific logic into the Executable Contract
contract ExecutableContract is IERC6551Executable {
    address public owner;

    // Mapping to track delegators
    mapping(address => bool) public delegators;

    // Set the contract owner
    constructor() {
        owner = msg.sender;
    }

    // Only owner can add or remove delegators
    modifier onlyOwner() {
        require(msg.sender == owner, "Not the owner");
        _;
    }

    // Add a new delegator
    function addDelegator(address delegator) external onlyOwner {
        delegators[delegator] = true;
    }

    // Remove an existing delegator
    function removeDelegator(address delegator) external onlyOwner {
        delegators[delegator] = false;
    }

    // Check if an address is a delegator
    function isDelegator(address addr) internal view returns (bool) {
        return delegators[addr];
    }

    /**
     * @dev Executes a low-level operation if the caller is a valid signer or delegator
     */
    function execute(
        address to,
        uint256 value,
        bytes calldata data,
        uint256 operation
    ) external payable override returns (bytes memory) {
        address signer = msg.sender;

        // Ensure that the caller is either a valid signer or an authorized delegator
        bool isSignerValid = isValidSigner(signer, data);  // You must implement the `isValidSigner` logic
        bool isDelegatorValid = isDelegator(signer);

        require(isSignerValid || isDelegatorValid, "Unauthorized signer or delegator");

        bytes memory result;

        if (operation == 0) {
            // CALL operation
            (bool success, bytes memory callResult) = to.call{value: value}(data);
            require(success, "CALL failed");
            result = callResult;
        } else if (operation == 1) {
            // DELEGATECALL operation
            (bool success, bytes memory delegateResult) = to.delegatecall(data);
            require(success, "DELEGATECALL failed");
            result = delegateResult;
        } else if (operation == 2) {
            // CREATE operation (if applicable)
            // Handle CREATE logic here
        } else if (operation == 3) {
            // CREATE2 operation (if applicable)
            // Handle CREATE2 logic here
        } else {
            revert("Invalid operation");
        }

        return result;
    }

    // Example of how to check if a signer is valid
    function isValidSigner(address signer, bytes calldata data) internal pure returns (bool) {
        // Implement your signer validation logic here (e.g., signature verification)
        return true;  // Placeholder, replace with actual validation logic
    }
}
