import {APIClient, Action, Name, PermissionLevel, PrivateKey, Serializer, SignedTransaction} from '@wharfkit/antelope';
import {Session} from '@wharfkit/session';
import {WalletPluginPrivateKey} from '@wharfkit/wallet-plugin-privatekey';
import {env} from './environment';


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
  

export async function createTransaction({
  action,
  privateKey = env.defaultPrivateKey,
  permission = env.defaultPermission,
  rpcEndpoint = env.defaultRpc
}: {
  action: Action
  privateKey?: string
  permission?: string
  rpcEndpoint?: string
}) {
  try {
    debugLog('createTransaction session', {  
      actor: action.authorization[0].actor,
      permission, 
      privateKey
    })

    // Create a Session instance
    const session = new Session({
      chain: {
        id: env.chainId,
        url: rpcEndpoint
      },
      actor: action.authorization[0].actor,
      permission,
      walletPlugin: new WalletPluginPrivateKey(privateKey)
    })

    debugLog('createTransaction', {action})

    // Use the session to transact
    const result = await session.transact({action})
    
    debugLog('Transaction result', result)
    
    return result
  } catch (error) {
    console.error(`Transaction error in ${action.name}:`, error)
    
    const errorMessage = extractErrorDetails(error) || 'Unknown error occurred'
    throw new Error(errorMessage)
  }
}
  