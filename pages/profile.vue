<!-- This page lets the authenticated user create, update, sign out, or delete only their profile row. -->
<script setup lang="ts">
definePageMeta({
  middleware: ['auth']
})

const router = useRouter()
const statusMessage = ref('')
const profileExists = ref(false)
const isLoading = ref(true)
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
    statusMessage.value = 'Please choose an image file for your avatar.'
    input.value = ''
    return
  }

  try {
    avatarUrl.value = await readAvatarFile(file)
    statusMessage.value = ''
  } catch {
    statusMessage.value = 'Failed to load avatar image.'
  } finally {
    input.value = ''
  }
}

const { getUser, signOut } = useAuth()
const { getProfileById, createProfile, updateProfile, deleteProfileData } = useProfile()

const avatarPreview = computed(() => {
  return avatarUrl.value || defaultProfileAvatar
})

const showDeleteConfirmModal = ref(false)

const loadProfilePage = async () => {
  isLoading.value = true
  const user = await getUser()

  if (!user) {
    await router.push('/login')
    return
  }

  email.value = user.email || ''

  const { data, error } = await getProfileById(user.id)

  if (error) {
    statusMessage.value = 'Failed to load profile'
    isLoading.value = false
    return
  }

  if (!data) {
    profileExists.value = false
    fullName.value = ''
    username.value = ''
    birthDate.value = ''
    avatarUrl.value = ''
    statusMessage.value = 'Profile not found. Fill in the form to create it again.'
    isLoading.value = false
    return
  }

  profileExists.value = true
  statusMessage.value = ''
  fullName.value = data.full_name
  username.value = data.username
  birthDate.value = data.birth_date
  avatarUrl.value = data.avatar_url
  isLoading.value = false
}

const handleSave = async () => {
  statusMessage.value = ''

  const user = await getUser()

  if (!user) {
    await router.push('/login')
    return
  }

  if (!fullName.value.trim()) {
    statusMessage.value = 'Full name is required'
    return
  }

  if (!username.value.trim()) {
    statusMessage.value = 'Username is required'
    return
  }

  if (!birthDate.value) {
    statusMessage.value = 'Date of birth is required'
    return
  }

  const normalizedUsername = username.value.trim().toLowerCase()
  const selectedAvatarUrl = avatarUrl.value.trim() || defaultProfileAvatar
  const payload = {
    email: user.email || email.value,
    full_name: fullName.value.trim(),
    username: normalizedUsername,
    birth_date: birthDate.value,
    avatar_url: selectedAvatarUrl
  }

  const response = profileExists.value
    ? await updateProfile(user.id, payload)
    : await createProfile({
        id: user.id,
        ...payload
      })

  if (response.error) {
    console.error('Profile save failed:', response.error)
    statusMessage.value = 'Failed to save profile'
    return
  }

  username.value = normalizedUsername
  email.value = payload.email
  avatarUrl.value = selectedAvatarUrl
  profileExists.value = true
  statusMessage.value = 'Profile saved successfully'
}

const handleSignOut = async () => {
  await signOut()
  await router.push('/login')
}

const handleDeleteProfile = async () => {
  const user = await getUser()

  if (!user) {
    await router.push('/login')
    return
  }

  showDeleteConfirmModal.value = true
}

const confirmDeleteProfile = async () => {
  const user = await getUser()

  if (!user) {
    await router.push('/login')
    return
  }

  const { error } = await deleteProfileData(user.id)

  if (error) {
    console.error('Profile deletion failed:', error)
    statusMessage.value = 'Failed to delete profile data'
    return
  }

  showDeleteConfirmModal.value = false
  await signOut()
  await router.push('/login')
}

onMounted(loadProfilePage)
</script>

<template>
  <section class="page-section">
    <div v-if="isLoading" class="surface-card profile-page profile-page--loading">
      <div class="profile-page__skeleton-avatar" />
      <div class="profile-page__skeleton-line profile-page__skeleton-line--long" />
      <div class="profile-page__skeleton-line" />
      <div class="profile-page__skeleton-line" />
      <div class="profile-page__skeleton-line" />
      <div class="profile-page__skeleton-grid">
        <div v-for="item in 8" :key="item" class="profile-page__skeleton-option" />
      </div>
    </div>

    <div v-if="!isLoading" class="surface-card profile-page">
      <div class="profile-page__intro">
        <div class="profile-page__intro-copy">
          <span class="eyebrow">My space</span>
          <h1>Profile</h1>
          <p>Keep your public identity polished so wishlists, friends, and invitations always feel personal.</p>
        </div>
        <div class="profile-page__snapshot">
          <img
            :src="avatarPreview"
            alt="Profile avatar preview"
            class="profile-page__avatar"
          >
          <div class="profile-page__snapshot-meta">
            <strong>{{ fullName || 'Your name here' }}</strong>
            <span>{{ username ? `@${username}` : 'Choose a username' }}</span>
          </div>
        </div>
      </div>

      <div class="profile-page__field-grid">
        <div>
          <label for="profile-email">Email</label>
          <input
            id="profile-email"
            :value="email"
            type="email"
            readonly
          >
        </div>

        <div>
          <label for="profile-full-name">Full name</label>
          <input
            id="profile-full-name"
            v-model="fullName"
            type="text"
            placeholder="Enter your full name"
          >
        </div>

        <div>
          <label for="profile-username">Username</label>
          <input
            id="profile-username"
            v-model="username"
            type="text"
            placeholder="Enter a username"
          >
        </div>

        <div>
          <label for="profile-birth-date">Date of birth</label>
          <input
            id="profile-birth-date"
            v-model="birthDate"
            type="date"
          >
        </div>
      </div>

      <fieldset class="profile-page__avatar-picker">
        <legend>Choose avatar</legend>
        <label class="profile-page__upload">
          <span>Upload your photo</span>
          <input
            type="file"
            accept="image/*"
            @change="handleAvatarUpload"
          >
        </label>
        <div class="profile-page__avatar-options">
          <label
            v-for="option in avatarOptions"
            :key="option.id"
            class="profile-page__avatar-option"
          >
            <input
              v-model="avatarUrl"
              type="radio"
              name="profile-avatar"
              :value="option.image"
            >
            <img
              :src="option.image"
              :alt="option.label"
              class="profile-page__avatar-option-image"
            >
            <span>{{ option.label }}</span>
          </label>
        </div>
      </fieldset>

      <div class="profile-page__actions">
        <button type="button" @click="handleSave">
          Save profile data
        </button>

        <button type="button" class="profile-page__secondary-button" @click="handleSignOut">
          Sign out
        </button>

        <button type="button" class="profile-page__danger-button" @click="handleDeleteProfile">
          Delete profile
        </button>
      </div>

      <p v-if="statusMessage">
        {{ statusMessage }}
      </p>
    </div>

    <div v-if="showDeleteConfirmModal" class="profile-page__modal-backdrop">
      <div class="surface-card profile-page__confirm-modal">
        <div class="profile-page__confirm-copy">
          <h2>Delete profile data?</h2>
          <p>Your login account will stay active, but your profile and related app data will be removed.</p>
        </div>

        <div class="profile-page__confirm-actions">
          <button type="button" class="profile-page__secondary-button" @click="showDeleteConfirmModal = false">
            Cancel
          </button>
          <button type="button" class="profile-page__danger-button" @click="confirmDeleteProfile">
            Delete profile
          </button>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.profile-page {
  display: grid;
  gap: 1rem;
  width: min(100%, 760px);
  max-width: 760px;
  margin: 0 auto;
}

.profile-page--loading {
  min-height: 32rem;
}

.profile-page__intro {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 1rem;
}

.profile-page__intro-copy {
  display: grid;
  gap: 0.28rem;
}

.profile-page__intro-copy h1,
.profile-page__intro-copy p {
  margin: 0;
}

.profile-page__intro-copy p {
  max-width: 34rem;
  color: var(--muted);
}

.profile-page__snapshot {
  display: flex;
  align-items: center;
  gap: 0.8rem;
  padding: 0.8rem 0.95rem;
  border-radius: 1.35rem;
  border: 1px solid rgba(218, 218, 218, 0.9);
  background: linear-gradient(180deg, rgba(255, 255, 255, 0.96), rgba(249, 249, 249, 0.92));
}

.profile-page__snapshot-meta {
  display: grid;
  gap: 0.12rem;
}

.profile-page__snapshot-meta span {
  color: var(--muted);
  font-size: 0.88rem;
}

.profile-page__field-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 1rem;
}

.profile-page__avatar {
  width: 88px;
  height: 88px;
  border-radius: 50%;
  object-fit: cover;
  border: 1px solid var(--border);
}

.profile-page__avatar-picker {
  border: 1px solid var(--border);
  border-radius: 0.75rem;
  padding: 1rem;
}

.profile-page__upload {
  display: grid;
  gap: 0.45rem;
  margin-bottom: 1rem;
}

.profile-page__upload input {
  width: 100%;
  border: 1px solid var(--border);
  border-radius: 0.95rem;
  background: #fff;
  padding: 0.45rem;
  color: var(--text);
}

.profile-page__upload input::file-selector-button {
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

.profile-page__avatar-options {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(96px, 1fr));
  gap: 0.75rem;
}

.profile-page__actions {
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
}

.profile-page__secondary-button {
  background: #eef2f7;
  color: #1f1f1f;
}

.profile-page__danger-button {
  background: transparent;
  color: #c92a2a;
  border: 1px solid rgba(201, 42, 42, 0.35);
}

.profile-page__modal-backdrop {
  position: fixed;
  inset: 0;
  display: grid;
  place-items: center;
  background: rgb(15 23 42 / 24%);
  padding: 1rem;
}

.profile-page__confirm-modal {
  width: min(100%, 520px);
  display: grid;
  gap: 1rem;
  border-radius: 2rem;
}

.profile-page__confirm-copy {
  display: grid;
  gap: 0.55rem;
}

.profile-page__confirm-copy h2,
.profile-page__confirm-copy p {
  margin: 0;
}

.profile-page__confirm-actions {
  display: flex;
  justify-content: flex-end;
  gap: 0.75rem;
  flex-wrap: wrap;
}

.profile-page__avatar-option {
  display: grid;
  justify-items: center;
  gap: 0.35rem;
  text-align: center;
}

.profile-page__avatar-option-image {
  width: 56px;
  height: 56px;
  border-radius: 50%;
  object-fit: cover;
  border: 1px solid var(--border);
}

.profile-page__skeleton-avatar,
.profile-page__skeleton-line,
.profile-page__skeleton-option {
  border-radius: 0.9rem;
  background:
    linear-gradient(90deg, #f8fafc 0%, #eef2f7 50%, #f8fafc 100%);
  background-size: 200% 100%;
  animation: profile-page__pulse 1.4s ease-in-out infinite;
}

.profile-page__skeleton-avatar {
  width: 88px;
  height: 88px;
  border-radius: 50%;
}

.profile-page__skeleton-line {
  height: 2.9rem;
}

.profile-page__skeleton-line--long {
  height: 3.2rem;
}

.profile-page__skeleton-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(96px, 1fr));
  gap: 0.75rem;
}

.profile-page__skeleton-option {
  height: 6rem;
}

@media (max-width: 720px) {
  .profile-page__intro {
    flex-direction: column;
  }

  .profile-page__field-grid {
    grid-template-columns: 1fr;
  }
}

@keyframes profile-page__pulse {
  0% {
    background-position: 200% 0;
  }

  100% {
    background-position: -200% 0;
  }
}
</style>
