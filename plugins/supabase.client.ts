// This file creates and provides the global Supabase client for Nuxt components and composables.
import { createClient } from '@supabase/supabase-js'

export default defineNuxtPlugin(() => {
  const config = useRuntimeConfig()
  const supabase = createClient(config.public.supabaseUrl, config.public.supabaseAnonKey)

  return {
    provide: {
      supabase
    }
  }
})
