import { getPostById } from 'src/apis/post'
import { ApiError } from 'src/types/client.type'
import { Post } from 'src/types/post.type'
import { useQueryClient } from '@tanstack/react-query'

interface PostResult {
  post: Post | undefined
  isLoading: boolean
  error: ApiError | null
  updatePostInList: (updatedPost: Post) => void
}

export function usePost(postId: number): PostResult {
  const queryClient = useQueryClient()

  const { data: post, isLoading, error } = getPostById(postId)

  const updatePostInList = (updatedPost: Post): void => {
    queryClient.setQueryData<Post>(['getPostById', postId], () => updatedPost)

    queryClient.setQueryData<Post[]>(['getAllPosts', updatedPost.eventId], (oldPosts) => {
      return oldPosts?.map((post) => (post.id === updatedPost.id ? updatedPost : post))
    })
  }

  return {
    post,
    isLoading,
    error,
    updatePostInList
  }
}
