import { Users } from 'src/types/user.type'

export const setAccessTokenToLS = (access_token: string) => {
  localStorage.setItem('access_token', access_token)
}
export const clearLS = () => {
  localStorage.removeItem('access_token')
  localStorage.removeItem('profile')
}

export const getAccessTokenFromLS = () => localStorage.getItem('access_token') || ''

export const getProfileFromLS = () => {
  const result = localStorage.getItem('profile')
  if (result) {
    return JSON.parse(result)
  }
}

export const setProfileToLS = (profile: Users) => {
  localStorage.setItem('profile', JSON.stringify(profile))
}
