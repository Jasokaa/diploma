<!-- This file defines the wishlist creation page route and saves a new wishlist to Supabase. -->
<script setup lang="ts">
definePageMeta({
  middleware: ['auth']
})

import type { WishlistFormInput } from '~/types/wishlist'

const router = useRouter()
const statusMessage = ref('')
const canCreateWishlist = ref(true)

const { getUser } = useAuth()
const { getProfileById } = useProfile()
const { createWishlist } = useWishlists()

const loadCreatePage = async () => {
  const user = await getUser()

  if (!user) {
    canCreateWishlist.value = false
    statusMessage.value = 'Please log in to create a wishlist.'
    return
  }

  const { data, error } = await getProfileById(user.id)

  if (error) {
    canCreateWishlist.value = false
    statusMessage.value = 'Failed to load your profile data.'
    return
  }

  if (!data) {
    canCreateWishlist.value = false
    statusMessage.value = 'Please complete your profile before creating a wishlist.'
    return
  }

  canCreateWishlist.value = true
  statusMessage.value = ''
}

const handleSubmit = async (payload: WishlistFormInput) => {
  statusMessage.value = ''

  if (!payload.title.trim()) {
    statusMessage.value = 'Wishlist title is required'
    return
  }

  const user = await getUser()

  if (!user) {
    await router.push('/login')
    return
  }

  const { data, error } = await createWishlist(user.id, payload)

  if (error || !data) {
    console.error('Wishlist creation failed:', error)
    statusMessage.value = error
      ? `Failed to create wishlist: ${error.message}`
      : 'Failed to create wishlist'
    return
  }

  await router.push(`/wishlists/${data.id}`)
}

const handleClose = async () => {
  await router.push('/wishlists')
}

onMounted(loadCreatePage)
</script>

<template>
  <section class="page-section wishlist-create">
    <div class="wishlist-create__layout">
      <div class="surface-card wishlist-create__hero">
        <div class="wishlist-create__hero-copy">
          <span class="eyebrow">gifttt</span>
          <h1>Create a wishlist that feels like your own.</h1>
          <p>Choose a scenario, set the tone, and fine-tune the sharing rules for this celebration.</p>
          <div class="wishlist-create__hero-pills">
            <span class="wishlist-create__hero-pill">Personal moments</span>
            <span class="wishlist-create__hero-pill">Shared gifting</span>
            <span class="wishlist-create__hero-pill">Secret Santa ready</span>
          </div>
        </div>
        <NuxtLink to="/wishlists" class="button-secondary wishlist-create__back-link">
          Back to my wishlists
        </NuxtLink>
      </div>

      <WishlistForm
        v-if="canCreateWishlist"
        submit-label="Create wishlist"
        show-close-button
        close-label="Close"
        @submit="handleSubmit"
        @close="handleClose"
      />

      <div v-else class="surface-card wishlist-create__notice">
        <p>{{ statusMessage }}</p>
        <NuxtLink to="/profile" class="button-primary wishlist-create__profile-link">
          Go to profile
        </NuxtLink>
      </div>

      <p v-if="statusMessage && canCreateWishlist" class="wishlist-create__status">
        {{ statusMessage }}
      </p>
    </div>
  </section>
</template>

<style scoped>
.wishlist-create {
  padding-top: 1rem;
}

.wishlist-create__layout {
  width: min(100%, 74rem);
  margin: 0 auto;
  display: grid;
  gap: 1rem;
}

.wishlist-create__hero {
  display: flex;
  align-items: end;
  justify-content: space-between;
  gap: 1rem;
  padding: 1.7rem 1.85rem;
  border-radius: 2rem;
  background:
    radial-gradient(circle at top right, rgba(220, 255, 130, 0.65), transparent 28%),
    linear-gradient(180deg, rgba(255, 255, 255, 0.98), rgba(255, 253, 247, 0.94));
}

.wishlist-create__hero-copy {
  display: grid;
  gap: 0.45rem;
  max-width: 41rem;
}

.wishlist-create__hero-copy h1 {
  font-size: clamp(2.5rem, 4vw, 3.6rem);
  line-height: 0.9;
}

.wishlist-create__hero-copy p {
  max-width: 31rem;
}

.wishlist-create__back-link {
  flex-shrink: 0;
}

.wishlist-create__hero-pills {
  display: flex;
  flex-wrap: wrap;
  gap: 0.7rem;
  margin-top: 0.55rem;
}

.wishlist-create__hero-pill {
  display: inline-flex;
  align-items: center;
  min-height: 2.15rem;
  padding: 0.68rem 0.92rem;
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.9);
  border: 1px solid rgba(218, 218, 218, 0.9);
  color: #43523e;
  font-size: 0.82rem;
  font-weight: 600;
}

.wishlist-create__notice {
  display: grid;
  gap: 0.9rem;
  justify-items: start;
  padding: 1.5rem;
}

.wishlist-create__status {
  color: var(--danger);
  font-size: 0.95rem;
  font-weight: 500;
  padding: 0 0.25rem;
}

@media (max-width: 720px) {
  .wishlist-create__hero {
    flex-direction: column;
    align-items: start;
    padding: 1.35rem;
  }
}
</style>
