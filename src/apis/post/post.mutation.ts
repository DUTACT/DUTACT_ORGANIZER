import { useMutation, UseMutationOptions, useQuery, UseQueryOptions } from '@tanstack/react-query'
import { mutationFetch, mutationFormData, queryFetch } from 'src/config/queryClient'
import { getPostUrl } from 'src/constants/endpoints'
import { ApiError } from 'src/types/client.type'
import { ChangePostStatusData, Post, PostBody } from 'src/types/post.type'

export const getPostsOfEvent = (eventId: number, options?: UseQueryOptions<Post[], ApiError>) => {
  return useQuery<Post[], ApiError>({
    queryKey: ['getAllPosts'],
    queryFn: async () => {
      const response = await queryFetch<Post[]>({
        url: getPostUrl(),
        inputParams: {
          event_id: eventId
        }
      })
      return response
    },
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

export const createPost = (options?: UseMutationOptions<Post, ApiError, PostBody>) => {
  return useMutation<Post, ApiError, PostBody>({
    mutationFn: async (body) => {
      const response = await mutationFormData<Post>({
        url: getPostUrl(),
        method: 'POST',
        body
      })
      return response
    },
    ...options
  })
}

export const changeStatusOfPost = (
  postId: number,
  options?: UseMutationOptions<ChangePostStatusData, ApiError, ChangePostStatusData>
) => {
  return useMutation<ChangePostStatusData, ApiError, ChangePostStatusData>({
    mutationFn: async (body) => {
      const response = await mutationFetch<ChangePostStatusData>({
        baseURL: getPostUrl(postId),
        url: '/status',
        method: 'PUT',
        body
      })
      return response
    },
    ...options
  })
}

export const deletePost = (options?: UseMutationOptions<number, ApiError, number>) => {
  return useMutation<number, ApiError, number>({
    mutationFn: async (postId: number) => {
      await mutationFetch<number>({
        url: getPostUrl(postId),
        method: 'DELETE'
      })
      return postId
    },
    ...options
  })
}
