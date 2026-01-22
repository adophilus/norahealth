/**
 * Farcaster Platform Integration - Platform button and modal for Farcaster
 * @module components/farcaster/farcaster-platform
 */

'use client'

import { useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import { FarcasterConnectBtn } from './farcaster-auth'
import { useFarcasterAuth } from './farcaster-auth-provider'
import { usePost } from '@/hooks/use-post'
import { AlertCircle, CheckCircle } from 'lucide-react'

interface FarcasterPlatformProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  content: string
  onPost?: () => void
}

/**
 * Modal dialog for posting to Farcaster
 * Appears when user selects Farcaster channel
 */
export function FarcasterPlatform({
  open,
  onOpenChange,
  content,
  onPost,
}: FarcasterPlatformProps) {
  const [channelId, setChannelId] = useState('')
  const [error, setError] = useState<string | null>(null)

  const { isConnected, user } = useFarcasterAuth()
  const { postCast, isPosting } = usePost({
    onSuccess: () => {
      setChannelId('')
      setError(null)
      onOpenChange(false)
      onPost?.()
    },
  })

  const handlePost = () => {
    setError(null)

    // Validate content
    if (!content.trim()) {
      setError('Please write some content')
      return
    }

    if (content.length > 400) {
      setError('Content exceeds 400 character limit for Farcaster')
      return
    }

    postCast({
      content: content.trim(),
      channelId: channelId.trim() || undefined,
    })
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <div className="size-6 rounded-full bg-gradient-to-br from-[#855DCD] to-[#6B3FA0] flex items-center justify-center">
              <span className="text-xs font-bold text-white">F</span>
            </div>
            Post to Farcaster
          </DialogTitle>
          <DialogDescription>
            Share your post with the Farcaster community
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {/* Connection Status */}
          {!isConnected ? (
            <div>
              <Label className="text-sm font-medium mb-2 block">
                Connect Your Account
              </Label>
              <FarcasterConnectBtn showDisconnect={false} />
            </div>
          ) : (
            <div className="flex items-center gap-2 p-3 rounded-md bg-green-50 dark:bg-green-950/30 text-green-700 dark:text-green-400 text-sm">
              <CheckCircle className="size-4 flex-shrink-0" />
              <span>Connected as @{user?.username}</span>
            </div>
          )}

          <Separator />

          {/* Content Preview */}
          <div>
            <Label className="text-sm font-medium mb-2 block">Your Post</Label>
            <div className="p-3 rounded-md border bg-muted/50 text-sm line-clamp-4">
              {content || 'Your content will appear here...'}
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              {content.length} / 400 characters
            </p>
          </div>

          {/* Channel Selection */}
          {isConnected && (
            <div>
              <Label htmlFor="channel-id" className="text-sm font-medium">
                Channel (optional)
              </Label>
              <Input
                id="channel-id"
                value={channelId}
                onChange={(e) => setChannelId(e.target.value.toLowerCase())}
                placeholder="e.g., farcaster, onchain, dev"
                disabled={isPosting}
                className="mt-2"
              />
              <p className="text-xs text-muted-foreground mt-1">
                Leave empty to post to your home feed
              </p>
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div className="flex items-center gap-2 p-3 rounded-md bg-destructive/10 text-destructive text-sm">
              <AlertCircle className="size-4 flex-shrink-0" />
              {error}
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isPosting}
            className="flex-1"
          >
            Cancel
          </Button>
          <Button
            onClick={handlePost}
            disabled={!isConnected || isPosting || !content.trim()}
            className="flex-1"
          >
            {isPosting ? (
              <>
                <span className="animate-spin">⟳</span>
                Posting...
              </>
            ) : (
              'Post to Farcaster'
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
