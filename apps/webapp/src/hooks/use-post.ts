/**
 * usePost - React hook for posting casts to Farcaster
 * @module hooks/use-post
 */

import { useMutation, useQueryClient } from '@tanstack/react-query'
import { postToCast, APIError } from '@/lib/api/client'
import { useToast } from '@/hooks/use-toast'
import { useFarcasterAuth } from '@/components/farcaster/farcaster-auth-provider'
import type { PostCastResponse } from '@/lib/types/farcaster'

interface UsePostOptions {
  onSuccess?: (data: PostCastResponse) => void
  onError?: (error: Error) => void
}

interface PostParams {
  content: string
  channelId?: string
  embeds?: Array<{ url: string }>
}

/**
 * Hook for posting casts to Farcaster using TanStack Query mutations
 */
export function usePost(options?: UsePostOptions) {
  const queryClient = useQueryClient()
  const { toast } = useToast()
  const { user } = useFarcasterAuth()

  const mutation = useMutation({
    mutationFn: async ({ content, channelId, embeds }: PostParams) => {
      if (!user?.signerUuid) {
        throw new Error('Not authenticated. Please connect your Farcaster account.')
      }

      return postToCast(content, user.signerUuid, channelId, embeds)
    },
    onSuccess: (data) => {
      toast({
        title: 'Cast published!',
        description: 'Your cast has been posted to Farcaster.',
      })

      // Invalidate scheduled posts query to refresh the list
      queryClient.invalidateQueries({ queryKey: ['scheduled-posts'] })

      options?.onSuccess?.(data)
    },
    onError: (error: Error) => {
      const message = error instanceof APIError
        ? error.message
        : 'Failed to publish cast. Please try again.'

      toast({
        title: 'Error',
        description: message,
        variant: 'destructive',
      })

      options?.onError?.(error)
    },
  })

  return {
    postCast: mutation.mutate,
    postCastAsync: mutation.mutateAsync,
    isPosting: mutation.isPending,
    error: mutation.error,
    isSuccess: mutation.isSuccess,
    reset: mutation.reset,
  }
}
