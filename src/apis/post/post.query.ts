import { useQuery, UseQueryOptions } from '@tanstack/react-query'
import { queryFetch } from 'src/config/queryClient'
import { STALE_TIME } from 'src/constants/common'
import { getPostUrl } from 'src/constants/endpoints'
import { ApiError } from 'src/types/client.type'
import { Post } from 'src/types/post.type'

export const getPostsOfEvent = (eventId: number, options?: UseQueryOptions<Post[], ApiError>) => {
  return useQuery<Post[], ApiError>({
    queryKey: ['getAllPosts', eventId],
    queryFn: async () => {
      const response = await queryFetch<Post[]>({
        url: getPostUrl(),
        inputParams: {
          event_id: eventId
        }
      })
      return response
    },
    staleTime: options?.staleTime ?? STALE_TIME,
    ...options
  })
}

export const getPostById = (postId: number, options?: UseQueryOptions<Post, ApiError>) => {
  return useQuery<Post, ApiError>({
    queryKey: ['getPostById', postId],
    queryFn: async () => {
      const response = await queryFetch<Post>({ url: getPostUrl(postId) })
      return response
    },
    ...options
  })
}
