'use client'

import { Alert } from '@l1network/ui/components/alert'
import type { Message } from 'ai'
import { Loader2 } from 'lucide-react'

interface AiInsightsProps {
  messages: Message[]
  isLoading: boolean
}

export const AiInsights = ({ messages, isLoading }: AiInsightsProps) => {
  const aiMessages = messages.filter((message) => message.role === 'assistant')

  if (messages.length <= 1 && isLoading)
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="h-6 w-6 animate-spin text-primary mr-2" />
        <span>Analyzing blockchain data...</span>
      </div>
    )

  if (aiMessages.length === 0 && !isLoading)
    return (
      <Alert>
        Ask a question about this blockchain data to get AI-powered insights.
      </Alert>
    )

  return (
    <div className="space-y-4">
      {aiMessages.map((message, index) => (
        <div
          key={message.id || index}
          className="prose prose-sm dark:prose-invert max-w-none"
        >
          {message.content.split('\n').map((paragraph, i) => (
            <p key={i}>{paragraph}</p>
          ))}
        </div>
      ))}

      {isLoading && (
        <div className="flex items-center text-sm text-muted-foreground">
          <Loader2 className="h-3 w-3 animate-spin mr-2" />
          <span>AI is thinking...</span>
        </div>
      )}
    </div>
  )
}
