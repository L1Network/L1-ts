declare const process: {
    env: Record<string, string | undefined>
    exit: (code: number) => never
  }

  
 const privateKey = process.env.PRIVATE_KEY

if (!privateKey) {
  throw new Error('PRIVATE_KEY environment variable is required')
  process.exit(1)
}

export const env = { privateKey }
