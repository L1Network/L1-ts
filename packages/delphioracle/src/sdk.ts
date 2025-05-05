import { APIClient } from '@wharfkit/antelope'
import { Checksum256, Name, PermissionLevel, UInt64 } from '@wharfkit/antelope'
import { Contract as OracleContract, Types } from './delphioracle'
import type { ActionParams } from './delphioracle'
import { env } from './environment'
import { createTransaction, debugLog, extractErrorDetails } from './wharfkit'

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
  quotes: { value: number | string; pair: string }[]
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
  pair: ActionParams.Type.pairinput
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
