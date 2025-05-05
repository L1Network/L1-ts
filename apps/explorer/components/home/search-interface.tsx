'use client'

import { useEffect, useState } from 'react'
import { AiSearch } from './ai-search'
import { ResultsDisplay } from './results-display'

export const SearchInterface = () => {
  const [hasSearched, setHasSearched] = useState(false)
  const [chatId, setChatId] = useState<string>('')

  // Generate a unique chat ID when the component mounts
  useEffect(() => {
    setChatId(`blockchain-explorer-${Date.now()}`)
  }, [])

  return (
    <div className="space-y-8">
      <AiSearch
        chatId={chatId}
        onResultsReceived={() => setHasSearched(true)}
      />

      {hasSearched && chatId && <ResultsDisplay chatId={chatId} />}
    </div>
  )
}
