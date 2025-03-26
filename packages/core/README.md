# @l1network/core

Core SDK for L1 blockchain interactions and smart contract integration on Antelope.

## Features

- Type-safe smart contract actions and tables
- Pre-configured Antelope API instances
- TypeScript types and interfaces for contract interactions
- Singleton client pattern for efficient resource usage
- Optimized for L1 blockchain interactions
- Built-in support for common Antelope operations

## Installation

```bash
pnpm install @l1network/core
```

## Usage

```typescript
import { createL1Client } from '@l1network/core'

// Initialize the L1 client
const client = createL1Client({
  nodeUrl: 'https://your-antelope-node',
  chainId: 'your-chain-id'
})

// Use contract actions
const balance = await client.getBalance({
  account: 'youraccount',
  symbol: 'EOS'
})
```

## API Reference

### Client Configuration
```typescript
interface L1ClientConfig {
  nodeUrl: string
  chainId: string
  // ... other config options
}
```

### Core Functions
- `createL1Client(config: L1ClientConfig)`: Create a new L1 client instance
- `getBalance(params: BalanceParams)`: Get account token balance
- `getTableRows(params: GetTableRowsParams)`: Query contract table data
- `pushTransaction(params: TransactionParams)`: Send transaction to the blockchain
- More functions documented in the source code

## Contributing

Please read the [contributing guidelines](../../CONTRIBUTING.md) before submitting any pull requests.

## License

MIT License - see the [LICENSE](../../LICENSE) file for details
