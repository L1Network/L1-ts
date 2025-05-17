import { debugLog } from './wharfkit'
// Environment setup
const env = {
    oracleContract: process.env.ORACLE_CONTRACT || 'delphioracle',
    defaultRpc: process.env.RPC_ENDPOINT || 'https://api.np.animus.is',
    debug: process.env.DEBUG === 'true' || false,
    chainId: process.env.CHAIN_ID || 'e28174b34639a5ba006265f3641c8ffc1021d65c4cd12fbf242e5c6a6fde6a55', // Animus Testnet default
    // oracle account, key and permission for signing transactions
    oracle: process.env.ORACLE || 'delphioracle',
    defaultPrivateKey: process.env.PRIVATE_KEY || '',
    defaultPermission: process.env.PERMISSION || 'active',
  }

if (env.debug)  debugLog('env', env)
  
export { env }