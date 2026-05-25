// This file defines wishlist-related TypeScript types used for creating, editing, and rendering wishlists.
export type WishlistVisibility = 'private' | 'friends_only' | 'public'
export type WishlistToggleSetting = 'enabled' | 'disabled'
export type ParticipantVisibility = 'visible' | 'hidden'
export type WishlistCollaboration = 'author_only' | 'collaborative'
export type GiftStatusVisibility = 'full' | 'partial' | 'hidden'
export type SecretAssignmentMode = 'disabled' | 'random_assignment' | 'manual_assignment'
export type ParticipantJoinMode = 'open' | 'approval_required' | 'invite_only'
export type WishlistParticipantStatus = 'invited' | 'pending' | 'approved' | 'rejected'
export type WishlistParticipantRole = 'owner' | 'participant' | 'collaborator'
export type WishlistTheme = 'standard' | 'lime_bloom' | 'sage_light' | 'aqua_mint' | 'lavender_mist' | 'rose_glow'
export type WishlistScenarioKey = 'personal' | 'group_gift' | 'secret_santa' | 'custom'

export interface WishlistAssignmentProfile {
  id: string
  full_name: string
  username: string
  avatar_url: string
}

export interface Wishlist {
  id: string
  ownerId: string
  title: string
  description?: string | null
  visibility: WishlistVisibility
  giftReservation: WishlistToggleSetting
  hideReservedGiftsFromAuthor: boolean
  splitGifts: WishlistToggleSetting
  randomGiftSelection: WishlistToggleSetting
  participantVisibility: ParticipantVisibility
  wishlistCollaboration: WishlistCollaboration
  giftStatusVisibility: GiftStatusVisibility
  eventDate?: string | null
  eventTime?: string | null
  eventTimezone?: string | null
  secretAssignmentMode: SecretAssignmentMode
  participantJoinMode: ParticipantJoinMode
  themeKey: WishlistTheme
  createdAt?: string
  updatedAt?: string
}

export interface WishlistParticipant {
  id: string
  wishlistId: string
  userId: string
  status: WishlistParticipantStatus
  role: WishlistParticipantRole
  invitedBy?: string | null
  createdAt?: string
  updatedAt?: string
  profile?: {
    id: string
    full_name: string
    username: string
    avatar_url: string
    email?: string | null
  } | null
}

export interface WishlistAccessRecord {
  participant: WishlistParticipant
  wishlist: Wishlist
}

export interface WishlistAssignment {
  id: string
  wishlistId: string
  giverUserId: string
  recipientUserId: string
  assignmentMode: SecretAssignmentMode
  assignedBy?: string | null
  createdAt?: string
  giverProfile?: WishlistAssignmentProfile | null
  recipientProfile?: WishlistAssignmentProfile | null
}

export interface WishlistFormInput {
  title: string
  description?: string | null
  visibility: WishlistVisibility
  giftReservation: WishlistToggleSetting
  hideReservedGiftsFromAuthor: boolean
  splitGifts: WishlistToggleSetting
  randomGiftSelection: WishlistToggleSetting
  participantVisibility: ParticipantVisibility
  wishlistCollaboration: WishlistCollaboration
  giftStatusVisibility: GiftStatusVisibility
  eventDate?: string | null
  eventTime?: string | null
  eventTimezone?: string | null
  secretAssignmentMode: SecretAssignmentMode
  participantJoinMode: ParticipantJoinMode
  themeKey: WishlistTheme
}

export interface WishlistCollection {
  own: Wishlist[]
  joined: Wishlist[]
  incomingInvitations: WishlistAccessRecord[]
  accessRequests: WishlistAccessRecord[]
  followingPublic: Wishlist[]
}
