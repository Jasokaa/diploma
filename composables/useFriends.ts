// This composable handles user search, following, followers, and mutual friend relationships.
import type { Profile } from '~/types/profile'

export const useFriends = () => {
  const { $supabase } = useNuxtApp()

  const searchProfiles = async (term: string) => {
    const normalizedTerm = term.trim()

    if (!normalizedTerm) {
      return { data: [] as Profile[], error: null }
    }

    return await $supabase
      .from('profiles')
      .select('*')
      .or(`username.ilike.%${normalizedTerm}%,full_name.ilike.%${normalizedTerm}%`)
      .order('username', { ascending: true })
  }

  const getProfileByUsername = async (username: string) => {
    return await $supabase
      .from('profiles')
      .select('*')
      .ilike('username', username)
      .maybeSingle()
  }

  const getProfilesByIds = async (ids: string[]) => {
    if (!ids.length) {
      return {
        data: [] as Profile[],
        error: null
      }
    }

    const response = await $supabase
      .from('profiles')
      .select('*')
      .in('id', ids)
      .order('username', { ascending: true })

    return {
      data: (response.data || []) as Profile[],
      error: response.error
    }
  }

  const getFollowingIds = async (userId: string) => {
    const response = await $supabase
      .from('user_follows')
      .select('following_id')
      .eq('follower_id', userId)

    return {
      data: (response.data || []).map((item) => item.following_id as string),
      error: response.error
    }
  }

  const getFollowerIds = async (userId: string) => {
    const response = await $supabase
      .from('user_follows')
      .select('follower_id')
      .eq('following_id', userId)

    return {
      data: (response.data || []).map((item) => item.follower_id as string),
      error: response.error
    }
  }

  const getFollowing = async (userId: string) => {
    const idsResponse = await getFollowingIds(userId)

    if (idsResponse.error) {
      return {
        data: [] as Profile[],
        error: idsResponse.error
      }
    }

    return await getProfilesByIds(idsResponse.data)
  }

  const getFollowers = async (userId: string) => {
    const idsResponse = await getFollowerIds(userId)

    if (idsResponse.error) {
      return {
        data: [] as Profile[],
        error: idsResponse.error
      }
    }

    return await getProfilesByIds(idsResponse.data)
  }

  const getMutualFriends = async (userId: string) => {
    const [followingResponse, followersResponse] = await Promise.all([
      getFollowingIds(userId),
      getFollowerIds(userId)
    ])

    if (followingResponse.error || followersResponse.error) {
      return {
        data: [] as Profile[],
        error: followingResponse.error || followersResponse.error
      }
    }

    const mutualIds = followingResponse.data.filter((id) => followersResponse.data.includes(id))
    return await getProfilesByIds(mutualIds)
  }

  const isFollowing = async (followerId: string, followingId: string) => {
    const response = await $supabase
      .from('user_follows')
      .select('follower_id')
      .eq('follower_id', followerId)
      .eq('following_id', followingId)
      .maybeSingle()

    return {
      data: Boolean(response.data),
      error: response.error
    }
  }

  const followUser = async (followerId: string, followingId: string) => {
    return await $supabase
      .from('user_follows')
      .insert({
        follower_id: followerId,
        following_id: followingId
      })
  }

  const unfollowUser = async (followerId: string, followingId: string) => {
    return await $supabase
      .from('user_follows')
      .delete()
      .eq('follower_id', followerId)
      .eq('following_id', followingId)
  }

  return {
    searchProfiles,
    getProfileByUsername,
    getProfilesByIds,
    getFollowingIds,
    getFollowerIds,
    getFollowing,
    getFollowers,
    getMutualFriends,
    isFollowing,
    followUser,
    unfollowUser
  }
}
