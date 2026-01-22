/**
 * Farcaster Compose - Component for composing and publishing casts
 */

import { useState } from 'react'
import { useFarcaster } from '@/hooks/use-farcaster'
import { formatCastText, isValidFarcasterChannel } from '@/lib/services/farcaster-service'

interface FarcasterComposeProps {
  onPostPublished?: (url: string) => void
  initialText?: string
  initialChannelId?: string
}

/**
 * Component for composing and publishing Farcaster casts
 */
export function FarcasterCompose({
  onPostPublished,
  initialText = '',
  initialChannelId = '',
}: FarcasterComposeProps) {
  const { connections, publishCast, isLoading, error } = useFarcaster()

  const [text, setText] = useState(initialText)
  const [channelId, setChannelId] = useState(initialChannelId)
  const [embedUrls, setEmbedUrls] = useState<string[]>([])
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(
    null
  )

  const formattedText = formatCastText(text)
  const charCount = formattedText.length
  const maxChars = 320
  const isOverLimit = charCount > maxChars
  const canSubmit =
    text.trim().length > 0 &&
    !isOverLimit &&
    connections.length > 0 &&
    !isLoading
  const isValidChannel = !channelId || isValidFarcasterChannel(channelId)

  const handlePublish = async () => {
    try {
      setMessage(null)

      if (channelId && !isValidChannel) {
        setMessage({
          type: 'error',
          text: 'Invalid channel ID format (use lowercase, numbers, hyphens only)',
        })
        return
      }

      const result = await publishCast({
        postId: `cast_${Date.now()}`,
        text: formattedText,
        embeds: embedUrls.map(url => ({ url })),
        channelId: channelId || undefined,
      })

      if (result) {
        setMessage({
          type: 'success',
          text: 'Cast published successfully!',
        })

        setText('')
        setChannelId(initialChannelId)
        setEmbedUrls([])
        onPostPublished?.(result.url)
      }
    } catch (err) {
      setMessage({
        type: 'error',
        text: err instanceof Error ? err.message : 'Failed to publish cast',
      })
    }
  }

  const addEmbed = (url: string) => {
    if (url && !embedUrls.includes(url)) {
      setEmbedUrls([...embedUrls, url])
    }
  }

  const removeEmbed = (url: string) => {
    setEmbedUrls(embedUrls.filter(u => u !== url))
  }

  return (
    <div className="w-full max-w-2xl mx-auto p-4 border rounded-lg bg-white shadow-sm">
      <h2 className="text-lg font-semibold mb-4">Post to Farcaster</h2>

      {connections.length === 0 ? (
        <div className="p-4 bg-blue-100 border border-blue-300 rounded text-blue-700">
          Please connect your Farcaster account first to publish casts.
        </div>
      ) : (
        <>
          <div className="mb-4">
            <textarea
              value={text}
              onChange={e => setText(e.target.value)}
              placeholder="What's happening on Farcaster? (max 320 characters)"
              className="w-full p-3 border rounded resize-none focus:outline-none focus:ring-2 focus:ring-purple-500"
              rows={4}
              disabled={isLoading}
            />

            <div
              className={`text-sm mt-2 ${
                isOverLimit ? 'text-red-500 font-semibold' : 'text-gray-500'
              }`}
            >
              {charCount} / {maxChars}
            </div>
          </div>

          <div className="mb-4">
            <label htmlFor="channel" className="block text-sm font-medium mb-2">
              Channel (optional)
            </label>
            <input
              id="channel"
              type="text"
              value={channelId}
              onChange={e => setChannelId(e.target.value.toLowerCase())}
              placeholder="e.g., nora-health, dev-tools"
              className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-purple-500"
              disabled={isLoading}
            />
            {channelId && !isValidChannel && (
              <p className="text-sm text-red-500 mt-1">
                Invalid channel ID (use lowercase, numbers, hyphens)
              </p>
            )}
          </div>

          {embedUrls.length > 0 && (
            <div className="mb-4">
              <p className="text-sm font-medium mb-2">Attachments ({embedUrls.length})</p>
              <div className="space-y-2">
                {embedUrls.map(url => (
                  <div
                    key={url}
                    className="flex items-center justify-between p-2 bg-gray-50 rounded"
                  >
                    <span className="text-sm truncate">{url}</span>
                    <button
                      onClick={() => removeEmbed(url)}
                      className="text-sm text-red-500 hover:text-red-700"
                      disabled={isLoading}
                    >
                      Remove
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {error && (
            <div className="p-3 mb-4 bg-red-100 border border-red-300 rounded text-red-700 text-sm">
              {error}
            </div>
          )}

          {message?.type === 'success' && (
            <div className="p-3 mb-4 bg-green-100 border border-green-300 rounded text-green-700 text-sm">
              {message.text}
            </div>
          )}

          {message?.type === 'error' && (
            <div className="p-3 mb-4 bg-red-100 border border-red-300 rounded text-red-700 text-sm">
              {message.text}
            </div>
          )}

          <div className="flex gap-2">
            <button
              onClick={handlePublish}
              disabled={!canSubmit}
              className="flex-1 px-4 py-2 bg-purple-500 text-white rounded hover:bg-purple-600 disabled:opacity-50 disabled:cursor-not-allowed font-medium"
            >
              {isLoading ? 'Publishing...' : 'Publish Cast'}
            </button>

            <button
              onClick={() => setText('')}
              disabled={isLoading}
              className="px-4 py-2 border rounded hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Clear
            </button>
          </div>

          <p className="text-xs text-gray-500 mt-4">
            💡 Tip: Use channels to organize your casts. Press Publish to share immediately,
            or schedule posts from the main compose interface.
          </p>
        </>
      )}
    </div>
  )
}
