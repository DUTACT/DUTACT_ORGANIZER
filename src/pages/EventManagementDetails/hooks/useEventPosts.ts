import { getPostsOfEvent } from 'src/apis/post'
import { ApiError } from 'src/types/client.type'
import { Post } from 'src/types/post.type'
import { useEventId } from './useEventId'
import { useQueryClient } from '@tanstack/react-query'

interface EventPostsResult {
  posts: Post[]
  isLoading: boolean
  error: ApiError | null
  addPost: (newPost: Post) => void
}

export function useEventPosts(): EventPostsResult {
  const eventId = useEventId()
  const queryClient = useQueryClient()

  const { data: posts = [], isLoading, error } = getPostsOfEvent(eventId)

  const addPost = (newPost: Post) => {
    queryClient.setQueryData<Post[]>(['getAllPosts', eventId], (oldPosts) => {
      return oldPosts ? [newPost, ...oldPosts] : [newPost]
    })
  }

  return {
    posts,
    isLoading,
    error,
    addPost
  }
}
