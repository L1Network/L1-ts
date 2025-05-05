import { APIClient, Asset, Checksum256, Name, NameType, PermissionLevelType } from '@wharfkit/antelope'
import session, { Session } from '@wharfkit/session'
import { WalletPluginPrivateKey } from '@wharfkit/wallet-plugin-privatekey'
import { Contract } from './token.bk'

export const chain = {
  id: Checksum256.from('e28174b34639a5ba006265f3641c8ffc1021d65c4cd12fbf242e5c6a6fde6a55'),
  url: 'https://api.np.animus.is',
}

/**
 * Creates a session using a private key for authentication
 * @param privateKey - The private key for authentication
 * @param permission - The permission level, defaults to 'active'
 * @returns An object containing the session
 */
export const createSession = async ({ privateKey, permission }: {
  privateKey: string
  permission?: string
}) => {
  const walletPlugin = new WalletPluginPrivateKey(privateKey)
  const session = new Session({ chain, permissionLevel: permission, walletPlugin })
  return { session }
}

/**
 * Creates a new token on the blockchain
 * @param issuer - Account that will issue the token
 * @param symbol - Token symbol
 * @param precision - Number of decimal places for the token
 * @param maxSupply - Maximum supply of the token
 * @param privateKey - Private key for transaction signing
 * @param permission - Permission level, defaults to 'active'
 * @returns Object with success flag and error details if any
 */
export const createToken = async ({ 
  issuer,
  symbol,
  precision,
  maxSupply,
  privateKey,
  permission = `token.bk@active`
}: {
  issuer: NameType
  symbol: string
  precision: number
  maxSupply: number
  privateKey: string
  permission?: string
}) => {
  try {
    const { session } = await createSession({ privateKey, permission })
    const contract = new Contract({ client: session.client, account: 'token.bk' })
    
    const maximumSupply = Asset.from(`${maxSupply.toFixed(precision)} ${symbol}`)
    await session.transact({
      action: contract.action('create', {
        issuer: Name.from(issuer),
        maximum_supply: maximumSupply
      })
    })
    
    return { success: true }
  } catch (error) {
    return { success: false, error }
  }
}

/**
 * Retrieves all tokens from the blockchain
 * @param rpcEndpoint - API endpoint URL, defaults to 'https://api.np.animus.is'
 * @returns Object containing success flag, tokens array, and error details if any
 */
export const getAllTokens = async (rpcEndpoint = 'https://api.np.animus.is') => {
  try {
    const client = new APIClient({ url: rpcEndpoint })
    const contract = new Contract({ client, account: 'token.bk' })
    
    const response = await client.v1.chain.get_table_by_scope({
      code: 'token.bk',
      table: 'stat',
      limit: 100
    })
    
    const tokens: Array<{
      symbol: string
      precision: number
      supply: string
      maxSupply: string
      issuer: string
    }> = []
    
    for (const scope of response.rows) {
      const stats = await contract.table('stat', scope.scope).get()
      if (stats) {
        tokens.push({
          symbol: stats.supply.symbol.code.toString(),
          precision: stats.supply.symbol.precision,
          supply: stats.supply.toString(),
          maxSupply: stats.max_supply.toString(),
          issuer: stats.issuer.toString()
        })
      }
    }
    
    return { success: true, tokens }
  } catch (error) {
    return { success: false, error }
  }
}
