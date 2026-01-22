# Domain Models - OAuth & Social Platform Integration

## Overview

This document describes the domain models for OAuth2 social platform integrations.

## Core Models

### 1. ConnectedAccount

**Purpose**: Represents a user's connection to a specific social media platform account.

**Key Fields**:
- `id` - Unique identifier for the connection
- `user_id` - nora-health user who owns this connection
- `platform` - Platform identifier (e.g., 'FACEBOOK', 'TWITTER')
- `platform_account_id` - ID of the account on the social platform
- `platform_username` - Username/handle on the social platform
- `platform_display_name` - Display name (if different from username)
- `profile_url` - URL to profile on social platform
- `avatar_url` - Avatar URL
- `is_active` - Whether this connection is currently active
- `is_primary` - Whether this is the user's primary account for that platform

**NOT Stored Here**:
- ❌ OAuth tokens (access_token, refresh_token)
- ❌ Token metadata (expires_at, scopes)

**Lifecycle**: Created when user connects their social account, deactivated when disconnected.

---

### 2. OAuthToken

**Purpose**: Stores OAuth authentication credentials separately from account metadata.

**Key Fields**:
- `id` - Unique token identifier
- `connected_account_id` - FK to ConnectedAccount
- `provider` - Platform identifier
- `token_type` - Type of token: USER_TOKEN | PAGE_TOKEN | APP_TOKEN
- `platform_account_id` - Account ID on the social platform this token belongs to
- `access_token` - Encrypted OAuth access token
- `refresh_token` - Encrypted OAuth refresh token (nullable)
- `expires_at` - Unix timestamp when token expires (nullable)
- `scopes` - Array of granted OAuth scopes/permissions
- `is_active` - Whether this token is currently valid
- `last_used_at` - Last time this token was used
- `revoked_at` - When token was revoked (nullable)

**Security**:
- ⚠️ `access_token` and `refresh_token` MUST be encrypted at rest
- Use separate encryption service

**Token Types**:
- `USER_TOKEN` - User-level OAuth token (used for posting to user's personal feed, getting page list, etc.)
- `PAGE_TOKEN` - Page-level OAuth token (used for posting to Facebook Pages - business/community pages)
- `APP_TOKEN` - Application-level token (rare, for server-to-server)

**Note**: For MVP/general feed posting, use `USER_TOKEN`. The `PAGE_TOKEN` support exists for future "post to managed pages" feature.

**Lifecycle**: Created after OAuth flow, refreshed before expiry, revoked when user disconnects or refresh fails.

---

## Relationship: ConnectedAccount ↔ OAuthToken

### One-to-Many Relationship

```
ConnectedAccount (1) ─────────────────┐
                                       │
                                       ├── OAuthToken (user_token)
                                       ├── OAuthToken (page_token_1)
                                       ├── OAuthToken (page_token_2)
                                       └── OAuthToken (page_token_3)
```

**Why This Design**:

1. **Multiple Tokens Per Connection**: For platforms like Facebook, a single user connection can have:
   - 1 user access token (for getting page list)
   - N page access tokens (one per managed page)

2. **Independent Token Lifecycle**: Tokens can be refreshed/revoked independently of the account connection.

3. **Security**: Tokens encrypted separately from account metadata.

---

## Usage Patterns

### Example: Facebook Integration

```
1. User clicks "Connect Facebook"
2. OAuth flow completes
3. Create ConnectedAccount:
   - user_id: "user_123"
   - platform: "FACEBOOK"
   - platform_account_id: "fb_user_456"
   - platform_username: "john_doe"
4. Create OAuthTokens:
   a. User token:
      - connected_account_id: connected_account_id
      - token_type: "USER_TOKEN"
      - platform_account_id: "fb_user_456"
      - access_token: "encrypted_short_lived"
      - refresh_token: "encrypted_refresh"
   b. Page token (if user selected a page):
      - connected_account_id: connected_account_id
      - token_type: "PAGE_TOKEN"
      - platform_account_id: "fb_page_789"
      - access_token: "encrypted_page_token"
      - refresh_token: null (page tokens don't expire)
5. User publishes to Facebook:
   - Use PAGE_TOKEN from OAuthToken
   - POST to Graph API with page token
```

---

## Service-Level Models

### ConnectedAccountWithTokens

**Purpose**: Combines ConnectedAccount metadata with its OAuth tokens for service responses.

**Usage**: Return from repository when fetching a user's connected account with all available tokens.

**Not a Database Table**: This is a service-level model, similar to `PostWithPlatforms`.
