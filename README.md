# L1 TypeScript DevKit

A comprehensive TypeScript development kit for building modern web applications on Antelope blockchains (EOS, Telos, WAX, UX).

### Core Packages
- [__packages/core__](./packages/core/README.md) - Core SDK for Antelope blockchain interactions and smart contract integration
- [__packages/react__](./packages/react/README.md) - React components and hooks for building blockchain-based frontend applications
- [__packages/lib__](./packages/lib/README.md) - Shared utilities and helper functions
- [__packages/errors__](./packages/errors/README.md) - Antelope-specific error handling and definitions
- [__packages/tsconfig__](./packages/tsconfig/README.md) - Standardized TypeScript configuration

## Features

- 🚀 Built for modern Antelope development
- 💻 Framework agnostic core with React-specific bindings
- 🔒 Type-safe contract interactions
- 📦 Modular and extensible architecture
- 🌐 Support for all major Antelope networks
- 🔧 Built-in wallet integrations (Anchor, Wombat)
- 📊 Resource management (CPU/NET/RAM)
- ⚡ Optimized for performance

## Development Setup

### Requirements
- Node.js 20+
- pnpm

### Quick Start

```bash
# Install package manager
npm install -g pnpm

# Clone and setup project
git clone https://github.com/l1-network/l1-ts.git
cd l1-ts
pnpm install
```

### Development Commands

```bash
pnpm dev        # Start development server
pnpm build      # Create production build
pnpm test       # Run test suite
```

## Usage Examples

```typescript
// Core SDK Usage
import { createL1Client } from '@l1network/core'

const client = createL1Client({
  nodeUrl: 'https://eos.greymass.com',
  chainId: 'aca376f206b8fc25a6ed44dbdc66547c36c6c33e3a119ffbeaef943642f0e906'
})

// React Components
import { L1Provider, WalletButton } from '@l1network/react'

function App() {
  return (
    <L1Provider>
      <WalletButton />
      {/* Your dApp components */}
    </L1Provider>
  )
}
```

## Contributing

Please read the [contributing guidelines](./CONTRIBUTING.md) before submitting any pull requests.

## License

MIT License

