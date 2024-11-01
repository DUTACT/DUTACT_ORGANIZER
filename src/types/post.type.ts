export type PostStatus = 'public' | 'removed'

export interface Post {
  id: number
  eventId: number
  content: string
  postedAt: string
  coverPhotoUrl?: string
  status: {
    type: PostStatus
    label?: string
  }
}

export type PostBody = Omit<Post, 'id' | 'postedAt' | 'coverPhotoUrl' | 'status'> & {
  coverPhoto: File
}

export interface ChangePostStatusData {
  type: PostStatus
}

export interface PostFilterType {
  timeFrom: string
  timeTo: string
  types: PostStatus[]
}
