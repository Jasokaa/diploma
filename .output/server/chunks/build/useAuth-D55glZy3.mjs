import { u as useNuxtApp } from './server.mjs';

const useAuth = () => {
  const { $supabase } = useNuxtApp();
  const signUp = async (email, password) => {
    return await $supabase.auth.signUp({
      email,
      password
    });
  };
  const signIn = async (email, password) => {
    return await $supabase.auth.signInWithPassword({
      email,
      password
    });
  };
  const signOut = async () => {
    return await $supabase.auth.signOut();
  };
  const getUser = async () => {
    const { data } = await $supabase.auth.getUser();
    return data.user;
  };
  return {
    signUp,
    signIn,
    signOut,
    getUser
  };
};

export { useAuth as u };
//# sourceMappingURL=useAuth-D55glZy3.mjs.map
