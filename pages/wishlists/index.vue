<!-- This page shows the user's own wishlists, joined wishlists, and public wishlists from followed users. -->
<script setup lang="ts">
definePageMeta({
  middleware: ['auth']
})

import type { WishlistAccessRecord, WishlistCollection } from '~/types/wishlist'
import { formatParticipantStatus } from '~/utils/helpers'

const statusMessage = ref('')
const isLoading = ref(true)
const collections = ref<WishlistCollection>({
  own: [],
  joined: [],
  incomingInvitations: [],
  accessRequests: [],
  followingPublic: []
})

const { getUser } = useAuth()
const currentUserId = ref('')
const { getWishlistCollections, acceptInvitation, rejectInvitation } = useWishlists()

const wishlistHighlights = computed(() => {
  return [
    {
      label: 'Own lists',
      value: collections.value.own.length,
      note: 'Wishlists you manage yourself'
    },
    {
      label: 'Joined',
      value: collections.value.joined.length,
      note: 'Wishlists you are already inside'
    },
    {
      label: 'Invitations',
      value: collections.value.incomingInvitations.length,
      note: 'Requests waiting for your answer'
    }
  ]
})

const loadWishlistsPage = async () => {
  statusMessage.value = ''
  isLoading.value = true
  collections.value = {
    own: [],
    joined: [],
    incomingInvitations: [],
    accessRequests: [],
    followingPublic: []
  }

  const user = await getUser()

  if (!user) {
    statusMessage.value = 'Please log in to view your wishlists.'
    isLoading.value = false
    return
  }

  currentUserId.value = user.id

  const { data, error } = await getWishlistCollections(user.id)

  if (error || !data) {
    console.error('Wishlist load failed:', error)
    statusMessage.value = error
      ? `Failed to load wishlists: ${error.message}`
      : 'Failed to load wishlists.'
    isLoading.value = false
    return
  }

  collections.value = data
  isLoading.value = false
}

const handleAcceptInvitation = async (record: WishlistAccessRecord) => {
  statusMessage.value = ''

  const { error } = await acceptInvitation(record.wishlist.id, currentUserId.value)

  if (error) {
    statusMessage.value = `Failed to accept invitation: ${error.message}`
    return
  }

  statusMessage.value = 'Invitation accepted successfully.'
  await loadWishlistsPage()
}

const handleRejectInvitation = async (record: WishlistAccessRecord) => {
  statusMessage.value = ''

  const { error } = await rejectInvitation(record.wishlist.id, currentUserId.value)

  if (error) {
    statusMessage.value = `Failed to reject invitation: ${error.message}`
    return
  }

  statusMessage.value = 'Invitation rejected.'
  await loadWishlistsPage()
}

onMounted(loadWishlistsPage)
</script>

<template>
  <section class="page-section wishlist-page">
    <div class="surface-card">
      <h1>Wishlists</h1>
      <p>Keep your own lists close, answer invitations quickly, and browse the wishlists that matter to you.</p>
      <div class="wishlist-page__hero-actions">
        <NuxtLink to="/wishlists/create" class="button-primary wishlist-page__primary-link">
          Create a new wishlist
        </NuxtLink>
        <NuxtLink to="/search" class="button-secondary wishlist-page__secondary-link">
          Find people and wishlists
        </NuxtLink>
      </div>
      <p v-if="statusMessage">
        {{ statusMessage }}
      </p>
      <div class="wishlist-page__highlights">
        <article
          v-for="item in wishlistHighlights"
          :key="item.label"
          class="wishlist-page__highlight-card"
        >
          <span class="wishlist-page__highlight-value">{{ item.value }}</span>
          <div class="wishlist-page__highlight-copy">
            <strong>{{ item.label }}</strong>
            <span>{{ item.note }}</span>
          </div>
        </article>
      </div>
    </div>

    <div class="surface-card">
      <div class="wishlist-page__section-copy">
        <h2>My wishlists</h2>
        <p>Your personal space for lists you own, style, and share.</p>
      </div>
      <div v-if="isLoading" class="wishlist-page__skeleton-list">
        <div v-for="item in 2" :key="`own-${item}`" class="wishlist-page__skeleton-card" />
      </div>
      <div v-else-if="collections.own.length" class="wishlist-page__list">
        <WishlistCard
          v-for="wishlist in collections.own"
          :key="wishlist.id"
          :wishlist="wishlist"
          link-label="Details"
        />
      </div>
      <p v-else-if="!isLoading">
        You have not created any wishlists yet.
      </p>
    </div>

    <div class="surface-card">
      <div class="wishlist-page__section-copy">
        <h2>Incoming invitations</h2>
        <p>Answer these first so the right lists move into your active planning space.</p>
      </div>
      <div v-if="isLoading" class="wishlist-page__skeleton-list">
        <div v-for="item in 1" :key="`invite-${item}`" class="wishlist-page__skeleton-card" />
      </div>
      <div v-else-if="collections.incomingInvitations.length" class="wishlist-page__list">
        <div
          v-for="record in collections.incomingInvitations"
          :key="record.participant.id"
          class="wishlist-page__invitation-card"
        >
          <WishlistCard
            :wishlist="record.wishlist"
            link-label="Details"
            :meta-label="`Status: ${formatParticipantStatus(record.participant.status)}`"
          />
          <div class="wishlist-page__invitation-actions">
            <button type="button" class="button-primary wishlist-page__inline-button" @click="handleAcceptInvitation(record)">
              Accept invitation
            </button>
            <button type="button" class="button-secondary wishlist-page__inline-button" @click="handleRejectInvitation(record)">
              Reject invitation
            </button>
          </div>
        </div>
      </div>
      <p v-else-if="!isLoading">
        You have no incoming wishlist invitations right now.
      </p>
    </div>

    <div class="surface-card">
      <div class="wishlist-page__section-copy">
        <h2>Wishlists I joined</h2>
        <p>Lists where you can already browse gifts, coordinate, and jump back in quickly.</p>
      </div>
      <div v-if="isLoading" class="wishlist-page__skeleton-list">
        <div v-for="item in 1" :key="`joined-${item}`" class="wishlist-page__skeleton-card" />
      </div>
      <div v-else-if="collections.joined.length" class="wishlist-page__list">
        <WishlistCard
          v-for="wishlist in collections.joined"
          :key="wishlist.id"
          :wishlist="wishlist"
          link-label="Details"
          meta-label="You are a participant"
        />
      </div>
      <p v-else-if="!isLoading">
        You have not joined any wishlists yet.
      </p>
    </div>

    <div class="surface-card">
      <div class="wishlist-page__section-copy">
        <h2>My access requests</h2>
        <p>These are still waiting on the author, so you can track them without guessing.</p>
      </div>
      <div v-if="isLoading" class="wishlist-page__skeleton-list">
        <div v-for="item in 1" :key="`requests-${item}`" class="wishlist-page__skeleton-card" />
      </div>
      <div v-else-if="collections.accessRequests.length" class="wishlist-page__list">
        <WishlistCard
          v-for="record in collections.accessRequests"
          :key="record.participant.id"
          :wishlist="record.wishlist"
          link-label="Details"
          :meta-label="`Status: ${formatParticipantStatus(record.participant.status)}`"
        />
      </div>
      <p v-else-if="!isLoading">
        You do not have active access requests.
      </p>
    </div>

    <div class="surface-card">
      <div class="wishlist-page__section-copy">
        <h2>Public wishlists from followed users</h2>
        <p>Open lists shared by people you already follow and might want to browse next.</p>
      </div>
      <div v-if="isLoading" class="wishlist-page__skeleton-list">
        <div v-for="item in 1" :key="`public-${item}`" class="wishlist-page__skeleton-card" />
      </div>
      <div v-else-if="collections.followingPublic.length" class="wishlist-page__list">
        <WishlistCard
          v-for="wishlist in collections.followingPublic"
          :key="wishlist.id"
          :wishlist="wishlist"
          link-label="Details"
          meta-label="Public wishlist"
        />
      </div>
      <p v-else-if="!isLoading">
        No public wishlists from followed users are available yet.
      </p>
    </div>
  </section>
</template>

<style scoped>
.wishlist-page {
  display: grid;
  gap: 1.25rem;
}

.wishlist-page__list {
  display: grid;
  gap: 1rem;
}

.wishlist-page__section-copy {
  display: grid;
  gap: 0.24rem;
  margin-bottom: 1rem;
}

.wishlist-page__section-copy h2,
.wishlist-page__section-copy p {
  margin: 0;
}

.wishlist-page__section-copy p {
  color: var(--muted);
}

.wishlist-page__skeleton-list {
  display: grid;
  gap: 1rem;
}

.wishlist-page__skeleton-card {
  min-height: 10.5rem;
  border-radius: 1.25rem;
  border: 1px solid var(--border);
  background:
    linear-gradient(90deg, #f8fafc 0%, #eef2f7 50%, #f8fafc 100%);
  background-size: 200% 100%;
  animation: wishlist-page__pulse 1.4s ease-in-out infinite;
}

.wishlist-page__invitation-card {
  display: grid;
  gap: 0.75rem;
}

.wishlist-page__invitation-actions {
  display: flex;
  gap: 0.75rem;
  flex-wrap: wrap;
}

.wishlist-page__inline-button {
  min-width: 10.4rem;
}

.wishlist-page__primary-link {
  width: fit-content;
}

.wishlist-page__hero-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 0.85rem;
  margin-top: 1rem;
}

.wishlist-page__secondary-link {
  width: fit-content;
}

.wishlist-page__highlights {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 0.8rem;
  margin-top: 1.1rem;
}

.wishlist-page__highlight-card {
  display: flex;
  align-items: center;
  gap: 0.9rem;
  padding: 0.95rem 1rem;
  border-radius: 1.35rem;
  border: 1px solid rgba(218, 218, 218, 0.9);
  background: linear-gradient(180deg, rgba(255, 255, 255, 0.96), rgba(249, 249, 249, 0.92));
}

.wishlist-page__highlight-value {
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

.wishlist-page__highlight-copy {
  display: grid;
  gap: 0.14rem;
}

.wishlist-page__highlight-copy span {
  color: var(--muted);
  font-size: 0.84rem;
}

.wishlist-page > .surface-card:first-child {
  padding: 1.6rem;
  border-radius: 2.5rem;
  background:
    radial-gradient(circle at top left, rgba(220, 255, 130, 0.55), transparent 28%),
    linear-gradient(135deg, #fffef8 0%, #ffffff 100%);
}

@media (max-width: 860px) {
  .wishlist-page__highlights {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 560px) {
  .wishlist-page__inline-button {
    width: 100%;
  }
}

@keyframes wishlist-page__pulse {
  0% {
    background-position: 200% 0;
  }

  100% {
    background-position: -200% 0;
  }
}
</style>
