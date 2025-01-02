export type PostStatus = 'public' | 'removed'

export interface Post {
  id: number
  eventId: number
  content: string
  postedAt: string
  coverPhotoUrl?: string
  coverPhotoUrls: string[]
  status: {
    type: PostStatus
    label?: string
  }
}

export type PostBody = Omit<Post, 'id' | 'postedAt' | 'coverPhotoUrl' | 'status'> & {
  coverPhotos?: File[]
  keepCoverPhotoUrls?: string[]
}

export interface ChangePostStatusData {
  type: PostStatus
}

export interface PostFilterType {
  timeFrom: string
  timeTo: string
  types: PostStatus[]
}

export interface CoverPhotoData {
  type: 'file' | 'url'
  file?: File
  url?: string
}
