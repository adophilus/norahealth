/\*\*

- Farcaster Integration Documentation
- =====================================
-
- This directory contains the complete Farcaster integration layer for nora-health.
- It provides frontend-backend abstraction for connecting Farcaster accounts and
- publishing casts via the Neynar API.
-
- # Architecture
-
- ## Layers
-
- ```

  ```
- ┌─────────────────────────────────────────┐
- │ React Components (UI) │
- │ - FarcasterConnectButton │
- │ - FarcasterCompose │
- └──────────────────┬──────────────────────┘
-                    │
- ┌──────────────────▼──────────────────────┐
- │ React Hook (State Management) │
- │ - useFarcaster() │
- └──────────────────┬──────────────────────┘
-                    │
- ┌──────────────────▼──────────────────────┐
- │ Service Layer (API Abstraction) │
- │ - farcaster-service.ts │
- │ - Handles all Farcaster operations │
- └──────────────────┬──────────────────────┘
-                    │
- ┌──────────────────▼──────────────────────┐
- │ API Client (HTTP + Auth) │
- │ - client.ts │
- │ - Adds Bearer token automatically │
- └──────────────────┬──────────────────────┘
-                    │
- ┌──────────────────▼──────────────────────┐
- │ Backend API Endpoints (to implement) │
- │ - POST /social-connections/farcaster │
- │ - GET /social-connections │
- │ - DELETE /social-connections/:id │
- │ - POST /posts/publish/farcaster │
- │ - POST /social-connections/:id/test │
- └─────────────────────────────────────────┘
- ```

  ```
-
- # Files
-
- ## Core Integration Files
-
- ### 1. lib/api/client.ts
- Base HTTP client that handles:
- - Automatic Bearer token injection from localStorage
- - JSON serialization/deserialization
- - Error handling with custom APIError class
- - Type-safe generic responses
-
- **Key Functions:**
- - `apiClient<T>(endpoint, options): Promise<T>`
- - Throws `APIError` with status code and response data
-
- **Usage:**
- ```typescript

  ```
- const data = await apiClient<MyType>('/endpoint', {
- method: 'POST',
- body: JSON.stringify(payload)
- });
- ```

  ```
-
- ### 2. lib/services/farcaster-service.ts
- Main service module that provides:
- - Farcaster account connections
- - Publishing casts via Neynar
- - Connection testing and management
- - Helper utilities (text formatting, channel validation)
-
- **Key Exports:**
- - `connectFarcaster()` - Connect new account
- - `getFarcasterConnections()` - List user's connections
- - `disconnectFarcaster()` - Remove connection
- - `publishFarcasterCast()` - Publish a cast
- - `testFarcasterConnection()` - Validate connection
- - `initializeFarcasterConnection()` - Get user from SDK
- - `formatCastText()` - Enforce 320 char limit
- - `isValidFarcasterChannel()` - Validate channel IDs
-
- **Types:**
- - `FarcasterConnection` - Connected account
- - `FarcasterCastRequest` - Cast details
- - `FarcasterCastResponse` - Cast result
-
- ### 3. lib/services/types.ts
- Shared TypeScript definitions:
- - `Platform` - Social media platforms enum
- - `SocialConnection` - Generic connection interface
- - `Post` - Cross-platform post
- - `Channel` - Supported channels
- - `PostAnalytics` - Engagement metrics
- - `User` - User account
-
- ### 4. hooks/use-farcaster.ts
- React hook for component-level integration:
-
- **State Management:**
- - `connections[]` - User's Farcaster accounts
- - `isLoading` - Async operation in progress
- - `error` - Last error message
-
- **Operations:**
- - `connect()` - Connect new account
- - `disconnect(id)` - Remove connection
- - `publishCast(request)` - Publish to Farcaster
- - `testConnection(id)` - Test validity
- - `refreshConnections()` - Manual refresh
-
- **Usage in Components:**
- ```typescript

  ```
- import { useFarcaster } from '@/hooks/use-farcaster'
-
- export function MyComponent() {
- const { connections, connect, publishCast } = useFarcaster()
-
- const handlePost = async () => {
-     const result = await publishCast({
-       postId: 'post_123',
-       text: 'Hello Farcaster!',
-       embeds: [{ url: 'https://example.com/image.png' }]
-     })
-
-     if (result) {
-       console.log('Posted:', result.url)
-     }
- }
-
- return <button onClick={handlePost}>Post</button>
- }
- ```

  ```
-
- ## UI Components
-
- ### 1. components/farcaster/farcaster-connect-button.tsx
- Button component for managing Farcaster connections.
-
- **States:**
- - Not connected: Shows "Connect Farcaster" button
- - Connected: Shows username and "Disconnect" button
- - Loading: Disabled state during async operations
- - Error: Displays error message
-
- **Usage:**
- ```typescript

  ```
- import { FarcasterConnectButton } from '@/components/farcaster'
-
- export function Header() {
- return (
-     <nav>
-       <h1>nora-health</h1>
-       <FarcasterConnectButton />
-     </nav>
- )
- }
- ```

  ```
-
- ### 2. components/farcaster/farcaster-compose.tsx
- Full-featured compose component for publishing casts.
-
- **Features:**
- - Text input with character counter
- - Channel selection
- - Image/embed management
- - Real-time validation
- - Error handling
- - Success feedback
-
- **Props:**
- ```typescript

  ```
- interface FarcasterComposeProps {
- onPostPublished?: (url: string) => void
- initialText?: string
- initialChannelId?: string
- }
- ```

  ```
-
- **Usage:**
- ```typescript

  ```
- import { FarcasterCompose } from '@/components/farcaster'
-
- export function PostPage() {
- return (
-     <FarcasterCompose
-       initialChannelId="nora-health"
-       onPostPublished={(url) => {
-         console.log('Posted:', url)
-         // Navigate or refresh UI
-       }}
-     />
- )
- }
- ```

  ```
-
- # Environment Variables
-
- Set these in `.env.development` or `.env.production`:
-
- ```env

  ```
- # API Server URL
- VITE_API_URL=http://localhost:8008
-
- # For Farcaster miniapp integration (optional)
- VITE_FARCASTER_ENABLED=true
- ```

  ```
-
- # Flow Diagrams
-
- ## Connect Farcaster Account Flow
-
- ```

  ```
- User clicks "Connect Farcaster"
-              │
-              ▼
- useFarcaster.connect() called
-              │
-              ├─▶ initializeFarcasterConnection()
-              │   - Gets FID from Farcaster SDK
-              │
-              ├─▶ [User approves signer creation]
-              │   - Via Neynar API or deep link
-              │
-              ├─▶ connectFarcaster() API call
-              │   - POST /social-connections/farcaster
-              │
-              ├─▶ Backend creates connection record
-              │   - Stores signer_uuid
-              │   - Saves FID and username
-              │
-              ├─▶ refreshConnections() updates state
-              │
-              ▼
- UI shows connected username
- ```

  ```
-
- ## Publish Cast Flow
-
- ```

  ```
- User types message and clicks "Publish"
-              │
-              ▼
- FarcasterCompose validates
- - Text length (max 320 chars)
- - Channel ID format (if provided)
- - Connection exists
-              │
-              ▼
- publishCast() called via useFarcaster hook
-              │
-              ├─▶ Finds first active connection
-              │
-              ├─▶ publishFarcasterCast() API call
-              │   - POST /posts/publish/farcaster
-              │   - Includes: text, embeds, channel, connection ID
-              │
-              ├─▶ Backend calls Neynar API
-              │   - Creates cast with signer
-              │   - Returns cast hash and Warpcast URL
-              │
-              ├─▶ Updates post record in database
-              │
-              ▼
- UI shows success message with link
- ```

  ```
-
- # Common Patterns
-
- ## Pattern 1: Check if User is Connected
-
- ```typescript

  ```
- const { connections } = useFarcaster()
-
- if (connections.length === 0) {
- return <p>Please connect Farcaster first</p>
- }
-
- return <button onClick={handlePublish}>Post</button>
- ```

  ```
-
- ## Pattern 2: Show Loading State During Publish
-
- ```typescript

  ```
- const { publishCast, isLoading } = useFarcaster()
-
- return (
- <button onClick={handlePublish} disabled={isLoading}>
-     {isLoading ? 'Publishing...' : 'Publish'}
- </button>
- )
- ```

  ```
-
- ## Pattern 3: Display Error Messages
-
- ```typescript

  ```
- const { error } = useFarcaster()
-
- if (error) {
- return (
-     <div className="error-message">
-       <p>{error}</p>
-       <button onClick={() => /* retry */}>Try Again</button>
-     </div>
- )
- }
- ```

  ```
-
- ## Pattern 4: Handle Success with Callback
-
- ```typescript

  ```
- const { publishCast } = useFarcaster()
-
- const handlePublish = async () => {
- const result = await publishCast({
-     postId: generateId(),
-     text: message
- })
-
- if (result) {
-     // Success: Open Warpcast link
-     window.open(result.url, '_blank')
-     // Or show toast notification
-     showToast('Cast published!')
- }
- }
- ```

  ```
-
- # Debugging
-
- ## Enable Console Logging
-
- In development, the services log errors to console:
-
- ```typescript

  ```
- // Open browser DevTools (F12) and check Console tab
- // Look for messages like:
- // "Error fetching Farcaster connections: ..."
- // "Error publishing cast: ..."
- ```

  ```
-
- ## Test API Connections
-
- ```typescript

  ```
- // In browser console
- import { apiClient } from '@/lib/api/client'
-
- // Test if API is reachable
- await apiClient('/health')
-
- // Get connections directly
- import { getFarcasterConnections } from '@/lib/services/farcaster-service'
- await getFarcasterConnections()
- ```

  ```
-
- ## Common Issues
-
- ### \"No active Farcaster connection found\"
- - User hasn't connected Farcaster account yet
- - Check: `const { connections } = useFarcaster()`
- - Fix: Call `connect()` method first
-
- ### \"APIError: 401\"
- - Access token is missing or expired
- - Check localStorage for 'accessToken'
- - Fix: User needs to sign in/authenticate first
- n \* ### \"Failed to fetch connections\"
- - Backend API is not responding
- - Check: Is server running on VITE_API_URL?
- - Fix: Start backend with `pnpm start:backend`
-
- ### \"Signer UUID is required\"
- - Neynar signer creation didn't complete
- - Check: Did user approve the signer in Neynar flow?
- - Fix: Implement complete signer creation flow
-
- # Testing
-
- ## Unit Tests
-
- ```typescript

  ```
- // Test the service
- import { connectFarcaster } from '@/lib/services/farcaster-service'
-
- describe('connectFarcaster', () => {
- it('should connect account successfully', async () => {
-     const connection = await connectFarcaster({
-       fid: 12345,
-       username: 'alice',
-       signerUuid: 'abc123'
-     })
-
-     expect(connection.username).toBe('alice')
- })
- })
- ```

  ```
-
- ## Component Tests
-
- ```typescript

  ```
- // Test the hook
- import { renderHook, act } from '@testing-library/react'
- import { useFarcaster } from '@/hooks/use-farcaster'
-
- describe('useFarcaster', () => {
- it('should fetch connections on mount', async () => {
-     const { result } = renderHook(() => useFarcaster())
-
-     expect(result.current.isLoading).toBe(true)
-
-     await act(async () => {
-       // Wait for connections to load
-     })
-
-     expect(result.current.connections).toHaveLength(1)
- })
- })
- ```

  ```
-
- # Migration Guide
-
- ## From Placeholder to Real Implementation
-
- The integration is ready for the backend endpoints. Once your backend team
- implements the endpoints listed in \"Backend API Endpoints (to implement)\",
- everything will work seamlessly.
-
- No changes needed in the frontend code - it's already designed to work with
- the real backend API.
-
- # Contributing
-
- When adding new Farcaster features:
-
- 1.  Add types to `lib/services/types.ts`
- 2.  Add API calls to `lib/services/farcaster-service.ts`
- 3.  Add hook integration to `hooks/use-farcaster.ts` (if needed)
- 4.  Create UI component in `components/farcaster/`
- 5.  Add JSDoc comments for all functions
- 6.  Update this README with examples
-
- # Support
-
- For issues or questions:
- 1.  Check the \"Common Issues\" section in Debugging
- 2.  Look at example components for usage patterns
- 3.  Review JSDoc comments in source files
- 4.  Check backend API documentation
-
- @module Farcaster Integration
  \*/

// This file serves as documentation only.
// For actual implementation, see the other files in this directory.
