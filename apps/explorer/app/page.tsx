import { SearchInterface } from '@/components/home/search-interface'

export default function Home() {
  return (
    <main className="min-h-screen p-4 md:p-8 bg-background">
      <div className="max-w-5xl mx-auto space-y-8">
        <header className="text-center space-y-4">
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight">
            AI-Powered Blockchain Explorer
          </h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Search for blockchain accounts, transactions, and blocks using
            natural language. Our AI assistant analyzes blockchain data to
            provide insights and answers your questions.
          </p>
        </header>

        <SearchInterface />
      </div>
    </main>
  )
}
