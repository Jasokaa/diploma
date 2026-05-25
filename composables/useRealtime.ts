// This file contains realtime-related helpers for future live updates.
// It should later subscribe to Supabase channels for collaborative wishlist changes.
export const useRealtime = () => {
  const isConnected = ref(false)

  const connect = async () => {
    isConnected.value = true
  }

  const disconnect = async () => {
    isConnected.value = false
  }

  return {
    isConnected,
    connect,
    disconnect
  }
}
