// Environment setup
const env = {
    oracleContract: process.env.ORACLE_CONTRACT || 'delphioracle',
    defaultRpc: process.env.RPC_ENDPOINT || 'https://api.np.animus.is',
    defaultPrivateKey: process.env.PRIVATE_KEY || '',
    defaultPermission: process.env.PERMISSION || 'active',
    debug: process.env.DEBUG === 'true' || false,
    oracle: process.env.ORACLE || 'delphioracle',
    chainId: process.env.CHAIN_ID || '17dcf4a44b74274c4146e8aec53e78e044cd3a41646a29dea610d7d43de854a1' // Animus Testnet default
  }

if (env.debug)  console.log(`🍓 env: `, env)
  
export { env }