'use client'

import { useChat } from '@ai-sdk/react'
import { Button, Input } from '@l1network/ui/components'
import { Search } from 'lucide-react'
import type { FormEvent } from 'react'
import { useState } from 'react'

interface AiSearchProps {
  chatId?: string
  onResultsReceived?: () => void
}

export const AiSearch = ({ chatId, onResultsReceived }: AiSearchProps) => {
  const [searchQuery, setSearchQuery] = useState('')

  const { handleSubmit, isLoading } = useChat({
    api: '/api/ai/chat',
    id: chatId,
    initialMessages: [],
    onFinish: () => {
      if (onResultsReceived) onResultsReceived()
    },
  })

  const handleSearch = (e: FormEvent) => {
    e.preventDefault()
    if (!searchQuery.trim()) return

    handleSubmit(e, {
      data: {
        message: `Search for blockchain address: ${searchQuery}`,
      },
    })
  }

  return (
    <form onSubmit={handleSearch} className="relative">
      <div className="flex flex-col sm:flex-row gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            type="text"
            placeholder="Search by address, transaction hash, or block number..."
            className="pl-10 w-full"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <Button type="submit" disabled={isLoading} className="w-full sm:w-auto">
          {isLoading ? 'Searching...' : 'Search'}
        </Button>
      </div>
    </form>
  )
}
