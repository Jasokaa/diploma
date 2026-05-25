// This file defines shared API response types.
// It should later include request payload types and error models for server routes.
export interface ApiResponse<T = unknown> {
  success: boolean
  message: string
  data?: T
}
