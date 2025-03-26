# @l1network/react

React components and hooks for building blockchain-based frontend applications on L1 Antelope.

## Features

- Type-safe contract interactions with TypeScript
- Built with modern Antelope blockchain libraries
- Hooks for reading tables and sending actions
- Support for multiple Antelope networks
- Automatic error handling and loading states
- Optimized React components for L1 interactions
- Real-time blockchain data updates
- Built-in wallet connection management (Anchor, Wombat)

## Installation

```bash
pnpm install @l1network/react
```

## Usage

```typescript
import { useL1Balance, useL1Contract } from '@l1network/react'

// Use hooks in your components
function TokenBalance({ account }) {
  const { data: balance, isLoading } = useL1Balance({ 
    account,
    symbol: 'EOS'
  })
  
  if (isLoading) return <div>Loading...</div>
  return <div>Balance: {balance}</div>
}

// Contract interactions
function ContractAction() {
  const { sendAction, isLoading } = useL1Contract({
    account: 'mycontract',
    action: 'transfer'
  })
  
  const handleTransfer = async () => {
    await sendAction({
      from: 'myaccount',
      to: 'otheraccount',
      quantity: '1.0000 EOS',
      memo: 'Transfer'
    })
  }
  
  return (
    <button disabled={isLoading} onClick={handleTransfer}>
      Send Transfer
    </button>
  )
}
```

## Available Hooks

- `useL1Balance`: Get account token balances
- `useL1Contract`: Interact with smart contracts
- `useL1Network`: Get current network information
- `useL1Wallet`: Wallet connection management (Anchor, Wombat)
- `useL1TableRows`: Query contract tables
- And more...

## Components

- `L1Provider`: Main provider component
- `WalletButton`: Ready-to-use wallet connection button
- `NetworkSelector`: Network selection component
- `ResourceUsage`: CPU/NET/RAM usage display

## Contributing

Please read the [contributing guidelines](../../CONTRIBUTING.md) before submitting any pull requests.

## License

MIT License - see the [LICENSE](../../LICENSE) file for details
