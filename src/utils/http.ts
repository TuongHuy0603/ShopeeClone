/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import axios, { AxiosError } from 'axios'
import { type AxiosInstance } from 'axios'
import HttpStatusCode from 'src/constant/httpStatusCode.enum'
import { toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { AuthResponse } from 'src/types/auth.type'
import { clearLS, getAccessTokenFromLS, setAccessTokenToLS, setProfileToLS } from './auth'
import path from 'src/constant/path'
import config from 'src/constant/config'

class Http {
  instance: AxiosInstance
  private accessToken: string
  constructor() {
    this.accessToken = getAccessTokenFromLS()
    this.instance = axios.create({
      baseURL: config.baseURL,
      timeout: 1000,
      headers: {
        'Content-Type': 'application/json'
      }
    })
    this.instance.interceptors.request.use(
      (config) => {
        if (this.accessToken && this.accessToken !== undefined) {
          config.headers.authorization = this.accessToken
          return config
        }
        return config
      },
      (error) => {
        return Promise.reject(error)
      }
    )
    this.instance.interceptors.response.use(
      (response) => {
        const { url } = response.config
        if (url === path.login || (url === path.register && typeof url !== 'undefined')) {
          const data = response.data as AuthResponse
          this.accessToken = data.data.access_token
          setAccessTokenToLS(this.accessToken)
          setProfileToLS(data.data.user)
        } else if (url === path.logout && typeof url !== 'undefined') {
          this.accessToken = ''
          clearLS()
        }
        return response
      },
      (error: AxiosError) => {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-explicit-any
        if (
          (error.response?.data as any)?.data?.name === 'EXPIRED_TOKEN' &&
          error.response?.status === HttpStatusCode.Unauthorized
        ) {
          this.accessToken = ''
          clearLS()
          return
        }

        if (error.code === 'ERR_NETWORK') {
          toast.error(error.message)
        }

        if (error.response?.status === HttpStatusCode.PayloadTooLarge) {
          toast.error('Kích thước file không được lớn hơn 1MB')
        }
        if (error.response?.status !== HttpStatusCode.UnprocessableEntity) {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-redundant-type-constituents
          const data: any | undefined = error.response?.data
          // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access

          const message = data?.message || error.message
          // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
          toast.error(message)
        }

        return Promise.reject(error)
      }
    )
  }
}
const http = new Http().instance

export default http
