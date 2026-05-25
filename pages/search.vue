<!-- This page shows search results for all users and allows following them from a dedicated search flow. -->
<script setup lang="ts">
definePageMeta({
  middleware: ['auth']
})

import type { Profile } from '~/types/profile'

const router = useRouter()
const route = useRoute()
const statusMessage = ref('')
const searchResults = ref<Profile[]>([])
const followingIds = ref<string[]>([])
const currentUserId = ref('')
const ownProfileExists = ref(false)
const showProfileModal = ref(false)
const profileStatusMessage = ref('')
const defaultProfileAvatar = '/images/avatars/avatar-standart.png'
const avatarOptions = [
  { id: 'avatar-1', label: 'Avatar 1', image: '/images/avatars/avatar-1.png' },
  { id: 'avatar-2', label: 'Avatar 2', image: '/images/avatars/avatar-2.png' },
  { id: 'avatar-3', label: 'Avatar 3', image: '/images/avatars/avatar-3.png' },
  { id: 'avatar-4', label: 'Avatar 4', image: '/images/avatars/avatar-4.png' },
  { id: 'avatar-5', label: 'Avatar 5', image: '/images/avatars/avatar-5.png' },
  { id: 'avatar-6', label: 'Avatar 6', image: '/images/avatars/avatar-6.png' },
  { id: 'avatar-7', label: 'Avatar 7', image: '/images/avatars/avatar-7.png' },
  { id: 'avatar-8', label: 'Avatar 8', image: '/images/avatars/avatar-8.png' }
]
const email = ref('')
const fullName = ref('')
const username = ref('')
const birthDate = ref('')
const avatarUrl = ref('')

const { getUser } = useAuth()
const { getProfileById, createProfile } = useProfile()
const { searchProfiles, getFollowing, followUser, unfollowUser } = useFriends()

const modalAvatarPreview = computed(() => {
  return avatarUrl.value || defaultProfileAvatar
})

const readAvatarFile = async (file: File) => {
  return await new Promise<string>((resolve, reject) => {
    const reader = new FileReader()

    reader.onload = () => {
      if (typeof reader.result === 'string') {
        resolve(reader.result)
        return
      }

      reject(new Error('Unsupported file result'))
    }

    reader.onerror = () => {
      reject(reader.error || new Error('Failed to read image file'))
    }

    reader.readAsDataURL(file)
  })
}

const normalizedQuery = computed(() => {
  return typeof route.query.search === 'string' ? route.query.search.trim() : ''
})

const resultSummary = computed(() => {
  return normalizedQuery.value
    ? `${searchResults.value.length} ${searchResults.value.length === 1 ? 'profile' : 'profiles'} found`
    : 'Search the people behind the wishlists'
})

const getProfileAvatar = (profile: Profile) => {
  return profile.avatar_url || defaultProfileAvatar
}

const loadSearchPage = async () => {
  if (!import.meta.client) {
    return
  }

  statusMessage.value = ''
  searchResults.value = []
  followingIds.value = []

  const user = await getUser()

  if (!user) {
    statusMessage.value = 'Please log in to search users.'
    return
  }

  currentUserId.value = user.id
  email.value = user.email || ''

  const ownProfileResponse = await getProfileById(user.id)
  ownProfileExists.value = Boolean(ownProfileResponse.data)

  const { data: followingData, error: followingError } = await getFollowing(user.id)

  if (followingError) {
    statusMessage.value = 'Failed to load follow state.'
  } else {
    followingIds.value = followingData.map((profile) => profile.id)
  }

  if (typeof route.query.search !== 'string' || !route.query.search.trim()) {
    return
  }

  const { data: searchData, error: searchError } = await searchProfiles(route.query.search)

  if (searchError) {
    statusMessage.value = 'Failed to search profiles.'
    return
  }

  searchResults.value = (searchData || []).filter((profile) => profile.id !== user.id)
}

const isAlreadyFollowing = (profileId: string) => {
  return followingIds.value.includes(profileId)
}

const handleFollow = async (profile: Profile) => {
  statusMessage.value = ''

  if (!ownProfileExists.value) {
    profileStatusMessage.value = ''
    fullName.value = ''
    username.value = ''
    birthDate.value = ''
    avatarUrl.value = ''
    showProfileModal.value = true
    return
  }

  const { error } = await followUser(currentUserId.value, profile.id)

  if (error) {
    console.error('Follow failed:', error)
    statusMessage.value = 'Failed to follow this user.'
    return
  }

  await loadSearchPage()
}

const handleUnfollow = async (profile: Profile) => {
  statusMessage.value = ''

  const { error } = await unfollowUser(currentUserId.value, profile.id)

  if (error) {
    console.error('Unfollow failed:', error)
    statusMessage.value = 'Failed to unfollow this user.'
    return
  }

  await loadSearchPage()
}

const handleAvatarUpload = async (event: Event) => {
  const input = event.target as HTMLInputElement | null
  const file = input?.files?.[0]

  if (!file) {
    return
  }

  if (!file.type.startsWith('image/')) {
    profileStatusMessage.value = 'Please choose an image file for the avatar.'
    if (input) {
      input.value = ''
    }
    return
  }

  try {
    avatarUrl.value = await readAvatarFile(file)
    profileStatusMessage.value = ''
  } catch (error) {
    console.error('Avatar upload failed:', error)
    profileStatusMessage.value = 'Failed to load the selected image.'
  } finally {
    if (input) {
      input.value = ''
    }
  }
}

const handleProfileModalSave = async () => {
  profileStatusMessage.value = ''

  const user = await getUser()

  if (!user) {
    await router.push('/login')
    return
  }

  if (!fullName.value.trim()) {
    profileStatusMessage.value = 'Full name is required'
    return
  }

  if (!username.value.trim()) {
    profileStatusMessage.value = 'Username is required'
    return
  }

  if (!birthDate.value) {
    profileStatusMessage.value = 'Date of birth is required'
    return
  }

  const normalizedUsername = username.value.trim().toLowerCase()
  const selectedAvatarUrl = avatarUrl.value.trim() || defaultProfileAvatar
  const { error } = await createProfile({
    id: user.id,
    email: user.email || email.value,
    full_name: fullName.value.trim(),
    username: normalizedUsername,
    birth_date: birthDate.value,
    avatar_url: selectedAvatarUrl
  })

  if (error) {
    console.error('Profile creation from search page failed:', error)
    profileStatusMessage.value = 'Failed to save profile'
    return
  }

  ownProfileExists.value = true
  showProfileModal.value = false
  profileStatusMessage.value = ''
  statusMessage.value = 'Profile saved. Now you can follow users from the search results.'
}

onMounted(loadSearchPage)
watch(() => route.fullPath, () => {
  loadSearchPage()
})
</script>

<template>
  <section class="page-section search-page">
    <div class="surface-card">
      <h1>User search</h1>
      <p class="search-page__summary">{{ resultSummary }}</p>
      <p v-if="normalizedQuery">
        Search results for: "{{ normalizedQuery }}"
      </p>
      <p v-else>
        Search for people from the header to find profiles by username or full name.
      </p>
      <p v-if="statusMessage">
        {{ statusMessage }}
      </p>

      <div v-if="normalizedQuery">
        <div v-if="searchResults.length" class="search-page__cards">
          <article
            v-for="profile in searchResults"
            :key="profile.id"
            class="surface-card search-page__card"
          >
            <div class="search-page__card-main">
              <img
                :src="getProfileAvatar(profile)"
                :alt="profile.full_name"
                class="search-page__card-avatar"
              >
              <div>
                <h3 class="search-page__card-title">{{ profile.full_name }}</h3>
                <p class="search-page__card-username">@{{ profile.username }}</p>
              </div>
            </div>

            <div class="search-page__card-actions">
              <p v-if="isAlreadyFollowing(profile.id)" class="search-page__following-note">
                You are following this user.
              </p>

              <template v-if="isAlreadyFollowing(profile.id)">
                <NuxtLink :to="`/friends/${profile.username}`" class="search-page__action-link">
                  View profile
                </NuxtLink>
                <button type="button" class="button-secondary" @click="handleUnfollow(profile)">
                  Unfollow
                </button>
              </template>

              <button v-else type="button" class="button-primary" @click="handleFollow(profile)">
                Follow
              </button>
            </div>
          </article>
        </div>
        <div v-else class="search-page__empty-state">
          <p>No profiles matched this search yet. Try another spelling, a shorter username, or go back to your existing circle.</p>
          <div class="search-page__empty-actions">
            <NuxtLink to="/friends" class="search-page__action-link">
              Open friends
            </NuxtLink>
            <NuxtLink to="/wishlists" class="search-page__action-link search-page__action-link--secondary">
              Open wishlists
            </NuxtLink>
          </div>
        </div>
      </div>

      <div v-else class="search-page__empty-state">
        <p>Start with a name or username in the search bar above, then open a profile or follow someone from the results.</p>
        <div class="search-page__empty-actions">
          <NuxtLink to="/friends" class="search-page__action-link">
            Open friends
          </NuxtLink>
          <NuxtLink to="/wishlists" class="search-page__action-link search-page__action-link--secondary">
            Open wishlists
          </NuxtLink>
        </div>
      </div>
    </div>

    <div v-if="showProfileModal" class="search-page__modal-backdrop">
      <div class="surface-card search-page__modal">
        <h2>Complete profile first</h2>
        <p>Please fill in your profile before following other users.</p>

        <img
          :src="modalAvatarPreview"
          alt="Profile avatar preview"
          class="search-page__modal-avatar"
        >

        <div>
          <label for="search-profile-email">Email</label>
          <input
            id="search-profile-email"
            :value="email"
            type="email"
            readonly
          >
        </div>

        <div>
          <label for="search-profile-full-name">Full name</label>
          <input
            id="search-profile-full-name"
            v-model="fullName"
            type="text"
            placeholder="Enter your full name"
          >
        </div>

        <div>
          <label for="search-profile-username">Username</label>
          <input
            id="search-profile-username"
            v-model="username"
            type="text"
            placeholder="Enter a username"
          >
        </div>

        <div>
          <label for="search-profile-birth-date">Date of birth</label>
          <input
            id="search-profile-birth-date"
            v-model="birthDate"
            type="date"
          >
        </div>

        <fieldset class="search-page__modal-avatar-picker">
          <legend>Choose avatar</legend>
          <label class="search-page__modal-upload">
            <span>Upload your photo</span>
            <input
              type="file"
              accept="image/*"
              @change="handleAvatarUpload"
            >
          </label>
          <div class="search-page__modal-avatar-options">
            <label
              v-for="option in avatarOptions"
              :key="option.id"
              class="search-page__modal-avatar-option"
            >
              <input
                v-model="avatarUrl"
                type="radio"
                name="search-profile-avatar"
                :value="option.image"
              >
              <img
                :src="option.image"
                :alt="option.label"
                class="search-page__modal-avatar-option-image"
              >
              <span>{{ option.label }}</span>
            </label>
          </div>
        </fieldset>

        <button type="button" @click="handleProfileModalSave">
          Save profile
        </button>

        <button type="button" @click="showProfileModal = false">
          Close
        </button>

        <p v-if="profileStatusMessage">
          {{ profileStatusMessage }}
        </p>
      </div>
    </div>
  </section>
</template>

<style scoped>
.search-page {
  display: grid;
  gap: 1.1rem;
}

.search-page__cards {
  display: grid;
  gap: 1rem;
}

.search-page__summary {
  margin: 0 0 0.35rem;
  color: var(--accent);
  font-size: 0.84rem;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
}

.search-page__card {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 1rem;
}

.search-page__card-main {
  display: flex;
  align-items: center;
  gap: 1rem;
  min-width: 0;
}

.search-page__card-avatar {
  width: 64px;
  height: 64px;
  border-radius: 50%;
  object-fit: cover;
  border: 1px solid var(--border);
}

.search-page__card-title {
  margin: 0;
}

.search-page__card-username {
  margin: 0.2rem 0 0;
  color: var(--muted);
}

.search-page__card-actions {
  display: grid;
  justify-items: start;
  gap: 0.75rem;
}

.search-page__following-note {
  margin: 0;
  color: var(--muted);
}

.search-page__empty-state {
  display: grid;
  gap: 1rem;
  padding: 1rem 0 0;
  max-width: 32rem;
}

.search-page__empty-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
}

.search-page__action-link {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0.7rem 1rem;
  border-radius: 999px;
  background: #da2795;
  color: #fff;
  text-decoration: none;
  font-weight: 600;
  box-shadow: 0 10px 24px rgba(218, 39, 149, 0.18);
}

.search-page__action-link--secondary {
  background: #dcff82;
  color: #1f1f1f;
  box-shadow: none;
}

@media (max-width: 900px) {
  .search-page__card {
    flex-direction: column;
    align-items: flex-start;
  }
}

.search-page__modal-backdrop {
  position: fixed;
  inset: 0;
  display: grid;
  place-items: center;
  background: rgb(15 23 42 / 35%);
  padding: 1rem;
}

.search-page__modal {
  width: min(100%, 680px);
  max-height: calc(100vh - 2rem);
  overflow-y: auto;
  display: grid;
  gap: 1rem;
}

.search-page__modal-avatar {
  width: 88px;
  height: 88px;
  border-radius: 50%;
  object-fit: cover;
  border: 1px solid var(--border);
}

.search-page__modal-avatar-picker {
  border: 1px solid var(--border);
  border-radius: 0.75rem;
  padding: 1rem;
}

.search-page__modal-upload {
  display: grid;
  gap: 0.45rem;
  margin-bottom: 1rem;
}

.search-page__modal-upload input {
  width: 100%;
  border: 1px solid var(--border);
  border-radius: 0.95rem;
  background: #fff;
  padding: 0.45rem;
  color: var(--text);
}

.search-page__modal-upload input::file-selector-button {
  margin-right: 0.8rem;
  border: 1px solid rgba(218, 39, 149, 0.22);
  border-radius: 999px;
  background: #dcff82;
  color: #1f1f1f;
  padding: 0.7rem 1rem;
  font: inherit;
  font-weight: 600;
  cursor: pointer;
}

.search-page__modal-avatar-options {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(96px, 1fr));
  gap: 0.75rem;
}

.search-page__modal-avatar-option {
  display: grid;
  justify-items: center;
  gap: 0.35rem;
  text-align: center;
}

.search-page__modal-avatar-option-image {
  width: 56px;
  height: 56px;
  border-radius: 50%;
  object-fit: cover;
  border: 1px solid var(--border);
}

@media (max-width: 720px) {
  .search-page__card {
    flex-direction: column;
    align-items: stretch;
  }

  .search-page__card-actions {
    justify-content: flex-start;
  }
}
</style>
