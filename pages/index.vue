<!-- This file defines the main home page for the application and guides the user to profile completion or wishlist creation. -->
<script setup lang="ts">
const router = useRouter()
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

const hasProfile = ref(false)
const homeMessage = ref('Loading your workspace...')
const showProfileModal = ref(false)
const profileStatusMessage = ref('')
const email = ref('')
const fullName = ref('')
const username = ref('')
const birthDate = ref('')
const avatarUrl = ref('')

const { getUser } = useAuth()
const { getProfileById, createProfile } = useProfile()

const avatarPreview = computed(() => {
  return avatarUrl.value || defaultProfileAvatar
})

const primaryActionLabel = computed(() => {
  return hasProfile.value ? 'Create wishlist' : 'Complete profile to continue'
})

const loadHomePage = async () => {
  const user = await getUser()

  if (!user) {
    hasProfile.value = false
    homeMessage.value = 'Welcome! Log in or create an account to start building wishlists.'
    return
  }

  email.value = user.email || ''

  const { data } = await getProfileById(user.id)

  hasProfile.value = Boolean(data)
  homeMessage.value = hasProfile.value
    ? 'Your profile is ready. You can create a wishlist.'
    : 'Your profile is not completed yet.'
}

const handleCreateWishlist = async () => {
  const user = await getUser()

  if (!user) {
    await router.push('/login')
    return
  }

  if (!hasProfile.value) {
    showProfileModal.value = true
    return
  }

  await router.push('/wishlists/create')
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
    console.error('Profile creation from home page failed:', error)
    profileStatusMessage.value = 'Failed to save profile'
    return
  }

  hasProfile.value = true
  homeMessage.value = 'Your profile is ready. You can create a wishlist.'
  showProfileModal.value = false
  profileStatusMessage.value = ''
  await router.push('/wishlists/create')
}

onMounted(loadHomePage)
</script>

<template>
  <section class="page-section">
    <div class="surface-card home-page__hero">
      <img
        src="/images/design/logo-max.svg"
        alt=""
        aria-hidden="true"
        class="home-page__hero-brand-mark"
      >
      <div class="home-page__hero-content">
        <div class="home-page__hero-copy">
          <span class="eyebrow">gifttt</span>
          <p class="home-page__kicker">from you &amp; to you</p>
          <h1>Wishlists for the moments that matter.</h1>
          <p class="home-page__description">
            Plan birthdays, holidays, shared presents, and little surprises in one personal place.
            Keep the mood light, the access controlled, and the gift choices beautifully organized.
          </p>
          <p class="home-page__status">{{ homeMessage }}</p>
          <div class="home-page__actions">
            <button type="button" class="home-page__primary-button" @click="handleCreateWishlist">
              {{ primaryActionLabel }}
            </button>
            <NuxtLink to="/wishlists" class="button-secondary home-page__secondary-link">
              Open my wishlists
            </NuxtLink>
            <NuxtLink to="/friends" class="button-ghost home-page__ghost-link">
              Friends
            </NuxtLink>
          </div>
          <div class="home-page__feature-row">
            <span class="home-page__feature-pill">Private or shared lists</span>
            <span class="home-page__feature-pill">Gift reservations</span>
            <span class="home-page__feature-pill">Secret Santa</span>
          </div>
        </div>
        <div class="home-page__hero-side">
          <span class="home-page__hero-note-label">Why it works</span>
          <div class="home-page__hero-side-list">
            <article class="home-page__side-card">
              <p class="home-page__side-number">01</p>
              <h2>Create your space</h2>
              <p>Build a wishlist that feels personal, polished, and easy to revisit for every occasion.</p>
            </article>
            <article class="home-page__side-card">
              <p class="home-page__side-number">02</p>
              <h2>Invite the right people</h2>
              <p>Control who can join, who can browse, and how each list is shared without awkward overlap.</p>
            </article>
            <article class="home-page__side-card">
              <p class="home-page__side-number">03</p>
              <h2>Coordinate gifts calmly</h2>
              <p>Reserve gifts, split the cost, and keep everyone aligned before duplicate surprises happen.</p>
            </article>
          </div>
        </div>
      </div>
    </div>

    <div v-if="showProfileModal" class="home-modal-backdrop">
      <div class="surface-card home-modal">
        <h2>Complete profile first</h2>
        <p>Please fill in your profile first.</p>

        <img
          :src="avatarPreview"
          alt="Profile avatar preview"
          class="home-modal__avatar"
        >

        <div>
          <label for="home-profile-email">Email</label>
          <input
            id="home-profile-email"
            :value="email"
            type="email"
            readonly
          >
        </div>

        <div>
          <label for="home-profile-full-name">Full name</label>
          <input
            id="home-profile-full-name"
            v-model="fullName"
            type="text"
            placeholder="Enter your full name"
          >
        </div>

        <div>
          <label for="home-profile-username">Username</label>
          <input
            id="home-profile-username"
            v-model="username"
            type="text"
            placeholder="Enter a username"
          >
        </div>

        <div>
          <label for="home-profile-birth-date">Date of birth</label>
          <input
            id="home-profile-birth-date"
            v-model="birthDate"
            type="date"
          >
        </div>

        <fieldset class="home-modal__avatar-picker">
          <legend>Choose avatar</legend>
          <div class="home-modal__avatar-options">
            <label
              v-for="option in avatarOptions"
              :key="option.id"
              class="home-modal__avatar-option"
            >
              <input
                v-model="avatarUrl"
                type="radio"
                name="home-profile-avatar"
                :value="option.image"
              >
              <img
                :src="option.image"
                :alt="option.label"
                class="home-modal__avatar-option-image"
              >
              <span>{{ option.label }}</span>
            </label>
          </div>
        </fieldset>

        <button type="button" @click="handleProfileModalSave">
          Save profile and continue
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
.home-page__hero {
  position: relative;
  min-height: calc(100svh - 10.4rem);
  padding: 1.2rem 1.2rem 1rem;
  border-radius: 2.8rem;
  overflow: hidden;
  background:
    linear-gradient(108deg, rgba(23, 23, 23, 0.44) 0%, rgba(23, 23, 23, 0.16) 42%, rgba(23, 23, 23, 0.08) 100%),
    url('/images/design/main-page-background.jpg') center/cover no-repeat;
  box-shadow: var(--shadow-soft);
}

.home-page__hero-brand-mark {
  position: absolute;
  top: 1.5rem;
  right: 2.4rem;
  width: min(34vw, 23rem);
  opacity: 1;
  filter: none;
  pointer-events: none;
  user-select: none;
}

.home-page__hero-content {
  display: grid;
  grid-template-columns: minmax(0, 37rem) minmax(0, 1fr);
  align-items: end;
  gap: 1.05rem;
  min-height: 28rem;
}

.home-page__hero-copy {
  display: grid;
  gap: 0.9rem;
  width: min(100%, 37rem);
  padding: 1.35rem 1.45rem 1.2rem;
  border-radius: 2rem;
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(16px);
  box-shadow: 0 22px 50px rgba(0, 0, 0, 0.12);
}

.home-page__kicker {
  color: #6f7f64;
  font-size: 0.9rem;
  font-weight: 600;
  letter-spacing: 0.02em;
}

.home-page__hero-copy h1 {
  font-size: clamp(3rem, 5vw, 4.9rem);
  line-height: 0.86;
  max-width: 9ch;
}

.home-page__description {
  font-size: 1rem;
  color: #50604c;
  max-width: 34rem;
  line-height: 1.72;
}

.home-page__status {
  font-size: 0.92rem;
  color: #718268;
}

.home-page__actions {
  display: grid;
  grid-template-columns: repeat(3, max-content);
  align-items: center;
  gap: 0.75rem;
  margin-top: 0.2rem;
}

.home-page__primary-button {
  min-width: 11.5rem;
}

.home-page__secondary-link {
  min-width: 12.2rem;
}

.home-page__feature-row {
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
  margin-top: 0.15rem;
}

.home-page__feature-pill {
  display: inline-flex;
  align-items: center;
  min-height: 2.3rem;
  padding: 0.7rem 1rem;
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.92);
  border: 1px solid rgba(218, 218, 218, 0.9);
  color: #43523e;
  font-size: 0.84rem;
  font-weight: 600;
}

.home-page__ghost-link {
  align-self: center;
}

.home-page__hero-side {
  display: grid;
  align-content: end;
  gap: 0.55rem;
  width: 100%;
  min-height: 100%;
  padding: 6.1rem 0 0;
}

.home-page__hero-note-label {
  display: inline-flex;
  align-items: center;
  justify-self: start;
  min-height: 2rem;
  padding: 0.42rem 0.82rem;
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.96);
  border: 1px solid rgba(255, 255, 255, 0.85);
  box-shadow: 0 10px 24px rgba(0, 0, 0, 0.06);
  color: var(--accent);
  font-size: 0.72rem;
  font-weight: 700;
  letter-spacing: 0.12em;
  text-transform: uppercase;
}

.home-page__hero-side-list {
  display: grid;
  gap: 0.6rem;
}

.home-page__side-card {
  display: grid;
  gap: 0.42rem;
  min-height: 100%;
  padding: 0.82rem 1rem 0.88rem;
  border-radius: 1.4rem;
  background: rgba(220, 255, 130, 0.92);
  border: 1px solid rgba(144, 175, 65, 0.22);
  box-shadow: 0 14px 28px rgba(92, 126, 70, 0.1);
}

.home-page__side-number {
  color: var(--accent);
  font-size: 0.72rem;
  font-weight: 700;
  letter-spacing: 0.12em;
  text-transform: uppercase;
}

.home-page__side-card h2 {
  font-size: 1.18rem;
  line-height: 0.96;
}

.home-page__side-card p:last-child {
  color: #495745;
  font-size: 0.84rem;
  line-height: 1.45;
}

.home-modal-backdrop {
  position: fixed;
  inset: 0;
  display: grid;
  place-items: center;
  background: rgba(0, 0, 0, 0.24);
  padding: 1rem;
}

.home-modal {
  width: min(100%, 680px);
  max-height: calc(100vh - 2rem);
  overflow-y: auto;
  display: grid;
  gap: 1rem;
  border-radius: 2rem;
}

.home-modal__avatar {
  width: 88px;
  height: 88px;
  border-radius: 50%;
  object-fit: cover;
  border: 1px solid var(--border);
}

.home-modal__avatar-picker {
  border: 1px solid var(--border);
  border-radius: 0.75rem;
  padding: 1rem;
}

.home-modal__avatar-options {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(96px, 1fr));
  gap: 0.75rem;
}

.home-modal__avatar-option {
  display: grid;
  justify-items: center;
  gap: 0.35rem;
  text-align: center;
}

.home-modal__avatar-option-image {
  width: 56px;
  height: 56px;
  border-radius: 50%;
  object-fit: cover;
  border: 1px solid var(--border);
}

@media (max-width: 720px) {
  .home-page__hero {
    min-height: auto;
    padding: 1rem 1rem 0.85rem;
    border-radius: 2rem;
  }

  .home-page__hero-brand-mark {
    top: 0.9rem;
    right: 0.8rem;
    width: 9rem;
  }

  .home-page__hero-content {
    grid-template-columns: 1fr;
    align-items: stretch;
    min-height: auto;
  }

  .home-page__hero-copy h1 {
    max-width: none;
  }

  .home-page__actions {
    grid-template-columns: 1fr;
  }

  .home-page__hero-copy {
    width: 100%;
    padding: 1.3rem;
    border-radius: 1.6rem;
  }

  .home-page__hero-side {
    width: 100%;
    min-height: auto;
    padding-top: 0.35rem;
  }

  .home-page__hero-side-list {
    grid-template-columns: 1fr;
  }
}
</style>
