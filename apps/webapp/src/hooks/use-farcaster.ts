/**
 * useFarcaster - React hook for managing Farcaster connections and operations
 */

import { useState, useEffect, useCallback } from 'react'
import {
  getFarcasterConnections,
  connectFarcaster,
  disconnectFarcaster,
  publishFarcasterCast,
  testFarcasterConnection,
  initializeFarcasterConnection,
  scheduleFarcasterCast,
  getScheduledFarcasterCasts,
  updateScheduledFarcasterCast,
  cancelScheduledFarcasterCast,
  type FarcasterConnection,
  type FarcasterCastRequest,
  type FarcasterScheduledCastRequest,
  type FarcasterScheduledCast,
} from '@/lib/services/farcaster-service'
import { APIError } from '@/lib/api/client'

interface UseFarcasterReturn {
  connections: FarcasterConnection[]
  isLoading: boolean
  error: string | null
  connect: () => Promise<FarcasterConnection | null>
  disconnect: (connectionId: string) => Promise<void>
  publishCast: (
    request: Omit<FarcasterCastRequest, 'connectionId'>
  ) => Promise<{ hash: string; url: string } | null>
  scheduleCast: (
    request: Omit<FarcasterScheduledCastRequest, 'connectionId'>
  ) => Promise<FarcasterScheduledCast | null>
  testConnection: (connectionId: string) => Promise<boolean>
  refreshConnections: () => Promise<void>
  scheduledCasts: FarcasterScheduledCast[]
  loadScheduledCasts: () => Promise<void>
  updateScheduledCast: (
    castId: string,
    updates: Partial<Omit<FarcasterScheduledCastRequest, 'connectionId'>>
  ) => Promise<FarcasterScheduledCast | null>
  cancelScheduledCast: (castId: string) => Promise<void>
}

export function useFarcaster(): UseFarcasterReturn {
  const [connections, setConnections] = useState<FarcasterConnection[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [scheduledCasts, setScheduledCasts] = useState<FarcasterScheduledCast[]>([])

  /**
   * Fetch connected Farcaster accounts from backend
   */
  const refreshConnections = useCallback(async () => {
    try {
      setIsLoading(true)
      setError(null)
      const data = await getFarcasterConnections()
      setConnections(data)
    } catch (err) {
      const message =
        err instanceof APIError
          ? err.message
          : 'Failed to fetch connections'
      setError(message)
      console.error('Error fetching Farcaster connections:', err)
    } finally {
      setIsLoading(false)
    }
  }, [])

  /**
   * Load scheduled casts from backend
   */
  const loadScheduledCasts = useCallback(async () => {
    try {
      const casts = await getScheduledFarcasterCasts()
      setScheduledCasts(casts)
    } catch (err) {
      console.error('Error loading scheduled casts:', err)
    }
  }, [])

  // Load connections and scheduled casts on mount
  useEffect(() => {
    refreshConnections()
    loadScheduledCasts()
  }, [refreshConnections, loadScheduledCasts])

  /**
   * Connect a new Farcaster account
   * Gets user FID from Farcaster SDK and creates backend connection
   */
  const connect = useCallback(async (): Promise<FarcasterConnection | null> => {
    try {
      setIsLoading(true)
      setError(null)

      const connectionData = await initializeFarcasterConnection()

      if (!connectionData.signerUuid) {
        throw new Error(
          'Signer UUID is required. Please complete signer setup.'
        )
      }

      const connection = await connectFarcaster(connectionData)
      await refreshConnections()
      return connection
    } catch (err) {
      const message =
        err instanceof Error ? err.message : 'Failed to connect Farcaster'
      setError(message)
      console.error('Error connecting Farcaster:', err)
      return null
    } finally {
      setIsLoading(false)
    }
  }, [refreshConnections])

  /**
   * Disconnect a Farcaster account by connection ID
   */
  const disconnect = useCallback(
    async (connectionId: string): Promise<void> => {
      try {
        setIsLoading(true)
        setError(null)
        await disconnectFarcaster(connectionId)
        await refreshConnections()
      } catch (err) {
        const message =
          err instanceof APIError ? err.message : 'Failed to disconnect'
        setError(message)
        console.error('Error disconnecting Farcaster:', err)
        throw err
      } finally {
        setIsLoading(false)
      }
    },
    [refreshConnections]
  )

  /**
   * Publish a cast to Farcaster using the active connection
   */
  const publishCast = useCallback(
    async (
      request: Omit<FarcasterCastRequest, 'connectionId'>
    ): Promise<{ hash: string; url: string } | null> => {
      try {
        setIsLoading(true)
        setError(null)

        const activeConnection = connections.find(c => c.isActive)
        if (!activeConnection) {
          throw new Error('No active Farcaster connection found')
        }

        const result = await publishFarcasterCast({
          ...request,
          connectionId: activeConnection.id,
        })

        return result
      } catch (err) {
        const message =
          err instanceof APIError ? err.message : 'Failed to publish cast'
        setError(message)
        console.error('Error publishing cast:', err)
        return null
      } finally {
        setIsLoading(false)
      }
    },
    [connections]
  )

  /**
   * Schedule a cast to be published at a later time
   */
  const scheduleCast = useCallback(
    async (
      request: Omit<FarcasterScheduledCastRequest, 'connectionId'>
    ): Promise<FarcasterScheduledCast | null> => {
      try {
        setIsLoading(true)
        setError(null)

        const activeConnection = connections.find(c => c.isActive)
        if (!activeConnection) {
          throw new Error('No active Farcaster connection found')
        }

        const result = await scheduleFarcasterCast({
          ...request,
          connectionId: activeConnection.id,
        })

        // Update scheduled casts list
        setScheduledCasts(prev => [result, ...prev])

        return result
      } catch (err) {
        const message =
          err instanceof APIError ? err.message : 'Failed to schedule cast'
        setError(message)
        console.error('Error scheduling cast:', err)
        return null
      } finally {
        setIsLoading(false)
      }
    },
    [connections]
  )

  /**
   * Update a scheduled cast before publication
   */
  const updateScheduledCast = useCallback(
    async (
      castId: string,
      updates: Partial<Omit<FarcasterScheduledCastRequest, 'connectionId'>>
    ): Promise<FarcasterScheduledCast | null> => {
      try {
        setIsLoading(true)
        setError(null)

        const result = await updateScheduledFarcasterCast(castId, updates)

        // Update in list
        setScheduledCasts(prev =>
          prev.map(cast => (cast.id === castId ? result : cast))
        )

        return result
      } catch (err) {
        const message =
          err instanceof APIError ? err.message : 'Failed to update cast'
        setError(message)
        console.error('Error updating scheduled cast:', err)
        return null
      } finally {
        setIsLoading(false)
      }
    },
    []
  )

  /**
   * Cancel a scheduled cast
   */
  const cancelScheduledCast = useCallback(async (castId: string): Promise<void> => {
    try {
      setIsLoading(true)
      setError(null)

      await cancelScheduledFarcasterCast(castId)

      // Remove from list
      setScheduledCasts(prev => prev.filter(cast => cast.id !== castId))
    } catch (err) {
      const message =
        err instanceof APIError ? err.message : 'Failed to cancel cast'
      setError(message)
      console.error('Error canceling scheduled cast:', err)
      throw err
    } finally {
      setIsLoading(false)
    }
  }, [])

  /**
   * Test if a Farcaster connection is valid
   */
  const testConnection = useCallback(
    async (connectionId: string): Promise<boolean> => {
      try {
        return await testFarcasterConnection(connectionId)
      } catch (err) {
        console.error('Error testing connection:', err)
        return false
      }
    },
    []
  )

  return {
    connections,
    isLoading,
    error,
    connect,
    disconnect,
    publishCast,
    scheduleCast,
    testConnection,
    refreshConnections,
    scheduledCasts,
    loadScheduledCasts,
    updateScheduledCast,
    cancelScheduledCast,
  }
}
