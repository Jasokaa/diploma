// This file defines profile-related TypeScript types used for profile records and profile form data.
export interface Profile {
  id: string
  email: string
  full_name: string
  username: string
  birth_date: string
  avatar_url: string
  created_at: string
}

export interface CreateProfileInput {
  id: string
  email: string
  full_name: string
  username: string
  birth_date: string
  avatar_url: string
}

export interface UpdateProfileInput {
  email?: string
  full_name: string
  username: string
  birth_date: string
  avatar_url: string
}
