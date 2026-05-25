import { u as useNuxtApp } from './server.mjs';

const useFriends = () => {
  const { $supabase } = useNuxtApp();
  const searchProfiles = async (term) => {
    const normalizedTerm = term.trim();
    if (!normalizedTerm) {
      return { data: [], error: null };
    }
    return await $supabase.from("profiles").select("*").or(`username.ilike.%${normalizedTerm}%,full_name.ilike.%${normalizedTerm}%`).order("username", { ascending: true });
  };
  const getProfileByUsername = async (username) => {
    return await $supabase.from("profiles").select("*").ilike("username", username).maybeSingle();
  };
  const getProfilesByIds = async (ids) => {
    if (!ids.length) {
      return {
        data: [],
        error: null
      };
    }
    const response = await $supabase.from("profiles").select("*").in("id", ids).order("username", { ascending: true });
    return {
      data: response.data || [],
      error: response.error
    };
  };
  const getFollowingIds = async (userId) => {
    const response = await $supabase.from("user_follows").select("following_id").eq("follower_id", userId);
    return {
      data: (response.data || []).map((item) => item.following_id),
      error: response.error
    };
  };
  const getFollowerIds = async (userId) => {
    const response = await $supabase.from("user_follows").select("follower_id").eq("following_id", userId);
    return {
      data: (response.data || []).map((item) => item.follower_id),
      error: response.error
    };
  };
  const getFollowing = async (userId) => {
    const idsResponse = await getFollowingIds(userId);
    if (idsResponse.error) {
      return {
        data: [],
        error: idsResponse.error
      };
    }
    return await getProfilesByIds(idsResponse.data);
  };
  const getFollowers = async (userId) => {
    const idsResponse = await getFollowerIds(userId);
    if (idsResponse.error) {
      return {
        data: [],
        error: idsResponse.error
      };
    }
    return await getProfilesByIds(idsResponse.data);
  };
  const getMutualFriends = async (userId) => {
    const [followingResponse, followersResponse] = await Promise.all([
      getFollowingIds(userId),
      getFollowerIds(userId)
    ]);
    if (followingResponse.error || followersResponse.error) {
      return {
        data: [],
        error: followingResponse.error || followersResponse.error
      };
    }
    const mutualIds = followingResponse.data.filter((id) => followersResponse.data.includes(id));
    return await getProfilesByIds(mutualIds);
  };
  const isFollowing = async (followerId, followingId) => {
    const response = await $supabase.from("user_follows").select("follower_id").eq("follower_id", followerId).eq("following_id", followingId).maybeSingle();
    return {
      data: Boolean(response.data),
      error: response.error
    };
  };
  const followUser = async (followerId, followingId) => {
    return await $supabase.from("user_follows").insert({
      follower_id: followerId,
      following_id: followingId
    });
  };
  const unfollowUser = async (followerId, followingId) => {
    return await $supabase.from("user_follows").delete().eq("follower_id", followerId).eq("following_id", followingId);
  };
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
  };
};

export { useFriends as u };
//# sourceMappingURL=useFriends-6-ja2yAP.mjs.map
