/**
 * API Client - HTTP client with automatic authentication and error handling
 * @module api/client
 */

const API_BASE_URL =
  import.meta.env.VITE_API_URL || 'http://localhost:8008'

// Debug log
console.log('[API Client] API_BASE_URL:', API_BASE_URL)

/**
 * Custom error class for API failures with status codes and response data
 */
export class APIError extends Error {
  constructor(
    message: string,
    public statusCode: number,
    public data?: unknown
  ) {
    super(message)
    this.name = 'APIError'
  }
}

/**
 * Get access token from localStorage
 */
function getAccessToken(): string | null {
  if (typeof window === 'undefined') return null
  return localStorage.getItem('accessToken')
}

/**
 * Base API client for all HTTP requests with automatic authentication
 * @template T - Response type
 * @param endpoint - API endpoint path
 * @param options - Fetch options (method, body, headers, etc)
 * @returns Parsed JSON response
 * @throws {APIError} On non-2xx responses
 */
export async function apiClient<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const token = getAccessToken()

  const headers = new Headers({
    'Content-Type': 'application/json',
    ...options.headers,
  })

  if (token) {
    headers.set('Authorization', `Bearer ${token}`)
  }

  try {
    const fullUrl = `${API_BASE_URL}${endpoint}`
    console.log('[API Client] Fetching:', fullUrl)
    const response = await fetch(fullUrl, {
      ...options,
      headers,
    })

    if (!response.ok) {
      let errorData: any = {}
      try {
        errorData = await response.json()
      } catch {
        errorData = { message: response.statusText }
      }
      throw new APIError(
        errorData.message || `HTTP ${response.status}: API request failed`,
        response.status,
        errorData
      )
    }

    return response.json()
  } catch (error) {
    if (error instanceof APIError) {
      throw error
    }
    throw new APIError(
      error instanceof Error ? error.message : 'Network error',
      0,
      { originalError: error }
    )
  }
}

// ============================================================================
// Farcaster API Methods
// ============================================================================

import type {
  PostCastRequest,
  PostCastResponse,
  SchedulePostRequest,
  SchedulePostResponse,
  GetScheduledPostsResponse,
  DeleteScheduledPostResponse,
  FarcasterClientIdResponse,
  ScheduledPost,
} from '@/lib/types/farcaster'

/**
 * Post a cast to Farcaster
 * @param content - The text content of the cast
 * @param signerUuid - The signer UUID for authentication
 * @param channelId - Optional channel ID to post to
 * @param embeds - Optional embedded URLs
 * @returns Promise with the cast hash and URL
 */
export async function postToCast(
  content: string,
  signerUuid: string,
  channelId?: string,
  embeds?: Array<{ url: string }>
): Promise<PostCastResponse> {
  const payload: PostCastRequest = {
    content,
    signerUuid,
    channelId,
    embeds,
  }

  return apiClient<PostCastResponse>('/post', {
    method: 'POST',
    body: JSON.stringify(payload),
  })
}

/**
 * Schedule a post to be published at a specific time
 * @param content - The text content of the cast
 * @param scheduledTime - ISO string of when to publish
 * @param signerUuid - The signer UUID for authentication
 * @param channelId - Optional channel ID to post to
 * @param embeds - Optional embedded URLs
 * @returns Promise with the scheduled post data
 */
export async function schedulePost(
  content: string,
  scheduledTime: string,
  signerUuid: string,
  channelId?: string,
  embeds?: Array<{ url: string }>
): Promise<ScheduledPost> {
  const payload: SchedulePostRequest = {
    content,
    scheduledTime,
    signerUuid,
    channelId,
    embeds,
  }

  const response = await apiClient<SchedulePostResponse>('/schedule', {
    method: 'POST',
    body: JSON.stringify(payload),
  })

  return response.data
}

/**
 * Get all scheduled posts for a user
 * @param signerUuid - The signer UUID to filter posts by
 * @returns Promise with array of scheduled posts
 */
export async function getScheduledPosts(
  signerUuid: string
): Promise<ScheduledPost[]> {
  const response = await apiClient<GetScheduledPostsResponse>(
    `/schedule?signerUuid=${encodeURIComponent(signerUuid)}`,
    {
      method: 'GET',
    }
  )

  return response.data
}

/**
 * Delete a scheduled post
 * @param id - The ID of the scheduled post to delete
 * @returns Promise with success message
 */
export async function deleteScheduledPost(
  id: string
): Promise<DeleteScheduledPostResponse> {
  return apiClient<DeleteScheduledPostResponse>(`/schedule/${id}`, {
    method: 'DELETE',
  })
}

/**
 * Get the Farcaster/Neynar client ID for SIWN authentication
 * @returns Promise with the client ID
 */
export async function getFarcasterClientId(): Promise<string> {
  const response = await apiClient<FarcasterClientIdResponse>(
    '/api/auth/farcaster/client-id',
    {
      method: 'GET',
    }
  )

  return response.clientId
}

export { API_BASE_URL }

