/**
 * Farcaster Connect Button - Connect/disconnect Farcaster accounts
 */

import { useFarcaster } from '@/hooks/use-farcaster'

/**
 * Button component for managing Farcaster account connections
 */
export function FarcasterConnectButton() {
  const { connections, connect, disconnect, isLoading, error } =
    useFarcaster()

  const activeConnection = connections.find(c => c.isActive)

  const handleConnect = async () => {
    const connection = await connect()
    if (connection) {
      console.log('Connected as', connection.username)
    }
  }

  const handleDisconnect = async () => {
    if (activeConnection) {
      await disconnect(activeConnection.id)
    }
  }

  if (isLoading) {
    return (
      <button disabled className="opacity-50 cursor-not-allowed">
        Loading...
      </button>
    )
  }

  if (activeConnection) {
    return (
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-2">
          {activeConnection.pfpUrl && (
            <img
              src={activeConnection.pfpUrl}
              alt={activeConnection.username}
              className="w-6 h-6 rounded-full"
            />
          )}
          <span className="text-sm font-medium">
            @{activeConnection.username}
          </span>
        </div>

        <button
          onClick={handleDisconnect}
          className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={isLoading}
        >
          Disconnect Farcaster
        </button>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-2">
      <button
        onClick={handleConnect}
        className="px-4 py-2 bg-purple-500 text-white rounded hover:bg-purple-600 disabled:opacity-50 disabled:cursor-not-allowed"
        disabled={isLoading}
      >
        Connect Farcaster
      </button>

      {error && (
        <div className="p-3 bg-red-100 border border-red-300 rounded text-red-700 text-sm">
          {error}
        </div>
      )}
    </div>
  )
}
