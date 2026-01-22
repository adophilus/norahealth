/**
 * Farcaster Types - Type definitions for Farcaster integration
 * @module lib/types/farcaster
 */

/**
 * Farcaster user profile information
 */
export interface FarcasterUser {
  fid: number
  username: string
  displayName: string
  pfpUrl?: string
  signerUuid?: string
}

/**
 * Farcaster SIWN initiate response data
 */
export interface FarcasterSiwnInitiateResponse {
  approval_url: string
  state: string
}

/**
 * Farcaster SIWN callback response data
 */
export interface FarcasterSiwnCallbackResponse {
  data: {
    access_token: string
  }
}

/**
 * Post cast request payload
 */
export interface FarcasterUser {
  fid: number
  username: string
  displayName: string
  pfpUrl?: string
  signerUuid?: string
}

/**
 * Scheduled post status types
 */
export type ScheduledPostStatus = 'pending' | 'posted' | 'failed'

/**
 * Scheduled post data structure
 */
export interface ScheduledPost {
  id: string
  content: string
  scheduledTime: string
  status: ScheduledPostStatus
  createdAt: string
  signerUuid: string
  channelId?: string
  embeds?: Array<{ url: string }>
}

/**
 * Context type for Farcaster authentication state
 */
export interface FarcasterAuthContext {
  user: FarcasterUser | null
  isLoading: boolean
  isConnected: boolean
  connectFarcaster: () => void
  disconnectFarcaster: () => void
}

/**
 * Farcaster SIWN initiate response data
 */
export interface FarcasterSiwnInitiateResponse {
  approval_url: string
  state: string
}

/**
 * Farcaster SIWN callback response data
 */
export interface FarcasterSiwnCallbackResponse {
  data: {
    access_token: string
  }
}

/**
 * Post cast request payload
 */
export interface PostCastRequest {
  content: string
  signerUuid: string
  channelId?: string
  embeds?: Array<{ url: string }>
}

/**
 * Post cast response from API
 */
export interface PostCastResponse {
  castHash: string
  castUrl: string
}

/**
 * Schedule post request payload
 */
export interface SchedulePostRequest {
  content: string
  scheduledTime: string
  signerUuid: string
  channelId?: string
  embeds?: Array<{ url: string }>
}

/**
 * Schedule post response from API
 */
export interface SchedulePostResponse {
  data: ScheduledPost
}

/**
 * Get scheduled posts response from API
 */
export interface GetScheduledPostsResponse {
  data: ScheduledPost[]
}

/**
 * Delete scheduled post response from API
 */
export interface DeleteScheduledPostResponse {
  message: string
}

/**
 * Farcaster client ID response
 */
export interface FarcasterClientIdResponse {
  clientId: string
}
