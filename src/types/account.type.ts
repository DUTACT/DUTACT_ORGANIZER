export interface AuthBody {
  username: string
  password: string
}

export interface AuthResponse {
  accessToken: string
}

export type UserRole = 'ADMIN' | 'STUDENT_AFFAIRS_OFFICE' | 'EVENT_ORGANIZER'
