# @l1network/lib

Shared utilities and helper functions for L1 Antelope blockchain applications.

## Features

- 🔧 Common Antelope blockchain utilities
- 📊 Resource calculation helpers (CPU/NET/RAM)
- 💰 Token formatting and conversion
- 🔐 Key and permission utilities
- 🌐 Network configuration helpers
- ⚡ Performance optimized functions
- 📝 Type definitions for Antelope data structures

## Installation

```bash
pnpm install @l1network/lib
```

## Usage

```typescript
import { 
  formatToken, 
  parseToken, 
  calculateResources,
  isValidPublicKey
} from '@l1network/lib'

// Token formatting
const formatted = formatToken('100000000', 'EOS', 4) // '10.0000 EOS'
const parsed = parseToken('10.0000 EOS') // { amount: '100000000', symbol: 'EOS', precision: 4 }

// Resource calculations
const resources = calculateResources({
  cpu: '10.0000 EOS',
  net: '1.0000 EOS',
  ram: 8192
})

// Key validation
const isValid = isValidPublicKey('EOS6MRyAjQq8ud7hVNYcfnVPJqcVpscN5So8BhtHuGYqET5GDW5CV')
```

## Available Utilities

### Token Utilities
- `formatToken`: Format token amount with proper precision
- `parseToken`: Parse token string into components
- `calculatePrice`: Calculate token price based on exchange rate

### Resource Utilities
- `calculateResources`: Calculate account resource usage
- `estimateResourceCost`: Estimate cost of resources
- `formatBytes`: Format RAM bytes to human readable format

### Crypto Utilities
- `isValidPublicKey`: Validate Antelope public key
- `isValidPrivateKey`: Validate Antelope private key
- `generateKeyPair`: Generate new key pair

### Network Utilities
- `getChainInfo`: Get information about supported chains
- `validateEndpoint`: Validate API endpoint URL
- `getDefaultEndpoints`: Get default endpoints for chains

### Type Definitions
- `TokenSymbol`: Token symbol type
- `ResourceType`: Resource type definitions
- `ChainId`: Chain ID type
- `NetworkConfig`: Network configuration type

## Contributing

Please read the [contributing guidelines](../../CONTRIBUTING.md) before submitting any pull requests.

## License

MIT License - see the [LICENSE](../../LICENSE) file for details
