// This composable handles basic profile CRUD actions and profile data cleanup for the public app tables.
import type { CreateProfileInput, Profile, UpdateProfileInput } from '~/types/profile'

export const useProfile = () => {
  const { $supabase } = useNuxtApp()
  const profile = useState<Profile | null>('profile', () => null)

  const getProfileById = async (id: string) => {
    const response = await $supabase
      .from('profiles')
      .select('*')
      .eq('id', id)
      .maybeSingle()

    profile.value = response.data as Profile | null

    return response
  }

  const createProfile = async (profileData: CreateProfileInput) => {
    const response = await $supabase
      .from('profiles')
      .insert({
        id: profileData.id,
        email: profileData.email,
        full_name: profileData.full_name,
        username: profileData.username,
        birth_date: profileData.birth_date,
        avatar_url: profileData.avatar_url
      })
      .select()
      .single()

    if (!response.error) {
      profile.value = response.data as Profile
    }

    return response
  }

  const updateProfile = async (id: string, profileData: UpdateProfileInput) => {
    const response = await $supabase
      .from('profiles')
      .update({
        email: profileData.email,
        full_name: profileData.full_name,
        username: profileData.username,
        birth_date: profileData.birth_date,
        avatar_url: profileData.avatar_url
      })
      .eq('id', id)
      .select()
      .single()

    if (!response.error) {
      profile.value = response.data as Profile
    }

    return response
  }

  const deleteProfileData = async (userId: string) => {
    // TODO: delete user's gifts that belong directly to the user or to the user's wishlists when these tables are finalized.
    // TODO: delete wishlist-related records when the related tables and foreign keys are finalized.
    // TODO: delete user's wishlists when the final table structure and owner column names are confirmed.
    // TODO: delete other profile-related app tables that may be added later, always using the current auth user id.
    const response = await $supabase
      .from('profiles')
      .delete()
      .eq('id', userId)

    if (!response.error) {
      profile.value = null
    }

    return response
  }

  return {
    profile,
    getProfileById,
    createProfile,
    updateProfile,
    deleteProfileData
  }
}
