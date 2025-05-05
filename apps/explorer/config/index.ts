export const webConfig = {
  services: {
    google: {
      analyticsId: process.env.NEXT_PUBLIC_MARKETS_GOOGLE_ANALYTICS_ID || '',
    },
    sentry: {
      dsn: process.env.NEXT_PUBLIC_MARKETS_SENTRY_DSN || '',
      authToken: process.env.SENTRY_AUTH_TOKEN || '',
    },
    dub: {
      workspaceId: process.env.DUB_WORKSPACE_ID || '',
      apiKey: process.env.DUB_API_KEY || '',
    },
  },
} as const
