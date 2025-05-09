import { Contract as OracleContract, Types } from './delphioracle'
import type { ActionParams } from './delphioracle'
import { APIClient, Action } from '@wharfkit/antelope'
import { Name, UInt64, Checksum256, PermissionLevel, PrivateKey, Serializer, SignedTransaction } from '@wharfkit/antelope'
import { env } from './environment'

// Debug function
const debugLog = (message: string, data?: unknown) => {
  if (env.debug) {
    console.debug(`[ORACLE-SDK] ${message}`, data ? JSON.stringify(data, null, 2) : '')
  }
}

// Type definitions
export type Quote = {
  value: number | string
  pair: string
}

export type PairInput = Omit<ActionParams.Type.pairinput, 'base_symbol' | 'quote_symbol'> & {
  base_symbol: string
  quote_symbol: string
}

export type OracleStat = Types.stats

export type ChainDefinition = {
  id: string
  url: string
}

/**
 * Creates and sends a transaction to the blockchain
 * 
 * To use WharfKit's Session approach instead, install these packages:
 * npm install @wharfkit/session @wharfkit/wallet-plugin-privatekey
 * 
 * Then you can use createTransactionWithSession below instead of this function
 */
const createTransaction = async ({
  account,
  action,
  privateKey,
  permission = env.defaultPermission,
  rpcEndpoint = env.defaultRpc
}: {
  account: string
  action: Action
  privateKey: string
  permission?: string
  rpcEndpoint?: string
}) => {
  try {
    const client = new APIClient({ url: rpcEndpoint })
    
    debugLog(`Using RPC endpoint: ${rpcEndpoint}`)
    const info = await client.v1.chain.get_info()
    const header = info.getTransactionHeader(60)
    
    // Ensure action has proper authorization
    if (!action.authorization || action.authorization.length === 0) {
      action.authorization = [
        PermissionLevel.from({
          actor: Name.from(account),
          permission: Name.from(permission)
        })
      ]
    }
    
    const transaction = SignedTransaction.from({
      ...header,
      actions: [action],
    })

    const privateKeyObject = PrivateKey.from(privateKey)
    const signature = privateKeyObject.signDigest(transaction.signingDigest(info.chain_id))
    
    transaction.signatures.push(signature)
    
    debugLog('Pushing transaction', { 
      action: action.name,
      account,
      contract: env.oracleContract,
      permission,
      transaction: Serializer.encode({ object: transaction }).toString('hex').substring(0, 50) + '...'
    })
    
    const result = await client.v1.chain.push_transaction(transaction)
    
    debugLog('Transaction result', result)
    
    return result
  } catch (error) {
    console.error(`Transaction error in ${action.name}:`, error)
    
    const errorMessage = extractErrorDetails(error) || 'Unknown error occurred'
    throw new Error(errorMessage)
  }
}

/**
 * Alternative implementation using WharfKit Session
 * 
 * To use this function:
 * 1. Install required packages:
 *    npm install @wharfkit/session @wharfkit/wallet-plugin-privatekey
 * 
 * 2. Uncomment the import statements at the top of the file:
 *    import { Session } from '@wharfkit/session'
 *    import { WalletPluginPrivateKey } from '@wharfkit/wallet-plugin-privatekey'
 * 
 * 3. Rename this function to createTransaction and remove the original implementation
 */
// const createTransactionWithSession = async ({
//   account,
//   action,
//   privateKey,
//   permission = env.defaultPermission,
//   rpcEndpoint = env.defaultRpc,
//   expireSeconds = 60,
//   broadcast = true
// }: {
//   account: string
//   action: Action
//   privateKey: string
//   permission?: string
//   rpcEndpoint?: string
//   expireSeconds?: number
//   broadcast?: boolean
// }) => {
//   try {
//     debugLog(`Using RPC endpoint: ${rpcEndpoint}`)
//     
//     // To get the chain ID, we need to query the API first
//     const client = new APIClient({ url: rpcEndpoint })
//     const info = await client.v1.chain.get_info()
//     
//     // Create a session using WharfKit
//     const session = new Session({
//       chain: {
//         id: info.chain_id.toString(),
//         url: rpcEndpoint,
//       },
//       actor: account,
//       permission,
//       walletPlugin: new WalletPluginPrivateKey(privateKey)
//     })
//     
//     // Ensure action has proper authorization
//     if (!action.authorization || action.authorization.length === 0) {
//       action.authorization = [
//         PermissionLevel.from({
//           actor: Name.from(account),
//           permission: Name.from(permission)
//         })
//       ]
//     }
//     
//     debugLog('Pushing transaction', {
//       action: action.name,
//       account,
//       contract: env.oracleContract,
//       permission
//     })
//     
//     // Use session to sign and broadcast the transaction with full options
//     const result = await session.transact({
//       actions: [action],
//       broadcast,
//       expireSeconds
//     })
//     
//     debugLog('Transaction result', result)
//     
//     return result
//   } catch (error) {
//     console.error(`Transaction error in ${action.name}:`, error)
//     
//     const errorMessage = extractErrorDetails(error) || 'Unknown error occurred'
//     throw new Error(errorMessage)
//   }
// }

/**
 * For web applications, SessionKit is recommended instead of directly using Session
 * 
 * To use this approach:
 * 1. Install required packages:
 *    npm install @wharfkit/session @wharfkit/wallet-plugin-privatekey @wharfkit/web-renderer
 * 
 * 2. Create a SessionKit instance in your application:
 *    ```
 *    import { SessionKit } from "@wharfkit/session"
 *    import { WebRenderer } from "@wharfkit/web-renderer"
 *    import { WalletPluginPrivateKey } from "@wharfkit/wallet-plugin-privatekey"
 *    
 *    const sessionKit = new SessionKit({
 *      appName: "delphi-oracle",
 *      chains: [{
 *        id: env.chainId || "",
 *        url: env.defaultRpc
 *      }],
 *      ui: new WebRenderer(),
 *      walletPlugins: [new WalletPluginPrivateKey(env.defaultPrivateKey)]
 *    })
 *    
 *    // Login and get a session
 *    const { session } = await sessionKit.login()
 *    
 *    // Use session for transactions
 *    const result = await session.transact({ 
 *      actions: [action],
 *      broadcast: true,
 *      expireSeconds: 60
 *    })
 *    ```
 */

// Helper to extract error details from different error formats
const extractErrorDetails = (error: unknown): string | undefined => {
  if (!error) return undefined
  
  if (typeof error === 'object' && error !== null) {
    const errorObj = error as Record<string, any>
    
    // Handle RPC response errors
    if (errorObj.json) {
      const jsonError = errorObj.json
      
      // Check for detailed error array
      if (jsonError.error?.details?.length) {
        return jsonError.error.details
          .map((d: any) => d.message || JSON.stringify(d))
          .join(', ')
      }
      
      // Check for error message in common places
      if (jsonError.error?.what) {
        return jsonError.error.what
      }
      
      // Return stringified JSON if no specific field found
      return JSON.stringify(jsonError)
    }
    
    // For other errors, check for stack
    if (error instanceof Error) {
      return error.message
    }
  }
  
  return typeof error === 'object' ? JSON.stringify(error) : String(error)
}

// Register as an oracle
export const registerUser = async ({ 
  owner, 
  privateKey = env.defaultPrivateKey, 
  permission = env.defaultPermission,
  rpcEndpoint = env.defaultRpc 
}: {
  owner: string
  privateKey?: string
  permission?: string
  rpcEndpoint?: string
}) => {
  try {
    const client = new APIClient({ url: rpcEndpoint })
    const contract = new OracleContract({ account: Name.from(env.oracleContract), client })
    
    const action = contract.action('reguser', {
      owner: Name.from(owner)
    }, {
      authorization: [
        PermissionLevel.from({
          actor: Name.from(owner),
          permission: Name.from(permission)
        })
      ]
    })
    
    return createTransaction({ 
      account: owner, 
      action, 
      privateKey, 
      permission, 
      rpcEndpoint 
    })
  } catch (error) {
    console.error(`Failed to register user ${owner}:`, error)
    
    const errorMessage = extractErrorDetails(error) || 'Failed to register user'
    throw new Error(errorMessage)
  }
}

// Write oracle data
export const writeOracleData = async ({ 
  owner,
  quotes,
  privateKey = env.defaultPrivateKey,
  permission = env.defaultPermission,
  rpcEndpoint = env.defaultRpc
}: {
  owner: string
  quotes: Quote[]
  privateKey?: string
  permission?: string
  rpcEndpoint?: string
}) => {
  try {
    const client = new APIClient({ url: rpcEndpoint })
    const contract = new OracleContract({ account: Name.from(env.oracleContract), client })
    
    const formattedQuotes = quotes.map(q => ({
      value: UInt64.from(q.value),
      pair: Name.from(q.pair)
    }))
    
    const action = contract.action('write', {
      owner: Name.from(owner),
      quotes: formattedQuotes
    }, {
      authorization: [
        PermissionLevel.from({
          actor: Name.from(owner),
          permission: Name.from(permission)
        })
      ]
    })
    
    return createTransaction({ 
      account: owner, 
      action, 
      privateKey, 
      permission, 
      rpcEndpoint 
    })
  } catch (error) {
    console.error(`Failed to write oracle data:`, error)
    const errorMessage = extractErrorDetails(error) || 'Failed to write oracle data'
    throw new Error(errorMessage)
  }
}

// Claim oracle rewards
export const claimOracleRewards = async ({ 
  owner, 
  privateKey = env.defaultPrivateKey,
  permission = env.defaultPermission,
  rpcEndpoint = env.defaultRpc
}: {
  owner: string
  privateKey?: string
  permission?: string
  rpcEndpoint?: string
}) => {
  try {
    const client = new APIClient({ url: rpcEndpoint })
    const contract = new OracleContract({ account: Name.from(env.oracleContract), client })
    
    const action = contract.action('claim', {
      owner: Name.from(owner)
    }, {
      authorization: [
        PermissionLevel.from({
          actor: Name.from(owner),
          permission: Name.from(permission)
        })
      ]
    })
    
    return createTransaction({ 
      account: owner, 
      action, 
      privateKey, 
      permission, 
      rpcEndpoint 
    })
  } catch (error) {
    console.error(`Failed to claim rewards for ${owner}:`, error)
    
    const errorMessage = extractErrorDetails(error) || 'Failed to claim oracle rewards'
    throw new Error(errorMessage)
  }
}

// Create new trading pair
export const createNewPair = async ({ 
  proposer,
  pair,
  privateKey = env.defaultPrivateKey,
  permission = env.defaultPermission,
  rpcEndpoint = env.defaultRpc
}: {
  proposer: string
  pair: PairInput
  privateKey?: string
  permission?: string
  rpcEndpoint?: string
}) => {
  try {
    const client = new APIClient({ url: rpcEndpoint })
    const contract = new OracleContract({ account: Name.from(env.oracleContract), client })
    
    const action = contract.action('newbounty', {
      proposer: Name.from(proposer),
      pair: {
        name: Name.from(pair.name),
        base_symbol: pair.base_symbol,
        base_type: pair.base_type,
        base_contract: Name.from(pair.base_contract),
        quote_symbol: pair.quote_symbol,
        quote_type: pair.quote_type,
        quote_contract: Name.from(pair.quote_contract),
        quoted_precision: UInt64.from(pair.quoted_precision)
      }
    }, {
      authorization: [
        PermissionLevel.from({
          actor: Name.from(proposer),
          permission: Name.from(permission)
        })
      ]
    })
    
    return createTransaction({ 
      account: proposer, 
      action, 
      privateKey, 
      permission, 
      rpcEndpoint 
    })
  } catch (error) {
    console.error(`Failed to create new pair by ${proposer}:`, error)
    
    const errorMessage = extractErrorDetails(error) || 'Failed to create new trading pair'
    throw new Error(errorMessage)
  }
}

// Get oracle stats
export const getOracleStats = async (
  owner: string,
  rpcEndpoint = env.defaultRpc
): Promise<Types.stats | undefined> => {
  try {
    debugLog(`Getting oracle stats for ${owner} from ${rpcEndpoint}`)
    const client = new APIClient({ url: rpcEndpoint })
    const contract = new OracleContract({ account: Name.from(env.oracleContract), client })
    
    const table = contract.table('stats')
    const result = await table.get(Name.from(owner))
    
    debugLog('Table response', result)
    
    return result || undefined
  } catch (error) {
    console.error(`Failed to get stats for ${owner}:`, error)
    
    const errorMessage = extractErrorDetails(error) || 'Failed to fetch oracle stats'
    throw new Error(errorMessage)
  }
}

// Get all active pairs
export const getAllPairs = async (
  rpcEndpoint = env.defaultRpc
): Promise<Types.pairs[]> => {
  try {
    debugLog(`Getting all pairs from ${rpcEndpoint}`)
    const client = new APIClient({ url: rpcEndpoint })
    const contract = new OracleContract({ account: Name.from(env.oracleContract), client })
    
    const table = contract.table('pairs')
    const rows = await table.all()
    
    debugLog('Table rows response', rows)
    
    // Filter active pairs only from the result array
    return rows.filter(pair => pair.active)
  } catch (error) {
    console.error('Failed to get active pairs:', error)
    
    const errorMessage = extractErrorDetails(error) || 'Failed to fetch pairs'
    throw new Error(errorMessage)
  }
}

// Vote for a bounty
export const voteBounty = async ({
  owner,
  bounty,
  privateKey = env.defaultPrivateKey,
  permission = env.defaultPermission,
  rpcEndpoint = env.defaultRpc
}: {
  owner: string
  bounty: string
  privateKey?: string
  permission?: string
  rpcEndpoint?: string
}) => {
  try {
    const client = new APIClient({ url: rpcEndpoint })
    const contract = new OracleContract({ account: Name.from(env.oracleContract), client })
    
    const action = contract.action('votebounty', {
      owner: Name.from(owner),
      bounty: Name.from(bounty)
    }, {
      authorization: [
        PermissionLevel.from({
          actor: Name.from(owner),
          permission: Name.from(permission)
        })
      ]
    })
    
    return createTransaction({ 
      account: owner, 
      action, 
      privateKey, 
      permission, 
      rpcEndpoint 
    })
  } catch (error) {
    console.error(`Failed to vote for bounty ${bounty} by ${owner}:`, error)
    
    const errorMessage = extractErrorDetails(error) || 'Failed to vote for bounty'
    throw new Error(errorMessage)
  }
}

// Write hash (multi-party oracle)
export const writeHash = async ({
  owner,
  hash,
  reveal,
  privateKey = env.defaultPrivateKey,
  permission = env.defaultPermission,
  rpcEndpoint = env.defaultRpc
}: {
  owner: string
  hash: string
  reveal: string
  privateKey?: string
  permission?: string
  rpcEndpoint?: string
}) => {
  try {
    const client = new APIClient({ url: rpcEndpoint })
    const contract = new OracleContract({ account: Name.from(env.oracleContract), client })
    
    const action = contract.action('writehash', {
      owner: Name.from(owner),
      hash: Checksum256.from(hash),
      reveal
    }, {
      authorization: [
        PermissionLevel.from({
          actor: Name.from(owner),
          permission: Name.from(permission)
        })
      ]
    })
    
    return createTransaction({ 
      account: owner, 
      action, 
      privateKey, 
      permission, 
      rpcEndpoint 
    })
  } catch (error) {
    console.error(`Failed to write hash for ${owner}:`, error)
    
    const errorMessage = extractErrorDetails(error) || 'Failed to write hash'
    throw new Error(errorMessage)
  }
}

// Delete an existing pair
export const deletePair = async ({
  owner,
  pairName,
  reason,
  privateKey = env.defaultPrivateKey,
  permission = env.defaultPermission,
  rpcEndpoint = env.defaultRpc
}: {
  owner: string
  pairName: string
  reason: string
  privateKey?: string
  permission?: string
  rpcEndpoint?: string
}) => {
  try {
    const client = new APIClient({ url: rpcEndpoint })
    const contract = new OracleContract({ account: Name.from(env.oracleContract), client })
    
    const action = contract.action('deletepair', {
      name: Name.from(pairName),
      reason
    }, {
      authorization: [
        PermissionLevel.from({
          actor: Name.from(owner),
          permission: Name.from(permission)
        })
      ]
    })
    
    return createTransaction({ 
      account: owner, 
      action, 
      privateKey, 
      permission, 
      rpcEndpoint 
    })
  } catch (error) {
    console.error(`Failed to delete pair ${pairName} by ${owner}:`, error)
    
    const errorMessage = extractErrorDetails(error) || 'Failed to delete pair'
    throw new Error(errorMessage)
  }
}
