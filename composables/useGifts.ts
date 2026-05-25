// This composable handles wishlist gift CRUD using the public.wishlist_gifts table.
import type {
  Gift,
  GiftContribution,
  GiftCurrency,
  GiftFormInput,
  GiftPriority,
  GiftReservation
} from '~/types/gift'

const mapPriorityFromDb = (priority: number | null | undefined): GiftPriority => {
  if (priority === 3) {
    return 'high'
  }

  if (priority === 1) {
    return 'low'
  }

  return 'medium'
}

const mapPriorityToDb = (priority: GiftPriority): number => {
  if (priority === 'high') {
    return 3
  }

  if (priority === 'low') {
    return 1
  }

  return 2
}

const mapCurrencyFromDb = (currency: string | null | undefined): GiftCurrency => {
  if (currency === 'USD' || currency === 'EUR') {
    return currency
  }

  return 'UAH'
}

const mapGift = (gift: Record<string, any>): Gift => ({
  id: gift.id,
  wishlistId: gift.wishlist_id,
  createdBy: gift.created_by,
  title: gift.title,
  description: gift.description,
  imageUrl: gift.image_url,
  price: gift.price,
  currency: mapCurrencyFromDb(gift.currency),
  priority: mapPriorityFromDb(gift.priority),
  createdAt: gift.created_at,
  updatedAt: gift.updated_at
})

const mapReservation = (reservation: Record<string, any>): GiftReservation => ({
  id: reservation.id,
  giftId: reservation.gift_id,
  reservedBy: reservation.reserved_by,
  status: reservation.status,
  isAnonymous: reservation.is_anonymous,
  reservedAt: reservation.reserved_at,
  updatedAt: reservation.updated_at
})

const mapContribution = (contribution: Record<string, any>): GiftContribution => ({
  id: contribution.id,
  giftId: contribution.gift_id,
  contributorId: contribution.contributor_id,
  reservationId: contribution.reservation_id,
  amount: contribution.amount,
  currency: mapCurrencyFromDb(contribution.currency),
  status: contribution.status,
  note: contribution.note,
  contributorProfile: contribution.contributor_profile ? {
    id: contribution.contributor_profile.id,
    fullName: contribution.contributor_profile.full_name,
    username: contribution.contributor_profile.username,
    avatarUrl: contribution.contributor_profile.avatar_url,
    email: contribution.contributor_profile.email
  } : null,
  createdAt: contribution.created_at,
  updatedAt: contribution.updated_at
})

const buildGiftPayload = (payload: GiftFormInput) => ({
  title: payload.title.trim(),
  description: payload.description?.trim() || null,
  image_url: payload.imageUrl?.trim() || null,
  price: payload.price ?? null,
  currency: payload.currency || 'UAH',
  priority: mapPriorityToDb(payload.priority),
  updated_at: new Date().toISOString()
})

export const useGifts = () => {
  const { $supabase } = useNuxtApp()
  const gifts = useState<Gift[]>('gifts', () => [])

  const getGiftReservations = async (giftIds: string[]) => {
    if (!giftIds.length) {
      return {
        data: [] as GiftReservation[],
        error: null
      }
    }

    const response = await $supabase
      .from('gift_reservations')
      .select('*')
      .in('gift_id', giftIds)
      .in('status', ['reserved', 'purchased'])

    return {
      data: (response.data || []).map(mapReservation),
      error: response.error
    }
  }

  const getGiftContributions = async (giftIds: string[]) => {
    if (!giftIds.length) {
      return {
        data: [] as GiftContribution[],
        error: null
      }
    }

    const response = await $supabase
      .from('gift_contributions')
      .select(`
        *,
        contributor_profile:profiles!gift_contributions_contributor_id_fkey (
          id,
          full_name,
          username,
          avatar_url,
          email
        )
      `)
      .in('gift_id', giftIds)
      .in('status', ['pledged', 'paid'])

    return {
      data: (response.data || []).map(mapContribution),
      error: response.error
    }
  }

  const getWishlistGifts = async (wishlistId: string) => {
    const response = await $supabase
      .from('wishlist_gifts')
      .select('*')
      .eq('wishlist_id', wishlistId)
      .eq('is_deleted', false)
      .order('priority', { ascending: false })
      .order('created_at', { ascending: false })

    const mappedGifts = (response.data || []).map(mapGift)

    if (!response.error) {
      gifts.value = mappedGifts
    }

    return {
      data: mappedGifts,
      error: response.error
    }
  }

  const createGift = async (wishlistId: string, userId: string, payload: GiftFormInput) => {
    const response = await $supabase
      .from('wishlist_gifts')
      .insert({
        wishlist_id: wishlistId,
        created_by: userId,
        quantity: 1,
        ...buildGiftPayload(payload)
      })
      .select('*')
      .single()

    return {
      data: response.data ? mapGift(response.data) : null,
      error: response.error
    }
  }

  const updateGift = async (giftId: string, payload: GiftFormInput) => {
    const response = await $supabase
      .from('wishlist_gifts')
      .update(buildGiftPayload(payload))
      .eq('id', giftId)
      .select('*')
      .single()

    return {
      data: response.data ? mapGift(response.data) : null,
      error: response.error
    }
  }

  const deleteGift = async (giftId: string) => {
    const response = await $supabase
      .from('wishlist_gifts')
      .update({
        is_deleted: true,
        updated_at: new Date().toISOString()
      })
      .eq('id', giftId)

    return {
      error: response.error
    }
  }

  const reserveGift = async (giftId: string, userId: string) => {
    const response = await $supabase
      .from('gift_reservations')
      .insert({
        gift_id: giftId,
        reserved_by: userId,
        status: 'reserved',
        is_anonymous: false,
        updated_at: new Date().toISOString()
      })
      .select('*')
      .single()

    return {
      data: response.data ? mapReservation(response.data) : null,
      error: response.error
    }
  }

  const cancelReservation = async (giftId: string, userId: string) => {
    const response = await $supabase
      .from('gift_reservations')
      .delete()
      .eq('gift_id', giftId)
      .eq('reserved_by', userId)

    return {
      error: response.error
    }
  }

  const createContribution = async (
    giftId: string,
    contributorId: string,
    amount: number,
    currency: GiftCurrency,
    note?: string | null
  ) => {
    const response = await $supabase
      .from('gift_contributions')
      .insert({
        gift_id: giftId,
        contributor_id: contributorId,
        amount,
        currency,
        note: note?.trim() || null,
        status: 'pledged',
        updated_at: new Date().toISOString()
      })
      .select('*')
      .single()

    return {
      data: response.data ? mapContribution(response.data) : null,
      error: response.error
    }
  }

  const cancelContribution = async (giftId: string, contributorId: string) => {
    const response = await $supabase
      .from('gift_contributions')
      .delete()
      .eq('gift_id', giftId)
      .eq('contributor_id', contributorId)

    return {
      error: response.error
    }
  }

  const clearSplitStateForWishlist = async (wishlistId: string) => {
    const rpcResponse = await $supabase.rpc('clear_split_state_for_wishlist', {
      target_wishlist_id: wishlistId
    })

    if (!rpcResponse.error) {
      return {
        error: null
      }
    }

    const rpcMissing = rpcResponse.error.message?.toLowerCase().includes('could not find the function')
      || rpcResponse.error.message?.toLowerCase().includes('function public.clear_split_state_for_wishlist')

    if (!rpcMissing) {
      return {
        error: rpcResponse.error
      }
    }

    const giftsResponse = await $supabase
      .from('wishlist_gifts')
      .select('id')
      .eq('wishlist_id', wishlistId)
      .eq('is_deleted', false)

    if (giftsResponse.error) {
      return {
        error: giftsResponse.error
      }
    }

    const giftIds = (giftsResponse.data || []).map((gift) => gift.id as string)

    if (!giftIds.length) {
      return {
        error: null
      }
    }

    const contributionRowsResponse = await $supabase
      .from('gift_contributions')
      .select('gift_id, contributor_id')
      .in('gift_id', giftIds)

    if (contributionRowsResponse.error) {
      return {
        error: contributionRowsResponse.error
      }
    }

    const contributedGiftIds = [...new Set((contributionRowsResponse.data || []).map((row) => row.gift_id as string))]

    if (!contributedGiftIds.length) {
      return {
        error: null
      }
    }

    const reservationsResponse = await $supabase
      .from('gift_reservations')
      .delete()
      .in('gift_id', contributedGiftIds)

    if (reservationsResponse.error) {
      return {
        error: reservationsResponse.error
      }
    }

    const verificationResponse = await $supabase
      .from('gift_reservations')
      .select('id, gift_id')
      .in('gift_id', contributedGiftIds)

    if (verificationResponse.error) {
      return {
        error: verificationResponse.error
      }
    }

    if ((verificationResponse.data || []).length > 0) {
      return {
        error: {
          message: 'Some split reservations could not be removed because the current database policies do not allow deleting other users’ reservations. Add the clear_split_state_for_wishlist RPC helper in Supabase to fix this.'
        }
      }
    }

    const contributionsResponse = await $supabase
      .from('gift_contributions')
      .delete()
      .in('gift_id', contributedGiftIds)

    if (contributionsResponse.error) {
      return {
        error: contributionsResponse.error
      }
    }

    return {
      error: null
    }
  }

  return {
    gifts,
    getWishlistGifts,
    getGiftReservations,
    getGiftContributions,
    createGift,
    updateGift,
    deleteGift,
    reserveGift,
    cancelReservation,
    createContribution,
    cancelContribution,
    clearSplitStateForWishlist
  }
}
