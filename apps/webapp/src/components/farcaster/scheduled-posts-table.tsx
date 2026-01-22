/**
 * Scheduled Posts Table - Display and manage scheduled posts
 * @module components/farcaster/scheduled-posts-table
 */

'use client'

import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'
import { useScheduledPosts } from '@/hooks/use-scheduled-posts'
import { useFarcasterAuth } from './farcaster-auth-provider'
import { Trash2, RefreshCw, Clock, CheckCircle, XCircle, Calendar } from 'lucide-react'
import type { ScheduledPostStatus } from '@/lib/types/farcaster'

const scheduledPostsTableVariants = cva('w-full', {
  variants: {
    variant: {
      default: '',
      compact: 'text-sm',
    },
  },
  defaultVariants: { variant: 'default' },
})

interface ScheduledPostsTableProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof scheduledPostsTableVariants> {}

// Status badge configuration
const statusConfig: Record<
  ScheduledPostStatus,
  { label: string; variant: 'default' | 'secondary' | 'destructive' | 'outline'; icon: typeof Clock }
> = {
  pending: {
    label: 'Pending',
    variant: 'secondary',
    icon: Clock,
  },
  posted: {
    label: 'Posted',
    variant: 'default',
    icon: CheckCircle,
  },
  failed: {
    label: 'Failed',
    variant: 'destructive',
    icon: XCircle,
  },
}

/**
 * Format a date string for display
 */
function formatScheduledTime(isoString: string): string {
  const date = new Date(isoString)
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  })
}

/**
 * Table component for displaying scheduled posts
 * Includes status badges, delete actions, and auto-refresh
 */
export function ScheduledPostsTable({
  variant,
  className,
  ...props
}: ScheduledPostsTableProps) {
  const { isConnected } = useFarcasterAuth()
  const {
    scheduledPosts,
    isLoading,
    isFetching,
    refetch,
    deletePost,
    isDeleting,
  } = useScheduledPosts()

  // Not connected state
  if (!isConnected) {
    return (
      <div
        className={cn(
          scheduledPostsTableVariants({ variant }),
          'rounded-lg border border-dashed p-8 text-center',
          className
        )}
        {...props}
      >
        <Calendar className="size-10 mx-auto text-muted-foreground mb-4" />
        <h3 className="font-medium text-foreground mb-1">No scheduled posts</h3>
        <p className="text-sm text-muted-foreground">
          Connect your Farcaster account to view and manage scheduled posts.
        </p>
      </div>
    )
  }

  // Loading state
  if (isLoading) {
    return (
      <div
        className={cn(scheduledPostsTableVariants({ variant }), className)}
        {...props}
      >
        <div className="space-y-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="flex items-center gap-4 p-3">
              <Skeleton className="h-4 flex-1" />
              <Skeleton className="h-6 w-20" />
              <Skeleton className="h-8 w-8" />
            </div>
          ))}
        </div>
      </div>
    )
  }

  // Empty state
  if (scheduledPosts.length === 0) {
    return (
      <div
        className={cn(
          scheduledPostsTableVariants({ variant }),
          'rounded-lg border border-dashed p-8 text-center',
          className
        )}
        {...props}
      >
        <Clock className="size-10 mx-auto text-muted-foreground mb-4" />
        <h3 className="font-medium text-foreground mb-1">No scheduled posts</h3>
        <p className="text-sm text-muted-foreground">
          Schedule a post and it will appear here.
        </p>
      </div>
    )
  }

  return (
    <div
      className={cn(scheduledPostsTableVariants({ variant }), className)}
      {...props}
    >
      {/* Header with refresh button */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-foreground">Scheduled Posts</h3>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => refetch()}
          disabled={isFetching}
        >
          <RefreshCw className={cn('size-4', isFetching && 'animate-spin')} />
          Refresh
        </Button>
      </div>

      {/* Posts table */}
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[50%]">Content</TableHead>
              <TableHead>Scheduled</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="w-[80px]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {scheduledPosts.map((post) => {
              const status = statusConfig[post.status]
              const StatusIcon = status.icon

              return (
                <TableRow key={post.id}>
                  <TableCell>
                    <p className="line-clamp-2 text-sm">{post.content}</p>
                    {post.channelId && (
                      <p className="text-xs text-muted-foreground mt-1">
                        /{post.channelId}
                      </p>
                    )}
                  </TableCell>
                  <TableCell>
                    <span className="text-sm">
                      {formatScheduledTime(post.scheduledTime)}
                    </span>
                  </TableCell>
                  <TableCell>
                    <Badge variant={status.variant} className="gap-1">
                      <StatusIcon className="size-3" />
                      {status.label}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {post.status === 'pending' && (
                      <Button
                        variant="ghost"
                        size="icon-sm"
                        onClick={() => deletePost(post.id)}
                        disabled={isDeleting}
                        className="text-destructive hover:text-destructive hover:bg-destructive/10"
                      >
                        <Trash2 className="size-4" />
                        <span className="sr-only">Delete</span>
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              )
            })}
          </TableBody>
        </Table>
      </div>

      {/* Auto-refresh indicator */}
      <p className="text-xs text-muted-foreground text-center mt-4">
        Auto-refreshes every minute • {scheduledPosts.length} post
        {scheduledPosts.length !== 1 ? 's' : ''} scheduled
      </p>
    </div>
  )
}
