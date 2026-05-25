<!-- This file defines a summary card for a wishlist and links to its editing page. -->
<script setup lang="ts">
import type { Wishlist } from '~/types/wishlist'
import {
  formatParticipantJoinMode,
  formatWishlistVisibility,
  splitWishlistTitle
} from '~/utils/helpers'
import { detectWishlistScenario, formatWishlistScenario } from '~/utils/wishlistScenarios'
import { getWishlistThemeStyle } from '~/utils/wishlistThemes'

const props = defineProps<{
  wishlist: Wishlist
  linkLabel?: string
  metaLabel?: string
}>()

const titleParts = computed(() => splitWishlistTitle(props.wishlist.title))
const scenarioLabel = computed(() => {
  return formatWishlistScenario(
    detectWishlistScenario({
      visibility: props.wishlist.visibility,
      giftReservation: props.wishlist.giftReservation,
      hideReservedGiftsFromAuthor: props.wishlist.hideReservedGiftsFromAuthor,
      splitGifts: props.wishlist.splitGifts,
      randomGiftSelection: props.wishlist.randomGiftSelection,
      participantVisibility: props.wishlist.participantVisibility,
      wishlistCollaboration: props.wishlist.wishlistCollaboration,
      giftStatusVisibility: props.wishlist.giftStatusVisibility,
      secretAssignmentMode: props.wishlist.secretAssignmentMode,
      participantJoinMode: props.wishlist.participantJoinMode
    })
  )
})
</script>

<template>
  <article class="surface-card wishlist-card" :style="getWishlistThemeStyle(props.wishlist.themeKey)">
    <div class="wishlist-card__content">
      <span class="wishlist-card__scenario-chip">Scenario · {{ scenarioLabel }}</span>
      <h3 class="wishlist-card__title">
        <span v-if="titleParts.cover" class="wishlist-card__emoji">{{ titleParts.cover }}</span>
        <span>{{ titleParts.text || props.wishlist.title }}</span>
      </h3>
      <p>{{ props.wishlist.description || 'No description yet.' }}</p>
      <div class="wishlist-card__meta">
        <span>Visibility: {{ formatWishlistVisibility(props.wishlist.visibility) }}</span>
        <span>Join mode: {{ formatParticipantJoinMode(props.wishlist.participantJoinMode) }}</span>
        <span v-if="props.metaLabel">{{ props.metaLabel }}</span>
      </div>
    </div>

    <div class="wishlist-card__actions">
      <NuxtLink :to="`/wishlists/${props.wishlist.id}`" class="wishlist-card__link">
        {{ props.linkLabel || 'Open wishlist' }}
      </NuxtLink>
    </div>
  </article>
</template>

<style scoped>
.wishlist-card {
  display: flex;
  justify-content: space-between;
  gap: 1.2rem;
  align-items: flex-start;
  border-color: var(--wishlist-theme-secondary);
  background:
    linear-gradient(180deg, var(--wishlist-theme-soft), #fff 52%);
  border-radius: 1.5rem;
  transition: transform 200ms ease, box-shadow 200ms ease, border-color 200ms ease;
}

.wishlist-card:hover {
  transform: translateY(-3px);
  box-shadow: 0 18px 40px rgba(0, 0, 0, 0.08);
}

.wishlist-card__content {
  display: grid;
  gap: 0.7rem;
  flex: 1;
}

.wishlist-card__scenario-chip {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: fit-content;
  padding: 0.45rem 0.85rem;
  border-radius: 999px;
  background: rgba(220, 255, 130, 0.8);
  color: #476235;
  font-size: 0.78rem;
  font-weight: 700;
  letter-spacing: 0.05em;
  text-transform: uppercase;
}

.wishlist-card__title {
  display: flex;
  align-items: center;
  gap: 0.55rem;
  flex-wrap: wrap;
  font-size: 2.35rem;
  line-height: 0.95;
}

.wishlist-card__emoji {
  font-size: 2.2rem;
  line-height: 1;
}

.wishlist-card__meta {
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
  color: var(--muted);
  font-size: 0.88rem;
}

.wishlist-card__meta span {
  display: inline-flex;
  align-items: center;
  min-height: 2rem;
  padding: 0.45rem 0.72rem;
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.8);
  border: 1px solid rgba(218, 218, 218, 0.85);
}

.wishlist-card__actions {
  display: flex;
  align-items: flex-end;
}

.wishlist-card__link {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0.82rem 1.18rem;
  border-radius: 999px;
  background: var(--accent);
  color: #fff;
  text-decoration: none;
  font-weight: 600;
  white-space: nowrap;
  transition: transform 180ms ease, background-color 180ms ease, box-shadow 180ms ease;
}

.wishlist-card__link:hover {
  background: var(--accent-hover);
  transform: translateY(-1px);
  box-shadow: 0 8px 20px rgba(218, 39, 149, 0.22);
}

@media (max-width: 720px) {
  .wishlist-card {
    flex-direction: column;
  }

  .wishlist-card__title {
    font-size: 1.95rem;
  }
}
</style>
