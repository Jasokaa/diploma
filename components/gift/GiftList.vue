<!-- This file defines the list wrapper for wishlist gifts. -->
<script setup lang="ts">
import type { Gift } from '~/types/gift'

withDefaults(defineProps<{
  gifts: Gift[]
  canManage?: boolean
  manageableGiftIds?: string[]
  giftStates?: Record<string, {
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
  }>
  emptyMessage?: string
}>(), {
  canManage: false,
  manageableGiftIds: () => [],
  giftStates: () => ({}),
  emptyMessage: 'No gifts have been added yet.'
})

defineEmits<{
  edit: [gift: Gift]
  delete: [gift: Gift]
  reserve: [gift: Gift]
  reserveFully: [gift: Gift]
  cancelReservation: [gift: Gift]
}>()
</script>

<template>
  <section class="gift-list">
    <div v-if="gifts.length" class="gift-list__items">
      <GiftCard
        v-for="gift in gifts"
        :key="gift.id"
        :gift="gift"
        :can-manage="canManage || manageableGiftIds.includes(gift.id)"
        :reservation-message="giftStates[gift.id]?.reservationMessage"
        :reservation-action-label="giftStates[gift.id]?.reservationActionLabel"
        :can-reserve="giftStates[gift.id]?.canReserve"
        :reserve-disabled="giftStates[gift.id]?.reserveDisabled"
        :reserve-fully-action-label="giftStates[gift.id]?.reserveFullyActionLabel"
        :can-reserve-fully="giftStates[gift.id]?.canReserveFully"
        :reserve-fully-disabled="giftStates[gift.id]?.reserveFullyDisabled"
        :can-cancel-reservation="giftStates[gift.id]?.canCancelReservation"
        :contribution-summary="giftStates[gift.id]?.contributionSummary"
        @edit="$emit('edit', $event)"
        @delete="$emit('delete', $event)"
        @reserve="$emit('reserve', $event)"
        @reserve-fully="$emit('reserveFully', $event)"
        @cancel-reservation="$emit('cancelReservation', $event)"
      />
    </div>
    <p v-else>{{ emptyMessage }}</p>
  </section>
</template>

<style scoped>
.gift-list {
  display: grid;
  gap: 1rem;
}

.gift-list__items {
  display: grid;
  gap: 1.2rem;
  grid-template-columns: repeat(3, minmax(0, 1fr));
}

@media (max-width: 1160px) {
  .gift-list__items {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

@media (max-width: 900px) {
  .gift-list__items {
    grid-template-columns: 1fr;
  }
}
</style>
