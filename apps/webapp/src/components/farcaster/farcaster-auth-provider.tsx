/**
 * Farcaster Auth Provider - Context provider for Farcaster authentication
 * @module components/farcaster/farcaster-auth-provider
 */

'use client'

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  useMemo,
  type ReactNode,
} from 'react'
import type {
  FarcasterUser,
  FarcasterAuthContext as AuthContextType,
  SIWNResponse,
} from '@/lib/types/farcaster'
import { useToast } from '@/hooks/use-toast'

const STORAGE_KEY = 'farcaster_user'
const NEYNAR_LOGIN_URL = 'https://app.neynar.com/login'

// Create context with undefined default
const FarcasterAuthContext = createContext<AuthContextType | undefined>(undefined)

interface FarcasterAuthProviderProps {
  children: ReactNode
}

/**
 * Provider component for Farcaster authentication state
 * Handles SIWN popup flow and persists user to localStorage
 */
export function FarcasterAuthProvider({ children }: FarcasterAuthProviderProps) {
  const [user, setUser] = useState<FarcasterUser | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const { toast } = useToast()

  // Load user from localStorage on mount
  useEffect(() => {
    const loadStoredUser = () => {
      try {
        const stored = localStorage.getItem(STORAGE_KEY)
        if (stored) {
          const parsed = JSON.parse(stored) as FarcasterUser
          setUser(parsed)
        }
      } catch (error) {
        console.error('Failed to load stored Farcaster user:', error)
        localStorage.removeItem(STORAGE_KEY)
      } finally {
        setIsLoading(false)
      }
    }

    loadStoredUser()
  }, [])

  // Handle SIWN popup message events
  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      // Validate origin for security
      if (!event.origin.includes('neynar.com')) {
        return
      }

      try {
        const data = event.data as SIWNResponse

        // Check if this is a valid SIWN response
        if (data?.signer_uuid && data?.fid && data?.is_authenticated) {
          const newUser: FarcasterUser = {
            fid: data.fid,
            username: data.user.username,
            displayName: data.user.display_name,
            pfpUrl: data.user.pfp_url,
            signerUuid: data.signer_uuid,
          }

          // Persist to localStorage
          localStorage.setItem(STORAGE_KEY, JSON.stringify(newUser))
          setUser(newUser)

          toast({
            title: 'Connected!',
            description: `Welcome, @${newUser.username}!`,
          })
        }
      } catch (error) {
        console.error('Failed to process SIWN response:', error)
      }
    }

    window.addEventListener('message', handleMessage)
    return () => window.removeEventListener('message', handleMessage)
  }, [toast])

  /**
   * Open Neynar SIWN popup for authentication
   */
  const connectFarcaster = useCallback(() => {
    try {
      setIsLoading(true)

      // Get client ID from environment variable
      const clientId = import.meta.env.VITE_NEYNAR_CLIENT_ID

      if (!clientId) {
        throw new Error('Farcaster client ID not configured. Please add VITE_NEYNAR_CLIENT_ID to your .env file.')
      }

      // Calculate popup dimensions and position
      const width = 500
      const height = 700
      const left = window.screenX + (window.outerWidth - width) / 2
      const top = window.screenY + (window.outerHeight - height) / 2

      // Open SIWN popup
      const popup = window.open(
        `${NEYNAR_LOGIN_URL}?client_id=${clientId}`,
        'farcaster-siwn',
        `width=${width},height=${height},left=${left},top=${top},popup=true`
      )

      if (!popup) {
        throw new Error('Failed to open popup. Please allow popups for this site.')
      }

      // Monitor popup closure
      const checkPopupClosed = setInterval(() => {
        if (popup.closed) {
          clearInterval(checkPopupClosed)
          setIsLoading(false)
        }
      }, 500)
    } catch (error) {
      setIsLoading(false)
      const message = error instanceof Error
        ? error.message
        : 'Failed to connect Farcaster. Please try again.'

      toast({
        title: 'Connection failed',
        description: message,
        variant: 'destructive',
      })
    }
  }, [toast])

  /**
   * Disconnect Farcaster account
   */
  const disconnectFarcaster = useCallback(() => {
    localStorage.removeItem(STORAGE_KEY)
    setUser(null)

    toast({
      title: 'Disconnected',
      description: 'Your Farcaster account has been disconnected.',
    })
  }, [toast])

  const contextValue = useMemo<AuthContextType>(() => ({
    user,
    isLoading,
    isConnected: !!user,
    connectFarcaster,
    disconnectFarcaster,
  }), [user, isLoading, connectFarcaster, disconnectFarcaster])

  return (
    <FarcasterAuthContext.Provider value={contextValue}>
      {children}
    </FarcasterAuthContext.Provider>
  )
}

/**
 * Hook to access Farcaster authentication context
 * @throws Error if used outside of FarcasterAuthProvider
 */
export function useFarcasterAuth(): AuthContextType {
  const context = useContext(FarcasterAuthContext)

  if (context === undefined) {
    throw new Error('useFarcasterAuth must be used within a FarcasterAuthProvider')
  }

  return context
}
