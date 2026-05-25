<!-- This page shows following, followers, and mutual friends with follow management actions. -->
<script setup lang="ts">
definePageMeta({
  middleware: ['auth']
})

import type { Profile } from '~/types/profile'

const router = useRouter()
const statusMessage = ref('')
const followingProfiles = ref<Profile[]>([])
const followerProfiles = ref<Profile[]>([])
const mutualProfiles = ref<Profile[]>([])
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
const { getFollowing, getFollowers, getMutualFriends, followUser, unfollowUser } = useFriends()

const modalAvatarPreview = computed(() => {
  return avatarUrl.value || defaultProfileAvatar
})

const followingIds = computed(() => followingProfiles.value.map((profile) => profile.id))
const mutualIds = computed(() => mutualProfiles.value.map((profile) => profile.id))
const followersOnly = computed(() => {
  return followerProfiles.value.filter((profile) => !mutualIds.value.includes(profile.id))
})
const followingOnly = computed(() => {
  return followingProfiles.value.filter((profile) => !mutualIds.value.includes(profile.id))
})

const networkHighlights = computed(() => {
  return [
    {
      label: 'Mutual',
      value: mutualProfiles.value.length,
      note: 'People already connected both ways'
    },
    {
      label: 'Following',
      value: followingProfiles.value.length,
      note: 'Profiles you keep an eye on'
    },
    {
      label: 'Followers',
      value: followerProfiles.value.length,
      note: 'People who want to follow your updates'
    }
  ]
})

const getProfileAvatar = (profile: Profile) => {
  return profile.avatar_url || defaultProfileAvatar
}

const loadFriendsPage = async () => {
  if (!import.meta.client) {
    return
  }

  statusMessage.value = ''

  const user = await getUser()

  if (!user) {
    statusMessage.value = 'Please log in to view friends.'
    return
  }

  currentUserId.value = user.id
  email.value = user.email || ''

  const ownProfileResponse = await getProfileById(user.id)
  ownProfileExists.value = Boolean(ownProfileResponse.data)

  const [followingResponse, followersResponse, mutualResponse] = await Promise.all([
    getFollowing(user.id),
    getFollowers(user.id),
    getMutualFriends(user.id)
  ])

  if (followingResponse.error || followersResponse.error || mutualResponse.error) {
    statusMessage.value = 'Failed to load friend lists.'
  }

  followingProfiles.value = followingResponse.data
  followerProfiles.value = followersResponse.data
  mutualProfiles.value = mutualResponse.data
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

  await loadFriendsPage()
}

const handleUnfollow = async (profile: Profile) => {
  statusMessage.value = ''

  const { error } = await unfollowUser(currentUserId.value, profile.id)

  if (error) {
    console.error('Unfollow failed:', error)
    statusMessage.value = 'Failed to unfollow this user.'
    return
  }

  await loadFriendsPage()
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
    console.error('Profile creation from friends page failed:', error)
    profileStatusMessage.value = 'Failed to save profile'
    return
  }

  ownProfileExists.value = true
  showProfileModal.value = false
  profileStatusMessage.value = ''
  statusMessage.value = 'Profile saved. You can now manage follows and followers.'
}

onMounted(loadFriendsPage)
</script>

<template>
  <section class="page-section friends-page">
    <div class="surface-card">
      <h1>Friends</h1>
      <p>Track your network, follow people back, and jump straight to their profiles when you need to.</p>
      <div class="friends-page__hero-actions">
        <NuxtLink to="/search" class="friends-page__action-link friends-page__action-link--primary">
          Find people
        </NuxtLink>
      </div>
      <p v-if="statusMessage">
        {{ statusMessage }}
      </p>
      <div class="friends-page__highlights">
        <article
          v-for="item in networkHighlights"
          :key="item.label"
          class="friends-page__highlight-card"
        >
          <span class="friends-page__highlight-value">{{ item.value }}</span>
          <div class="friends-page__highlight-copy">
            <strong>{{ item.label }}</strong>
            <span>{{ item.note }}</span>
          </div>
        </article>
      </div>
    </div>

    <div class="surface-card">
      <div class="friends-page__section-copy">
        <h2>Mutual friends</h2>
        <p>Your closest circle inside gifttt, ready for faster profile and wishlist access.</p>
      </div>
      <div v-if="mutualProfiles.length" class="friends-page__cards">
        <article
          v-for="profile in mutualProfiles"
          :key="profile.id"
          class="surface-card friends-page__card"
        >
          <div class="friends-page__card-main">
            <img :src="getProfileAvatar(profile)" :alt="profile.full_name" class="friends-page__card-avatar">
            <div>
              <h3 class="friends-page__card-title">{{ profile.full_name }}</h3>
              <p class="friends-page__card-username">@{{ profile.username }}</p>
            </div>
          </div>

          <div class="friends-page__card-actions">
            <p class="friends-page__following-note">You follow each other.</p>
            <NuxtLink :to="`/friends/${profile.username}`" class="friends-page__action-link">View profile</NuxtLink>
            <button type="button" class="button-secondary" @click="handleUnfollow(profile)">Unfollow</button>
          </div>
        </article>
      </div>
      <p v-else>
        No mutual friends yet.
      </p>
    </div>

    <div class="surface-card">
      <div class="friends-page__section-copy">
        <h2>Following</h2>
        <p>People whose public wishlists and updates you want to keep nearby.</p>
      </div>
      <div v-if="followingOnly.length" class="friends-page__cards">
        <article
          v-for="profile in followingOnly"
          :key="profile.id"
          class="surface-card friends-page__card"
        >
          <div class="friends-page__card-main">
            <img :src="getProfileAvatar(profile)" :alt="profile.full_name" class="friends-page__card-avatar">
            <div>
              <h3 class="friends-page__card-title">{{ profile.full_name }}</h3>
              <p class="friends-page__card-username">@{{ profile.username }}</p>
            </div>
          </div>

          <div class="friends-page__card-actions">
            <p class="friends-page__following-note">You are following this user.</p>
            <NuxtLink :to="`/friends/${profile.username}`" class="friends-page__action-link">View profile</NuxtLink>
            <button type="button" class="button-secondary" @click="handleUnfollow(profile)">Unfollow</button>
          </div>
        </article>
      </div>
      <p v-else>
        No one is in your following-only list.
      </p>
    </div>

    <div class="surface-card">
      <div class="friends-page__section-copy">
        <h2>Followers</h2>
        <p>People who are already interested in your profile and may want to follow back.</p>
      </div>
      <div v-if="followersOnly.length" class="friends-page__cards">
        <article
          v-for="profile in followersOnly"
          :key="profile.id"
          class="surface-card friends-page__card"
        >
          <div class="friends-page__card-main">
            <img :src="getProfileAvatar(profile)" :alt="profile.full_name" class="friends-page__card-avatar">
            <div>
              <h3 class="friends-page__card-title">{{ profile.full_name }}</h3>
              <p class="friends-page__card-username">@{{ profile.username }}</p>
            </div>
          </div>

          <div class="friends-page__card-actions">
            <p class="friends-page__following-note">This user follows you.</p>
            <NuxtLink :to="`/friends/${profile.username}`" class="friends-page__action-link">View profile</NuxtLink>
            <button
              v-if="!followingIds.includes(profile.id)"
              type="button"
              class="button-primary"
              @click="handleFollow(profile)"
            >
              Follow back
            </button>
          </div>
        </article>
      </div>
      <p v-else>
        No follower-only profiles yet.
      </p>
    </div>

    <div v-if="showProfileModal" class="friends-page__modal-backdrop">
      <div class="surface-card friends-page__modal">
        <h2>Complete profile first</h2>
        <p>Please fill in your profile before following other users.</p>

        <img :src="modalAvatarPreview" alt="Profile avatar preview" class="friends-page__modal-avatar">

        <div>
          <label for="friends-profile-email">Email</label>
          <input id="friends-profile-email" :value="email" type="email" readonly>
        </div>

        <div>
          <label for="friends-profile-full-name">Full name</label>
          <input id="friends-profile-full-name" v-model="fullName" type="text" placeholder="Enter your full name">
        </div>

        <div>
          <label for="friends-profile-username">Username</label>
          <input id="friends-profile-username" v-model="username" type="text" placeholder="Enter a username">
        </div>

        <div>
          <label for="friends-profile-birth-date">Date of birth</label>
          <input id="friends-profile-birth-date" v-model="birthDate" type="date">
        </div>

        <fieldset class="friends-page__modal-avatar-picker">
          <legend>Choose avatar</legend>
          <div class="friends-page__modal-avatar-options">
            <label
              v-for="option in avatarOptions"
              :key="option.id"
              class="friends-page__modal-avatar-option"
            >
              <input
                v-model="avatarUrl"
                type="radio"
                name="friends-profile-avatar"
                :value="option.image"
              >
              <img :src="option.image" :alt="option.label" class="friends-page__modal-avatar-option-image">
              <span>{{ option.label }}</span>
            </label>
          </div>
        </fieldset>

        <button type="button" @click="handleProfileModalSave">Save profile</button>
        <button type="button" @click="showProfileModal = false">Close</button>

        <p v-if="profileStatusMessage">
          {{ profileStatusMessage }}
        </p>
      </div>
    </div>
  </section>
</template>

<style scoped>
.friends-page {
  display: grid;
  gap: 1.15rem;
}

.friends-page__cards {
  display: grid;
  gap: 1rem;
}

.friends-page__section-copy {
  display: grid;
  gap: 0.24rem;
  margin-bottom: 1rem;
}

.friends-page__section-copy h2,
.friends-page__section-copy p {
  margin: 0;
}

.friends-page__section-copy p {
  color: var(--muted);
}

.friends-page__hero-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
  margin-top: 1rem;
}

.friends-page__card {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 1rem;
}

.friends-page__card-main {
  display: flex;
  align-items: center;
  gap: 1rem;
  min-width: 0;
}

.friends-page__card-avatar {
  width: 64px;
  height: 64px;
  border-radius: 50%;
  object-fit: cover;
  border: 1px solid var(--border);
}

.friends-page__card-title {
  margin: 0;
}

.friends-page__card-username,
.friends-page__following-note {
  margin: 0.25rem 0 0;
  color: #64748b;
}

.friends-page__card-actions {
  display: grid;
  justify-items: end;
  gap: 0.5rem;
}

.friends-page__highlights {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 0.8rem;
  margin-top: 1.1rem;
}

.friends-page__highlight-card {
  display: flex;
  align-items: center;
  gap: 0.9rem;
  padding: 0.95rem 1rem;
  border-radius: 1.35rem;
  border: 1px solid rgba(218, 218, 218, 0.9);
  background: linear-gradient(180deg, rgba(255, 255, 255, 0.96), rgba(249, 249, 249, 0.92));
}

.friends-page__highlight-value {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 3rem;
  min-height: 3rem;
  border-radius: 50%;
  background: rgba(220, 255, 130, 0.82);
  color: #3e532f;
  font-size: 1.05rem;
  font-weight: 700;
}

.friends-page__highlight-copy {
  display: grid;
  gap: 0.14rem;
}

.friends-page__highlight-copy span {
  color: var(--muted);
  font-size: 0.84rem;
}

.friends-page__modal-backdrop {
  position: fixed;
  inset: 0;
  display: grid;
  place-items: center;
  background: rgb(15 23 42 / 35%);
  padding: 1rem;
}

.friends-page__modal {
  width: min(100%, 680px);
  max-height: calc(100vh - 2rem);
  overflow-y: auto;
  display: grid;
  gap: 1rem;
}

.friends-page__modal-avatar {
  width: 88px;
  height: 88px;
  border-radius: 50%;
  object-fit: cover;
  border: 1px solid var(--border);
}

.friends-page__modal-avatar-picker {
  border: 1px solid var(--border);
  border-radius: 0.75rem;
  padding: 1rem;
}

.friends-page__modal-avatar-options {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(96px, 1fr));
  gap: 0.75rem;
}

.friends-page__modal-avatar-option {
  display: grid;
  justify-items: center;
  gap: 0.35rem;
  text-align: center;
}

.friends-page__modal-avatar-option-image {
  width: 56px;
  height: 56px;
  border-radius: 50%;
  object-fit: cover;
  border: 1px solid var(--border);
}

.friends-page__action-link {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0.7rem 1rem;
  border-radius: 999px;
  background: #eef2f7;
  color: #1f1f1f;
  text-decoration: none;
  font-weight: 600;
}

.friends-page__action-link--primary {
  background: #da2795;
  color: #fff;
  box-shadow: 0 10px 24px rgba(218, 39, 149, 0.18);
}

@media (max-width: 900px) {
  .friends-page__highlights {
    grid-template-columns: 1fr;
  }

  .friends-page__card {
    flex-direction: column;
    align-items: flex-start;
  }

  .friends-page__card-actions {
    justify-items: start;
  }
}
</style>
