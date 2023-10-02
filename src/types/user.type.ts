type Role = 'User' | 'Admin'

export interface Users {
  _id: string
  roles: Role[]
  email: string
  name: string
  date_of_birth: null
  address: string
  phone: string
  createdAt: string
  updatedAt: string
}
