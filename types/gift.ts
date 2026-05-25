// This file defines gift-related TypeScript types used for gift CRUD and rendering inside wishlists.
export type GiftPriority = 'low' | 'medium' | 'high'
export type GiftCurrency = 'UAH' | 'USD' | 'EUR'
export type GiftReservationStatus = 'reserved' | 'purchased' | 'cancelled'
export type GiftContributionStatus = 'pledged' | 'paid' | 'cancelled'

export interface Gift {
  id: string
  wishlistId: string
  createdBy: string
  title: string
  description?: string | null
  imageUrl?: string | null
  price?: number | null
  currency: GiftCurrency
  priority: GiftPriority
  createdAt?: string
  updatedAt?: string
}

export interface GiftFormInput {
  title: string
  description?: string | null
  imageUrl?: string | null
  price?: number | null
  currency: GiftCurrency
  priority: GiftPriority
}

export interface GiftReservation {
  id: string
  giftId: string
  reservedBy: string
  status: GiftReservationStatus
  isAnonymous: boolean
  reservedAt?: string
  updatedAt?: string
}

export interface GiftContribution {
  id: string
  giftId: string
  contributorId: string
  reservationId?: string | null
  amount: number
  currency: GiftCurrency
  status: GiftContributionStatus
  note?: string | null
  contributorProfile?: {
    id: string
    fullName?: string | null
    username?: string | null
    avatarUrl?: string | null
    email?: string | null
  } | null
  createdAt?: string
  updatedAt?: string
}
