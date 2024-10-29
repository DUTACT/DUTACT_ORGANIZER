import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { getPostsOfEvent } from 'src/apis/post'
import { ApiError } from 'src/types/client.type'
import { Post } from 'src/types/post.type'

interface EventPostsResult {
  posts: Post[]
  setPosts: React.Dispatch<React.SetStateAction<Post[]>>
  error: ApiError | null
}

export function useEventPosts(): EventPostsResult {
  const [posts, setPosts] = useState<Post[]>([])

  const { id } = useParams<{ id: string }>()
  const eventId = parseInt(id ?? '0', 10)

  const { data: fetchedPosts, error } = getPostsOfEvent(eventId)

  useEffect(() => {
    if (fetchedPosts) {
      setPosts(fetchedPosts)
    }
  }, [fetchedPosts])

  return { posts, setPosts, error }
}
