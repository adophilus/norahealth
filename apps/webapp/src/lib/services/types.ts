/**
 * Core type definitions for nora-health services
 * =============================================
 *
 * These types define the data structures used throughout the application
 * for posts, channels, integrations, analytics, and user data.
 */

/**
 * Supported social media platforms for crossposting
 *
 * - farcaster: Farcaster social network
 * - baseapp: Base app ecosystem
 * - facebook: Facebook social network
 * - instagram: Instagram social network
 *
 * @type {string}
 */
export type Channel = "farcaster" | "baseapp" | "facebook" | "instagram"

/**
 * Supported platforms for social connections
 *
 * - FARCASTER: Farcaster social network
 * - INSTAGRAM: Instagram social network
 * - FACEBOOK: Facebook social network
 * - BASEAPP: Base app ecosystem
 *
 * @type {string}
 */
/**
 * Supported platforms for social connections
 *
 * - FARCASTER: Farcaster social network
 * - INSTAGRAM: Instagram social network
 * - FACEBOOK: Facebook social network
 * - BASEAPP: Base app ecosystem
 *
 * @type {string}
 */
export type Platform = 'FARCASTER' | 'INSTAGRAM' | 'FACEBOOK' | 'BASEAPP'

/**
 * Generic social media connection/integration
 *
 * Represents a user's connected social media account for crossposting.
 * Used as a base type for platform-specific connection types.
 *
 * @interface SocialConnection
 */
export interface SocialConnection {
  /** Unique identifier for this connection */
  id: string
  /** User ID who owns this connection */
  userId: string
  /** Platform this connection is for */
  platform: Platform
  /** User ID on the platform */
  platformUserId: string
  /** Username on the platform (without @ symbol) */
  platformUsername: string
  /** Whether this connection is active and can be used */
  isActive: boolean
  /** When the connection was established */
  connectedAt: Date
  /** Last time this connection was used for posting */
  lastUsedAt?: Date
}

/**
 * Represents a post that can be published to multiple platforms
 *
 * Posts start as drafts, can be scheduled for later, and are published
 * to one or more platforms. Status is tracked through their lifecycle.
 *
 * @interface Post
 */
export interface Post {
  /** Unique post identifier */
  id: string
  /** Post content/text */
  content: string
  /** Channels/platforms this post should be published to */
  channels: Channel[]
  /** When to publish (null for immediate/draft) */
  scheduledFor: Date | null
  /** Current status in the post lifecycle */
  status: "draft" | "scheduled" | "published" | "failed"
  /** When the post was created */
  createdAt: Date
  /** When the post was actually published (null if not yet published) */
  publishedAt?: Date
}

/**
 * Represents a social media channel integration
 *
 * Stores information about a user's connection to a social platform,
 * including credentials and connection metadata.
 *
 * @interface ChannelIntegration
 */
export interface ChannelIntegration {
  /** Unique integration identifier */
  id: string
  /** Platform/channel being integrated */
  channel: Channel
  /** User who owns this integration */
  userId: string
  /** Display name of the connected account */
  accountName: string
  /** Platform-specific account identifier */
  accountId: string
  /** Whether the integration is currently active */
  isConnected: boolean
  /** When the integration was created/connected */
  connectedAt: Date
  /** Optional: Platform-specific credentials (encrypted) */
  credentials?: Record<string, string>
}

/**
 * Analytics data for a post on a specific channel
 *
 * Tracks engagement metrics for posts published to social platforms.
 * Metrics are aggregated from each platform's API.
 *
 * @interface PostAnalytics
 */
export interface PostAnalytics {
  /** The post these analytics are for */
  postId: string
  /** Platform/channel these metrics are from */
  channel: Channel
  /** Number of people who saw the post */
  impressions: number
  /** Total interactions (likes + comments + shares) */
  engagements: number
  /** Number of likes/reactions */
  likes: number
  /** Number of comments/replies */
  comments: number
  /** Number of shares/reposts */
  shares: number
  /** Number of clicks on links in the post */
  clicks: number
}

/**
 * Represents an nora-health user account
 *
 * Contains basic user information and preferences.
 *
 * @interface User
 */
export interface User {
  /** Unique user identifier */
  id: string
  /** User's email address */
  email: string
  /** User's display name */
  displayName: string
  /** User's timezone for scheduling */
  timezone: string
  /** Whether user wants email notifications */
  emailNotifications: boolean
  /** When the account was created */
  createdAt: Date
}
