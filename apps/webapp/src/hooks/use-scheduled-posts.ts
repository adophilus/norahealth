/**
 * useScheduledPosts - React hook for fetching and managing scheduled posts
 * @module hooks/use-scheduled-posts
 */

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import {
  getScheduledPosts,
  deleteScheduledPost,
  schedulePost,
  APIError,
} from '@/lib/api/client'
import { useToast } from '@/hooks/use-toast'
import type { ScheduledPost } from '@/lib/types/farcaster'

interface SchedulePostParams {
  content: string
  scheduledTime: string
  channelId?: string
  embeds?: Array<{ url: string }>
}

/**
 * Hook for fetching scheduled posts with auto-refresh every 60 seconds
 */
export function useScheduledPosts() {
  const { user } = useFarcasterAuth()
  const queryClient = useQueryClient()
  const { toast } = useToast()

  // Query for fetching scheduled posts
  const query = useQuery<ScheduledPost[], Error>({
    queryKey: ['scheduled-posts', user?.signerUuid],
    queryFn: async () => {
      if (!user?.signerUuid) {
        return []
      }
      return getScheduledPosts(user.signerUuid)
    },
    enabled: !!user?.signerUuid,
    staleTime: 0, // Always consider data stale for real-time updates
    refetchInterval: 60000, // Auto-refetch every 60 seconds
    refetchOnWindowFocus: true,
  })

  // Mutation for scheduling a new post
  const scheduleMutation = useMutation({
    mutationFn: async (params: SchedulePostParams) => {
      if (!user?.signerUuid) {
        throw new Error('Not authenticated. Please connect your Farcaster account.')
      }

      return schedulePost(
        params.content,
        params.scheduledTime,
        user.signerUuid,
        params.channelId,
        params.embeds
      )
    },
    onSuccess: () => {
      toast({
        title: 'Post scheduled!',
        description: 'Your cast has been scheduled for publishing.',
      })

      // Invalidate and refetch scheduled posts
      queryClient.invalidateQueries({ queryKey: ['scheduled-posts'] })
    },
    onError: (error: Error) => {
      const message = error instanceof APIError
        ? error.message
        : 'Failed to schedule post. Please try again.'

      toast({
        title: 'Error',
        description: message,
        variant: 'destructive',
      })
    },
  })

  // Mutation for deleting a scheduled post
  const deleteMutation = useMutation({
    mutationFn: async (postId: string) => {
      return deleteScheduledPost(postId)
    },
    onSuccess: () => {
      toast({
        title: 'Post deleted',
        description: 'The scheduled post has been removed.',
      })

      // Invalidate and refetch scheduled posts
      queryClient.invalidateQueries({ queryKey: ['scheduled-posts'] })
    },
    onError: (error: Error) => {
      const message = error instanceof APIError
        ? error.message
        : 'Failed to delete post. Please try again.'

      toast({
        title: 'Error',
        description: message,
        variant: 'destructive',
      })
    },
  })

  return {
    // Query state
    scheduledPosts: query.data ?? [],
    isLoading: query.isLoading,
    isFetching: query.isFetching,
    error: query.error,
    refetch: query.refetch,

    // Schedule mutation
    schedulePost: scheduleMutation.mutate,
    schedulePostAsync: scheduleMutation.mutateAsync,
    isScheduling: scheduleMutation.isPending,

    // Delete mutation
    deletePost: deleteMutation.mutate,
    deletePostAsync: deleteMutation.mutateAsync,
    isDeleting: deleteMutation.isPending,
  }
}
