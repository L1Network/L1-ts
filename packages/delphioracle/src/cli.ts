#!/usr/bin/env node
import { program } from 'commander'
import { 
  claimOracleRewards, 
  createNewPair, 
  deletePair,
  getAllPairs,
  getOracleStats,
  registerUser, 
  voteBounty,
  writeHash,
  writeOracleData 
} from './sdk'

// Interface for common command options
interface CommandOptions {
  owner?: string
  privateKey?: string
  permission?: string
  rpc?: string
  [key: string]: any
}

// Helper to check if any required options are provided
const hasAnyArguments = (cmd: any) => cmd.args.length > 0 || Object.keys(cmd.opts()).length > 0

// CLI program setup
program
  .name('delphioracle-cli')
  .description('CLI to interact with DelphiOracle contract')
  .version('1.0.0')

const registerCmd = program
  .command('register')
  .description('Register as a new oracle')
  .requiredOption('--owner <n>', 'The account that will be registered as an oracle')
  .option('--private-key <key>', 'Private key for signing transactions (REQUIRED unless set as env var)')
  .option('--permission <permission>', 'Permission to use for signing')
  .option('--rpc <url>', 'RPC endpoint URL')
  .action(async (options: CommandOptions, cmd) => {
    if (!hasAnyArguments(cmd)) {
      cmd.help()
      return
    }
    
    try {
      await registerUser({
        owner: options.owner!,
        privateKey: options.privateKey,
        permission: options.permission,
        rpcEndpoint: options.rpc
      })
      console.log('Successfully registered as an oracle!')
    } catch (error) {
      console.error('Error registering as oracle:', error instanceof Error ? error.message : error)
    }
  })

const writeCmd = program
  .command('write')
  .description('Submit oracle data points')
  .requiredOption('--owner <n>', 'The oracle account submitting data')
  .requiredOption('--pair <pair>', 'The trading pair to report on (e.g., eosusd)')
  .requiredOption('--value <number>', 'The value to report (will be multiplied by 10000)')
  .option('--private-key <key>', 'Private key for signing transactions (REQUIRED unless set as env var)')
  .option('--permission <permission>', 'Permission to use for signing')
  .option('--rpc <url>', 'RPC endpoint URL')
  .action(async (options: CommandOptions, cmd) => {
    if (!hasAnyArguments(cmd)) {
      cmd.help()
      return
    }
    
    try {
      const value = Math.round(parseFloat(options.value) * 10000)
      const quotes = [{ value, pair: options.pair }]
      
      await writeOracleData({
        owner: options.owner!,
        quotes,
        privateKey: options.privateKey,
        permission: options.permission,
        rpcEndpoint: options.rpc
      })
      
      console.log('Oracle data submitted successfully!')
    } catch (error) {
      console.error('Error submitting oracle data:', error instanceof Error ? error.message : error)
    }
  })

const claimCmd = program
  .command('claim')
  .description('Claim oracle rewards')
  .requiredOption('--owner <n>', 'The oracle account claiming rewards')
  .option('--private-key <key>', 'Private key for signing transactions (REQUIRED unless set as env var)')
  .option('--permission <permission>', 'Permission to use for signing')
  .option('--rpc <url>', 'RPC endpoint URL')
  .action(async (options: CommandOptions, cmd) => {
    if (!hasAnyArguments(cmd)) {
      cmd.help()
      return
    }
    
    try {
      await claimOracleRewards({
        owner: options.owner!,
        privateKey: options.privateKey,
        permission: options.permission,
        rpcEndpoint: options.rpc
      })
      
      console.log('Rewards claimed successfully!')
    } catch (error) {
      console.error('Error claiming rewards:', error instanceof Error ? error.message : error)
    }
  })

const newPairCmd = program
  .command('new-pair')
  .description('Propose a new trading pair')
  .requiredOption('--proposer <n>', 'The account proposing the new pair')
  .requiredOption('--name <n>', 'Name for the trading pair (e.g., eosusd)')
  .requiredOption('--base-symbol <symbol>', 'Base token symbol (e.g., EOS)')
  .requiredOption('--base-type <number>', 'Base token type')
  .requiredOption('--base-contract <n>', 'Base token contract')
  .requiredOption('--quote-symbol <symbol>', 'Quote token symbol (e.g., USD)')
  .requiredOption('--quote-type <number>', 'Quote token type')
  .requiredOption('--quote-contract <n>', 'Quote token contract')
  .requiredOption('--quoted-precision <number>', 'Precision for quoted price')
  .option('--private-key <key>', 'Private key for signing transactions (REQUIRED unless set as env var)')
  .option('--permission <permission>', 'Permission to use for signing')
  .option('--rpc <url>', 'RPC endpoint URL')
  .action(async (options: CommandOptions, cmd) => {
    if (!hasAnyArguments(cmd)) {
      cmd.help()
      return
    }
    
    try {
      const pair = {
        name: options.name,
        base_symbol: options.baseSymbol,
        base_type: parseInt(options.baseType),
        base_contract: options.baseContract,
        quote_symbol: options.quoteSymbol,
        quote_type: parseInt(options.quoteType),
        quote_contract: options.quoteContract,
        quoted_precision: parseInt(options.quotedPrecision)
      }
      
      await createNewPair({
        proposer: options.proposer!,
        pair,
        privateKey: options.privateKey,
        permission: options.permission,
        rpcEndpoint: options.rpc
      })
      
      console.log('New trading pair proposed successfully!')
    } catch (error) {
      console.error('Error proposing new trading pair:', error instanceof Error ? error.message : error)
    }
  })

const statsCmd = program
  .command('stats')
  .description('Get oracle statistics')
  .requiredOption('--owner <n>', 'The oracle account to check')
  .option('--rpc <url>', 'RPC endpoint URL')
  .action(async (options: CommandOptions, cmd) => {
    if (!hasAnyArguments(cmd)) {
      cmd.help()
      return
    }
    
    try {
      const stats = await getOracleStats(options.owner!, options.rpc)
      
      if (stats) {
        console.log('Oracle statistics:')
        console.log('-----------------')
        console.log(`Owner: ${stats.owner}`)
        console.log(`Data points submitted: ${stats.count}`)
        console.log(`Current balance: ${stats.balance}`)
        console.log(`Last claim: ${stats.last_claim}`)
      } else {
        console.log(`No statistics found for oracle: ${options.owner}`)
      }
    } catch (error) {
      console.error('Error getting oracle stats:', error instanceof Error ? error.message : error)
    }
  })

const pairsCmd = program
  .command('pairs')
  .description('List all active trading pairs')
  .option('--rpc <url>', 'RPC endpoint URL')
  .action(async (options: CommandOptions, cmd) => {
    if (!hasAnyArguments(cmd)) {
      cmd.help()
      return
    }
    
    try {
      const pairs = await getAllPairs(options.rpc)
      
      if (pairs.length > 0) {
        console.log('Active trading pairs:')
        console.log('-------------------')
        
        pairs.forEach(pair => {
          console.log(`Name: ${pair.name}`)
          console.log(`Base Symbol: ${pair.base_symbol}`)
          console.log(`Quote Symbol: ${pair.quote_symbol}`)
          console.log(`Quoted Precision: ${pair.quoted_precision}`)
          console.log(`Owner: ${pair.proposer}`)
          console.log('-------------------')
        })
      } else {
        console.log('No active trading pairs found')
      }
    } catch (error) {
      console.error('Error getting active pairs:', error instanceof Error ? error.message : error)
    }
  })

const voteBountyCmd = program
  .command('vote-bounty')
  .description('Vote for a bounty')
  .requiredOption('--owner <n>', 'The account voting')
  .requiredOption('--bounty <n>', 'The bounty to vote for')
  .option('--private-key <key>', 'Private key for signing transactions (REQUIRED unless set as env var)')
  .option('--permission <permission>', 'Permission to use for signing')
  .option('--rpc <url>', 'RPC endpoint URL')
  .action(async (options: CommandOptions, cmd) => {
    if (!hasAnyArguments(cmd)) {
      cmd.help()
      return
    }
    
    try {
      await voteBounty({
        owner: options.owner!,
        bounty: options.bounty!,
        privateKey: options.privateKey,
        permission: options.permission,
        rpcEndpoint: options.rpc
      })
      
      console.log('Successfully voted for bounty!')
    } catch (error) {
      console.error('Error voting for bounty:', error instanceof Error ? error.message : error)
    }
  })

const writeHashCmd = program
  .command('write-hash')
  .description('Write hash for multi-party oracle')
  .requiredOption('--owner <n>', 'The oracle account submitting hash')
  .requiredOption('--hash <hash>', 'The hash to submit')
  .requiredOption('--reveal <string>', 'The reveal string')
  .option('--private-key <key>', 'Private key for signing transactions (REQUIRED unless set as env var)')
  .option('--permission <permission>', 'Permission to use for signing')
  .option('--rpc <url>', 'RPC endpoint URL')
  .action(async (options: CommandOptions, cmd) => {
    if (!hasAnyArguments(cmd)) {
      cmd.help()
      return
    }
    
    try {
      await writeHash({
        owner: options.owner!,
        hash: options.hash!,
        reveal: options.reveal!,
        privateKey: options.privateKey,
        permission: options.permission,
        rpcEndpoint: options.rpc
      })
      
      console.log('Hash written successfully!')
    } catch (error) {
      console.error('Error writing hash:', error instanceof Error ? error.message : error)
    }
  })

const deletePairCmd = program
  .command('delete-pair')
  .description('Delete an existing trading pair')
  .requiredOption('--owner <n>', 'The account that will delete the pair')
  .requiredOption('--pair <n>', 'Name of the pair to delete')
  .requiredOption('--reason <string>', 'Reason for deleting the pair')
  .option('--private-key <key>', 'Private key for signing transactions (REQUIRED unless set as env var)')
  .option('--permission <permission>', 'Permission to use for signing')
  .option('--rpc <url>', 'RPC endpoint URL')
  .action(async (options: CommandOptions, cmd) => {
    if (!hasAnyArguments(cmd)) {
      cmd.help()
      return
    }
    
    try {
      await deletePair({
        owner: options.owner!,
        pairName: options.pair!,
        reason: options.reason!,
        privateKey: options.privateKey,
        permission: options.permission,
        rpcEndpoint: options.rpc
      })
      
      console.log(`Successfully deleted pair: ${options.pair}`)
    } catch (error) {
      console.error('Error deleting pair:', error instanceof Error ? error.message : error)
    }
  })

program.parse() 