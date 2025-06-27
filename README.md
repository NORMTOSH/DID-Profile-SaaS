# ABYA DID SaaS Model

ABYA DID is a decentralized identity management platform built using blockchain technology. It empowers users to take control of their digital identity, ensuring security, privacy, and interoperability across platforms.

## Features

- **Decentralized Identity Management**: Secure your identity using blockchain technology.
- **Enhanced Security**: Resistant to unauthorized access and tampering.
- **Full Control**: Users decide what information to share and with whom.
- **Interoperability**: Use your DID across multiple platforms without creating multiple accounts.
- **Secure Storage**: Data is stored on IPFS with cryptographic protection.

## Technologies Used

- **Next.js**: React framework for building the frontend.
- **Tailwind CSS**: Utility-first CSS framework for styling.
- **Ethereum Blockchain**: For decentralized identity management.
- **IPFS**: Decentralized storage for identity data.
- **Pinata**: IPFS gateway for managing and pinning files.
- **Lucide Icons**: Modern icons for UI design.

## Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/yourusername/ABYA_DID_SaaS-Model.git
   cd ABYA_DID_SaaS-Model
   ```

2. Install dependencies:

```bash
npm install
```

3. Set up environment variables: Create a .env.local file in the root directory and add the following:

```bash
NEXT_PUBLIC_PINATA_API_KEY=your-pinata-api-key
NEXT_PUBLIC_PINATA_SECRET_KEY=your-pinata-secret-key
NEXT_PUBLIC_PINATA_JWT=your-pinata-jwt
NEXT_PUBLIC_GATEWAY_URL=https://your-pinata-gateway-url
NEXT_PUBLIC_RPC_URL=https://your-ethereum-rpc-url
NEXT_PUBLIC_DID_REGISTRY_CONTRACT_ADDRESS=your-contract-address
```

4. Start the development server:

```bash
npm run dev
```

5. Open the app in your browser:

```bash
http://localhost:3000
```

## Usage

- `Connect Wallet`: Link your blockchain wallet to establish your unique identity.
- `Create Profile`: Set up your decentralized identity with personal information.
- `Manage Profile`: Update or revoke access to your identity information as needed.

## License

- This project is licensed under the MIT License. See the LICENSE file for details.
