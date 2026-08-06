import type { UserType } from './enums'

export interface Profile {
  id: string
  fullName: string
  email: string
  type: UserType
  avatar: string | null
  createdAt: string
  updatedAt: string
}
