<!-- This page shows another user's public profile information, follow state, and visible wishlists by username. -->
<script setup lang="ts">
definePageMeta({
  middleware: ['auth']
})

import type { Profile } from '~/types/profile'
import type { Wishlist, WishlistParticipant } from '~/types/wishlist'
import {
  formatParticipantJoinMode,
  formatWishlistVisibility,
  splitWishlistTitle
} from '~/utils/helpers'

const route = useRoute()
const router = useRouter()
const statusMessage = ref('')
const userProfile = ref<Profile | null>(null)
const profileWishlists = ref<Wishlist[]>([])
const wishlistParticipationById = ref<Record<string, WishlistParticipant>>({})
const isOwnProfile = ref(false)
const following = ref(false)
const showProfileModal = ref(false)
const profileStatusMessage = ref('')
const currentUserId = ref('')
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

const readAvatarFile = (file: File) => {
  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader()

    reader.onload = () => {
      if (typeof reader.result === 'string') {
        resolve(reader.result)
        return
      }

      reject(new Error('Failed to read avatar file.'))
    }

    reader.onerror = () => reject(new Error('Failed to read avatar file.'))
    reader.readAsDataURL(file)
  })
}

const handleAvatarUpload = async (event: Event) => {
  const input = event.target as HTMLInputElement | null
  const file = input?.files?.[0]

  if (!file) {
    return
  }

  if (!file.type.startsWith('image/')) {
    profileStatusMessage.value = 'Please choose an image file for your avatar.'
    input.value = ''
    return
  }

  try {
    avatarUrl.value = await readAvatarFile(file)
    profileStatusMessage.value = ''
  } catch {
    profileStatusMessage.value = 'Failed to load avatar image.'
  } finally {
    input.value = ''
  }
}

const { getUser } = useAuth()
const {
  getWishlistsByOwner,
  getUserParticipationsForWishlists,
  requestToJoinWishlist,
  acceptInvitation,
  rejectInvitation
} = useWishlists()
const { getProfileById, createProfile } = useProfile()
const { getProfileByUsername, isFollowing, followUser, unfollowUser } = useFriends()

const displayedAvatar = computed(() => {
  return userProfile.value?.avatar_url || defaultProfileAvatar
})

const modalAvatarPreview = computed(() => {
  return avatarUrl.value || defaultProfileAvatar
})

const contactHref = computed(() => {
  if (!userProfile.value?.email || isOwnProfile.value) {
    return ''
  }

  const subject = encodeURIComponent(`gifttt | Contact for @${userProfile.value.username}`)
  return `mailto:${userProfile.value.email}?subject=${subject}`
})

const getWishlistTitleParts = (title: string) => {
  return splitWishlistTitle(title)
}

const loadFriendProfilePage = async () => {
  if (!import.meta.client) {
    return
  }

  statusMessage.value = ''
  userProfile.value = null
  profileWishlists.value = []

  const authUser = await getUser()

  if (!authUser) {
    statusMessage.value = 'Please log in to view profiles.'
    return
  }

  currentUserId.value = authUser.id
  email.value = authUser.email || ''

  const usernameFromRoute = String(route.params.username)
  const { data, error } = await getProfileByUsername(usernameFromRoute)

  if (error || !data) {
    statusMessage.value = 'Profile not found.'
    return
  }

  userProfile.value = data
  isOwnProfile.value = authUser.id === data.id

  const followStateResponse = await isFollowing(authUser.id, data.id)

  if (!followStateResponse.error) {
    following.value = followStateResponse.data
  }

  const wishlistsResponse = await getWishlistsByOwner(data.id)

  if (wishlistsResponse.error) {
    statusMessage.value = 'Profile loaded, but wishlists could not be loaded.'
  } else {
    profileWishlists.value = wishlistsResponse.data

    const participationResponse = await getUserParticipationsForWishlists(
      wishlistsResponse.data.map((wishlist) => wishlist.id),
      authUser.id
    )

    if (!participationResponse.error) {
      wishlistParticipationById.value = Object.fromEntries(
        participationResponse.data.map((participant) => [participant.wishlistId, participant])
      )
    }
  }
}

const handleFollowToggle = async () => {
  if (!userProfile.value) {
    return
  }

  const authUser = await getUser()

  if (!authUser) {
    statusMessage.value = 'Please log in to continue.'
    return
  }

  if (!following.value) {
    const ownProfileResponse = await getProfileById(authUser.id)

    if (ownProfileResponse.error) {
      statusMessage.value = 'Failed to verify your profile.'
      return
    }

    if (!ownProfileResponse.data) {
      profileStatusMessage.value = ''
      fullName.value = ''
      username.value = ''
      birthDate.value = ''
      avatarUrl.value = ''
      showProfileModal.value = true
      return
    }
  }

  const response = following.value
    ? await unfollowUser(authUser.id, userProfile.value.id)
    : await followUser(authUser.id, userProfile.value.id)

  if (response.error) {
    console.error('Follow state update failed:', response.error)
    statusMessage.value = 'Failed to update follow state.'
    return
  }

  following.value = !following.value
}

const handleProfileModalSave = async () => {
  profileStatusMessage.value = ''

  const authUser = await getUser()

  if (!authUser) {
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
    id: authUser.id,
    email: authUser.email || email.value,
    full_name: fullName.value.trim(),
    username: normalizedUsername,
    birth_date: birthDate.value,
    avatar_url: selectedAvatarUrl
  })

  if (error) {
    console.error('Profile creation before follow failed:', error)
    profileStatusMessage.value = 'Failed to save profile'
    return
  }

  showProfileModal.value = false
  profileStatusMessage.value = ''
  statusMessage.value = 'Profile saved. You can follow users now.'
}

const getWishlistParticipation = (wishlistId: string) => {
  return wishlistParticipationById.value[wishlistId] || null
}

const canOpenWishlist = (wishlistId: string) => {
  return Boolean(getWishlistParticipation(wishlistId))
}

const wishlistAccessLabel = (wishlist: Wishlist) => {
  const participation = getWishlistParticipation(wishlist.id)

  if (participation?.status === 'approved') {
    return 'You already joined this wishlist.'
  }

  if (participation?.status === 'invited') {
    return 'You were invited to this wishlist.'
  }

  if (participation?.status === 'pending') {
    return 'Your access request is waiting for approval.'
  }

  if (participation?.status === 'rejected') {
    return 'Your previous request was rejected.'
  }

  if (wishlist.participantJoinMode === 'invite_only') {
    return 'This wishlist is available by invitation only.'
  }

  return wishlist.participantJoinMode === 'open'
    ? 'You can join this wishlist right away.'
    : 'You can send an access request to the wishlist owner.'
}

const wishlistActionLabel = (wishlist: Wishlist) => {
  const participation = getWishlistParticipation(wishlist.id)

  if (participation?.status === 'invited') {
    return 'Accept invitation'
  }

  return wishlist.participantJoinMode === 'open' ? 'Join wishlist' : 'Request access'
}

const handleWishlistJoinAction = async (wishlist: Wishlist) => {
  const participation = getWishlistParticipation(wishlist.id)

  if (participation?.status === 'invited') {
    const response = await acceptInvitation(wishlist.id, currentUserId.value)

    if (response.error || !response.data) {
      statusMessage.value = response.error
        ? `Failed to accept invitation: ${response.error.message}`
        : 'Failed to accept invitation.'
      return
    }

    wishlistParticipationById.value = {
      ...wishlistParticipationById.value,
      [wishlist.id]: response.data
    }
    statusMessage.value = 'Invitation accepted successfully.'
    return
  }

  const response = await requestToJoinWishlist(wishlist, currentUserId.value)

  if (response.error || !response.data) {
    statusMessage.value = response.error
      ? `Failed to update wishlist access: ${response.error.message}`
      : 'Failed to update wishlist access.'
    return
  }

  wishlistParticipationById.value = {
    ...wishlistParticipationById.value,
    [wishlist.id]: response.data
  }
  statusMessage.value = response.data.status === 'approved'
    ? 'You joined this wishlist successfully.'
    : 'Your access request has been sent to the wishlist owner.'
}

const handleWishlistRejectInvitation = async (wishlist: Wishlist) => {
  const response = await rejectInvitation(wishlist.id, currentUserId.value)

  if (response.error || !response.data) {
    statusMessage.value = response.error
      ? `Failed to reject invitation: ${response.error.message}`
      : 'Failed to reject invitation.'
    return
  }

  wishlistParticipationById.value = {
    ...wishlistParticipationById.value,
    [wishlist.id]: response.data
  }
  statusMessage.value = 'Invitation rejected.'
}

onMounted(loadFriendProfilePage)
watch(() => route.fullPath, () => {
  loadFriendProfilePage()
})
</script>

<template>
  <section class="page-section user-profile-page">
    <div class="surface-card" v-if="userProfile">
      <div class="user-profile-page__hero">
        <div class="user-profile-page__hero-copy">
          <h1>{{ userProfile.full_name }}</h1>
          <img
            :src="displayedAvatar"
            alt="User avatar"
            class="user-profile-page__avatar"
          >
          <p><strong>Username:</strong> @{{ userProfile.username }}</p>
          <p><strong>Date of birth:</strong> {{ userProfile.birth_date }}</p>
        </div>

        <div v-if="!isOwnProfile" class="user-profile-page__hero-actions">
          <button
            type="button"
            @click="handleFollowToggle"
          >
            {{ following ? 'Unfollow' : 'Follow' }}
          </button>
          <a
            v-if="contactHref"
            :href="contactHref"
            class="user-profile-page__button-link"
          >
            Contact
          </a>
        </div>
      </div>
    </div>

    <div class="surface-card">
      <h2>Wishlists</h2>
      <div v-if="profileWishlists.length" class="user-profile-page__wishlist-list">
        <article
          v-for="wishlist in profileWishlists"
          :key="wishlist.id"
          class="user-profile-page__wishlist-card"
        >
          <div class="user-profile-page__wishlist-copy">
            <strong class="user-profile-page__wishlist-title">
              <span
                v-if="getWishlistTitleParts(wishlist.title).cover"
                class="user-profile-page__wishlist-emoji"
              >
                {{ getWishlistTitleParts(wishlist.title).cover }}
              </span>
              <span>{{ getWishlistTitleParts(wishlist.title).text || wishlist.title }}</span>
            </strong>
            <p>{{ wishlist.description || 'No description yet.' }}</p>
            <p>Visibility: {{ formatWishlistVisibility(wishlist.visibility) }}</p>
            <p>Join mode: {{ formatParticipantJoinMode(wishlist.participantJoinMode) }}</p>
            <p>{{ wishlistAccessLabel(wishlist) }}</p>
          </div>

          <div class="user-profile-page__wishlist-actions">
            <NuxtLink
              :to="`/wishlists/${wishlist.id}`"
              class="user-profile-page__button-link"
            >
              {{ canOpenWishlist(wishlist.id) ? 'Open wishlist' : 'View wishlist' }}
            </NuxtLink>

            <button
              v-if="!isOwnProfile && (!getWishlistParticipation(wishlist.id) || getWishlistParticipation(wishlist.id)?.status === 'rejected' || getWishlistParticipation(wishlist.id)?.status === 'invited')"
              type="button"
              @click="handleWishlistJoinAction(wishlist)"
            >
              {{ wishlistActionLabel(wishlist) }}
            </button>

            <button
              v-if="!isOwnProfile && getWishlistParticipation(wishlist.id)?.status === 'invited'"
              type="button"
              @click="handleWishlistRejectInvitation(wishlist)"
            >
              Reject invitation
            </button>
          </div>
        </article>
      </div>
      <p v-else>
        No visible wishlists found for this user.
      </p>
    </div>

    <p v-if="statusMessage">
      {{ statusMessage }}
    </p>

    <div v-if="showProfileModal" class="user-profile-page__modal-backdrop">
      <div class="surface-card user-profile-page__modal">
        <h2>Complete profile first</h2>
        <p>Please fill in your profile before following other users.</p>

        <img
          :src="modalAvatarPreview"
          alt="Profile avatar preview"
          class="user-profile-page__modal-avatar"
        >

        <div>
          <label for="follow-profile-email">Email</label>
          <input
            id="follow-profile-email"
            :value="email"
            type="email"
            readonly
          >
        </div>

        <div>
          <label for="follow-profile-full-name">Full name</label>
          <input
            id="follow-profile-full-name"
            v-model="fullName"
            type="text"
            placeholder="Enter your full name"
          >
        </div>

        <div>
          <label for="follow-profile-username">Username</label>
          <input
            id="follow-profile-username"
            v-model="username"
            type="text"
            placeholder="Enter a username"
          >
        </div>

        <div>
          <label for="follow-profile-birth-date">Date of birth</label>
          <input
            id="follow-profile-birth-date"
            v-model="birthDate"
            type="date"
          >
        </div>

        <fieldset class="user-profile-page__modal-avatar-picker">
          <legend>Choose avatar</legend>
          <label class="user-profile-page__modal-upload">
            <span>Upload your photo</span>
            <input
              type="file"
              accept="image/*"
              @change="handleAvatarUpload"
            >
          </label>
          <div class="user-profile-page__modal-avatar-options">
            <label
              v-for="option in avatarOptions"
              :key="option.id"
              class="user-profile-page__modal-avatar-option"
            >
              <input
                v-model="avatarUrl"
                type="radio"
                name="follow-profile-avatar"
                :value="option.image"
              >
              <img
                :src="option.image"
                :alt="option.label"
                class="user-profile-page__modal-avatar-option-image"
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
.user-profile-page {
  display: grid;
  gap: 1rem;
}

.user-profile-page__hero {
  display: flex;
  justify-content: space-between;
  gap: 1rem;
  align-items: flex-start;
}

.user-profile-page__hero-copy {
  display: grid;
  gap: 0.45rem;
}

.user-profile-page__hero-copy h1,
.user-profile-page__hero-copy p {
  margin: 0;
}

.user-profile-page__hero-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 0.6rem;
  align-items: flex-start;
  justify-content: flex-end;
}

.user-profile-page__avatar {
  width: 96px;
  height: 96px;
  border-radius: 50%;
  object-fit: cover;
  border: 1px solid var(--border);
}

.user-profile-page__wishlist-list {
  display: grid;
  gap: 0.85rem;
}

.user-profile-page__wishlist-card {
  display: flex;
  justify-content: space-between;
  gap: 1rem;
  padding: 1rem;
  border: 1px solid var(--border);
  border-radius: 0.9rem;
}

.user-profile-page__wishlist-copy {
  display: grid;
  gap: 0.35rem;
}

.user-profile-page__wishlist-title {
  display: flex;
  align-items: center;
  gap: 0.55rem;
  flex-wrap: wrap;
}

.user-profile-page__wishlist-emoji {
  font-size: 1.5rem;
  line-height: 1;
}

.user-profile-page__wishlist-copy p,
.user-profile-page__wishlist-copy strong {
  margin: 0;
}

.user-profile-page__wishlist-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 0.6rem;
  align-items: flex-start;
  justify-content: flex-end;
}

.user-profile-page__wishlist-actions button,
.user-profile-page__button-link {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0.75rem 1rem;
  border-radius: 0.75rem;
  border: none;
  background: #e2e8f0;
  color: #0f172a;
  text-decoration: none;
  font-weight: 600;
  cursor: pointer;
}

.user-profile-page__modal-backdrop {
  position: fixed;
  inset: 0;
  display: grid;
  place-items: center;
  background: rgb(15 23 42 / 35%);
  padding: 1rem;
}

.user-profile-page__modal {
  width: min(100%, 680px);
  max-height: calc(100vh - 2rem);
  overflow-y: auto;
  display: grid;
  gap: 1rem;
}

.user-profile-page__modal-avatar {
  width: 88px;
  height: 88px;
  border-radius: 50%;
  object-fit: cover;
  border: 1px solid var(--border);
}

.user-profile-page__modal-avatar-picker {
  border: 1px solid var(--border);
  border-radius: 0.75rem;
  padding: 1rem;
}

.user-profile-page__modal-upload {
  display: grid;
  gap: 0.45rem;
  margin-bottom: 1rem;
}

.user-profile-page__modal-upload input {
  width: 100%;
  border: 1px solid var(--border);
  border-radius: 0.95rem;
  background: #fff;
  padding: 0.45rem;
  color: var(--text);
}

.user-profile-page__modal-upload input::file-selector-button {
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

.user-profile-page__modal-avatar-options {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(96px, 1fr));
  gap: 0.75rem;
}

.user-profile-page__modal-avatar-option {
  display: grid;
  justify-items: center;
  gap: 0.35rem;
  text-align: center;
}

.user-profile-page__modal-avatar-option-image {
  width: 56px;
  height: 56px;
  border-radius: 50%;
  object-fit: cover;
  border: 1px solid var(--border);
}

@media (max-width: 720px) {
  .user-profile-page__hero,
  .user-profile-page__wishlist-card {
    flex-direction: column;
  }

  .user-profile-page__hero-actions,
  .user-profile-page__wishlist-actions {
    justify-content: flex-start;
  }
}
</style>
