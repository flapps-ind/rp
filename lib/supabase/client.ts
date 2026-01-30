import { createBrowserClient } from '@supabase/ssr'

export function createClient() {
  if (process.env.NEXT_PUBLIC_DEMO_MODE === 'true') {
    // Return a minimal mock client to prevent crashes
    return {
      auth: {
        getUser: async () => ({ data: { user: { id: 'demo-user', email: 'demo@example.com' } } }),
        signOut: async () => { },
        onAuthStateChange: () => ({ data: { subscription: { unsubscribe: () => { } } } }),
      },
      from: () => ({
        select: () => ({
          eq: () => ({
            single: async () => ({ data: null, error: null }),
          }),
        }),
        update: () => ({
          eq: async () => ({ error: null }),
        }),
      }),
      channel: () => ({
        on: () => ({
          subscribe: () => ({})
        }),
      }),
      removeChannel: () => { },
    } as any
  }

  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  )
}
