# Domain Layer

## Overview

The domain layer (@nora-health/domain) contains core business logic, types, and domain models for the entire nora-health system. This is the foundation layer that all other packages depend on.

## Purpose

The domain layer serves as the single source of truth for:
- Business entities and their relationships
- Data validation and transformation rules
- Type definitions used across backend and frontend
- Domain-specific error types

## Technology Stack

**Effect Schema** is used throughout for:
- Runtime type validation
- Data encoding/decoding
- Schema composition
- Type inference for TypeScript

## Domain Models

### Authentication Models

#### User
Represents a user account in the system.
- Fields: id, email, first_name, last_name, created_at, updated_at
- Used across auth, user management, and post ownership

#### AuthSession
Manages user authentication sessions.
- Fields: id, user_id, token, expires_at, created_at
- Links to User for session validation

#### AuthToken
Stores OTP-based authentication tokens.
- Fields: id, email, provider, purpose, otp, expires_at, created_at
- Short-lived tokens for email-based authentication
- Purposes: SIGN_UP_VERIFICATION, SIGN_IN_VERIFICATION

#### AuthProfile
Additional authentication profile information.
- Fields: id, user_id, provider_type, provider_data
- Extends user authentication with third-party providers (Farcaster, etc.)

### Content Models

#### Post
Represents a social media post.
- Fields: id, user_id, content, media_ids, scheduled_at, status, created_at, updated_at
- Status types: DRAFT, SCHEDULED, PUBLISHED, FAILED
- Links to User (owner)

#### PostPlatform
Represents a post's relationship with a specific platform.
- Fields: id, post_id, platform, platform_post_id, published_at, status, created_at
- Enables multi-platform publishing
- Tracks publish status per platform

#### PostStatus
Enum for post lifecycle states:
- `DRAFT` - Post is being edited
- `SCHEDULED` - Post is scheduled for future publish
- `PUBLISHED` - Post has been successfully published
- `FAILED` - Post publishing failed

#### PostWithPlatforms
Service-level model combining Post with its Platform relationships.
- Not a database table
- Used in service layer responses

### Social Integration Models

#### ConnectedAccount
Represents a user's connection to a social media platform.
- **Key Fields**:
  - id, user_id, platform, platform_account_id
  - platform_username, platform_display_name, profile_url, avatar_url
  - is_active, is_primary
  - created_at, updated_at, last_connected_at, disconnected_at

- **Platform Types**: TWITTER, FACEBOOK, INSTAGRAM, FARCASTER, BASEAPP, ZORA
- **Purpose**: Account metadata only (no OAuth tokens)
- **Lifecycle**: Created on OAuth connect, soft-deleted on disconnect

#### OAuthToken
Stores OAuth authentication credentials.
- **Key Fields**:
  - id, connected_account_id, provider, token_type, platform_account_id
  - access_token, refresh_token, expires_at, scopes
  - is_active, created_at, updated_at, last_used_at, revoked_at

- **Token Types**:
  - `USER_TOKEN` - User-level token (post to user feed)
  - `PAGE_TOKEN` - Page-level token (post to Facebook Pages)
  - `APP_TOKEN` - Application-level token (server-to-server)

- **Security**: access_token and refresh_token MUST be encrypted at rest
- **Purpose**: Separate storage from account metadata

#### OAuthProvider
Enum for OAuth2 providers:
- Inherits from PlatformName
- Values: TWITTER, FACEBOOK, INSTAGRAM, FARCASTER, BASEAPP, ZORA

#### OAuthTokenType
Enum for OAuth token types:
- `USER_TOKEN`
- `PAGE_TOKEN`
- `APP_TOKEN`

#### OAuthError
Domain errors for OAuth operations:
- `OAuthTokenExpiredError` - Token has expired
- `OAuthTokenInvalidError` - Token is invalid
- `OAuthInsufficientScopeError` - Token lacks required permissions

#### PlatformPostResult
Result of publishing to a platform:
- Fields: platform, platform_post_id, published_at, status
- Used for tracking multi-platform publish results

#### PlatformPublishError
Domain errors for platform publishing:
- `RateLimitError` - Platform rate limit exceeded
- `PermissionDeniedError` - Insufficient permissions
- `ValidationError` - Invalid post content for platform

#### PostContent
Content to be published to platforms:
- Fields: message, media_ids, hashtags, mentions
- Used in publish operations across platforms

#### ConnectedAccountWithTokens
Service-level model combining ConnectedAccount with OAuth tokens.
- Combines account metadata with available tokens
- Used in service responses
- Not a database table

### Storage Models

#### StorageFile
Represents a media file stored in the system.
- Fields: id, original_name, file_data, mime_type, user_id, created_at
- Used for post media (images, videos)
- Binary data stored in database

### Analytics Models

#### DashboardAnalytics
Analytics data for user dashboard.
- Fields: total_posts, scheduled_posts, published_posts, engagement_rate, created_at

#### CreatorAnalytics
Creator-focused analytics.
- Fields: followers, engagement, growth_rate, created_at

#### DashboardInfoTypeString
String type for dashboard info categories.

#### DashboardInfo
General dashboard information.

### Waitlist Models

#### WaitlistEntry
Represents a waitlist registration.
- Fields: id, email, created_at

### Supporting Types

#### Pagination
Pagination parameters and metadata.

#### Id
Unique identifier type.

#### Timestamp
Unix timestamp type.

#### TimestampFromString
Timestamp that can be parsed from string.

#### TimeString
String representation of time.

#### Url
URL type with validation.

### Models (Legacy/Refactoring)

Some models marked for potential refactoring:
- SocialPlatform
- CreatorProfile
- CoverImage
- Email, FirstName, LastName
- MediaDescription

## Usage Patterns

### Domain Model Creation

```typescript
import { Schema } from 'effect'
import Id from './Id'

class User extends Schema.Class<User>('User')({
  id: Id,
  email: Schema.String,
  first_name: Schema.String,
  last_name: Schema.String,
  created_at: Timestamp,
  updated_at: Schema.NullOr(Timestamp)
}) {}

export default User
```

### Schema Validation

```typescript
import { Schema } from 'effect'

const userInput = Schema.parse(User)(rawData)
// Returns User | Validation errors
```

### Type Export Pattern

```typescript
// packages/domain/src/index.ts
export { default as User } from './User'
export { default as Post } from './Post'
// ...
```

## Domain Model Relationships

### User → Posts (One-to-Many)
```
User (1) ───────────┐
                       │
                       ├── Post (1)
                       ├── Post (2)
                       └── Post (3)
```

### Post → Platforms (One-to-Many)
```
Post (1) ───────────┐
                     │
                     ├── PostPlatform (Facebook)
                     ├── PostPlatform (Twitter)
                     └── PostPlatform (Instagram)
```

### User → ConnectedAccount (One-to-Many)
```
User (1) ──────────────┐
                        │
                        ├── ConnectedAccount (Facebook)
                        ├── ConnectedAccount (Twitter)
                        └── ConnectedAccount (Instagram)
```

### ConnectedAccount → OAuthToken (One-to-Many)
```
ConnectedAccount (1) ───────┐
                             │
                             ├── OAuthToken (USER_TOKEN)
                             ├── OAuthToken (PAGE_TOKEN_1)
                             └── OAuthToken (PAGE_TOKEN_2)
```

See [OAuth Integration](./domain-models-oauth.md) for detailed OAuth architecture.

## Design Principles

1. **Single Responsibility**: Each model represents one business concept
2. **Type Safety**: All models use Effect Schema for runtime validation
3. **Immutability**: Models are immutable by default
4. **Composition**: Complex models composed from simpler ones
5. **Export from index**: Central exports in `index.ts` for clean imports

## Migration Guidelines

When modifying domain models:

1. Update the model file with new fields
2. Re-export from `index.ts` if it's a new model
3. Create database migration in backend
4. Update types in `apps/backend/src/types.ts`
5. Update API schemas if model used in endpoints
6. Run typecheck: `pnpm typecheck`

## Dependencies

The domain layer has **no external dependencies** besides:
- `effect` (core library)
- All other packages depend on domain layer

This ensures domain logic is pure and can be tested in isolation.

## Summary

The domain layer is the foundation of nora-health:
- Defines all business entities
- Provides type safety across the system
- Uses Effect Schema for validation
- Organized by feature (Auth, Post, Integrations, etc.)
- Minimal dependencies for maximum portability

All other packages (api, backend, api-client) build on top of these domain models.
