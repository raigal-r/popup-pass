# 🎫 Pop-up Pass

🔐 A decentralized identity and authentication system built on Scaffold-ETH 2 that combines on-chain identity verification, wallet delegation, and token-bound accounts to create a secure, user-friendly, and privacy-respecting "Passport" for Web3 communities.

⚙️ Built using Scaffold-ETH 2, World ID, MetaMask Delegation Toolkit, and Token Bound Accounts.

## ✨ Key Features

- 🌍 **World ID Integration**: Zero-knowledge proof identity verification ensuring uniqueness without compromising privacy
- 🎭 **Token Bound Accounts**: NFT-based passports that serve as compartmentalized accounts for user achievements and assets
- 📱 **Gasless Transactions**: Platform-delegated transactions using MetaMask's Delegation Toolkit for seamless user experience
- 🔄 **Cross-Platform Compatibility**: Portable identity system usable across different Web3 platforms and dApps
- 🏛 **On-Chain Governance**: Direct participation in community governance through delegated voting rights
- 🛡 **Enhanced Privacy**: Zero-knowledge proof system protects user data while ensuring authenticity

## 🏗 Architecture

The Pop-up Pass system consists of three main components:

1. **Identity Verification Layer**

   - World ID integration for human verification
   - Zero-knowledge proof generation and validation
   - Privacy-preserving identity confirmation

2. **Passport NFT Layer**

   - Token Bound Account creation
   - Achievement and credential storage
   - Cross-platform identity management

3. **Delegation Layer**
   - MetaMask Delegation Toolkit integration
   - Gasless transaction handling
   - Streamlined dApp interactions

## 🚀 Benefits

### For Users

- No gas fees for common interactions
- Single sign-on across supported platforms
- Full ownership of identity and achievements
- Privacy-preserving verification
- Simplified onboarding process

### For Platforms

- Reduced friction in user onboarding
- Enhanced security and authenticity
- Streamlined transaction processes
- Interoperable identity verification
- Robust governance capabilities

## 📦 Prerequisites

- [Node (>= v18.18)](https://nodejs.org/en/download/)
- Yarn ([v1](https://classic.yarnpkg.com/en/docs/install/) or [v2+](https://yarnpkg.com/getting-started/install))
- [Git](https://git-scm.com/downloads)
- MetaMask wallet
- Arbitrum Sepolia testnet ETH

## 🏄‍♂️ Quick Start

1. Clone the repository and install dependencies:

```bash
git clone <your-repo-url>
cd popup-pass
yarn install
```

2. Generate contract types:

```bash
yarn generate
```

This command generates TypeScript interfaces for your smart contracts using the contract ABIs. This step is crucial for type-safe interaction with your contracts from the frontend.

3. Start the frontend:

```bash
yarn start
```

Visit your app on: `http://localhost:3000`

Make sure your MetaMask wallet is connected to Arbitrum Sepolia network. You can get testnet ETH from the [Arbitrum Sepolia Faucet](https://sepolia-faucet.arbitrum.io/).

## 🔧 Configuration

The Pop-up Pass system can be configured through:

- World ID settings in `config/worldid.ts`
- Delegation parameters in `config/delegation.ts`
- Token Bound Account settings in `config/tba.ts`

## 🔍 Testing

Run the test suite with:

```bash
yarn test
```

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guide](CONTRIBUTING.md) for details.

## 📜 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE.md) file for details.

## 🙏 Acknowledgements

Built with [Scaffold-ETH 2](https://github.com/scaffold-eth/scaffold-eth-2)

Special thanks to:

- World ID team
- MetaMask Delegation Toolkit developers
- Token Bound Account contributors
