export interface AuthBody {
  username: string
  password: string
}

export interface AuthResponse {
  accessToken: string
}

export type UserRole = 'ADMIN' | 'STUDENT_AFFAIRS_OFFICE' | 'EVENT_ORGANIZER' | 'STUDENT'

// profile management
export interface Profile {
  name: string
  avatarUrl?: string
  phone: string
  address: string
  personInChargeName: string
}

export type ProfileBody = Omit<Profile, 'avatarUrl'> & {
  avatar?: File
}

export interface ChangePasswordBody {
  oldPassword: string
  newPassword: string
}

// account management
export interface Account {
  id: number
  username: string
  role: UserRole
  enabled: boolean
}

export interface StudentAccount extends Account {
  name: string
  phone?: string
  faculty?: string
  address?: string
  className?: string
  avatarUrl?: string
}