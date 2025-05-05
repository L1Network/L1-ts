import { createOpenAI } from '@ai-sdk/openai'
import {
  type Message,
  defaultSettingsMiddleware,
  streamText,
  wrapLanguageModel,
} from 'ai'

// Allow streaming responses up to 30 seconds
export const maxDuration = 30

if (!process.env.OPENAI_API_KEY) throw new Error('OPENAI_API_KEY is not set')

const openai = createOpenAI({
  apiKey: process.env.OPENAI_API_KEY,
  compatibility: 'strict',
})

// Tool argument types
type GetAccountArgs = {
  address: string
}

// Mock blockchain data retrieval tool
const getAccount = async (address: string) => {
  // In a real implementation, this would fetch from a blockchain API
  return {
    address,
    name: `Account ${address.substring(0, 6)}`,
    balance: {
      eth: '1.234',
      usdc: '5678.90',
      link: '123.45',
    },
    transactions: [
      {
        hash: '0x123...abc',
        timestamp: Date.now() - 1000 * 60 * 5,
        value: '0.1 ETH',
        to: '0xdef...456',
      },
      {
        hash: '0x456...def',
        timestamp: Date.now() - 1000 * 60 * 60,
        value: '25 USDC',
        to: '0x789...ghi',
      },
    ],
    tokenBalances: [
      { symbol: 'ETH', balance: '1.234', usdValue: '4,567.89' },
      { symbol: 'USDC', balance: '5678.90', usdValue: '5,678.90' },
      { symbol: 'LINK', balance: '123.45', usdValue: '678.90' },
    ],
  }
}

// AI model with tools
const model = wrapLanguageModel({
  model: openai('gpt-4o'),
  middleware: defaultSettingsMiddleware({
    settings: {
      temperature: 0.7,
      maxTokens: 2000,
    },
  }),
})

// Tool definition type
type Tool = {
  name: string
  args: GetAccountArgs
}

export async function POST(req: Request) {
  try {
    const { messages, tools } = (await req.json()) as {
      messages: Message[]
      tools?: Tool[]
    }

    // Process any tool calls first
    let toolResults = {}

    if (tools?.length) {
      for (const tool of tools) {
        if (tool.name === 'getAccount' && tool.args?.address) {
          toolResults = await getAccount(tool.args.address)
        }
      }
    }

    const stream = await streamText({
      model,
      system: `You are a blockchain data analyst assistant.
        Use the getAccount tool to retrieve information about blockchain accounts.
        Provide clear, concise insights about blockchain accounts, transactions, and tokens.
        Explain technical blockchain concepts in simple terms.
        If you detect suspicious activity patterns, mention them.
        Focus on providing actionable insights about the data.
        
        Available tools:
        - getAccount(address: string): Retrieves account information for a given address
        
        Account data context: ${JSON.stringify(toolResults)}`,
      messages,
    })

    return stream.toDataStreamResponse()
  } catch (error) {
    console.error('AI API error:', error)
    return new Response(
      JSON.stringify({ error: 'Failed to process AI request' }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      },
    )
  }
}
