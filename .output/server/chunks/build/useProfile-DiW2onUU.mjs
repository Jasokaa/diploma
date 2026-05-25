import { u as useNuxtApp } from './server.mjs';
import { u as useState } from './state-DQnwRar-.mjs';

const useProfile = () => {
  const { $supabase } = useNuxtApp();
  const profile = useState("profile", () => null);
  const getProfileById = async (id) => {
    const response = await $supabase.from("profiles").select("*").eq("id", id).maybeSingle();
    profile.value = response.data;
    return response;
  };
  const createProfile = async (profileData) => {
    const response = await $supabase.from("profiles").insert({
      id: profileData.id,
      email: profileData.email,
      full_name: profileData.full_name,
      username: profileData.username,
      birth_date: profileData.birth_date,
      avatar_url: profileData.avatar_url
    }).select().single();
    if (!response.error) {
      profile.value = response.data;
    }
    return response;
  };
  const updateProfile = async (id, profileData) => {
    const response = await $supabase.from("profiles").update({
      email: profileData.email,
      full_name: profileData.full_name,
      username: profileData.username,
      birth_date: profileData.birth_date,
      avatar_url: profileData.avatar_url
    }).eq("id", id).select().single();
    if (!response.error) {
      profile.value = response.data;
    }
    return response;
  };
  const deleteProfileData = async (userId) => {
    const response = await $supabase.from("profiles").delete().eq("id", userId);
    if (!response.error) {
      profile.value = null;
    }
    return response;
  };
  return {
    profile,
    getProfileById,
    createProfile,
    updateProfile,
    deleteProfileData
  };
};

export { useProfile as u };
//# sourceMappingURL=useProfile-DiW2onUU.mjs.map
