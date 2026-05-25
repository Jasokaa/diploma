<!-- This file defines the global branded header for the gifttt experience. -->
<script setup lang="ts">
const route = useRoute()
const router = useRouter()
const authUser = ref<{ id: string } | null>(null)
const defaultGuestAvatar = '/images/avatars/avatar-new.png'
const defaultProfileAvatar = '/images/avatars/avatar-standart.png'
const searchTerm = ref('')

const { getUser } = useAuth()
const { profile, getProfileById } = useProfile()

const isSearchPage = computed(() => route.path === '/search')

const avatarSrc = computed(() => {
  if (!authUser.value) {
    return defaultGuestAvatar
  }

  if (!profile.value?.avatar_url) {
    return defaultProfileAvatar
  }

  return profile.value.avatar_url
})

const displayName = computed(() => {
  return profile.value?.full_name || profile.value?.username || 'Profile'
})

const loadHeaderData = async () => {
  if (!import.meta.client) {
    return
  }

  if (typeof route.query.search === 'string' && route.query.search.trim()) {
    searchTerm.value = route.query.search
  } else if (!isSearchPage.value) {
    searchTerm.value = ''
  }

  const user = await getUser()
  authUser.value = user ? { id: user.id } : null

  if (!user?.id) {
    profile.value = null
    return
  }

  await getProfileById(user.id)
}

const handleSearch = async () => {
  const normalizedTerm = searchTerm.value.trim()

  if (!normalizedTerm) {
    return
  }

  await router.push({
    path: '/search',
    query: {
      search: normalizedTerm
    }
  })
}

watch(() => route.fullPath, loadHeaderData, { immediate: true })
</script>

<template>
  <header class="app-header">
    <div class="app-header__shell">
      <div class="app-header__left">
        <NuxtLink to="/" class="app-header__brand" aria-label="Go to gifttt home">
          <img src="/images/design/logo.svg" alt="gifttt logo" class="app-header__logo">
        </NuxtLink>

        <form class="app-header__search" @submit.prevent="handleSearch">
          <input
            v-model="searchTerm"
            type="text"
            placeholder="Search by username or full name"
          >
          <button type="submit" class="button-ghost app-header__search-button">
            Search
          </button>
        </form>
      </div>

      <nav class="app-header__nav">
        <NuxtLink to="/friends" class="app-header__nav-link">Friends</NuxtLink>
        <NuxtLink to="/wishlists" class="app-header__nav-link">Wishlists</NuxtLink>
        <NuxtLink to="/wishlists/create" class="button-primary app-header__create-link">
          Create wishlist
        </NuxtLink>
        <NuxtLink to="/profile" class="app-header__profile" aria-label="Open profile page">
          <div class="app-header__profile-copy">
            <span class="app-header__profile-label">My space</span>
            <strong class="app-header__profile-name">{{ displayName }}</strong>
          </div>
          <img
            :src="avatarSrc"
            alt="Profile avatar"
            class="app-header__avatar"
          >
        </NuxtLink>
      </nav>
    </div>
  </header>
</template>

<style scoped>
.app-header {
  position: sticky;
  top: 0;
  z-index: 20;
  padding: 0.9rem 1.2rem 0;
  background: linear-gradient(180deg, rgba(249, 249, 249, 0.94), rgba(249, 249, 249, 0.78));
  backdrop-filter: blur(14px);
}

.app-header__shell {
  width: min(100%, 1320px);
  margin: 0 auto;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 1rem;
  padding: 0.85rem 1rem;
  border: 1px solid rgba(218, 218, 218, 0.9);
  border-radius: 1.35rem;
  background: rgba(255, 255, 255, 0.94);
  box-shadow: var(--shadow-card);
}

.app-header__left {
  display: flex;
  align-items: center;
  gap: 0.95rem;
  min-width: 0;
  flex: 1;
}

.app-header__brand {
  display: flex;
  align-items: center;
  min-width: 0;
}

.app-header__logo {
  width: 7.4rem;
  height: auto;
  flex-shrink: 0;
}

.app-header__search {
  display: flex;
  align-items: center;
  gap: 0.45rem;
  flex: 1;
  min-width: 0;
  padding: 0.32rem;
  border: 1px solid var(--border);
  border-radius: 0.9rem;
  background: #fff;
}

.app-header__search input {
  border: none;
  box-shadow: none;
  padding: 0.58rem 0.78rem;
  background: transparent;
}

.app-header__search input:focus {
  box-shadow: none;
}

.app-header__search-button {
  padding-inline: 0.8rem;
  white-space: nowrap;
}

.app-header__nav {
  display: flex;
  align-items: center;
  gap: 0.55rem;
  flex-wrap: wrap;
}

.app-header__nav-link {
  display: inline-flex;
  align-items: center;
  padding: 0.58rem 0.84rem;
  border-radius: 999px;
  color: #5c7e46;
  font-size: 0.92rem;
  font-weight: 500;
  transition: background-color 180ms ease, color 180ms ease;
}

.app-header__nav-link:hover {
  background: rgba(220, 255, 130, 0.55);
}

.app-header__create-link {
  white-space: nowrap;
}

.app-header__profile {
  display: inline-flex;
  align-items: center;
  gap: 0.55rem;
  padding-left: 0.35rem;
}

.app-header__profile-copy {
  display: grid;
  justify-items: end;
  gap: 0.08rem;
}

.app-header__profile-label {
  color: var(--muted);
  font-size: 0.68rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.08em;
}

.app-header__profile-name {
  font-size: 0.88rem;
  font-weight: 600;
}

.app-header__avatar {
  width: 2.7rem;
  height: 2.7rem;
  border-radius: 50%;
  object-fit: cover;
  border: 2px solid #fff;
  box-shadow: 0 10px 22px rgba(0, 0, 0, 0.1);
}

@media (max-width: 1080px) {
  .app-header__shell {
    flex-direction: column;
    align-items: stretch;
  }

  .app-header__left {
    flex-direction: column;
    align-items: stretch;
  }

  .app-header__search {
    width: 100%;
  }

  .app-header__nav {
    justify-content: space-between;
  }
}

@media (max-width: 720px) {
  .app-header {
    padding: 0.75rem 0.75rem 0;
  }

  .app-header__shell {
    border-radius: 1.2rem;
  }

  .app-header__logo {
    width: 6.8rem;
  }

  .app-header__profile-copy {
    display: none;
  }

  .app-header__nav {
    gap: 0.55rem;
  }
}
</style>
