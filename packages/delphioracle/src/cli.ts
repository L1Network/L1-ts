#!/usr/bin/env node
import { program } from 'commander'
import { 
  claimOracleRewards, 
  createNewPair, 
  deletePair,
  getAllPairs,
  getOracleStats,
  getTableScopes,
  readTableData,
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
  // biome-ignore lint/suspicious/noExplicitAny: <explanation>
  [key: string]: any
}

// CLI program setup
program
  .name('delphioracle-cli')
  .description('CLI to interact with DelphiOracle contract')
  .version('1.0.0')

program
  .command('register')
  .description('Register as a new oracle')
  .requiredOption('--owner <n>', 'The account that will be registered as an oracle')
  .option('--private-key <key>', 'Private key for signing transactions (REQUIRED unless set as env var)')
  .option('--permission <permission>', 'Permission to use for signing')
  .option('--rpc <url>', 'RPC endpoint URL')
  .action(async (options: CommandOptions) => {
    try {
      await registerUser({
        owner: options.owner,
        privateKey: options.privateKey,
        permission: options.permission,
        rpcEndpoint: options.rpc
      })
      console.log('Successfully registered as an oracle!')
    } catch (error) {
      console.error('Error registering as oracle:', error instanceof Error ? error.message : error)
    }
  })

program
  .command('write')
  .description('Submit oracle data points')
  .requiredOption('--owner <n>', 'The oracle account submitting data')
  .requiredOption('--pair <pair>', 'The trading pair to report on (e.g., eosusd)')
  .requiredOption('--value <number>', 'The value to report (will be multiplied by 10000)')
  .option('--private-key <key>', 'Private key for signing transactions (REQUIRED unless set as env var)')
  .option('--permission <permission>', 'Permission to use for signing')
  .option('--rpc <url>', 'RPC endpoint URL')
  .action(async (options: CommandOptions) => {
    try {
      const value = Math.round(Number.parseFloat(options.value) * 10000)
      const quotes = [{ value, pair: options.pair }]
      
      await writeOracleData({
        owner: options.owner,
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

program
  .command('claim')
  .description('Claim oracle rewards')
  .requiredOption('--owner <n>', 'The oracle account claiming rewards')
  .option('--private-key <key>', 'Private key for signing transactions (REQUIRED unless set as env var)')
  .option('--permission <permission>', 'Permission to use for signing')
  .option('--rpc <url>', 'RPC endpoint URL')
  .action(async (options: CommandOptions) => {
    try {
      await claimOracleRewards({
        owner: options.owner,
        privateKey: options.privateKey,
        permission: options.permission,
        rpcEndpoint: options.rpc
      })
      
      console.log('Rewards claimed successfully!')
    } catch (error) {
      console.error('Error claiming rewards:', error instanceof Error ? error.message : error)
    }
  })

program
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
  .action(async (options: CommandOptions) => {
    try {
      const pair = {
        name: options.name,
        base_symbol: options.baseSymbol,
        base_type: Number.parseInt(options.baseType),
        base_contract: options.baseContract,
        quote_symbol: options.quoteSymbol,
        quote_type: Number.parseInt(options.quoteType),
        quote_contract: options.quoteContract,
        quoted_precision: Number.parseInt(options.quotedPrecision)
      }
      
      await createNewPair({
        proposer: options.proposer,
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

program
  .command('stats')
  .description('Get oracle statistics')
  .requiredOption('--owner <n>', 'The oracle account to check')
  .option('--rpc <url>', 'RPC endpoint URL')
  .action(async (options: CommandOptions) => {
    try {
      const stats = await getOracleStats(options.owner, options.rpc)
      
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

program
  .command('pairs')
  .description('List all active trading pairs')
  .option('--rpc <url>', 'RPC endpoint URL')
  .action(async (options: CommandOptions) => {
    try {
      const pairs = await getAllPairs(options.rpc)
      
      if (pairs.length > 0) {
        console.log('Active trading pairs:')
        console.log('-------------------')
        
        for (const pair of pairs) {
          console.log(`Name: ${pair.name}`)
          console.log(`Base Symbol: ${pair.base_symbol}`)
          console.log(`Quote Symbol: ${pair.quote_symbol}`)
          console.log(`Quoted Precision: ${pair.quoted_precision}`)
          console.log(`Owner: ${pair.proposer}`)
          console.log('-------------------')
        }
      } else {
        console.log('No active trading pairs found')
      }
    } catch (error) {
      console.error('Error getting active pairs:', error instanceof Error ? error.message : error)
    }
  })

program
  .command('vote-bounty')
  .description('Vote for a bounty')
  .requiredOption('--owner <n>', 'The account voting')
  .requiredOption('--bounty <n>', 'The bounty to vote for')
  .option('--private-key <key>', 'Private key for signing transactions (REQUIRED unless set as env var)')
  .option('--permission <permission>', 'Permission to use for signing')
  .option('--rpc <url>', 'RPC endpoint URL')
  .action(async (options: CommandOptions) => {
    try {
      await voteBounty({
        owner: options.owner,
        bounty: options.bounty,
        privateKey: options.privateKey,
        permission: options.permission,
        rpcEndpoint: options.rpc
      })
      
      console.log('Successfully voted for bounty!')
    } catch (error) {
      console.error('Error voting for bounty:', error instanceof Error ? error.message : error)
    }
  })

program
  .command('write-hash')
  .description('Write hash for multi-party oracle')
  .requiredOption('--owner <n>', 'The oracle account submitting hash')
  .requiredOption('--hash <hash>', 'The hash to submit')
  .requiredOption('--reveal <string>', 'The reveal string')
  .option('--private-key <key>', 'Private key for signing transactions (REQUIRED unless set as env var)')
  .option('--permission <permission>', 'Permission to use for signing')
  .option('--rpc <url>', 'RPC endpoint URL')
  .action(async (options: CommandOptions) => {
    try {
      await writeHash({
        owner: options.owner,
        hash: options.hash,
        reveal: options.reveal,
        privateKey: options.privateKey,
        permission: options.permission,
        rpcEndpoint: options.rpc
      })
      
      console.log('Hash written successfully!')
    } catch (error) {
      console.error('Error writing hash:', error instanceof Error ? error.message : error)
    }
  })

program
  .command('delete-pair')
  .description('Delete an existing trading pair')
  .requiredOption('--owner <n>', 'The account that will delete the pair')
  .requiredOption('--pair <n>', 'Name of the pair to delete')
  .requiredOption('--reason <string>', 'Reason for deleting the pair')
  .option('--private-key <key>', 'Private key for signing transactions (REQUIRED unless set as env var)')
  .option('--permission <permission>', 'Permission to use for signing')
  .option('--rpc <url>', 'RPC endpoint URL')
  .action(async (options: CommandOptions) => {
    try {
      await deletePair({
        owner: options.owner,
        pairName: options.pair,
        reason: options.reason,
        privateKey: options.privateKey,
        permission: options.permission,
        rpcEndpoint: options.rpc
      })
      
      console.log(`Successfully deleted pair: ${options.pair}`)
    } catch (error) {
      console.error('Error deleting pair:', error instanceof Error ? error.message : error)
    }
  })

program
  .command('table [tableName]')
  .description('Read data from a DelphiOracle contract table with filtering options\n' +
    'Available tables: abusers, bars, custodians, datapoints, donations, global, hashes, networks, ' +
    'npairs, oglobal, pairs, producers, stats, users, voters')
  .option('--table <name>', 'Name of the table to read (e.g., pairs, stats, users)')
  .option('--scope <scope>', 'Scope for the table lookup')
  .option('--key <key>', 'Primary key to filter by (for single row)')
  .option('--from <value>', 'Start primary key value for range query')
  .option('--to <value>', 'End primary key value for range query')
  .option('--index <number>', 'Index position to use (default: primary key)')
  .option('--key-type <type>', 'Type of the key for secondary indices')
  .option('--lower <value>', 'Lower bound value for range queries')
  .option('--upper <value>', 'Upper bound value for range queries')
  .option('--limit <number>', 'Maximum number of rows to return')
  .option('--reverse', 'Reverse the order of results')
  .option('--paginate', 'Show pagination info instead of all rows')
  .option('--rpc <url>', 'RPC endpoint URL')
  .action(async (tableName, options: CommandOptions) => {
    try {
      // Allow table name to be specified as positional argument or option
      const tableToQuery = tableName || options.table
      
      if (!tableToQuery) {
        console.error('Error: Table name is required. Please specify a table name.')
        console.log('Available tables: abusers, bars, custodians, datapoints, donations, global, hashes, networks, ' +
          'npairs, oglobal, pairs, producers, stats, users, voters')
        return
      }
      
      // Use the unified readTableData function for all cases
      const result = await readTableData({
        tableName: tableToQuery,
        scope: options.scope,
        primaryKey: options.key,
        from: options.from,
        to: options.to,
        indexPosition: options.index ? Number.parseInt(options.index) : undefined,
        keyType: options.keyType,
        lowerBound: options.lower,
        upperBound: options.upper,
        limit: options.limit ? Number.parseInt(options.limit) : undefined,
        reverse: !!options.reverse,
        showPagination: !!options.paginate,
        rpcEndpoint: options.rpc
      })
      
      // Use descriptive output based on what was requested
      const outputLabel = options.key ? 'Table row:' : 'Query results:'
      console.log(outputLabel)
      console.log(JSON.stringify(result, null, 2))
    } catch (error) {
      console.error('Error reading table data:', error instanceof Error ? error.message : error)
    }
  })

program
  .command('get-scopes [tableName]')
  .description('Get all scopes for a DelphiOracle contract table\n' +
    'Available tables: abusers, bars, custodians, datapoints, donations, global, hashes, networks, ' +
    'npairs, oglobal, pairs, producers, stats, users, voters')
  .option('--table <name>', 'Name of the table to check')
  .option('--limit <number>', 'Maximum number of scopes to return')
  .option('--lower <value>', 'Lower bound scope name')
  .option('--upper <value>', 'Upper bound scope name')
  .option('--rpc <url>', 'RPC endpoint URL')
  .action(async (tableName, options: CommandOptions) => {
    try {
      // Allow table name to be specified as positional argument or option
      const tableToQuery = tableName || options.table
      
      if (!tableToQuery) {
        console.error('Error: Table name is required. Please specify a table name.')
        console.log('Available tables: abusers, bars, custodians, datapoints, donations, global, hashes, networks, ' +
          'npairs, oglobal, pairs, producers, stats, users, voters')
        return
      }
      
      const scopes = await getTableScopes({
        tableName: tableToQuery,
        limit: options.limit ? Number.parseInt(options.limit) : undefined,
        lowerBound: options.lower,
        upperBound: options.upper,
        rpcEndpoint: options.rpc
      })
      
      console.log('Table scopes:')
      console.log(JSON.stringify(scopes, null, 2))
    } catch (error) {
      console.error('Error retrieving table scopes:', error instanceof Error ? error.message : error)
    }
  })

program.parse() 