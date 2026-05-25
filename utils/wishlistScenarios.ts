import type { WishlistFormInput, WishlistScenarioKey } from '~/types/wishlist'

type WishlistScenarioDefinition = {
  key: Exclude<WishlistScenarioKey, 'custom'>
  label: string
  emoji: string
  description: string
  accent: [string, string]
  settings: Pick<
    WishlistFormInput,
    | 'visibility'
    | 'giftReservation'
    | 'hideReservedGiftsFromAuthor'
    | 'splitGifts'
    | 'randomGiftSelection'
    | 'participantVisibility'
    | 'wishlistCollaboration'
    | 'giftStatusVisibility'
    | 'secretAssignmentMode'
    | 'participantJoinMode'
  >
}

export const wishlistScenarioOptions: WishlistScenarioDefinition[] = [
  {
    key: 'personal',
    label: 'Personal wishlist',
    emoji: '🎂',
    description: 'A classic wishlist for birthdays, New Year, and personal celebrations. People can request access, browse your gifts, and reserve them without overlap.',
    accent: ['#F6F5FF', '#C8B8FF'],
    settings: {
      visibility: 'friends_only',
      giftReservation: 'enabled',
      hideReservedGiftsFromAuthor: true,
      splitGifts: 'disabled',
      randomGiftSelection: 'disabled',
      participantVisibility: 'visible',
      wishlistCollaboration: 'author_only',
      giftStatusVisibility: 'partial',
      secretAssignmentMode: 'disabled',
      participantJoinMode: 'approval_required'
    }
  },
  {
    key: 'group_gift',
    label: 'Group gift',
    emoji: '🤝',
    description: 'Best for weddings, anniversaries, team gifts, or any expensive present people buy together. Participants can coordinate contributions, split the price, and stay in touch by email.',
    accent: ['#E8FBF8', '#7ED4C3'],
    settings: {
      visibility: 'friends_only',
      giftReservation: 'enabled',
      hideReservedGiftsFromAuthor: false,
      splitGifts: 'enabled',
      randomGiftSelection: 'disabled',
      participantVisibility: 'visible',
      wishlistCollaboration: 'collaborative',
      giftStatusVisibility: 'full',
      secretAssignmentMode: 'disabled',
      participantJoinMode: 'approval_required'
    }
  },
  {
    key: 'secret_santa',
    label: 'Secret Santa',
    emoji: '🎅',
    description: 'Made for Secret Santa, Christmas exchanges, and holiday gift circles. You invite participants first, then the author launches the distribution when everyone has joined.',
    accent: ['#FFF1F7', '#F58AB7'],
    settings: {
      visibility: 'friends_only',
      giftReservation: 'enabled',
      hideReservedGiftsFromAuthor: true,
      splitGifts: 'disabled',
      randomGiftSelection: 'disabled',
      participantVisibility: 'visible',
      wishlistCollaboration: 'author_only',
      giftStatusVisibility: 'hidden',
      secretAssignmentMode: 'random_assignment',
      participantJoinMode: 'invite_only'
    }
  }
]

export const customScenarioOption = {
  key: 'custom' as const,
  label: 'Custom',
  emoji: '🛠️',
  description: 'Build your own setup when none of the ready-made scenarios fits. You can mix visibility, collaboration, reservations, and event rules however you need.',
  accent: ['#F3F4F6', '#CBD5E1']
}

const scenarioSettingKeys: Array<keyof WishlistScenarioDefinition['settings']> = [
  'visibility',
  'giftReservation',
  'hideReservedGiftsFromAuthor',
  'splitGifts',
  'randomGiftSelection',
  'participantVisibility',
  'wishlistCollaboration',
  'giftStatusVisibility',
  'secretAssignmentMode',
  'participantJoinMode'
]

export const getWishlistScenarioByKey = (key: WishlistScenarioKey) => {
  if (key === 'custom') {
    return null
  }

  return wishlistScenarioOptions.find((scenario) => scenario.key === key) || null
}

export const detectWishlistScenario = (
  values: Partial<
    Pick<
      WishlistFormInput,
      | 'visibility'
      | 'giftReservation'
      | 'hideReservedGiftsFromAuthor'
      | 'splitGifts'
      | 'randomGiftSelection'
      | 'participantVisibility'
      | 'wishlistCollaboration'
      | 'giftStatusVisibility'
      | 'secretAssignmentMode'
      | 'participantJoinMode'
    >
  >
): WishlistScenarioKey => {
  const secretSantaScenario = wishlistScenarioOptions.find((scenario) => scenario.key === 'secret_santa')

  if (secretSantaScenario) {
    const matchesSecretSanta = scenarioSettingKeys.every((key) => {
      if (key === 'secretAssignmentMode') {
        return values.secretAssignmentMode === 'random_assignment' || values.secretAssignmentMode === 'manual_assignment'
      }

      return secretSantaScenario.settings[key] === values[key]
    })

    if (matchesSecretSanta) {
      return 'secret_santa'
    }
  }

  const matchedScenario = wishlistScenarioOptions.find((scenario) => {
    if (scenario.key === 'secret_santa') {
      return false
    }

    return scenarioSettingKeys.every((key) => scenario.settings[key] === values[key])
  })

  return matchedScenario?.key || 'custom'
}

export const formatWishlistScenario = (key: WishlistScenarioKey) => {
  if (key === 'custom') {
    return customScenarioOption.label
  }

  return getWishlistScenarioByKey(key)?.label || key
}
