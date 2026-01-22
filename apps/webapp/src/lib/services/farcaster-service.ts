/**
 * Farcaster Service - Handle Farcaster connections and publishing via Neynar API
 * @module services/farcaster-service
 */

import { apiClient, APIError } from '../api/client'

// Types

export interface FarcasterConnection {
  id: string
  userId: string
  fid: number
  username: string
  displayName?: string
  pfpUrl?: string
  signerUuid: string
  isActive: boolean
  connectedAt: Date
  lastUsedAt?: Date
}

export interface CreateFarcasterConnectionRequest {  
  signerUuid: string
  fid: number
  username: string
  displayName?: string
  pfpUrl?: string
}

export interface CreateFarcasterConnectionResponse {
  data: FarcasterConnection
}

export interface GetConnectionsResponse {
  data: FarcasterConnection[]
}

export interface DisconnectConnectionResponse {
  success: boolean
  message: string
}

export interface FarcasterCastRequest {
  postId: string
  connectionId: string
  text: string
  embeds?: Array<{ url: string }>
  channelId?: string
  parentCastHash?: string
}

export interface FarcasterCastResponse {
  data: {
    hash: string
    url: string
    timestamp: Date
  }
}

export interface FarcasterScheduledCastRequest {
  postId: string
  connectionId: string
  text: string
  embeds?: Array<{ url: string }>
  channelId?: string
  parentCastHash?: string
  scheduledFor: Date
}

export interface FarcasterScheduledCast {
  id: string
  postId: string
  connectionId: string
  text: string
  embeds?: Array<{ url: string }>
  channelId?: string
  status: 'scheduled' | 'published' | 'failed'
  scheduledFor: Date
  createdAt: Date
  publishedAt?: Date
  error?: string
}

export interface ScheduledCastResponse {
  data: FarcasterScheduledCast
}

export interface ScheduledCastsResponse {
  data: FarcasterScheduledCast[]
}

// API Operations

/**
 * Connect a Farcaster account to nora-health
 */
export async function connectFarcaster(
  request: CreateFarcasterConnectionRequest
): Promise<FarcasterConnection> {
  const response = await apiClient<CreateFarcasterConnectionResponse>(
    '/social-connections/farcaster',
    {
      method: 'POST',
      body: JSON.stringify(request),
    }
  )
  return response.data
}

/**
 * Get all Farcaster connections for the current user
 */
export async function getFarcasterConnections(): Promise<
  FarcasterConnection[]
> {
  const response = await apiClient<GetConnectionsResponse>(
    '/social-connections?platform=FARCASTER',
    {
      method: 'GET',
    }
  )
  return response.data
}

/**
 * Disconnect a Farcaster account from nora-health
 */
export async function disconnectFarcaster(connectionId: string): Promise<void> {
  await apiClient<DisconnectConnectionResponse>(
    `/social-connections/${connectionId}`,
    {
      method: 'DELETE',
    }
  )
}

/**
 * Publish a cast to Farcaster via Neynar API
 *
 * @example
 * const result = await publishFarcasterCast({
 *   postId: 'post_123',
 *   connectionId: 'conn_456',
 *   text: 'Hello Farcaster! 👋',
 *   embeds: [{ url: 'https://example.com/image.png' }],
 *   channelId: 'nora-health'
 * });
 * console.log('Published to:', result.url);
 */
export async function publishFarcasterCast(
  request: FarcasterCastRequest
): Promise<FarcasterCastResponse['data']> {
  const response = await apiClient<FarcasterCastResponse>(
    '/posts/publish/farcaster',
    {
      method: 'POST',
      body: JSON.stringify(request),
    }
  )
  return response.data
}

/**
 * Test if a Farcaster connection is still valid
 */
export async function testFarcasterConnection(
  connectionId: string
): Promise<boolean> {
  try {
    await apiClient<{ valid: boolean }>(
      `/social-connections/${connectionId}/test`,
      {
        method: 'POST',
      }
    )
    return true
  } catch (error) {
    if (error instanceof APIError && error.statusCode === 401) {
      return false
    }
    throw error
  }
}

/**
 * Initialize Farcaster connection using the miniapp SDK
 */
export async function initializeFarcasterConnection(): Promise<
  CreateFarcasterConnectionRequest & { signerUuid: '' }
> {
  try {
    const sdk = await import('@farcaster/miniapp-sdk')
    const context = await sdk.default.context

    if (!context?.user) {
      throw new Error(
        'Failed to get Farcaster context. Are you in the miniapp?'
      )
    }

    const { fid, username, displayName, pfpUrl } = context.user

    if (!username) {
      throw new Error('Farcaster username is required.')
    }

    return {
      fid,
      username,
      displayName,
      pfpUrl,
      signerUuid: '',
    }
  } catch (error) {
    console.error('Failed to initialize Farcaster connection:', error)
    throw new Error(
      'Could not access Farcaster account. Please try again.'
    )
  }
}

/**
 * Format cast text to enforce 320 character limit
 */
export function formatCastText(text: string): string {
  const MAX_LENGTH = 320

  if (text.length > MAX_LENGTH) {
    return text.substring(0, MAX_LENGTH - 3) + '...'
  }

  return text
}

/**
 * Validate Farcaster channel ID format
 */
export function isValidFarcasterChannel(channelId: string): boolean {
  return /^[a-z0-9-]+$/.test(channelId)
}

/**
 * Schedule a cast to be published at a later time
 */
export async function scheduleFarcasterCast(
  request: FarcasterScheduledCastRequest
): Promise<FarcasterScheduledCast> {
  const response = await apiClient<ScheduledCastResponse>(
    '/posts/schedule/farcaster',
    {
      method: 'POST',
      body: JSON.stringify(request),
    }
  )
  return response.data
}

/**
 * Get all scheduled casts for the user
 */
export async function getScheduledFarcasterCasts(): Promise<FarcasterScheduledCast[]> {
  const response = await apiClient<ScheduledCastsResponse>(
    '/posts/scheduled?platform=farcaster',
    {
      method: 'GET',
    }
  )
  return response.data
}

/**
 * Get a specific scheduled cast
 */
export async function getScheduledFarcasterCast(
  castId: string
): Promise<FarcasterScheduledCast> {
  const response = await apiClient<ScheduledCastResponse>(
    `/posts/scheduled/${castId}`,
    {
      method: 'GET',
    }
  )
  return response.data
}

/**
 * Update a scheduled cast (before it's published)
 */
export async function updateScheduledFarcasterCast(
  castId: string,
  request: Partial<Omit<FarcasterScheduledCastRequest, 'connectionId'>>
): Promise<FarcasterScheduledCast> {
  const response = await apiClient<ScheduledCastResponse>(
    `/posts/scheduled/${castId}`,
    {
      method: 'PUT',
      body: JSON.stringify(request),
    }
  )
  return response.data
}

/**
 * Cancel a scheduled cast
 */
export async function cancelScheduledFarcasterCast(
  castId: string
): Promise<void> {
  await apiClient<{ success: boolean }>(
    `/posts/scheduled/${castId}`,
    {
      method: 'DELETE',
    }
  )
}

