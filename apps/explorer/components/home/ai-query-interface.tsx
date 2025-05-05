'use client'

import { useChat } from '@ai-sdk/react'
import { Button, Card, Input } from '@l1network/ui/components'
import { Send } from 'lucide-react'
import type { FormEvent } from 'react'
import { useState } from 'react'
import { AiInsights } from './ai-insights'

interface AiQueryInterfaceProps {
  accountData: unknown
  address: string
}

export const AiQueryInterface = ({
  accountData,
  address,
}: AiQueryInterfaceProps) => {
  const [aiQuery, setAiQuery] = useState('')

  const { messages, handleSubmit, isLoading } = useChat({
    api: '/api/chat',
    initialMessages: [
      {
        id: 'initial-data',
        role: 'user',
        content: `Analyze this blockchain account: ${address}\n\nData: ${JSON.stringify(accountData, null, 2)}`,
      },
    ],
  })

  const handleAiQuery = (e: FormEvent) => {
    e.preventDefault()
    if (!aiQuery.trim()) return

    handleSubmit(e)
    setAiQuery('')
  }

  return (
    <Card className="p-6">
      <div className="space-y-4">
        <h2 className="text-xl font-semibold">AI Insights</h2>

        <AiInsights messages={messages} isLoading={isLoading} />

        <form onSubmit={handleAiQuery} className="pt-4 border-t">
          <div className="flex gap-2">
            <Input
              type="text"
              placeholder="Ask a question about this blockchain data..."
              value={aiQuery}
              onChange={(e) => setAiQuery(e.target.value)}
              className="flex-1"
            />
            <Button type="submit" disabled={isLoading} size="icon">
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </form>
      </div>
    </Card>
  )
}
