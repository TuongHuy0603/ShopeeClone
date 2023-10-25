type Role = 'User' | 'Admin'

export interface Users {
  _id: string
  roles?: Role[]
  email: string
  name?: string
  date_of_birth: string
  address?: string
  phone?: string
  avatar?: string
  createdAt: string
  updatedAt: string
}
