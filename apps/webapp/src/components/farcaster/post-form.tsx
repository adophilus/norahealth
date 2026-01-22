/**
 * Post Form - Compose and publish casts to Farcaster
 * @module components/farcaster/post-form
 */

'use client'

import { useState } from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { usePost } from '@/hooks/use-post'
import { useFarcasterAuth } from './farcaster-auth-provider'
import { Send, Clock, AlertCircle } from 'lucide-react'
import { ScheduleDialog } from './schedule-dialog'

const MAX_CHARS = 400

const postFormVariants = cva(
  'w-full space-y-4 rounded-lg border p-4',
  {
    variants: {
      variant: {
        default: 'border-border bg-card',
        compact: 'border-0 bg-transparent p-0',
      },
    },
    defaultVariants: { variant: 'default' },
  }
)

interface PostFormProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof postFormVariants> {
  onPostSuccess?: () => void
}

/**
 * Form component for composing and publishing casts
 * Includes textarea, character counter, and send/schedule buttons
 */
export function PostForm({
  variant,
  className,
  onPostSuccess,
  ...props
}: PostFormProps) {
  const [content, setContent] = useState('')
  const [channelId, setChannelId] = useState('')
  const [showScheduleDialog, setShowScheduleDialog] = useState(false)

  const { isConnected } = useFarcasterAuth()
  const { postCast, isPosting } = usePost({
    onSuccess: () => {
      setContent('')
      setChannelId('')
      onPostSuccess?.()
    },
  })

  const charCount = content.length
  const isOverLimit = charCount > MAX_CHARS
  const canSubmit = content.trim().length > 0 && !isOverLimit && isConnected && !isPosting

  const handleSubmit = () => {
    if (!canSubmit) return
    postCast({
      content: content.trim(),
      channelId: channelId.trim() || undefined,
    })
  }

  return (
    <>
      <div
        className={cn(postFormVariants({ variant }), className)}
        {...props}
      >
        {!isConnected && (
          <div className="flex items-center gap-2 p-3 rounded-md bg-amber-50 dark:bg-amber-950/30 text-amber-700 dark:text-amber-400 text-sm">
            <AlertCircle className="size-4 flex-shrink-0" />
            <span>Connect your Farcaster account to post</span>
          </div>
        )}

        <div className="space-y-2">
          <Label htmlFor="post-content" className="sr-only">
            Cast content
          </Label>
          <Textarea
            id="post-content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="What's on your mind?"
            className="min-h-[120px] resize-none"
            disabled={!isConnected || isPosting}
          />

          <div className="flex items-center justify-between">
            <span
              className={cn(
                'text-xs font-medium transition-colors',
                isOverLimit
                  ? 'text-destructive'
                  : charCount > MAX_CHARS * 0.9
                    ? 'text-amber-600 dark:text-amber-400'
                    : 'text-muted-foreground'
              )}
            >
              {charCount} / {MAX_CHARS}
            </span>
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="channel-id">Channel (optional)</Label>
          <Input
            id="channel-id"
            value={channelId}
            onChange={(e) => setChannelId(e.target.value.toLowerCase())}
            placeholder="e.g., farcaster, onchain"
            disabled={!isConnected || isPosting}
          />
        </div>

        <div className="flex gap-2">
          <Button
            onClick={handleSubmit}
            disabled={!canSubmit}
            className="flex-1"
          >
            {isPosting ? (
              <>
                <span className="animate-spin">⟳</span>
                Posting...
              </>
            ) : (
              <>
                <Send className="size-4" />
                Send Post
              </>
            )}
          </Button>

          <Button
            variant="outline"
            onClick={() => setShowScheduleDialog(true)}
            disabled={!content.trim() || isOverLimit || !isConnected}
          >
            <Clock className="size-4" />
            Schedule
          </Button>
        </div>
      </div>

      <ScheduleDialog
        open={showScheduleDialog}
        onOpenChange={setShowScheduleDialog}
        content={content.trim()}
        channelId={channelId.trim() || undefined}
        onScheduled={() => {
          setContent('')
          setChannelId('')
          setShowScheduleDialog(false)
        }}
      />
    </>
  )
}
