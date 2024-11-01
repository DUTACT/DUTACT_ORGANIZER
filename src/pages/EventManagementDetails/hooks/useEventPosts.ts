import { getPostsOfEvent } from 'src/apis/post'
import { ApiError } from 'src/types/client.type'
import { Post, PostStatus } from 'src/types/post.type'
import { useEventId } from './useEventId'
import { useQueryClient } from '@tanstack/react-query'
import { getStatusMessage } from 'src/utils/common'
import { POST_STATUS_MESSAGES } from 'src/constants/common'

interface EventPostsResult {
  posts: Post[]
  isLoading: boolean
  error: ApiError | null
  addPost: (newPost: Post) => void
  deletePost: (postId: number) => void
  updateStatusOfPost: (postId: number, type: PostStatus) => void
}

export function useEventPosts(): EventPostsResult {
  const eventId = useEventId()
  const queryClient = useQueryClient()

  const { data: posts = [], isLoading, error } = getPostsOfEvent(eventId)

  const addPost = (newPost: Post): void => {
    queryClient.setQueryData<Post[]>(['getAllPosts', eventId], (oldPosts) => {
      return oldPosts ? [newPost, ...oldPosts] : [newPost]
    })
  }

  const deletePost = (postId: number): void => {
    queryClient.setQueryData<Post[]>(['getAllPosts', eventId], (oldPosts) => {
      return oldPosts ? oldPosts.filter((post) => post.id !== postId) : []
    })
  }

  const updateStatusOfPost = (postId: number, type: PostStatus) => {
    queryClient.setQueryData<Post[]>(['getAllPosts', eventId], (oldPosts) => {
      return oldPosts?.map((post) =>
        post.id === postId ? { ...post, status: { type, label: getStatusMessage(POST_STATUS_MESSAGES, type) } } : post
      )
    })
  }

  return {
    posts,
    isLoading,
    error,
    addPost,
    deletePost,
    updateStatusOfPost
  }
}
