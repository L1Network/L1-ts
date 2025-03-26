# @l1network/errors

Standardized error handling and management for L1 Antelope blockchain applications.

## Features

- Consistent error types and messages for Antelope blockchain operations
- Improved error tracking and logging capabilities
- User-friendly error descriptions
- Built-in error types for common Antelope scenarios:
  - Transaction errors
  - Resource limits (CPU/NET/RAM)
  - Authorization failures
  - Table query errors
  - Network connection issues

## Installation

```bash
pnpm install @l1network/errors
```

## Usage

```typescript
import { L1Error, ResourceError, TransactionError } from '@l1network/errors'

// Handle specific error types
try {
  await sendTransaction()
} catch (error) {
  if (error instanceof ResourceError) {
    console.log('Resource limit exceeded:', error.message)
    // Handle CPU/NET/RAM limits
  } else if (error instanceof TransactionError) {
    console.log('Transaction failed:', error.message)
    // Handle transaction failure
  }
}

// Create custom errors
class CustomContractError extends L1Error {
  constructor(message: string) {
    super(message)
    this.name = 'CustomContractError'
  }
}
```

## Error Types

- `L1Error`: Base error class
- `ResourceError`: CPU/NET/RAM related errors
- `TransactionError`: Transaction processing errors
- `AuthorizationError`: Permission and key errors
- `NetworkError`: Connection and endpoint errors
- `TableError`: Table query and data errors

## Contributing

Please read the [contributing guidelines](../../CONTRIBUTING.md) before submitting any pull requests.

## License

MIT License - see the [LICENSE](../../LICENSE) file for details