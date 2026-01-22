/**
 * nora-health Service Layer
 * ========================
 *
 * Central export file for all service modules. This layer provides abstraction
 * between the UI components and backend API calls.
 *
 * Services included:
 * - Post Service: Create, read, update, delete, and publish posts
 * - Integration Service: Manage social media account connections
 * - Farcaster Service: Farcaster-specific operations via Neynar API
 * - Analytics Service: Retrieve and aggregate performance metrics
 * - Auth Service: Handle authentication flows
 * - User Service: Handle account settings and preferences
 *
 * @module services
 */

// Core types used across services
export * from "./types"

// Authentication service
export * from "./auth"

// Post management service
export * from "./post-service"

// Social media integration service
export * from "./integration-service"

// Farcaster-specific service (Neynar integration)
export * from "./farcaster-service"

// Analytics service
export * from "./analytics-service"
export * from "./user-service"
