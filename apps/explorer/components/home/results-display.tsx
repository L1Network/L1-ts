'use client'

import { useChat } from '@ai-sdk/react'
import { Card } from '@l1network/ui/components'
import type { Message } from 'ai'
import { AiInsights } from './ai-insights'
import { JsonDisplay } from './json-display'

interface BlockchainData {
  address: string
  name: string
  balance: Record<string, string>
  transactions: Array<{
    hash: string
    timestamp: number
    value: string
    to: string
  }>
  tokenBalances: Array<{
    symbol: string
    balance: string
    usdValue: string
  }>
}

interface ResultsDisplayProps {
  chatId?: string
}

export const ResultsDisplay = ({ chatId }: ResultsDisplayProps) => {
  const { messages, isLoading } = useChat({
    api: '/api/ai/chat',
    id: chatId,
  })

  // Helper function to safely parse JSON
  const tryParseJson = (jsonString: string): BlockchainData | null => {
    try {
      // Try to extract JSON from text if it's embedded in a response
      const jsonMatch = jsonString.match(/{[\s\S]*}/)
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0]) as BlockchainData
      }
      return null
    } catch (e) {
      console.error('Failed to parse JSON from response:', e)
      return null
    }
  }

  // Extract blockchain data from AI response if available
  const blockchainData = messages.find(
    (msg) =>
      msg.role === 'assistant' &&
      msg.content.includes('{') &&
      msg.content.includes('}'),
  )?.content

  // Parse JSON data if present
  const parsedData = blockchainData ? tryParseJson(blockchainData) : null

  // Only display if we have messages
  if (messages.length === 0 && !isLoading) return null

  return (
    <Card className="p-6 overflow-hidden">
      <div className="space-y-6">
        <h2 className="text-xl font-semibold">Results</h2>

        <AiInsights messages={messages} isLoading={isLoading} />

        {parsedData && (
          <div className="mt-6 pt-6 border-t">
            <h3 className="text-lg font-medium mb-4">Account Data</h3>
            <JsonDisplay data={parsedData} />
          </div>
        )}
      </div>
    </Card>
  )
}
