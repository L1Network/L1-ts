import { program } from 'commander'
import { createToken, getAllTokens } from './sdk'
import { env } from './environment'

program
  .name('bitcash-token-cli')
  .description('CLI to manage BitCash tokens')
  .version('1.0.0')

program
  .command('create')
  .description('Create a new token')
  .requiredOption('--issuer <name>', 'The account that will issue the token')
  .requiredOption('--symbol <symbol>', 'Token symbol (e.g., BTC)')
  .option('--precision <number>', 'Token precision (decimal places)', '4')
  .requiredOption('--max-supply <number>', 'Maximum token supply')
  .requiredOption('--private-key <key>', 'Private key for signing transactions')
  .option('--permission <permission>', 'Permission to use for signing', 'active')
  .action(async options => {
    const result = await createToken({
      issuer: options.issuer,
      symbol: options.symbol,
      precision: parseInt(options.precision),
      maxSupply: parseFloat(options.maxSupply),
      privateKey: env.privateKey,
      permission: options.permission
    })
    
    if (result.success) {
      console.log('Token created successfully!')
    } else {
      console.error('Error creating token:', result.error)
    }
  })

program
  .command('list')
  .description('List all tokens on the contract')
  .option('--rpc <url>', 'RPC endpoint URL', 'https://api.np.animus.is')
  .action(async options => {
    const result = await getAllTokens(options.rpc)
    
    if (result.success && result.tokens) {
      console.log('All tokens:')
      console.log('-----------')
      
      result.tokens.forEach(token => {
        console.log(`Symbol: ${token.symbol}`)
        console.log(`Precision: ${token.precision}`)
        console.log(`Supply: ${token.supply}`)
        console.log(`Max Supply: ${token.maxSupply}`)
        console.log(`Issuer: ${token.issuer}`)
        console.log('-----------')
      })
    } else {
      console.error('Error getting tokens:', result.error)
    }
  })

program.parse()
