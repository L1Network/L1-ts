// Environment setup
const env = {
    oracleContract: process.env.ORACLE_CONTRACT || 'delphioracle',
    defaultRpc: process.env.RPC_ENDPOINT || 'https://api.np.animus.is',
    defaultPrivateKey: process.env.PRIVATE_KEY || '',
    defaultPermission: process.env.PERMISSION || 'active',
    debug: process.env.DEBUG === 'true' || false,
    oracle: process.env.ORACLE || 'delphioracle'
  }

  console.log(`🍓 env: `, env)

export { env }