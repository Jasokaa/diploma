<!-- This file defines a gift card with image, price, description, and color-coded priority. -->
<script setup lang="ts">
import type { Gift } from '~/types/gift'

const props = withDefaults(defineProps<{
  gift: Gift
  canManage?: boolean
  reservationMessage?: string
  reservationActionLabel?: string
  canReserve?: boolean
  reserveDisabled?: boolean
  reserveFullyActionLabel?: string
  canReserveFully?: boolean
  reserveFullyDisabled?: boolean
  canCancelReservation?: boolean
  contributionSummary?: {
    targetLabel: string
    collectedLabel: string
    progressPercent: number
    contributorCount: number
    contributions: Array<{
      id: string
      name: string
      username?: string
      amountLabel: string
    }>
    statusNote?: string
  } | null
}>(), {
  canManage: false,
  reservationMessage: '',
  reservationActionLabel: 'Reserve gift',
  canReserve: false,
  reserveDisabled: false,
  reserveFullyActionLabel: 'Reserve fully',
  canReserveFully: false,
  reserveFullyDisabled: false,
  canCancelReservation: false,
  contributionSummary: null
})

defineEmits<{
  edit: [gift: Gift]
  delete: [gift: Gift]
  reserve: [gift: Gift]
  reserveFully: [gift: Gift]
  cancelReservation: [gift: Gift]
}>()

const currencySymbolMap = {
  UAH: '₴',
  USD: '$',
  EUR: '€'
} as const

const priorityLabel = computed(() => {
  if (props.gift.priority === 'high') {
    return 'High priority'
  }

  if (props.gift.priority === 'low') {
    return 'Low priority'
  }

  return 'Medium priority'
})

const formattedPrice = computed(() => {
  if (props.gift.price == null) {
    return 'Price not specified'
  }

  const symbol = currencySymbolMap[props.gift.currency] || '₴'

  return `${props.gift.price} ${symbol}`
})

const contributionProgressStyle = computed(() => {
  const progress = props.contributionSummary?.progressPercent ?? 0
  return {
    width: `${Math.max(0, Math.min(100, progress))}%`
  }
})
</script>

<template>
  <article class="surface-card gift-card">
    <div class="gift-card__media">
      <img
        v-if="gift.imageUrl"
        :src="gift.imageUrl"
        :alt="gift.title"
        class="gift-card__image"
      >
      <div v-else class="gift-card__image gift-card__image--placeholder">
        No photo
      </div>

      <p class="gift-card__price">{{ formattedPrice }}</p>
      <span class="gift-card__priority" :class="`gift-card__priority--${gift.priority}`">
        {{ priorityLabel }}
      </span>
    </div>

    <div class="gift-card__content">
      <div class="gift-card__header">
        <h3 class="gift-card__title">{{ gift.title }}</h3>
      </div>

      <p class="gift-card__description">{{ gift.description || 'No description yet.' }}</p>
      <p v-if="reservationMessage" class="gift-card__reservation">
        {{ reservationMessage }}
      </p>

      <div v-if="contributionSummary" class="gift-card__contributions">
        <div class="gift-card__contributions-header">
          <p><strong>Goal:</strong> {{ contributionSummary.targetLabel }}</p>
          <p><strong>Collected:</strong> {{ contributionSummary.collectedLabel }}</p>
        </div>
        <div class="gift-card__progress">
          <div class="gift-card__progress-bar" :style="contributionProgressStyle" />
        </div>
        <p class="gift-card__contributions-meta">
          {{ contributionSummary.contributorCount }}
          {{ contributionSummary.contributorCount === 1 ? 'contributor' : 'contributors' }}
        </p>
        <p v-if="contributionSummary.statusNote" class="gift-card__contributions-note">
          {{ contributionSummary.statusNote }}
        </p>
        <ul v-if="contributionSummary.contributions.length" class="gift-card__contribution-list">
          <li
            v-for="contribution in contributionSummary.contributions"
            :key="contribution.id"
            class="gift-card__contribution-item"
          >
            <div>
              <strong>{{ contribution.name }}</strong>
              <p v-if="contribution.username">@{{ contribution.username }}</p>
            </div>
            <span>{{ contribution.amountLabel }}</span>
          </li>
        </ul>
      </div>

      <div v-if="canManage" class="gift-card__actions">
        <button type="button" @click="$emit('edit', gift)">
          Edit
        </button>
        <button type="button" class="gift-card__danger" @click="$emit('delete', gift)">
          Delete
        </button>
      </div>

      <div v-else-if="canReserve || canCancelReservation" class="gift-card__actions">
        <button
          v-if="canReserve"
          type="button"
          :disabled="reserveDisabled"
          @click="$emit('reserve', gift)"
        >
          {{ reservationActionLabel }}
        </button>
        <button
          v-if="canReserveFully"
          type="button"
          class="gift-card__secondary"
          :disabled="reserveFullyDisabled"
          @click="$emit('reserveFully', gift)"
        >
          {{ reserveFullyActionLabel }}
        </button>
        <button
          v-if="canCancelReservation"
          type="button"
          class="gift-card__secondary"
          @click="$emit('cancelReservation', gift)"
        >
          Cancel reservation
        </button>
      </div>
    </div>
  </article>
</template>

<style scoped>
.gift-card {
  display: grid;
  gap: 1rem;
  padding: 0.9rem;
  border-radius: 1.3rem;
  transition: transform 200ms ease, box-shadow 200ms ease, border-color 200ms ease;
}

.gift-card:hover {
  transform: translateY(-3px);
  box-shadow: 0 18px 36px rgba(0, 0, 0, 0.08);
}

.gift-card__media {
  position: relative;
  border-radius: 1.15rem;
  overflow: hidden;
}

.gift-card__image {
  width: 100%;
  aspect-ratio: 4 / 3;
  object-fit: cover;
  border-radius: 1.15rem;
  border: 1px solid var(--border);
  background: #f8fafc;
}

.gift-card__image--placeholder {
  display: grid;
  place-items: center;
  color: var(--muted);
  font-size: 0.95rem;
  min-height: 220px;
}

.gift-card__content {
  display: grid;
  gap: 0.72rem;
  padding: 0.15rem 0.25rem 0.25rem;
}

.gift-card__header {
  display: block;
}

.gift-card__title,
.gift-card__description {
  margin: 0;
}

.gift-card__title {
  font-size: 2rem;
  line-height: 0.95;
}

.gift-card__price {
  position: absolute;
  left: 1rem;
  bottom: 0.9rem;
  margin: 0;
  padding: 0.45rem 0.75rem;
  border-radius: 999px;
  background: linear-gradient(180deg, rgba(31, 31, 31, 0.15), rgba(31, 31, 31, 0.68));
  color: #fff;
  font-family: 'Cormorant Garamond', Georgia, serif;
  font-size: 1.8rem;
  font-weight: 600;
  line-height: 1;
}

.gift-card__description {
  color: var(--muted);
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.gift-card__reservation {
  margin: 0;
  color: var(--accent);
  font-size: 0.95rem;
}

.gift-card__contributions {
  display: grid;
  gap: 0.65rem;
  padding: 0.9rem 1rem;
  border: 1px solid #e9efdc;
  border-radius: 1.1rem;
  background: #fcfef5;
}

.gift-card__contributions-header {
  display: flex;
  justify-content: space-between;
  gap: 0.75rem;
  flex-wrap: wrap;
}

.gift-card__contributions-header p,
.gift-card__contributions-meta,
.gift-card__contributions-note,
.gift-card__contribution-item p {
  margin: 0;
}

.gift-card__progress {
  width: 100%;
  height: 0.75rem;
  border-radius: 999px;
  background: #e8f2cb;
  overflow: hidden;
}

.gift-card__progress-bar {
  height: 100%;
  border-radius: inherit;
  background: linear-gradient(90deg, #da2795, #f279be);
}

.gift-card__contributions-meta {
  color: var(--text);
  font-size: 0.95rem;
}

.gift-card__contributions-note {
  color: var(--muted);
  font-size: 0.95rem;
}

.gift-card__contribution-list {
  list-style: none;
  margin: 0;
  padding: 0;
  display: grid;
  gap: 0.55rem;
}

.gift-card__contribution-item {
  display: flex;
  justify-content: space-between;
  gap: 0.75rem;
  align-items: center;
  padding: 0.7rem 0.8rem;
  border-radius: 0.95rem;
  background: #fff;
  border: 1px solid rgba(144, 175, 65, 0.18);
}

.gift-card__contribution-item span {
  font-weight: 700;
  white-space: nowrap;
}

.gift-card__priority {
  position: absolute;
  right: 0.9rem;
  top: 0.9rem;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0.5rem 0.85rem;
  border-radius: 999px;
  font-size: 0.85rem;
  font-weight: 700;
  white-space: nowrap;
  box-shadow: 0 10px 20px rgba(0, 0, 0, 0.08);
}

.gift-card__priority--low {
  background: #e8f7dc;
  color: #4c7a3c;
}

.gift-card__priority--medium {
  background: #fff1c9;
  color: #9a6a05;
}

.gift-card__priority--high {
  background: #ffe0e6;
  color: #a6234d;
}

.gift-card__actions {
  display: flex;
  gap: 0.75rem;
  flex-wrap: wrap;
  margin-top: 0.15rem;
}

.gift-card__actions button {
  padding: 0.75rem 1rem;
}

.gift-card__actions .gift-card__danger {
  background: #fff;
  color: var(--danger);
  border: 1px solid rgba(201, 42, 42, 0.35);
  box-shadow: none;
}

.gift-card__actions .gift-card__secondary {
  background: var(--brand-lime);
  color: var(--text);
  border: 1px solid var(--brand-lime-dark);
  box-shadow: none;
}

.gift-card__actions button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

@media (max-width: 640px) {
  .gift-card__title {
    font-size: 1.75rem;
  }

  .gift-card__contributions-header,
  .gift-card__contribution-item {
    flex-direction: column;
    align-items: flex-start;
  }

  .gift-card__price {
    font-size: 1.55rem;
  }
}
</style>
