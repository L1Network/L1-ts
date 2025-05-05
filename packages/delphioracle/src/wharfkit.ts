import {APIClient, Action, Name, PermissionLevel, PrivateKey, Serializer, SignedTransaction} from '@wharfkit/antelope';
import {Session} from '@wharfkit/session';
import {WalletPluginPrivateKey} from '@wharfkit/wallet-plugin-privatekey';
import {env} from './environment';
/**
 * Creates and sends a transaction to the blockchain
 * 
 * To use WharfKit's Session approach instead, install these packages:
 * npm install @wharfkit/session @wharfkit/wallet-plugin-privatekey
 * 
 * Then you can use createTransactionWithSession below instead of this function
 */
export const createTransaction = async ({
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

  // Helper to extract error details from different error formats
export const extractErrorDetails = (error: unknown): string | undefined => {
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
  
  
// Debug function
export const debugLog = (message: string, data?: unknown) => {
    if (env.debug) {
      console.debug(`[ORACLE-SDK] ${message}`, data ? JSON.stringify(data, null, 2) : '')
    }
  }
  
/**
 * Creates and sends a transaction to the blockchain using WharfKit Session
 * 
 * This is the recommended approach for transaction signing and broadcasting
 */
export async function createTransactionWithSession({
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
}) {
  try {
    debugLog(`Using RPC endpoint: ${rpcEndpoint}`)
    
    // Create a Session instance
    const session = new Session({
      chain: {
        id: env.chainId,
        url: rpcEndpoint
      },
      actor: account,
      permission,
      walletPlugin: new WalletPluginPrivateKey(privateKey)
    })

    // Ensure action has proper authorization
    if (!action.authorization || action.authorization.length === 0) {
      action.authorization = [
        PermissionLevel.from({
          actor: Name.from(account),
          permission: Name.from(permission)
        })
      ]
    }
    
    debugLog('Pushing transaction', { 
      action: action.name,
      account,
      contract: env.oracleContract,
      permission
    })

    // Use the session to transact
    const result = await session.transact({actions: [action]})
    
    debugLog('Transaction result', result)
    
    return result
  } catch (error) {
    console.error(`Transaction error in ${action.name}:`, error)
    
    const errorMessage = extractErrorDetails(error) || 'Unknown error occurred'
    throw new Error(errorMessage)
  }
}
  