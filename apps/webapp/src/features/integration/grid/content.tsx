import {
  MessageCircleIcon,
  PlusIcon,
  RefreshCwIcon,
  SendIcon,
  Share2Icon,
  Trash2Icon,
  ZapIcon
} from 'lucide-react'
import { useState } from 'react'
import type { Channel } from '@/lib/services/types'
import { $api } from '@/features/api/client'

type Integration = {
  id: string
  channel: Channel
} & (
    | {
      isConnected: false
    }
    | {
      isConnected: true
      accountName: string
      connectedAt: Date
      lastVerified?: Date
    }
  )

export const IntegrationsGridContent = () => {
  const res = $api.useSuspenseQuery('get', '/integrations/connected-accounts')

  console.log(res)

  const [integrations, setIntegrations] = useState<Integration[]>([
    {
      id: 'int_1',
      channel: 'farcaster',
      accountName: '@creator',
      isConnected: true,
      connectedAt: new Date('2024-01-15'),
      lastVerified: new Date('2024-01-20')
    },
    {
      id: 'int_2',
      channel: 'instagram',
      accountName: 'john_doe_creator',
      isConnected: true,
      connectedAt: new Date('2024-01-10'),
      lastVerified: new Date('2024-01-21')
    },
    {
      id: 'int_3',
      channel: 'facebook',
      isConnected: false
    },
    {
      id: 'int_4',
      channel: 'baseapp',
      isConnected: false
    }
  ])

  const [loading, setLoading] = useState<string | null>(null)
  const [message, setMessage] = useState<{
    type: 'success' | 'error'
    text: string
  } | null>(null)

  const showMessage = (type: 'success' | 'error', text: string) => {
    setMessage({ type, text })
    setTimeout(() => setMessage(null), 4000)
  }

  const handleConnect = async (channel: Channel) => {
    setLoading(channel)
    try {
      // Simulate OAuth flow
      await new Promise((resolve) => setTimeout(resolve, 1500))
      const accountNames: Record<Channel, string> = {
        farcaster: '@newcreator',
        instagram: 'new_handle',
        facebook: 'Facebook Page Name',
        baseapp: 'baseapp.eth'
      }

      const newIntegration: Integration = {
        id: `int_${Date.now()}`,
        channel,
        accountName: accountNames[channel],
        isConnected: true,
        connectedAt: new Date(),
        lastVerified: new Date()
      }

      setIntegrations((prev) => [
        ...prev.filter((i) => i.channel !== channel),
        newIntegration
      ])

      showMessage('success', `${channel} connected successfully!`)
    } catch (_error) {
      showMessage('error', `Failed to connect ${channel}`)
    } finally {
      setLoading(null)
    }
  }

  const handleDisconnect = async (integrationId: string) => {
    setLoading(integrationId)
    try {
      await disconnectChannel(integrationId)
      const integration = integrations.find((i) => i.id === integrationId)
      if (integration) {
        setIntegrations((prev) =>
          prev.map((i) =>
            i.id === integrationId
              ? { ...i, isConnected: false, accountName: null }
              : i
          )
        )
        showMessage('success', `${integration.channel} disconnected`)
      }
    } catch (_error) {
      showMessage('error', 'Failed to disconnect')
    } finally {
      setLoading(null)
    }
  }

  const handleTestIntegration = async (integrationId: string) => {
    setLoading(integrationId)
    try {
      const isValid = await testIntegration(integrationId)
      if (isValid) {
        setIntegrations((prev) =>
          prev.map((i) =>
            i.id === integrationId ? { ...i, lastVerified: new Date() } : i
          )
        )
        showMessage('success', 'Connection verified successfully!')
      } else {
        showMessage(
          'error',
          'Connection verification failed. Please reconnect.'
        )
      }
    } catch (_error) {
      showMessage('error', 'Failed to test connection')
    } finally {
      setLoading(null)
    }
  }

  const connectedCount = integrations.filter((i) => i.isConnected).length
  const totalChannels = integrations.length

  const channelIcons: Record<Channel, React.ReactNode> = {
    farcaster: <SendIcon className="w-6 h-6" />,
    instagram: <MessageCircleIcon className="w-6 h-6" />,
    facebook: <Share2Icon className="w-6 h-6" />,
    baseapp: <ZapIcon className="w-6 h-6" />
  }

  const channelColors: Record<Channel, string> = {
    farcaster: 'text-blue-500',
    instagram: 'text-pink-500',
    facebook: 'text-blue-600',
    baseapp: 'text-cyan-500'
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
      {integrations.map((integration) => (
        <div
          key={integration.id}
          className={`bg-card rounded-lg border-2 transition-all p-6 ${integration.isConnected
              ? 'border-primary/20 bg-primary/5'
              : 'border-border'
            }`}
        >
          {/* Channel Header */}
          <div className="flex items-start justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className={`${channelColors[integration.channel]}`}>
                {channelIcons[integration.channel]}
              </div>
              <div>
                <h3 className="text-lg font-bold text-foreground capitalize">
                  {integration.channel}
                </h3>
                {integration.isConnected ? (
                  <p className="text-sm text-muted-foreground">
                    Connected as {integration.accountName}
                  </p>
                ) : (
                  <p className="text-sm text-destructive">Not connected</p>
                )}
              </div>
            </div>
            {integration.isConnected && (
              <div className="w-3 h-3 rounded-full bg-green-500" />
            )}
          </div>

          {/* Status Information */}
          {integration.isConnected && (
            <div className="mb-6 space-y-2 pb-6 border-b border-border">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Connected:</span>
                <span className="text-foreground">
                  {integration.connectedAt.toLocaleDateString()}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Last Verified:</span>
                <span className="text-foreground">
                  {integration.lastVerified
                    ? integration.lastVerified.toLocaleDateString()
                    : 'Never'}
                </span>
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-2">
            {integration.isConnected ? (
              <>
                <button
                  type="button"
                  onClick={() => handleTestIntegration(integration.id)}
                  disabled={loading === integration.id}
                  className="flex-1 px-4 py-2 rounded-lg bg-secondary text-foreground border border-border font-medium transition-all hover:bg-secondary/80 active:scale-95 flex items-center justify-center gap-2 text-sm disabled:opacity-50"
                >
                  <RefreshCwIcon
                    className={`w-4 h-4 ${loading === integration.id ? 'animate-spin' : ''}`}
                  />
                  Verify
                </button>
                <button
                  type="button"
                  onClick={() => handleDisconnect(integration.id)}
                  disabled={loading === integration.id}
                  className="flex-1 px-4 py-2 rounded-lg bg-secondary text-destructive border border-border font-medium transition-all hover:bg-secondary/80 active:scale-95 flex items-center justify-center gap-2 text-sm disabled:opacity-50"
                >
                  <Trash2Icon className="w-4 h-4" />
                  Disconnect
                </button>
              </>
            ) : (
              <button
                type="button"
                onClick={() => handleConnect(integration.channel)}
                disabled={loading === integration.channel}
                className="w-full px-4 py-2 rounded-lg bg-primary text-primary-foreground font-medium transition-all hover:opacity-90 active:scale-95 flex items-center justify-center gap-2 disabled:opacity-50"
              >
                <PlusIcon className="w-4 h-4" />
                {loading === integration.channel ? 'Connecting...' : 'Connect'}
              </button>
            )}
          </div>
        </div>
      ))}
    </div>
  )
}
