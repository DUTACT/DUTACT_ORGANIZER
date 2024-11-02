export interface AuthBody {
  username: string
  password: string
}

export interface AuthResponse {
  accessToken: string
}

export type UserRole = 'ADMIN' | 'STUDENT_AFFAIRS_OFFICE' | 'EVENT_ORGANIZER'

export interface Profile {
  name: string
  avatarUrl?: string
  phone: string
  address: string
  personInChargeName: string
}

export type ProfileBody = Omit<Profile, 'id' | 'avatarUrl'> & {
  avatar?: string
}
