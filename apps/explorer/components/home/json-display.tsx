'use client'

import { Button } from '@l1network/ui/components'
import { Check, ChevronDown, ChevronRight, Copy } from 'lucide-react'
import { useState } from 'react'

interface JsonDisplayProps {
  data: any
  level?: number
  isLast?: boolean
  property?: string
}

export const JsonDisplay = ({
  data,
  level = 0,
  isLast = true,
  property,
}: JsonDisplayProps) => {
  const [isExpanded, setIsExpanded] = useState(true)
  const [copied, setCopied] = useState(false)

  const toggleExpand = () => setIsExpanded(!isExpanded)

  const copyToClipboard = () => {
    navigator.clipboard.writeText(JSON.stringify(data, null, 2))
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const indent = level * 20

  if (data === null) return <span className="text-gray-500">null</span>

  if (typeof data !== 'object')
    return (
      <div className="flex items-start">
        {property && (
          <span className="text-blue-600 dark:text-blue-400 mr-2">{`"${property}": `}</span>
        )}
        <span
          className={
            typeof data === 'string'
              ? 'text-green-600 dark:text-green-400'
              : 'text-amber-600 dark:text-amber-400'
          }
        >
          {typeof data === 'string' ? `"${data}"` : data.toString()}
        </span>
        {!isLast && <span>,</span>}
      </div>
    )

  const isArray = Array.isArray(data)
  const isEmpty = Object.keys(data).length === 0

  if (isEmpty)
    return (
      <div className="flex items-start">
        {property && (
          <span className="text-blue-600 dark:text-blue-400 mr-2">{`"${property}": `}</span>
        )}
        <span>{isArray ? '[]' : '{}'}</span>
        {!isLast && <span>,</span>}
      </div>
    )

  return (
    <div className="relative">
      <div className="flex items-start">
        {level === 0 && (
          <Button
            variant="ghost"
            size="icon"
            className="absolute right-0 top-0 h-6 w-6"
            onClick={copyToClipboard}
          >
            {copied ? (
              <Check className="h-4 w-4" />
            ) : (
              <Copy className="h-4 w-4" />
            )}
          </Button>
        )}

        <Button
          variant="ghost"
          size="icon"
          className="h-6 w-6 p-0 mr-1"
          onClick={toggleExpand}
        >
          {isExpanded ? (
            <ChevronDown className="h-4 w-4" />
          ) : (
            <ChevronRight className="h-4 w-4" />
          )}
        </Button>

        {property && (
          <span className="text-blue-600 dark:text-blue-400 mr-2">{`"${property}": `}</span>
        )}
        <span>{isArray ? '[' : '{'}</span>
        {!isExpanded && <span>...</span>}
      </div>

      {isExpanded && (
        <div className="ml-6">
          {Object.entries(data).map(([key, value], index, array) => (
            <div key={key} style={{ marginLeft: `${indent}px` }}>
              <JsonDisplay
                data={value}
                level={level + 1}
                isLast={index === array.length - 1}
                property={key}
              />
            </div>
          ))}
        </div>
      )}

      {isExpanded && (
        <div style={{ marginLeft: `${indent}px` }}>
          <span>{isArray ? ']' : '}'}</span>
          {!isLast && <span>,</span>}
        </div>
      )}
    </div>
  )
}
