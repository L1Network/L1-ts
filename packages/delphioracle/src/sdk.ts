import { APIClient } from '@wharfkit/antelope'
import { Checksum256, Name, PermissionLevel, UInt64 } from '@wharfkit/antelope'
import { Contract as OracleContract, TableMap, type TableNames, Types } from './delphioracle'
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
    const actionData = { owner: Name.from(owner) }
    
    const action = contract.action('reguser', actionData, {
      authorization: [
        PermissionLevel.from({
          actor: Name.from(owner),
          permission: Name.from(permission)
        })
      ]
    })
    
    return createTransaction({ 
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
    
    const actionData = {
      owner: Name.from(owner),
      quotes: formattedQuotes
    }
    debugLog('Creating write action:', actionData)
    
    const action = contract.action('write', actionData, {
      authorization: [
        PermissionLevel.from({
          actor: Name.from(owner),
          permission: Name.from(permission)
        })
      ]
    })
    
    return createTransaction({ 
      action, 
      privateKey, 
      permission, 
      rpcEndpoint 
    })
  } catch (error) {
    console.error('Failed to write oracle data:', error)
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
    
    const actionData = { owner: Name.from(owner) }
    debugLog('Creating claim action:', actionData)
    
    const action = contract.action('claim', actionData, {
      authorization: [
        PermissionLevel.from({
          actor: Name.from(owner),
          permission: Name.from(permission)
        })
      ]
    })
    
    return createTransaction({ 
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
    
    const actionData = {
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
    }
    debugLog('Creating newbounty action:', actionData)
    
    const action = contract.action('newbounty', actionData, {
      authorization: [
        PermissionLevel.from({
          actor: Name.from(proposer),
          permission: Name.from(permission)
        })
      ]
    })
    
    return createTransaction({ 
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

/**
 * Read data from a DelphiOracle contract table with filtering options
 * Provides flexible options for querying, filtering, and pagination
 */
export const readTableData = async ({ 
  tableName, 
  scope,
  primaryKey,
  from,
  to,
  indexPosition,
  keyType,
  lowerBound,
  upperBound,
  limit = 100,
  reverse = false,
  showPagination = false,
  rpcEndpoint = env.defaultRpc
}: {
  tableName: TableNames
  scope?: string
  primaryKey?: string
  from?: string
  to?: string
  indexPosition?: number
  keyType?: string
  lowerBound?: string
  upperBound?: string
  limit?: number
  reverse?: boolean
  showPagination?: boolean
  rpcEndpoint?: string
}) => {
  try {
    // Validate if table exists in TableMap
    if (!Object.keys(TableMap).includes(tableName)) {
      throw new Error('Table \'' + tableName + '\' does not exist in contract')
    }

    debugLog('Querying table ' + tableName)
    const client = new APIClient({ url: rpcEndpoint })
    const contract = new OracleContract({ account: Name.from(env.oracleContract), client })
    
    // Create table instance with optional scope
    const table = scope 
      ? contract.table(tableName as TableNames, Name.from(scope))
      : contract.table(tableName as TableNames)
    
    // If primaryKey is provided, get a single row
    if (primaryKey) {
      const result = await table.get(primaryKey)
      debugLog('Single row response', result)
      return result
    }
    
    // Create query params with all the filtering options
    const queryParams: any = {
      ...(from ? { from } : {}),
      ...(to ? { to } : {}),
      ...(indexPosition !== undefined ? { index: indexPosition } : {}),
      ...(keyType ? { keyType } : {}),
      ...(lowerBound ? { lowerBound } : {}),
      ...(upperBound ? { upperBound } : {}),
      limit,
      reverse
    }
    
    // Create cursor for pagination
    const cursor = table.query(queryParams)
    
    if (showPagination) {
      // Return first page with cursor for pagination
      const firstPage = await cursor.next(limit)
      return {
        rows: firstPage,
        hasMore: firstPage.length === limit,
        tableName,
        queryParams
      }
    }
    
    // Return all rows matching the query
    const rows = await cursor.all()
    debugLog('Retrieved ' + rows.length + ' rows from ' + tableName)
    return { rows, tableName }
  } catch (error) {
    console.error('Failed to query table ' + tableName + ':', error)
    const errorMessage = extractErrorDetails(error) || 'Failed to query table ' + tableName
    throw new Error(errorMessage)
  }
}

/**
 * Advanced table data reader with pagination, filtering, and range queries
 */
export const queryTableData = async ({ 
  tableName, 
  scope,
  primaryKey,
  from,
  to,
  indexPosition,
  keyType,
  lowerBound,
  upperBound,
  limit = 100,
  reverse = false,
  showPagination = false,
  rpcEndpoint = env.defaultRpc
}: {
  tableName: TableNames
  scope?: string
  primaryKey?: string
  from?: string
  to?: string
  indexPosition?: number
  keyType?: string
  lowerBound?: string
  upperBound?: string
  limit?: number
  reverse?: boolean
  showPagination?: boolean
  rpcEndpoint?: string
}) => {
  try {
    // Validate if table exists in TableMap
    if (!Object.keys(TableMap).includes(tableName)) {
      throw new Error('Table \'' + tableName + '\' does not exist in contract')
    }

    debugLog('Querying table ' + tableName)
    const client = new APIClient({ url: rpcEndpoint })
    const contract = new OracleContract({ account: Name.from(env.oracleContract), client })
    
    // Create table instance with optional scope
    const table = scope 
      ? contract.table(tableName as TableNames, Name.from(scope))
      : contract.table(tableName as TableNames)
    
    // If primaryKey is provided, get a single row
    if (primaryKey) {
      const result = await table.get(primaryKey)
      debugLog('Single row response', result)
      return result
    }
    
    // Create query params with all the filtering options
    const queryParams: any = {
      ...(from ? { from } : {}),
      ...(to ? { to } : {}),
      ...(indexPosition !== undefined ? { index: indexPosition } : {}),
      ...(keyType ? { keyType } : {}),
      ...(lowerBound ? { lowerBound } : {}),
      ...(upperBound ? { upperBound } : {}),
      limit,
      reverse
    }
    
    // Create cursor for pagination
    const cursor = table.query(queryParams)
    
    if (showPagination) {
      // Return first page with cursor for pagination
      const firstPage = await cursor.next(limit)
      return {
        rows: firstPage,
        hasMore: firstPage.length === limit,
        tableName,
        queryParams
      }
    } else {
      // Return all rows matching the query
      const rows = await cursor.all()
      debugLog('Retrieved ' + rows.length + ' rows from ' + tableName)
      return { rows, tableName }
    }
  } catch (error) {
    console.error('Failed to query table ' + tableName + ':', error)
    const errorMessage = extractErrorDetails(error) || 'Failed to query table ' + tableName
    throw new Error(errorMessage)
  }
}

// Get table scopes
export const getTableScopes = async ({
  tableName,
  limit = 100,
  lowerBound,
  upperBound,
  rpcEndpoint = env.defaultRpc
}: {
  tableName: TableNames
  limit?: number
  lowerBound?: string
  upperBound?: string
  rpcEndpoint?: string
}) => {
  try {
    // Validate if table exists in TableMap
    if (!Object.keys(TableMap).includes(tableName)) {
      throw new Error('Table \'' + tableName + '\' does not exist in contract')
    }

    debugLog('Getting scopes for table ' + tableName)
    const client = new APIClient({ url: rpcEndpoint })
    const contract = new OracleContract({ account: Name.from(env.oracleContract), client })
    
    // Get the table instance
    const table = contract.table(tableName as TableNames)
    
    // Create scope cursor
    const scopeCursor = table.scopes()
    
    // Get all scopes
    const scopes = await scopeCursor.all()
    debugLog('Retrieved ' + scopes.length + ' scopes for ' + tableName)
    
    return scopes
  } catch (error) {
    console.error('Failed to get scopes for table ' + tableName + ':', error)
    const errorMessage = extractErrorDetails(error) || 'Failed to get scopes for table ' + tableName
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
    // return rows.filter(pair => pair.active)
    return rows
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
    
    const actionData = {
      owner: Name.from(owner),
      bounty: Name.from(bounty)
    }
    debugLog('Creating votebounty action:', actionData)
    
    const action = contract.action('votebounty', actionData, {
      authorization: [
        PermissionLevel.from({
          actor: Name.from(owner),
          permission: Name.from(permission)
        })
      ]
    })
    
    return createTransaction({ 
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
    
    const actionData = {
      owner: Name.from(owner),
      hash: Checksum256.from(hash),
      reveal
    }
    debugLog('Creating writehash action:', actionData)
    
    const action = contract.action('writehash', actionData, {
      authorization: [
        PermissionLevel.from({
          actor: Name.from(owner),
          permission: Name.from(permission)
        })
      ]
    })
    
    return createTransaction({ 
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
    
    const actionData = {
      name: Name.from(pairName),
      reason
    }
    debugLog('Creating deletepair action:', actionData)
    
    const action = contract.action('deletepair', actionData, {
      authorization: [
        PermissionLevel.from({
          actor: Name.from(owner),
          permission: Name.from(permission)
        })
      ]
    })
    
    return createTransaction({ 
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

// Edit an existing pair
export const editPair = async ({
  owner,
  pair,
  privateKey = env.defaultPrivateKey,
  permission = env.defaultPermission,
  rpcEndpoint = env.defaultRpc
}: {
  owner: string
  pair: Types.pairs
  privateKey?: string
  permission?: string
  rpcEndpoint?: string
}) => {
  try {
    const client = new APIClient({ url: rpcEndpoint })
    const contract = new OracleContract({ account: Name.from(env.oracleContract), client })
    
    const actionData = { pair }
    debugLog('Creating editpair action:', actionData)
    
    const action = contract.action('editpair', actionData, {
      authorization: [
        PermissionLevel.from({
          actor: Name.from(owner),
          permission: Name.from(permission)
        })
      ]
    })
    
    return createTransaction({ 
      action, 
      privateKey, 
      permission, 
      rpcEndpoint 
    })
  } catch (error) {
    console.error(`Failed to edit pair ${pair.name} by ${owner}:`, error)
    
    const errorMessage = extractErrorDetails(error) || 'Failed to edit pair'
    throw new Error(errorMessage)
  }
}

