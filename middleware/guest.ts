// This middleware protects guest-only pages by redirecting authenticated users to the main home page.
import { createClient } from '@supabase/supabase-js'

export default defineNuxtRouteMiddleware(async () => {
  if (import.meta.server) {
    return
  }

  const config = useRuntimeConfig()
  const supabase = createClient(config.public.supabaseUrl, config.public.supabaseAnonKey)
  const { data } = await supabase.auth.getSession()

  if (data.session) {
    return navigateTo('/')
  }
})
