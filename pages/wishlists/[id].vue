<!-- This page lets owners edit a wishlist and lets other users view it, request access, or accept invitations. -->
<script setup lang="ts">
definePageMeta({
  middleware: ['auth']
})

import type { Gift, GiftContribution, GiftFormInput, GiftReservation } from '~/types/gift'
import type { Profile } from '~/types/profile'
import type { Wishlist, WishlistAssignment, WishlistFormInput, WishlistParticipant } from '~/types/wishlist'
import {
  formatGiftReservationSetting,
  formatGiftStatusVisibility,
  formatParticipantJoinMode,
  formatParticipantStatus,
  formatWishlistVisibility,
  splitWishlistTitle
} from '~/utils/helpers'
import { detectWishlistScenario, formatWishlistScenario } from '~/utils/wishlistScenarios'
import { getWishlistThemeStyle } from '~/utils/wishlistThemes'

const route = useRoute()
const router = useRouter()
const statusMessage = ref('')
const wishlistValues = ref<Partial<WishlistFormInput>>({})
const settingsFormKey = ref(0)
const wishlist = ref<Wishlist | null>(null)
const gifts = ref<Gift[]>([])
const reservations = ref<GiftReservation[]>([])
const contributions = ref<GiftContribution[]>([])
const participants = ref<WishlistParticipant[]>([])
const assignments = ref<WishlistAssignment[]>([])
const manualAssignmentSelections = ref<Record<string, string>>({})
const inviteUsername = ref('')
const isLoaded = ref(false)
const currentUserId = ref('')
const currentUserEmail = ref('')
const ownerProfile = ref<Profile | null>(null)
const isOwner = ref(false)
const userParticipation = ref<WishlistParticipant | null>(null)
const giftValues = ref<Partial<GiftFormInput>>({})
const editingGiftId = ref('')
const giftStatusMessage = ref('')
const showSettingsModal = ref(false)
const showGiftModal = ref(false)
const showContributionModal = ref(false)
const showDistributionConfirmModal = ref(false)
const showActionConfirmModal = ref(false)
const showOwnerAssignments = ref(false)
const selectedContributionGift = ref<Gift | null>(null)
const contributionAmount = ref('')
const contributionNote = ref('')
const distributionConfirmMode = ref<'generate' | 'delete'>('generate')
const actionConfirmMode = ref<'deleteWishlist' | 'deleteGift'>('deleteWishlist')
const actionConfirmGiftTitle = ref('')
const pendingDeleteGiftId = ref('')

const currencySymbolMap = {
  UAH: '₴',
  USD: '$',
  EUR: '€'
} as const

const { getUser } = useAuth()
const { getProfileByUsername, getProfilesByIds } = useFriends()
const {
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
} = useGifts()
const {
  getWishlistById,
  getWishlistAssignments,
  getOwnWishlistAssignment,
  createWishlistAssignments,
  deleteWishlistAssignments,
  updateWishlist,
  deleteWishlist,
  getWishlistParticipants,
  getUserParticipation,
  inviteUserToWishlist,
  requestToJoinWishlist,
  acceptInvitation,
  rejectInvitation,
  updateParticipationStatus,
  removeParticipant
} = useWishlists()

const pendingParticipants = computed(() => {
  return participants.value.filter((participant) => participant.status === 'pending')
})

const invitedParticipants = computed(() => {
  return participants.value.filter((participant) => participant.status === 'invited' || participant.status === 'approved')
})

const giftFormHeading = computed(() => {
  return editingGiftId.value ? 'Edit gift' : 'Add a gift'
})

const reservationsByGiftId = computed(() => {
  return reservations.value.reduce<Record<string, GiftReservation[]>>((accumulator, reservation) => {
    if (!accumulator[reservation.giftId]) {
      accumulator[reservation.giftId] = []
    }

    accumulator[reservation.giftId].push(reservation)
    return accumulator
  }, {})
})

const contributionsByGiftId = computed(() => {
  return contributions.value.reduce<Record<string, GiftContribution[]>>((accumulator, contribution) => {
    if (!accumulator[contribution.giftId]) {
      accumulator[contribution.giftId] = []
    }

    accumulator[contribution.giftId].push(contribution)
    return accumulator
  }, {})
})

const isApprovedParticipant = computed(() => {
  return userParticipation.value?.status === 'approved'
})

const approvedParticipants = computed(() => {
  return participants.value.filter((participant) => participant.status === 'approved')
})

const secretSantaParticipants = computed(() => {
  if (!wishlist.value || wishlist.value.secretAssignmentMode === 'disabled') {
    return approvedParticipants.value
  }

  const ownerParticipant = {
    id: `owner-${wishlist.value.ownerId}`,
    userId: wishlist.value.ownerId,
    profile: ownerProfile.value
      ? {
          id: ownerProfile.value.id,
          full_name: ownerProfile.value.full_name,
          username: ownerProfile.value.username,
          avatar_url: ownerProfile.value.avatar_url,
          email: ownerProfile.value.email
        }
      : null
  }

  if (approvedParticipants.value.some((participant) => participant.userId === wishlist.value?.ownerId)) {
    return approvedParticipants.value
  }

  return [ownerParticipant, ...approvedParticipants.value]
})

const distributionActive = computed(() => {
  return assignments.value.length > 0
})

const participantManagementLocked = computed(() => {
  return wishlist.value?.secretAssignmentMode !== 'disabled' && distributionActive.value
})

const canAddGift = computed(() => {
  if (!wishlist.value) {
    return false
  }

  return isOwner.value || (
    isApprovedParticipant.value
    && (
      wishlist.value.wishlistCollaboration === 'collaborative'
      || wishlist.value.secretAssignmentMode !== 'disabled'
    )
  )
})

const canUseReservations = computed(() => {
  if (!wishlist.value) {
    return false
  }

  return !isOwner.value
    && isApprovedParticipant.value
    && wishlist.value.giftReservation === 'enabled'
})

const canViewParticipants = computed(() => {
  if (!wishlist.value) {
    return false
  }

  return isOwner.value || (
    wishlist.value.participantVisibility === 'visible'
    && (wishlist.value.visibility === 'public' || isApprovedParticipant.value)
  )
})

const visibleParticipants = computed(() => {
  return participants.value.filter((participant) => participant.status === 'approved')
})

const contactableVisibleParticipants = computed(() => {
  return visibleParticipants.value.filter((participant) => {
    return participant.profile?.email && participant.profile.email !== currentUserEmail.value
  })
})

const ownerContactableParticipants = computed(() => {
  return participants.value.filter((participant) => {
    return participant.status === 'approved'
      && participant.profile?.email
      && participant.profile.email !== currentUserEmail.value
  })
})

const ownAssignment = computed(() => {
  return assignments.value.find((assignment) => assignment.giverUserId === currentUserId.value) || null
})

const canGenerateRandomAssignments = computed(() => {
  return Boolean(
    isOwner.value
    && wishlist.value
    && wishlist.value.secretAssignmentMode === 'random_assignment'
    && secretSantaParticipants.value.length >= 2
    && !distributionActive.value
  )
})

const canGenerateManualAssignments = computed(() => {
  return Boolean(
    isOwner.value
    && wishlist.value
    && wishlist.value.secretAssignmentMode === 'manual_assignment'
    && secretSantaParticipants.value.length >= 2
    && !distributionActive.value
  )
})

const ownerMailto = computed(() => {
  if (!wishlist.value || !ownerProfile.value?.email || ownerProfile.value.email === currentUserEmail.value) {
    return ''
  }

  return buildParticipantsMailto(wishlist.value.title, [ownerProfile.value.email])
})

const manageableGiftIds = computed(() => {
  if (isOwner.value) {
    return gifts.value.map((gift) => gift.id)
  }

  if (!canAddGift.value) {
    return []
  }

  return gifts.value
    .filter((gift) => gift.createdBy === currentUserId.value)
    .map((gift) => gift.id)
})

const accessActionLabel = computed(() => {
  if (!wishlist.value) {
    return ''
  }

  return wishlist.value.participantJoinMode === 'open' ? 'Join wishlist' : 'Request access'
})

const secretSantaStatusMessage = computed(() => {
  if (!wishlist.value || wishlist.value.secretAssignmentMode === 'disabled') {
    return ''
  }

  if (distributionActive.value) {
    return 'Distribution is active. Participant changes are locked until the author deletes the distribution.'
  }

  if (secretSantaParticipants.value.length < 2) {
    return 'At least two participants are required before generating a Secret Santa distribution.'
  }

  return 'Add and approve all participants first, then generate the Secret Santa distribution.'
})

const wishlistThemeStyle = computed(() => {
  return getWishlistThemeStyle(wishlist.value?.themeKey)
})

const wishlistTitleParts = computed(() => {
  return splitWishlistTitle(wishlist.value?.title || '')
})

const wishlistScenarioLabel = computed(() => {
  if (!wishlist.value) {
    return ''
  }

  return formatWishlistScenario(
    detectWishlistScenario({
      visibility: wishlist.value.visibility,
      giftReservation: wishlist.value.giftReservation,
      hideReservedGiftsFromAuthor: wishlist.value.hideReservedGiftsFromAuthor,
      splitGifts: wishlist.value.splitGifts,
      randomGiftSelection: wishlist.value.randomGiftSelection,
      participantVisibility: wishlist.value.participantVisibility,
      wishlistCollaboration: wishlist.value.wishlistCollaboration,
      giftStatusVisibility: wishlist.value.giftStatusVisibility,
      secretAssignmentMode: wishlist.value.secretAssignmentMode,
      participantJoinMode: wishlist.value.participantJoinMode
    })
  )
})

const wishlistHighlights = computed(() => {
  if (!wishlist.value) {
    return []
  }

  return [
    {
      label: 'Gifts',
      value: gifts.value.length,
      note: 'Ideas currently inside this list'
    },
    {
      label: 'People',
      value: visibleParticipants.value.length + (isOwner.value ? 1 : 0),
      note: 'Confirmed people around this wishlist'
    },
    {
      label: 'Sharing',
      value: formatWishlistVisibility(wishlist.value.visibility),
      note: 'How broadly the list is meant to travel'
    }
  ]
})

const syncWishlistFormValues = () => {
  if (!wishlist.value) {
    wishlistValues.value = {}
    return
  }

  wishlistValues.value = {
    title: wishlist.value.title,
    description: wishlist.value.description,
    visibility: wishlist.value.visibility,
    giftReservation: wishlist.value.giftReservation,
    hideReservedGiftsFromAuthor: wishlist.value.hideReservedGiftsFromAuthor,
    splitGifts: wishlist.value.splitGifts,
    randomGiftSelection: wishlist.value.randomGiftSelection,
    participantVisibility: wishlist.value.participantVisibility,
    wishlistCollaboration: wishlist.value.wishlistCollaboration,
    giftStatusVisibility: wishlist.value.giftStatusVisibility,
    eventDate: wishlist.value.eventDate,
    eventTime: wishlist.value.eventTime,
    eventTimezone: wishlist.value.eventTimezone,
    secretAssignmentMode: wishlist.value.secretAssignmentMode,
    participantJoinMode: wishlist.value.participantJoinMode,
    themeKey: wishlist.value.themeKey
  }
}

const syncManualAssignmentSelections = () => {
  if (distributionActive.value) {
    manualAssignmentSelections.value = assignments.value.reduce<Record<string, string>>((accumulator, assignment) => {
      accumulator[assignment.giverUserId] = assignment.recipientUserId
      return accumulator
    }, {})
    return
  }

  manualAssignmentSelections.value = secretSantaParticipants.value.reduce<Record<string, string>>((accumulator, participant, index) => {
    const otherParticipants = secretSantaParticipants.value.filter((item) => item.userId !== participant.userId)
    const fallbackRecipient = otherParticipants[index % otherParticipants.length]
    accumulator[participant.userId] = fallbackRecipient?.userId || ''
    return accumulator
  }, {})
}

const formatMoney = (amount: number, currency: Gift['currency']) => {
  const formattedAmount = new Intl.NumberFormat('uk-UA', {
    maximumFractionDigits: Number.isInteger(amount) ? 0 : 2,
    minimumFractionDigits: Number.isInteger(amount) ? 0 : 2
  }).format(amount)

  return `${formattedAmount} ${currencySymbolMap[currency]}`
}

const buildContributorMailto = (giftTitle: string, emails: string[]) => {
  const uniqueEmails = [...new Set(emails.filter(Boolean))]

  if (!uniqueEmails.length) {
    return ''
  }

  const subject = encodeURIComponent(`Split gift coordination: ${giftTitle}`)
  const body = encodeURIComponent(
    `Hello,\n\nI am reaching out about the split gift "${giftTitle}". Let's coordinate the contribution details here.\n`
  )

  return `mailto:${uniqueEmails.join(',')}?subject=${subject}&body=${body}`
}

const buildParticipantsMailto = (wishlistTitle: string, emails: string[]) => {
  const uniqueEmails = [...new Set(emails.filter(Boolean))]

  if (!uniqueEmails.length) {
    return ''
  }

  const subject = encodeURIComponent(`Wishlist coordination: ${wishlistTitle}`)
  const body = encodeURIComponent(
    `Hello,\n\nI am reaching out about the wishlist "${wishlistTitle}". Let's coordinate the details here.\n`
  )

  return `mailto:${uniqueEmails.join(',')}?subject=${subject}&body=${body}`
}

const giftStateById = computed(() => {
  if (!wishlist.value) {
    return {}
  }

  return Object.fromEntries(gifts.value.map((gift) => {
    const giftReservations = reservationsByGiftId.value[gift.id] || []
    const splitEnabled = wishlist.value.splitGifts === 'enabled'
    const giftContributions = splitEnabled ? (contributionsByGiftId.value[gift.id] || []) : []
    const contributorIds = new Set(giftContributions.map((contribution) => contribution.contributorId))
    const ownReservation = giftReservations.find((reservation) => reservation.reservedBy === currentUserId.value)
    const ownContribution = splitEnabled
      ? giftContributions.find((contribution) => contribution.contributorId === currentUserId.value)
      : undefined
    const ownFullReservation = splitEnabled
      ? Boolean(ownReservation && !ownContribution)
      : Boolean(ownReservation)
    const fullReservations = splitEnabled
      ? giftReservations.filter((reservation) => !contributorIds.has(reservation.reservedBy))
      : giftReservations
    const otherFullReservation = fullReservations.find((reservation) => reservation.reservedBy !== currentUserId.value)
    const reservedCount = giftReservations.length
    const reservedByOthers = reservedCount > 0 && !ownReservation
    const totalContributionAmount = giftContributions.reduce((sum, contribution) => sum + contribution.amount, 0)
    const isReservationHiddenFromOwner = isOwner.value && wishlist.value?.hideReservedGiftsFromAuthor
    const hasSplitActivity = splitEnabled && giftContributions.length > 0
    let reservationMessage = ''
    let contributionSummary = null as null | {
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
    }

    if (!isReservationHiddenFromOwner) {
      if (ownContribution) {
        reservationMessage = `You pledged ${formatMoney(ownContribution.amount, ownContribution.currency)}.`
      } else if (ownFullReservation && splitEnabled) {
        reservationMessage = 'You reserved this gift fully.'
      } else if (ownReservation) {
        reservationMessage = 'You reserved this gift.'
      } else if (otherFullReservation) {
        reservationMessage = 'This gift is fully reserved.'
      } else if (reservedCount > 0) {
        if (wishlist.value.giftStatusVisibility === 'hidden') {
          reservationMessage = 'Reservation details are hidden for this wishlist.'
        } else if (wishlist.value.giftStatusVisibility === 'partial') {
          reservationMessage = 'This gift is already reserved.'
        } else {
          if (splitEnabled && totalContributionAmount > 0) {
            reservationMessage = `Total pledged so far: ${formatMoney(totalContributionAmount, gift.currency)}.`
          } else {
            reservationMessage = reservedCount === 1
              ? '1 participant already reserved this gift.'
              : `${reservedCount} participants already reserved this gift.`
          }
        }
      }
    }

    if (splitEnabled && !isReservationHiddenFromOwner && !ownFullReservation && !otherFullReservation) {
      const contributorCount = giftContributions.length
      const targetAmount = gift.price ?? 0
      const progressPercent = targetAmount > 0
        ? Math.min(100, Math.round((totalContributionAmount / targetAmount) * 100))
        : 0
      const targetLabel = gift.price != null
        ? formatMoney(gift.price, gift.currency)
        : 'Flexible amount'
      const collectedLabel = formatMoney(totalContributionAmount, gift.currency)

      contributionSummary = {
        targetLabel,
        collectedLabel,
        progressPercent,
        contributorCount,
        contributions: [],
        statusNote: undefined
      }

      if (wishlist.value.giftStatusVisibility === 'full') {
        contributionSummary.contributions = giftContributions.map((contribution) => ({
          id: contribution.id,
          name: contribution.contributorProfile?.fullName
            || contribution.contributorProfile?.username
            || 'Participant',
          username: contribution.contributorProfile?.username || undefined,
          amountLabel: formatMoney(contribution.amount, contribution.currency)
        }))
      } else if (wishlist.value.giftStatusVisibility === 'partial') {
        contributionSummary.statusNote = contributorCount
          ? `${contributorCount} ${contributorCount === 1 ? 'contribution has' : 'contributions have'} already been added.`
          : 'No contributions yet.'
      } else {
        contributionSummary.statusNote = 'Contribution details are hidden for this wishlist.'
      }
    }

    const canReserveContribution = splitEnabled
      ? canUseReservations.value
        && !ownReservation
        && !ownContribution
        && !otherFullReservation
        && gift.createdBy !== currentUserId.value
      : canUseReservations.value
        && !ownReservation
        && gift.createdBy !== currentUserId.value
        && !reservedByOthers

    const canReserveFully = splitEnabled
      && canUseReservations.value
      && !ownReservation
      && !ownContribution
      && !otherFullReservation
      && !hasSplitActivity
      && gift.createdBy !== currentUserId.value

    const reserveDisabled = !canUseReservations.value
      || gift.createdBy === currentUserId.value
      || (!splitEnabled && reservedByOthers)
      || Boolean(otherFullReservation)
    const reserveFullyDisabled = !canReserveFully
    const reservationActionLabel = splitEnabled
      ? 'Contribute to gift'
      : 'Reserve gift'

    return [
      gift.id,
      {
        reservationMessage,
        reservationActionLabel,
        canReserve: canReserveContribution,
        reserveDisabled,
        reserveFullyActionLabel: 'Reserve fully',
        canReserveFully,
        reserveFullyDisabled,
        canCancelReservation: canUseReservations.value && (splitEnabled
          ? (Boolean(ownContribution) || ownFullReservation)
          : Boolean(ownReservation)),
        contributionSummary
      }
    ]
  }))
})

const randomEligibleGifts = computed(() => {
  return gifts.value.filter((gift) => {
    const state = giftStateById.value[gift.id]
    return Boolean(state?.canReserve) && !state?.reserveDisabled
  })
})

const canUseRandomGiftSelection = computed(() => {
  if (!wishlist.value) {
    return false
  }

  return canUseReservations.value
    && wishlist.value.randomGiftSelection === 'enabled'
    && randomEligibleGifts.value.length > 0
})

const splitGiftSummaries = computed(() => {
  if (
    !wishlist.value
    || wishlist.value.splitGifts !== 'enabled'
    || !canViewGifts.value
    || (isOwner.value && wishlist.value.hideReservedGiftsFromAuthor)
  ) {
    return []
  }

  return gifts.value.map((gift) => {
    const giftContributions = contributionsByGiftId.value[gift.id] || []
    const contributorIds = new Set(giftContributions.map((contribution) => contribution.contributorId))
    const giftReservations = reservationsByGiftId.value[gift.id] || []
    const fullReservations = giftReservations.filter((reservation) => !contributorIds.has(reservation.reservedBy))
    const collectedAmount = giftContributions.reduce((sum, contribution) => sum + contribution.amount, 0)
    const targetAmount = gift.price ?? 0
    const progressPercent = targetAmount > 0
      ? Math.min(100, Math.round((collectedAmount / targetAmount) * 100))
      : 0
    const canRevealContributors = wishlist.value.giftStatusVisibility === 'full'
    const contributorEntries = canRevealContributors
      ? giftContributions.map((contribution) => ({
          id: contribution.id,
          name: contribution.contributorProfile?.fullName
            || contribution.contributorProfile?.username
            || 'Participant',
          username: contribution.contributorProfile?.username || '',
          email: contribution.contributorProfile?.email || '',
          amountLabel: formatMoney(contribution.amount, contribution.currency),
          href: contribution.contributorProfile?.email
            ? buildContributorMailto(gift.title, [contribution.contributorProfile.email])
            : ''
        }))
      : []
    const contributorEmails = canRevealContributors
      ? contributorEntries
          .map((entry) => entry.email)
          .filter((email) => email && email !== currentUserEmail.value)
      : []
    const contactHref = canRevealContributors
      ? buildContributorMailto(gift.title, contributorEmails)
      : ''
    const statusNote = wishlist.value.giftStatusVisibility === 'partial'
      ? 'Contributor identities are hidden for this wishlist.'
      : wishlist.value.giftStatusVisibility === 'hidden'
        ? 'Contribution details are hidden for this wishlist.'
        : ''

    return {
      id: gift.id,
      title: gift.title,
      targetLabel: gift.price != null ? formatMoney(gift.price, gift.currency) : 'Flexible amount',
      collectedLabel: formatMoney(collectedAmount, gift.currency),
      progressPercent,
      contributorCount: contributorEntries.length,
      contributors: contributorEntries,
      contactHref,
      statusNote,
      visibleContributorCount: giftContributions.length,
      hasFullReservation: fullReservations.length > 0
    }
  }).filter((summary) => summary.visibleContributorCount > 0 && !summary.hasFullReservation)
})

const giftSectionDescription = computed(() => {
  if (isOwner.value) {
    return 'Add gifts to your wishlist and mark their priority.'
  }

  if (!wishlist.value) {
    return 'Browse the gifts in this wishlist.'
  }

  if (isApprovedParticipant.value && wishlist.value.wishlistCollaboration === 'collaborative') {
    return 'You are a participant in this wishlist and can add your own gifts.'
  }

  return 'Browse the gifts in this wishlist.'
})

const visibleParticipantsMailto = computed(() => {
  if (!wishlist.value) {
    return ''
  }

  return buildParticipantsMailto(
    wishlist.value.title,
    contactableVisibleParticipants.value.map((participant) => participant.profile?.email || '')
  )
})

const ownerParticipantsMailto = computed(() => {
  if (!wishlist.value) {
    return ''
  }

  return buildParticipantsMailto(
    wishlist.value.title,
    ownerContactableParticipants.value.map((participant) => participant.profile?.email || '')
  )
})

const canViewGifts = computed(() => {
  if (!wishlist.value) {
    return false
  }

  return isOwner.value
    || wishlist.value.visibility === 'public'
    || isApprovedParticipant.value
})

const giftEmptyMessage = computed(() => {
  if (isOwner.value) {
    return 'No gifts yet. Use the button above to add the first one.'
  }

  if (!canViewGifts.value) {
    if (userParticipation.value?.status === 'pending') {
      return 'You do not have access to this wishlist yet. Gifts will appear after the owner approves your request.'
    }

    if (userParticipation.value?.status === 'invited') {
      return 'You do not have access to this wishlist yet. Accept the invitation to see the gifts.'
    }

    if (userParticipation.value?.status === 'rejected') {
      return 'You do not have access to this wishlist right now. The owner previously rejected your request.'
    }

    return 'You do not have access to this wishlist yet. Join it or request access to see the gifts.'
  }

  return 'No gifts have been added yet.'
})

const loadGiftData = async (wishlistId: string) => {
  const giftsResponse = await getWishlistGifts(wishlistId)

  if (giftsResponse.error) {
    return {
      error: giftsResponse.error
    }
  }

  gifts.value = giftsResponse.data

  const [reservationsResponse, contributionsResponse] = await Promise.all([
    getGiftReservations(gifts.value.map((gift) => gift.id)),
    getGiftContributions(gifts.value.map((gift) => gift.id))
  ])

  if (!reservationsResponse.error) {
    reservations.value = reservationsResponse.data
  }

  if (!contributionsResponse.error) {
    contributions.value = contributionsResponse.data
  }

  return {
    error: reservationsResponse.error || contributionsResponse.error || null
  }
}

const loadWishlistPage = async () => {
  statusMessage.value = ''
  giftStatusMessage.value = ''
  isLoaded.value = false

  const user = await getUser()

  if (!user) {
    await router.push('/login')
    return
  }

  currentUserId.value = user.id
  currentUserEmail.value = user.email || ''

  const { data, error } = await getWishlistById(String(route.params.id))

  if (error || !data) {
    statusMessage.value = error ? `Failed to load wishlist: ${error.message}` : 'Failed to load wishlist.'
    return
  }

  wishlist.value = data
  isOwner.value = data.ownerId === user.id
  ownerProfile.value = null
  syncWishlistFormValues()

  const participationResponse = await getUserParticipation(data.id, user.id)

  if (!participationResponse.error) {
    userParticipation.value = participationResponse.data
  }

  const ownerProfileResponse = await getProfilesByIds([data.ownerId])

  if (!ownerProfileResponse.error) {
    ownerProfile.value = ownerProfileResponse.data[0] || null
  }

  if (
    isOwner.value
    || (
      data.participantVisibility === 'visible'
      && (data.visibility === 'public' || participationResponse.data?.status === 'approved')
    )
  ) {
    const participantsResponse = await getWishlistParticipants(data.id)

    if (!participantsResponse.error) {
      participants.value = participantsResponse.data
    } else {
      statusMessage.value = `Wishlist loaded, but participants could not be loaded: ${participantsResponse.error.message}`
    }
  }

  syncManualAssignmentSelections()

  const giftDataResponse = await loadGiftData(data.id)

  if (giftDataResponse.error && !statusMessage.value) {
    statusMessage.value = `Wishlist loaded, but some gift data could not be loaded: ${giftDataResponse.error.message}`
  }

  if (data.secretAssignmentMode !== 'disabled') {
    const assignmentsResponse = isOwner.value
      ? await getWishlistAssignments(data.id)
      : await getOwnWishlistAssignment(data.id, user.id)

    if (!assignmentsResponse.error) {
      assignments.value = assignmentsResponse.data
        ? Array.isArray(assignmentsResponse.data)
          ? assignmentsResponse.data
          : [assignmentsResponse.data]
        : []
    } else if (!statusMessage.value) {
      statusMessage.value = `Wishlist loaded, but assignments could not be loaded: ${assignmentsResponse.error.message}`
    }
  }

  syncManualAssignmentSelections()

  isLoaded.value = true
}

const handleSubmit = async (payload: WishlistFormInput) => {
  statusMessage.value = ''

  if (!payload.title.trim()) {
    statusMessage.value = 'Wishlist title is required'
    return
  }

  const wasSplitEnabled = wishlist.value?.splitGifts === 'enabled'
  const willDisableSplit = wasSplitEnabled && payload.splitGifts === 'disabled'

  if (willDisableSplit && wishlist.value) {
    const cleanupResponse = await clearSplitStateForWishlist(wishlist.value.id)

    if (cleanupResponse.error) {
      console.error('Split reservation cleanup failed:', cleanupResponse.error)
      statusMessage.value = `Split mode could not be turned off because shared contributions and related reservations were not fully removed: ${cleanupResponse.error.message}`
      return
    }
  }

  const { error, data } = await updateWishlist(String(route.params.id), payload)

  if (error || !data) {
    console.error('Wishlist update failed:', error)
    statusMessage.value = error
      ? `Failed to update wishlist: ${error.message}`
      : 'Failed to update wishlist.'
    return
  }

  wishlist.value = data
  syncWishlistFormValues()

  if (willDisableSplit) {
    await loadGiftData(data.id)
    statusMessage.value = 'Wishlist updated successfully. Split contributions and related reservations were cleared.'
  } else {
    statusMessage.value = 'Wishlist updated successfully.'
  }

  settingsFormKey.value += 1
  showSettingsModal.value = false
}

const handleDeleteWishlist = async () => {
  if (!wishlist.value) {
    return
  }

  actionConfirmMode.value = 'deleteWishlist'
  showActionConfirmModal.value = true
}

const confirmDeleteWishlist = async () => {
  if (!wishlist.value) {
    return
  }

  const { error } = await deleteWishlist(wishlist.value.id)

  if (error) {
    console.error('Wishlist deletion failed:', error)
    statusMessage.value = `Failed to delete wishlist: ${error.message}`
    return
  }

  showActionConfirmModal.value = false
  await router.push('/wishlists')
}

const handleInviteUser = async () => {
  statusMessage.value = ''

  if (!wishlist.value) {
    return
  }

  if (participantManagementLocked.value) {
    statusMessage.value = 'Participant changes are locked while Secret Santa distribution is active.'
    return
  }

  if (!inviteUsername.value.trim()) {
    statusMessage.value = 'Enter a username to invite.'
    return
  }

  const profileResponse = await getProfileByUsername(inviteUsername.value.trim().toLowerCase())

  if (profileResponse.error || !profileResponse.data) {
    statusMessage.value = 'User not found for invitation.'
    return
  }

  if (profileResponse.data.id === currentUserId.value) {
    statusMessage.value = 'You cannot invite yourself to your own wishlist.'
    return
  }

  const { error } = await inviteUserToWishlist(wishlist.value.id, profileResponse.data.id, currentUserId.value)

  if (error) {
    console.error('Wishlist invite failed:', error)
    statusMessage.value = `Failed to invite user: ${error.message}`
    return
  }

  inviteUsername.value = ''
  statusMessage.value = 'Invitation saved successfully.'
  await loadWishlistPage()
}

const handleParticipantStatus = async (participantId: string, status: 'approved' | 'rejected') => {
  statusMessage.value = ''

  if (participantManagementLocked.value) {
    statusMessage.value = 'Participant changes are locked while Secret Santa distribution is active.'
    return
  }

  const { error } = await updateParticipationStatus(participantId, status)

  if (error) {
    console.error('Participant update failed:', error)
    statusMessage.value = `Failed to update participant: ${error.message}`
    return
  }

  await loadWishlistPage()
}

const handleRemoveParticipant = async (participantId: string) => {
  statusMessage.value = ''

  if (participantManagementLocked.value) {
    statusMessage.value = 'Participant changes are locked while Secret Santa distribution is active.'
    return
  }

  const { error } = await removeParticipant(participantId)

  if (error) {
    console.error('Participant removal failed:', error)
    statusMessage.value = `Failed to remove participant: ${error.message}`
    return
  }

  await loadWishlistPage()
}

const handleJoinWishlist = async () => {
  if (!wishlist.value) {
    return
  }

  statusMessage.value = ''

  if (participantManagementLocked.value) {
    statusMessage.value = 'This wishlist is not accepting participant changes while Secret Santa distribution is active.'
    return
  }

  const response = await requestToJoinWishlist(wishlist.value, currentUserId.value)

  if (response.error) {
    statusMessage.value = `Failed to join wishlist: ${response.error.message}`
    return
  }

  userParticipation.value = response.data
  await loadWishlistPage()
  statusMessage.value = response.data?.status === 'approved'
    ? 'You joined this wishlist successfully.'
    : 'Your join request has been sent to the wishlist owner.'
}

const handleAcceptInvitation = async () => {
  if (!userParticipation.value || !wishlist.value) {
    return
  }

  const { error, data } = await acceptInvitation(wishlist.value.id, currentUserId.value)

  if (error) {
    statusMessage.value = `Failed to accept invitation: ${error.message}`
    return
  }

  userParticipation.value = data
  await loadWishlistPage()
  statusMessage.value = 'Invitation accepted successfully.'
}

const handleRejectInvitation = async () => {
  if (!wishlist.value) {
    return
  }

  const { error, data } = await rejectInvitation(wishlist.value.id, currentUserId.value)

  if (error) {
    statusMessage.value = `Failed to reject invitation: ${error.message}`
    return
  }

  userParticipation.value = data
  await loadWishlistPage()
  statusMessage.value = 'Invitation rejected.'
}

const buildRandomAssignments = () => {
  const participantIds = secretSantaParticipants.value.map((participant) => participant.userId)
  const shuffled = [...participantIds]

  for (let index = shuffled.length - 1; index > 0; index -= 1) {
    const randomIndex = Math.floor(Math.random() * (index + 1))
    const current = shuffled[index]
    shuffled[index] = shuffled[randomIndex]
    shuffled[randomIndex] = current
  }

  return shuffled.map((giverUserId, index) => ({
    giverUserId,
    recipientUserId: shuffled[(index + 1) % shuffled.length]
  }))
}

const handleGenerateSecretSanta = async () => {
  if (!wishlist.value || !isOwner.value) {
    return
  }

  if (secretSantaParticipants.value.length < 2) {
    statusMessage.value = 'At least two participants are required before generating a Secret Santa distribution.'
    return
  }

  distributionConfirmMode.value = 'generate'
  showDistributionConfirmModal.value = true
}

const confirmGenerateSecretSanta = async () => {
  if (!wishlist.value || !isOwner.value) {
    return
  }

  let nextAssignments: Array<{ giverUserId: string, recipientUserId: string }> = []

  if (wishlist.value.secretAssignmentMode === 'manual_assignment') {
    const selectedRecipientIds = secretSantaParticipants.value.map((participant) => {
      return manualAssignmentSelections.value[participant.userId] || ''
    })

    const hasMissingSelections = selectedRecipientIds.some((recipientId) => !recipientId)

    if (hasMissingSelections) {
      statusMessage.value = 'Please choose a recipient for every participant.'
      return
    }

    const hasSelfAssignment = secretSantaParticipants.value.some((participant) => {
      return manualAssignmentSelections.value[participant.userId] === participant.userId
    })

    if (hasSelfAssignment) {
      statusMessage.value = 'A participant cannot be assigned to themselves.'
      return
    }

    const uniqueRecipientIds = new Set(selectedRecipientIds)

    if (uniqueRecipientIds.size !== secretSantaParticipants.value.length) {
      statusMessage.value = 'Each recipient must be assigned exactly once.'
      return
    }

    nextAssignments = secretSantaParticipants.value.map((participant) => ({
      giverUserId: participant.userId,
      recipientUserId: manualAssignmentSelections.value[participant.userId]
    }))
  } else {
    nextAssignments = buildRandomAssignments()
  }

  const { data, error } = await createWishlistAssignments(
    wishlist.value.id,
    nextAssignments,
    wishlist.value.secretAssignmentMode,
    currentUserId.value
  )

  if (error) {
    statusMessage.value = `Failed to generate Secret Santa distribution: ${error.message}`
    return
  }

  assignments.value = data
  showOwnerAssignments.value = false
  syncManualAssignmentSelections()
  statusMessage.value = 'Secret Santa distribution generated successfully.'
  showDistributionConfirmModal.value = false
}

const handleDeleteSecretSantaDistribution = async () => {
  if (!wishlist.value || !isOwner.value || !distributionActive.value) {
    return
  }

  distributionConfirmMode.value = 'delete'
  showDistributionConfirmModal.value = true
}

const confirmDeleteSecretSantaDistribution = async () => {
  if (!wishlist.value || !isOwner.value || !distributionActive.value) {
    return
  }

  const { error } = await deleteWishlistAssignments(wishlist.value.id)

  if (error) {
    statusMessage.value = `Failed to delete Secret Santa distribution: ${error.message}`
    return
  }

  assignments.value = []
  showOwnerAssignments.value = false
  syncManualAssignmentSelections()
  statusMessage.value = 'Secret Santa distribution deleted. Participant management is unlocked again.'
  showDistributionConfirmModal.value = false
}

const distributionConfirmTitle = computed(() => {
  return distributionConfirmMode.value === 'generate'
    ? 'Generate Secret Santa distribution'
    : 'Delete Secret Santa distribution'
})

const distributionConfirmDescription = computed(() => {
  return distributionConfirmMode.value === 'generate'
    ? 'Please confirm that all participants have joined. After the distribution is generated, participant changes will be locked until you delete the distribution.'
    : 'Delete the current Secret Santa distribution and unlock participant management?'
})

const actionConfirmTitle = computed(() => {
  return actionConfirmMode.value === 'deleteWishlist'
    ? 'Delete this wishlist?'
    : `Delete “${actionConfirmGiftTitle.value}”?`
})

const actionConfirmDescription = computed(() => {
  return actionConfirmMode.value === 'deleteWishlist'
    ? 'This will permanently remove the wishlist, its gifts, participant history, and related reservations.'
    : 'This will permanently remove the gift together with any related reservation or split-contribution data.'
})

const resetGiftForm = () => {
  editingGiftId.value = ''
  giftValues.value = {}
  showGiftModal.value = false
}

const handleGiftSubmit = async (payload: GiftFormInput) => {
  giftStatusMessage.value = ''

  if (!wishlist.value) {
    return
  }

  if (!payload.title.trim()) {
    giftStatusMessage.value = 'Gift name is required.'
    return
  }

  const response = editingGiftId.value
    ? await updateGift(editingGiftId.value, payload)
    : await createGift(wishlist.value.id, currentUserId.value, payload)

  if (response.error) {
    console.error('Gift save failed:', response.error)
    giftStatusMessage.value = editingGiftId.value
      ? `Failed to update gift: ${response.error.message}`
      : `Failed to create gift: ${response.error.message}`
    return
  }

  giftStatusMessage.value = editingGiftId.value
    ? 'Gift updated successfully.'
    : 'Gift created successfully.'

  editingGiftId.value = ''
  giftValues.value = {}
  showGiftModal.value = false
  await loadGiftData(wishlist.value.id)
}

const handleGiftEdit = (gift: Gift) => {
  editingGiftId.value = gift.id
  giftValues.value = {
    title: gift.title,
    description: gift.description,
    imageUrl: gift.imageUrl,
    price: gift.price,
    currency: gift.currency,
    priority: gift.priority
  }
  giftStatusMessage.value = ''
  showGiftModal.value = true
}

const handleGiftDelete = async (gift: Gift) => {
  if (!wishlist.value) {
    return
  }

  pendingDeleteGiftId.value = gift.id
  actionConfirmGiftTitle.value = gift.title
  actionConfirmMode.value = 'deleteGift'
  showActionConfirmModal.value = true
}

const confirmDeleteGift = async () => {
  if (!wishlist.value || !pendingDeleteGiftId.value) {
    return
  }

  const { error } = await deleteGift(pendingDeleteGiftId.value)

  if (error) {
    console.error('Gift deletion failed:', error)
    giftStatusMessage.value = `Failed to delete gift: ${error.message}`
    return
  }

  if (editingGiftId.value === pendingDeleteGiftId.value) {
    resetGiftForm()
  }

  pendingDeleteGiftId.value = ''
  actionConfirmGiftTitle.value = ''
  showActionConfirmModal.value = false
  giftStatusMessage.value = 'Gift deleted successfully.'
  await loadGiftData(wishlist.value.id)
}

const handleReserveGift = async (gift: Gift) => {
  if (!canUseReservations.value) {
    return
  }

  if (!wishlist.value) {
    return
  }

  if (gift.createdBy === currentUserId.value) {
    giftStatusMessage.value = 'You cannot reserve your own gift.'
    return
  }

  if (wishlist.value.splitGifts === 'enabled') {
    selectedContributionGift.value = gift
    contributionAmount.value = gift.price ? String(gift.price) : ''
    contributionNote.value = ''
    giftStatusMessage.value = ''
    showContributionModal.value = true
    return
  }

  const response = await reserveGift(gift.id, currentUserId.value)

  if (response.error) {
    giftStatusMessage.value = `Failed to reserve gift: ${response.error.message}`
    return
  }

  await loadGiftData(wishlist.value.id)

  giftStatusMessage.value = 'Gift reserved successfully.'
}

const handleReserveGiftFully = async (gift: Gift) => {
  if (!canUseReservations.value || !wishlist.value) {
    return
  }

  if (gift.createdBy === currentUserId.value) {
    giftStatusMessage.value = 'You cannot reserve your own gift.'
    return
  }

  const response = await reserveGift(gift.id, currentUserId.value)

  if (response.error) {
    giftStatusMessage.value = `Failed to reserve gift fully: ${response.error.message}`
    return
  }

  await loadGiftData(wishlist.value.id)
  giftStatusMessage.value = 'Gift reserved fully.'
}

const handleCancelGiftReservation = async (gift: Gift) => {
  if (!wishlist.value) {
    return
  }

  const ownContribution = (contributionsByGiftId.value[gift.id] || []).find((contribution) => {
    return contribution.contributorId === currentUserId.value
  })

  if (wishlist.value.splitGifts === 'enabled' && ownContribution) {
    const contributionResponse = await cancelContribution(gift.id, currentUserId.value)

    if (contributionResponse.error) {
      giftStatusMessage.value = `Failed to cancel contribution: ${contributionResponse.error.message}`
      return
    }
  }

  const response = await cancelReservation(gift.id, currentUserId.value)

  if (response.error) {
    giftStatusMessage.value = `Failed to cancel reservation: ${response.error.message}`
    return
  }

  await loadGiftData(wishlist.value.id)
  giftStatusMessage.value = 'Reservation cancelled successfully.'
}

const handleContributionSubmit = async () => {
  if (!wishlist.value || !selectedContributionGift.value) {
    return
  }

  if (selectedContributionGift.value.createdBy === currentUserId.value) {
    giftStatusMessage.value = 'You cannot contribute to your own gift.'
    return
  }

  const parsedAmount = Number(String(contributionAmount.value).trim())

  if (!Number.isFinite(parsedAmount) || parsedAmount <= 0) {
    giftStatusMessage.value = 'Please enter a valid contribution amount.'
    return
  }

  const existingReservation = reservationsByGiftId.value[selectedContributionGift.value.id]?.find((reservation) => {
    return reservation.reservedBy === currentUserId.value
  })

  if (!existingReservation) {
    const reservationResponse = await reserveGift(selectedContributionGift.value.id, currentUserId.value)

    if (reservationResponse.error) {
      giftStatusMessage.value = `Failed to reserve contribution slot: ${reservationResponse.error.message}`
      return
    }
  }

  const contributionResponse = await createContribution(
    selectedContributionGift.value.id,
    currentUserId.value,
    parsedAmount,
    selectedContributionGift.value.currency,
    contributionNote.value
  )

  if (contributionResponse.error) {
    giftStatusMessage.value = `Failed to save contribution: ${contributionResponse.error.message}`
    return
  }

  showContributionModal.value = false
  selectedContributionGift.value = null
  contributionAmount.value = ''
  contributionNote.value = ''
  await loadGiftData(wishlist.value.id)
  giftStatusMessage.value = 'Contribution saved successfully.'
}

const handleRandomGiftSelection = async () => {
  if (!wishlist.value || !randomEligibleGifts.value.length) {
    return
  }

  const selectedGift = randomEligibleGifts.value[Math.floor(Math.random() * randomEligibleGifts.value.length)]
  await handleReserveGift(selectedGift)
}

const participationMessage = computed(() => {
  if (!userParticipation.value) {
    return ''
  }

  if (userParticipation.value.status === 'approved') {
    return 'You already have access to this wishlist.'
  }

  if (userParticipation.value.status === 'invited') {
    return 'You were invited to this wishlist.'
  }

  if (userParticipation.value.status === 'pending') {
    return 'Your access request is waiting for approval.'
  }

  if (userParticipation.value.status === 'rejected') {
    return 'Your previous request was rejected.'
  }

  return ''
})

const openGiftModal = () => {
  editingGiftId.value = ''
  giftValues.value = {}
  giftStatusMessage.value = ''
  showGiftModal.value = true
}

const openSettingsModal = () => {
  syncWishlistFormValues()
  settingsFormKey.value += 1
  showSettingsModal.value = true
}

onMounted(loadWishlistPage)
watch(() => route.params.id, () => {
  loadWishlistPage()
})
</script>

<template>
  <section class="page-section wishlist-details-page" :style="wishlistThemeStyle">
    <div v-if="wishlist" class="surface-card wishlist-details-page__themed-card wishlist-details-page__hero-card">
      <div class="wishlist-details-page__hero">
        <div>
          <h1>Wishlist details</h1>
          <p class="wishlist-details-page__hero-title">
            <span
              v-if="wishlistTitleParts.cover"
              class="wishlist-details-page__hero-emoji"
            >
              {{ wishlistTitleParts.cover }}
            </span>
            <span>{{ wishlistTitleParts.text || wishlist.title }}</span>
          </p>
          <p v-if="ownerProfile" class="wishlist-details-page__owner-note">
            Owned by
            <strong>{{ ownerProfile.full_name || ownerProfile.username }}</strong>
            <span v-if="ownerProfile.username"> · @{{ ownerProfile.username }}</span>
          </p>
          <p>{{ wishlist.description || 'No description yet.' }}</p>
        </div>
        <div class="wishlist-details-page__header-actions">
          <a
            v-if="!isOwner && ownerMailto"
            :href="ownerMailto"
            class="wishlist-details-page__secondary-button wishlist-details-page__mail-link"
          >
            Email wishlist owner
          </a>
          <button
            v-if="isOwner"
            type="button"
            class="wishlist-details-page__primary-button"
            @click="openSettingsModal"
          >
            Edit wishlist
          </button>
        </div>
      </div>

      <div class="wishlist-details-page__meta-grid">
        <p><strong>Scenario:</strong> {{ wishlistScenarioLabel }}</p>
        <p><strong>Visibility:</strong> {{ formatWishlistVisibility(wishlist.visibility) }}</p>
        <p><strong>Join mode:</strong> {{ formatParticipantJoinMode(wishlist.participantJoinMode) }}</p>
        <p><strong>Gift reservation:</strong> {{ formatGiftReservationSetting(wishlist.giftReservation) }}</p>
        <p><strong>Gift status visibility:</strong> {{ formatGiftStatusVisibility(wishlist.giftStatusVisibility) }}</p>
        <p v-if="wishlist.eventDate"><strong>Event date:</strong> {{ wishlist.eventDate }}</p>
        <p v-if="wishlist.eventTime"><strong>Event time:</strong> {{ wishlist.eventTime }}</p>
        <p v-if="wishlist.eventTimezone"><strong>Timezone:</strong> {{ wishlist.eventTimezone }}</p>
      </div>

      <div class="wishlist-details-page__highlight-grid">
        <article
          v-for="item in wishlistHighlights"
          :key="item.label"
          class="wishlist-details-page__highlight-card"
        >
          <strong>{{ item.value }}</strong>
          <span>{{ item.label }}</span>
          <p>{{ item.note }}</p>
        </article>
      </div>
    </div>

    <div v-if="wishlist" class="surface-card wishlist-details-page__section wishlist-details-page__themed-card">
      <div class="wishlist-details-page__section-header">
        <div>
          <h2>Gifts</h2>
          <p>{{ giftSectionDescription }}</p>
        </div>
        <div class="wishlist-details-page__header-actions">
          <button
            v-if="canUseRandomGiftSelection"
            type="button"
            class="wishlist-details-page__secondary-button"
            @click="handleRandomGiftSelection"
          >
            Pick a gift for me
          </button>
          <button
            v-if="canAddGift"
            type="button"
            class="wishlist-details-page__primary-button"
            @click="openGiftModal"
          >
            Add gift
          </button>
        </div>
      </div>

      <GiftList
        :gifts="gifts"
        :can-manage="isOwner"
        :manageable-gift-ids="manageableGiftIds"
        :gift-states="giftStateById"
        :empty-message="giftEmptyMessage"
        @edit="handleGiftEdit"
        @delete="handleGiftDelete"
        @reserve="handleReserveGift"
        @reserve-fully="handleReserveGiftFully"
        @cancel-reservation="handleCancelGiftReservation"
      />

      <p v-if="giftStatusMessage" class="wishlist-details-page__gift-status">
        {{ giftStatusMessage }}
      </p>
    </div>

    <div
      v-if="wishlist && wishlist.splitGifts === 'enabled' && canViewGifts && splitGiftSummaries.length"
      class="surface-card wishlist-details-page__section wishlist-details-page__themed-card"
    >
      <div class="wishlist-details-page__section-header">
        <div>
          <h2>Split gift contributions</h2>
          <p>Track progress for shared gifts and coordinate contributions by email.</p>
        </div>
      </div>

      <div class="wishlist-details-page__split-summary-list">
        <article
          v-for="summary in splitGiftSummaries"
          :key="summary.id"
          class="wishlist-details-page__split-summary-card"
        >
          <div class="wishlist-details-page__split-summary-header">
            <div>
              <h3>{{ summary.title }}</h3>
              <p>
                <strong>Collected:</strong> {{ summary.collectedLabel }}
                <span> of {{ summary.targetLabel }}</span>
              </p>
            </div>
            <a
              v-if="summary.contactHref"
              :href="summary.contactHref"
              class="wishlist-details-page__primary-button wishlist-details-page__mail-link"
            >
              Email contributors
            </a>
          </div>

          <div class="wishlist-details-page__split-progress">
            <div
              class="wishlist-details-page__split-progress-bar"
              :style="{ width: `${summary.progressPercent}%` }"
            />
          </div>

          <p class="wishlist-details-page__split-meta">
            {{ summary.visibleContributorCount }}
            {{ summary.visibleContributorCount === 1 ? 'contributor' : 'contributors' }}
          </p>

          <p v-if="summary.statusNote" class="wishlist-details-page__split-note">
            {{ summary.statusNote }}
          </p>

          <div v-if="summary.contributors.length" class="wishlist-details-page__split-contributors">
            <article
              v-for="contributor in summary.contributors"
              :key="contributor.id"
              class="wishlist-details-page__split-contributor"
            >
              <div>
                <strong>{{ contributor.name }}</strong>
                <p v-if="contributor.username">@{{ contributor.username }}</p>
                <p>{{ contributor.amountLabel }}</p>
              </div>
              <a
                v-if="contributor.href"
                :href="contributor.href"
                class="wishlist-details-page__secondary-button wishlist-details-page__mail-link"
              >
                Email
              </a>
            </article>
          </div>
        </article>
      </div>
    </div>

    <div
      v-if="wishlist && !isOwner && canViewParticipants"
      class="surface-card wishlist-details-page__section wishlist-details-page__themed-card"
    >
      <div class="wishlist-details-page__section-header">
        <div>
          <h2>Participants</h2>
          <p>See who is already taking part in this wishlist.</p>
        </div>
        <a
          v-if="visibleParticipantsMailto"
          :href="visibleParticipantsMailto"
          class="wishlist-details-page__secondary-button wishlist-details-page__mail-link"
        >
          Email participants
        </a>
      </div>
      <div v-if="visibleParticipants.length" class="wishlist-details-page__participant-list">
        <article
          v-for="participant in visibleParticipants"
          :key="participant.id"
          class="wishlist-details-page__participant-card"
        >
          <div>
            <strong>{{ participant.profile?.full_name || 'User' }}</strong>
            <p>@{{ participant.profile?.username || 'unknown' }}</p>
          </div>
          <a
            v-if="participant.profile?.email && participant.profile.email !== currentUserEmail"
            :href="buildParticipantsMailto(wishlist.title, [participant.profile.email])"
            class="wishlist-details-page__secondary-button wishlist-details-page__mail-link"
          >
            Email
          </a>
        </article>
      </div>
      <p v-else>
        No approved participants are visible yet.
      </p>
    </div>

    <div
      v-if="wishlist && wishlist.secretAssignmentMode !== 'disabled'"
      class="surface-card wishlist-details-page__section"
    >
      <div class="wishlist-details-page__section-header">
        <div>
          <h2>Secret assignment</h2>
          <p><strong>Scenario:</strong> {{ wishlistScenarioLabel }}</p>
          <p>{{ secretSantaStatusMessage }}</p>
        </div>
        <div
          v-if="isOwner"
          class="wishlist-details-page__participant-actions"
        >
          <button
            v-if="canGenerateRandomAssignments || canGenerateManualAssignments"
            type="button"
            class="wishlist-details-page__primary-button"
            @click="handleGenerateSecretSanta"
          >
            Generate distribution
          </button>
          <button
            v-if="distributionActive"
            type="button"
            class="wishlist-details-page__secondary-button"
            @click="handleDeleteSecretSantaDistribution"
          >
            Delete distribution
          </button>
          <button
            v-if="distributionActive"
            type="button"
            class="wishlist-details-page__secondary-button"
            @click="showOwnerAssignments = !showOwnerAssignments"
          >
            {{ showOwnerAssignments ? 'Hide distribution' : 'Show distribution' }}
          </button>
        </div>
      </div>

      <div
        v-if="isOwner && wishlist.secretAssignmentMode === 'manual_assignment' && !distributionActive && secretSantaParticipants.length"
        class="wishlist-details-page__manual-assignment-grid"
      >
        <article
          v-for="participant in secretSantaParticipants"
          :key="participant.id"
          class="wishlist-details-page__manual-assignment-card"
        >
          <div>
            <strong>{{ participant.profile?.full_name || 'Participant' }}</strong>
            <p>@{{ participant.profile?.username || 'unknown' }}</p>
          </div>

          <label class="wishlist-details-page__manual-assignment-field">
            <span>Recipient</span>
            <select v-model="manualAssignmentSelections[participant.userId]">
              <option value="" disabled>Select recipient</option>
              <option
                v-for="recipient in secretSantaParticipants.filter((item) => item.userId !== participant.userId)"
                :key="recipient.id"
                :value="recipient.userId"
              >
                {{ recipient.profile?.full_name || 'Participant' }} (@{{ recipient.profile?.username || 'unknown' }})
              </option>
            </select>
          </label>
        </article>
      </div>

      <template v-if="isOwner">
        <div v-if="ownAssignment" class="wishlist-details-page__participant-card">
          <div>
            <strong>Your recipient:</strong>
            <p>{{ ownAssignment.recipientProfile?.full_name || 'Hidden recipient' }}</p>
            <p>@{{ ownAssignment.recipientProfile?.username || 'unknown' }}</p>
          </div>
          <NuxtLink
            v-if="ownAssignment.recipientProfile?.username"
            :to="`/friends/${ownAssignment.recipientProfile.username}`"
            class="wishlist-details-page__secondary-button"
          >
            View profile
          </NuxtLink>
        </div>

        <div v-if="assignments.length && showOwnerAssignments" class="wishlist-details-page__participant-list">
          <article
            v-for="assignment in assignments"
            :key="assignment.id"
            class="wishlist-details-page__participant-card"
          >
            <div>
              <strong>{{ assignment.giverProfile?.full_name || 'Participant' }}</strong>
              <p>@{{ assignment.giverProfile?.username || 'unknown' }}</p>
            </div>
            <div>
              <strong>{{ assignment.recipientProfile?.full_name || 'Recipient' }}</strong>
              <p>@{{ assignment.recipientProfile?.username || 'unknown' }}</p>
            </div>
          </article>
        </div>
        <p v-else-if="assignments.length && !showOwnerAssignments">
          Distribution is ready. Use “Show distribution” to review the pairs.
        </p>
        <p v-else>
          No secret assignments have been created yet.
        </p>
      </template>

      <template v-else-if="isApprovedParticipant">
        <div v-if="ownAssignment" class="wishlist-details-page__participant-card">
          <div>
            <strong>Your recipient:</strong>
            <p>{{ ownAssignment.recipientProfile?.full_name || 'Hidden recipient' }}</p>
            <p>@{{ ownAssignment.recipientProfile?.username || 'unknown' }}</p>
          </div>
          <NuxtLink
            v-if="ownAssignment.recipientProfile?.username"
            :to="`/friends/${ownAssignment.recipientProfile.username}`"
            class="wishlist-details-page__secondary-button"
          >
            View recipient profile
          </NuxtLink>
        </div>
        <p v-else>
          Your recipient has not been assigned yet.
        </p>
      </template>
    </div>

    <div v-if="wishlist && isOwner" class="surface-card wishlist-details-page__section">
      <h2>Invite users</h2>
      <p>Invite a user by username. The invitation will be stored in the wishlist participants table.</p>
      <p v-if="participantManagementLocked" class="wishlist-details-page__split-note">
        Participant management is locked while Secret Santa distribution is active.
      </p>
      <div class="wishlist-details-page__invite-row">
        <input
          v-model="inviteUsername"
          type="text"
          placeholder="Enter username"
          :disabled="participantManagementLocked"
        >
        <button type="button" :disabled="participantManagementLocked" @click="handleInviteUser">
          Invite user
        </button>
      </div>
    </div>

    <div v-if="wishlist && isOwner" class="surface-card wishlist-details-page__section">
      <h2>Pending join requests</h2>
      <p v-if="participantManagementLocked" class="wishlist-details-page__split-note">
        Pending requests cannot be changed while Secret Santa distribution is active.
      </p>
      <div v-if="pendingParticipants.length" class="wishlist-details-page__participant-list">
        <article
          v-for="participant in pendingParticipants"
          :key="participant.id"
          class="wishlist-details-page__participant-card"
        >
          <div>
            <strong>{{ participant.profile?.full_name || 'User' }}</strong>
            <p>@{{ participant.profile?.username || 'unknown' }}</p>
          </div>
          <div class="wishlist-details-page__participant-actions">
            <button type="button" :disabled="participantManagementLocked" @click="handleParticipantStatus(participant.id, 'approved')">
              Approve
            </button>
            <button type="button" :disabled="participantManagementLocked" @click="handleParticipantStatus(participant.id, 'rejected')">
              Reject
            </button>
          </div>
        </article>
      </div>
      <p v-else>
        No pending join requests yet.
      </p>
    </div>

    <div v-if="wishlist && isOwner" class="surface-card wishlist-details-page__section">
      <div class="wishlist-details-page__section-header">
        <div>
          <h2>Invited and approved participants</h2>
          <p>Manage who already has access and contact approved participants if needed.</p>
          <p v-if="participantManagementLocked" class="wishlist-details-page__split-note">
            Participant changes are locked while Secret Santa distribution is active.
          </p>
        </div>
        <a
          v-if="ownerParticipantsMailto"
          :href="ownerParticipantsMailto"
          class="wishlist-details-page__secondary-button wishlist-details-page__mail-link"
        >
          Email approved participants
        </a>
      </div>
      <div v-if="invitedParticipants.length" class="wishlist-details-page__participant-list">
        <article
          v-for="participant in invitedParticipants"
          :key="participant.id"
          class="wishlist-details-page__participant-card"
        >
          <div>
            <strong>{{ participant.profile?.full_name || 'User' }}</strong>
            <p>@{{ participant.profile?.username || 'unknown' }}</p>
            <p>Status: {{ formatParticipantStatus(participant.status) }}</p>
          </div>
          <div class="wishlist-details-page__participant-actions">
            <a
              v-if="participant.status === 'approved' && participant.profile?.email && participant.profile.email !== currentUserEmail"
              :href="buildParticipantsMailto(wishlist.title, [participant.profile.email])"
              class="wishlist-details-page__secondary-button wishlist-details-page__mail-link"
            >
              Email
            </a>
            <button type="button" :disabled="participantManagementLocked" @click="handleRemoveParticipant(participant.id)">
              Remove
            </button>
          </div>
        </article>
      </div>
      <p v-else>
        No invitations or approved participants yet.
      </p>
    </div>

    <div v-if="wishlist && !isOwner" class="surface-card wishlist-details-page__section">
      <h2>Access</h2>
      <p v-if="participationMessage">{{ participationMessage }}</p>
      <p v-if="participantManagementLocked" class="wishlist-details-page__split-note">
        This wishlist is not accepting participant changes while Secret Santa distribution is active.
      </p>
      <button
        v-if="userParticipation?.status === 'invited'"
        type="button"
        @click="handleAcceptInvitation"
      >
        Accept invitation
      </button>
      <button
        v-if="userParticipation?.status === 'invited'"
        type="button"
        @click="handleRejectInvitation"
      >
        Reject invitation
      </button>
      <button
        v-if="!userParticipation || userParticipation.status === 'rejected'"
        type="button"
        :disabled="participantManagementLocked"
        @click="handleJoinWishlist"
      >
        {{ accessActionLabel }}
      </button>
    </div>

    <div v-if="isOwner" class="surface-card wishlist-details-page__section">
      <button type="button" class="wishlist-details-page__danger" @click="handleDeleteWishlist">
        Delete wishlist
      </button>
    </div>

    <div v-if="!isLoaded && !statusMessage" class="surface-card">
      <p>Loading wishlist settings...</p>
    </div>

    <div v-if="showSettingsModal" class="wishlist-details-page__modal-backdrop">
      <div class="surface-card wishlist-details-page__modal">
        <div class="wishlist-details-page__modal-header">
          <div>
            <h2>Edit wishlist</h2>
            <p>Update the settings for this wishlist.</p>
          </div>
          <button type="button" class="wishlist-details-page__modal-close" @click="showSettingsModal = false">
            Close
          </button>
        </div>

        <WishlistForm
          :key="settingsFormKey"
          v-if="isLoaded && isOwner"
          :initial-values="wishlistValues"
          submit-label="Save wishlist changes"
          @submit="handleSubmit"
        />
      </div>
    </div>

    <div v-if="showGiftModal" class="wishlist-details-page__modal-backdrop">
      <div class="surface-card wishlist-details-page__modal">
        <div class="wishlist-details-page__modal-header">
          <div>
            <h2>{{ giftFormHeading }}</h2>
            <p>Add a new gift or update an existing one.</p>
          </div>
          <button type="button" class="wishlist-details-page__modal-close" @click="resetGiftForm">
            Close
          </button>
        </div>

        <GiftForm
          :initial-values="giftValues"
          :submit-label="editingGiftId ? 'Save gift changes' : 'Add gift'"
          :error-message="giftStatusMessage"
          @save="handleGiftSubmit"
          @cancel="resetGiftForm"
        />
      </div>
    </div>

    <div v-if="showContributionModal" class="wishlist-details-page__modal-backdrop">
      <div class="surface-card wishlist-details-page__modal">
        <div class="wishlist-details-page__modal-header">
          <div>
            <h2>Contribute to gift</h2>
            <p>
              {{ selectedContributionGift?.title || 'Selected gift' }}
            </p>
          </div>
          <button type="button" class="wishlist-details-page__modal-close" @click="showContributionModal = false">
            Close
          </button>
        </div>

        <label class="wishlist-details-page__modal-field">
          <span>Contribution amount</span>
          <input
            v-model="contributionAmount"
            type="number"
            min="0"
            step="0.01"
            placeholder="500"
          >
        </label>

        <label class="wishlist-details-page__modal-field">
          <span>Note</span>
          <textarea
            v-model="contributionNote"
            rows="3"
            placeholder="Optional note for this contribution"
          />
        </label>

        <div class="wishlist-details-page__modal-actions">
          <button type="button" class="wishlist-details-page__primary-button" @click="handleContributionSubmit">
            Save contribution
          </button>
          <button type="button" class="wishlist-details-page__secondary-button" @click="showContributionModal = false">
            Cancel
          </button>
        </div>
      </div>
    </div>

    <div v-if="showDistributionConfirmModal" class="wishlist-details-page__modal-backdrop">
      <div class="surface-card wishlist-details-page__confirm-modal">
        <div class="wishlist-details-page__modal-header">
          <div>
            <h3>{{ distributionConfirmTitle }}</h3>
            <p>{{ distributionConfirmDescription }}</p>
          </div>
          <button type="button" class="wishlist-details-page__modal-close" @click="showDistributionConfirmModal = false">
            Close
          </button>
        </div>

        <div class="wishlist-details-page__confirm-actions">
          <button type="button" class="wishlist-details-page__secondary-button" @click="showDistributionConfirmModal = false">
            Cancel
          </button>
          <button
            type="button"
            class="wishlist-details-page__primary-button"
            @click="distributionConfirmMode === 'generate' ? confirmGenerateSecretSanta() : confirmDeleteSecretSantaDistribution()"
          >
            {{ distributionConfirmMode === 'generate' ? 'Confirm distribution' : 'Delete distribution' }}
          </button>
        </div>
      </div>
    </div>

    <div v-if="showActionConfirmModal" class="wishlist-details-page__modal-backdrop">
      <div class="surface-card wishlist-details-page__confirm-modal">
        <div class="wishlist-details-page__modal-header">
          <div>
            <h3>{{ actionConfirmTitle }}</h3>
            <p>{{ actionConfirmDescription }}</p>
          </div>
          <button type="button" class="wishlist-details-page__modal-close" @click="showActionConfirmModal = false">
            Close
          </button>
        </div>

        <div class="wishlist-details-page__confirm-actions">
          <button type="button" class="wishlist-details-page__secondary-button" @click="showActionConfirmModal = false">
            Cancel
          </button>
          <button
            type="button"
            class="wishlist-details-page__danger-button"
            @click="actionConfirmMode === 'deleteWishlist' ? confirmDeleteWishlist() : confirmDeleteGift()"
          >
            {{ actionConfirmMode === 'deleteWishlist' ? 'Delete wishlist' : 'Delete gift' }}
          </button>
        </div>
      </div>
    </div>

    <p v-if="statusMessage">
      {{ statusMessage }}
    </p>

    <div class="surface-card">
      <NuxtLink to="/wishlists" class="wishlist-details-page__button-link">
        Back to wishlists
      </NuxtLink>
    </div>
  </section>
</template>

<style scoped>
.wishlist-details-page {
  display: grid;
  gap: 1rem;
}

.wishlist-details-page__section {
  display: grid;
  gap: 1rem;
}

.wishlist-details-page__themed-card {
  border-color: var(--wishlist-theme-secondary);
  background:
    linear-gradient(180deg, var(--wishlist-theme-soft), #fff 36%);
}

.wishlist-details-page__hero-card {
  overflow: hidden;
}

.wishlist-details-page__hero {
  display: flex;
  justify-content: space-between;
  gap: 1rem;
  align-items: flex-start;
}

.wishlist-details-page__hero-title {
  display: flex;
  align-items: center;
  gap: 0.7rem;
  flex-wrap: wrap;
  font-size: 1.15rem;
  font-weight: 700;
  margin: 0.35rem 0;
  color: var(--wishlist-theme-secondary);
}

.wishlist-details-page__owner-note {
  margin: 0.1rem 0 0;
  color: var(--muted);
  font-size: 0.94rem;
}

.wishlist-details-page__owner-note strong {
  color: var(--text);
}

.wishlist-details-page__hero-emoji {
  font-size: 2.2rem;
  line-height: 1;
}

.wishlist-details-page__meta-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 0.75rem 1rem;
}

.wishlist-details-page__highlight-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
  gap: 0.8rem;
  margin-top: 1rem;
}

.wishlist-details-page__highlight-card {
  display: grid;
  gap: 0.18rem;
  padding: 0.95rem 1rem;
  border-radius: 1.35rem;
  border: 1px solid rgba(218, 218, 218, 0.88);
  background: rgba(255, 255, 255, 0.88);
}

.wishlist-details-page__highlight-card strong {
  font-size: 1.15rem;
  color: var(--wishlist-theme-secondary);
}

.wishlist-details-page__highlight-card span {
  font-size: 0.85rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  color: var(--accent);
}

.wishlist-details-page__highlight-card p {
  margin: 0;
  color: var(--muted);
  font-size: 0.86rem;
}

.wishlist-details-page__section-header p {
  margin: 0.35rem 0 0;
  color: #475569;
}

.wishlist-details-page__section-header {
  display: flex;
  justify-content: space-between;
  gap: 1rem;
  align-items: flex-start;
}

.wishlist-details-page__header-actions {
  display: flex;
  gap: 0.75rem;
  flex-wrap: wrap;
  justify-content: flex-end;
}

.wishlist-details-page__invite-row {
  display: flex;
  gap: 0.75rem;
}

.wishlist-details-page__invite-row input {
  flex: 1;
  padding: 0.75rem 0.9rem;
  border: 1px solid var(--border);
  border-radius: 0.75rem;
}

.wishlist-details-page__participant-list {
  display: grid;
  gap: 0.75rem;
}

.wishlist-details-page__participant-card {
  display: flex;
  justify-content: space-between;
  gap: 1rem;
  padding: 1rem;
  border: 1px solid var(--border);
  border-radius: 0.75rem;
}

.wishlist-details-page__participant-actions {
  display: flex;
  gap: 0.5rem;
  align-items: center;
  flex-wrap: wrap;
}

.wishlist-details-page__manual-assignment-grid {
  display: grid;
  gap: 0.75rem;
}

.wishlist-details-page__manual-assignment-card {
  display: grid;
  gap: 0.75rem;
  padding: 1rem;
  border: 1px solid var(--border);
  border-radius: 0.85rem;
  background: #f8fafc;
}

.wishlist-details-page__manual-assignment-card p {
  margin: 0.25rem 0 0;
  color: #64748b;
}

.wishlist-details-page__manual-assignment-field {
  display: grid;
  gap: 0.35rem;
}

.wishlist-details-page__manual-assignment-field select {
  padding: 0.75rem 0.9rem;
  border: 1px solid var(--border);
  border-radius: 0.75rem;
  background: #fff;
}

.wishlist-details-page__split-summary-list {
  display: grid;
  gap: 1rem;
}

.wishlist-details-page__split-summary-card {
  display: grid;
  gap: 0.85rem;
  padding: 1rem;
  border: 1px solid var(--border);
  border-radius: 1rem;
  background: #fbfdff;
}

.wishlist-details-page__split-summary-header {
  display: flex;
  justify-content: space-between;
  gap: 1rem;
  align-items: flex-start;
}

.wishlist-details-page__split-summary-header h3,
.wishlist-details-page__split-summary-header p,
.wishlist-details-page__split-meta,
.wishlist-details-page__split-contributor p {
  margin: 0;
}

.wishlist-details-page__split-progress {
  width: 100%;
  height: 0.8rem;
  border-radius: 999px;
  overflow: hidden;
  background: rgba(220, 255, 130, 0.45);
}

.wishlist-details-page__split-progress-bar {
  height: 100%;
  border-radius: inherit;
  background: linear-gradient(90deg, #da2795, #c91f86);
}

.wishlist-details-page__split-meta {
  color: #5f6c58;
}

.wishlist-details-page__split-note {
  margin: 0;
  color: #5f6c58;
}

.wishlist-details-page__split-contributors {
  display: grid;
  gap: 0.65rem;
}

.wishlist-details-page__split-contributor {
  display: flex;
  justify-content: space-between;
  gap: 1rem;
  align-items: center;
  padding-top: 0.65rem;
  border-top: 1px solid rgba(220, 255, 130, 0.55);
}

.wishlist-details-page__gift-status {
  margin: 0;
  color: #8c2264;
}

.wishlist-details-page__danger {
  width: 100%;
  padding: 0.9rem 1rem;
  border: none;
  border-radius: 0.85rem;
  background: #991b1b;
  color: white;
  cursor: pointer;
}

.wishlist-details-page__button-link {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0.75rem 1rem;
  border-radius: 999px;
  background: #eef2f7;
  color: #1f1f1f;
  text-decoration: none;
  font-weight: 600;
}

.wishlist-details-page__danger-button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0.75rem 1rem;
  border-radius: 999px;
  border: 1px solid rgba(201, 42, 42, 0.35);
  background: rgba(201, 42, 42, 0.08);
  color: #c92a2a;
  cursor: pointer;
  font-weight: 600;
}

.wishlist-details-page__gift-form {
  display: grid;
  gap: 1rem;
}

.wishlist-details-page__primary-button,
.wishlist-details-page__secondary-button,
.wishlist-details-page__modal-close {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0.75rem 1rem;
  border: none;
  border-radius: 0.75rem;
  cursor: pointer;
  font-weight: 600;
}

.wishlist-details-page__primary-button:disabled,
.wishlist-details-page__secondary-button:disabled,
.wishlist-details-page button:disabled {
  cursor: not-allowed;
  opacity: 0.55;
}

.wishlist-details-page__primary-button {
  background: var(--wishlist-theme-secondary);
  color: white;
}

.wishlist-details-page__secondary-button,
.wishlist-details-page__modal-close {
  background: #e2e8f0;
  color: #0f172a;
}

.wishlist-details-page__mail-link {
  text-decoration: none;
}

.wishlist-details-page__modal-backdrop {
  position: fixed;
  inset: 0;
  display: grid;
  place-items: center;
  padding: 1rem;
  background: rgb(15 23 42 / 35%);
  z-index: 30;
}

.wishlist-details-page__modal {
  width: min(100%, 860px);
  max-height: calc(100vh - 2rem);
  overflow-y: auto;
  display: grid;
  gap: 1rem;
}

.wishlist-details-page__confirm-modal {
  width: min(100%, 36rem);
  display: grid;
  gap: 1rem;
  border-radius: 2rem;
}

.wishlist-details-page__modal-field {
  display: grid;
  gap: 0.4rem;
}

.wishlist-details-page__modal-field input,
.wishlist-details-page__modal-field textarea {
  width: 100%;
  padding: 0.75rem 0.9rem;
  border: 1px solid var(--border);
  border-radius: 0.75rem;
}

.wishlist-details-page__modal-actions {
  display: flex;
  gap: 0.75rem;
  flex-wrap: wrap;
}

.wishlist-details-page__confirm-actions {
  display: flex;
  justify-content: flex-end;
  gap: 0.75rem;
  flex-wrap: wrap;
}

.wishlist-details-page__modal-header {
  display: flex;
  justify-content: space-between;
  gap: 1rem;
  align-items: flex-start;
}

@media (max-width: 720px) {
  .wishlist-details-page__hero,
  .wishlist-details-page__section-header,
  .wishlist-details-page__modal-header,
  .wishlist-details-page__split-summary-header,
  .wishlist-details-page__split-contributor {
    flex-direction: column;
  }

  .wishlist-details-page__header-actions {
    justify-content: flex-start;
  }
}
</style>
