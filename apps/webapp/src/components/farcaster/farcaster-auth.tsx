/**
 * Farcaster Auth - Authentication component for Farcaster
 * @module components/farcaster/farcaster-auth
 */

'use client'

import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar'
import { Skeleton } from '@/components/ui/skeleton'
import { useFarcasterAuth } from './farcaster-auth-provider'
import { LogIn, LogOut, User } from 'lucide-react'

interface FarcasterAuthProps {
  showDisconnect?: boolean
  onConnect?: () => void
  onDisconnect?: () => void
}

/**
 * Compact connect button for Farcaster
 */
export function FarcasterConnectBtn({
  showDisconnect = false,
  onConnect,
  onDisconnect,
}: FarcasterAuthProps) {
  const { user, isLoading, isConnected, connectFarcaster, disconnectFarcaster } =
    useFarcasterAuth()

  if (isLoading) {
    return (
      <Button disabled className="w-full">
        <span className="animate-spin">⟳</span>
        Connecting...
      </Button>
    )
  }

  if (isConnected && user && showDisconnect) {
    return (
      <div className="space-y-2">
        <div className="flex items-center gap-2 p-2 rounded-md bg-muted">
          <Avatar className="size-6">
            {user.pfpUrl ? (
              <AvatarImage src={user.pfpUrl} alt={user.displayName} />
            ) : null}
            <AvatarFallback>
              <User className="size-3" />
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-medium truncate">{user.displayName}</p>
            <p className="text-xs text-muted-foreground truncate">@{user.username}</p>
          </div>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => {
            disconnectFarcaster()
            onDisconnect?.()
          }}
          className="w-full text-destructive hover:text-destructive hover:bg-destructive/10"
        >
          <LogOut className="size-4" />
          Disconnect
        </Button>
      </div>
    )
  }

  if (isConnected && user) {
    return (
      <div className="space-y-2">
        <div className="flex items-center gap-2 p-2 rounded-md bg-muted text-sm">
          <Avatar className="size-5">
            {user.pfpUrl ? (
              <AvatarImage src={user.pfpUrl} alt={user.displayName} />
            ) : null}
            <AvatarFallback>
              <User className="size-3" />
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-medium truncate">{user.displayName}</p>
            <p className="text-xs text-muted-foreground truncate">@{user.username}</p>
          </div>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={() => {
            disconnectFarcaster()
            onDisconnect?.()
          }}
          className="w-full text-destructive hover:text-destructive hover:bg-destructive/10"
        >
          <LogOut className="size-4" />
          Disconnect
        </Button>
      </div>
    )
  }

  return (
    <Button
      onClick={() => {
        connectFarcaster()
        onConnect?.()
      }}
      disabled={isLoading}
      className="w-full bg-[#855DCD] hover:bg-[#7248B9] text-white"
    >
      <LogIn className="size-4" />
      Connect Farcaster
    </Button>
  )
}

/**
 * Full auth display component with connect/disconnect
 */
export function FarcasterAuth({ showDisconnect = true }: { showDisconnect?: boolean }) {
  const { user, isLoading, isConnected, disconnectFarcaster } = useFarcasterAuth()

  if (isLoading) {
    return (
      <div className="flex items-center gap-3 p-4 rounded-lg border">
        <Skeleton className="size-10 rounded-full" />
        <div className="flex-1 space-y-2">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-3 w-16" />
        </div>
      </div>
    )
  }

  if (isConnected && user && showDisconnect) {
    return (
      <div className="flex items-center gap-3 p-4 rounded-lg border bg-card">
        <Avatar className="size-10">
          {user.pfpUrl ? (
            <AvatarImage src={user.pfpUrl} alt={user.displayName} />
          ) : null}
          <AvatarFallback>
            <User className="size-4" />
          </AvatarFallback>
        </Avatar>

        <div className="flex-1 min-w-0">
          <p className="font-medium text-foreground truncate">
            {user.displayName}
          </p>
          <p className="text-sm text-muted-foreground truncate">
            @{user.username}
          </p>
        </div>

        <Button
          variant="ghost"
          size="sm"
          onClick={disconnectFarcaster}
          className="text-destructive hover:text-destructive hover:bg-destructive/10"
        >
          <LogOut className="size-4" />
          <span className="sr-only">Disconnect</span>
        </Button>
      </div>
    )
  }

  return null
}

