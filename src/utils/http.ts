/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import axios, { AxiosError } from 'axios'
import axiox, { type AxiosInstance } from 'axios'
import HttpStatusCode from 'src/constant/httpStatusCode.enum'
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import { AuthResponse } from 'src/types/auth.type'
import { clearLS, getAccessTokenFromLS, setAccessTokenToLS, setProfileToLS } from './auth'
import path from 'src/constant/path'

class Http {
  instance: AxiosInstance
  private accessToken: string
  constructor() {
    this.accessToken = getAccessTokenFromLS()
    this.instance = axios.create({
      baseURL: 'https://api-ecom.duthanhduoc.com',
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
        console.log(response)
        const { url } = response.config
        console.log('this.url ', url)
        if (url === path.login || (url === path.register && url !== 'undefined')) {
          const data = response.data as AuthResponse
          this.accessToken = data.data.access_token
          setAccessTokenToLS(this.accessToken)
          setProfileToLS(data.data.user)
        } else if (url === path.logout && url !== 'undefined') {
          this.accessToken = ''
          clearLS()
        }
        return response
      },
      (error: AxiosError) => {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-explicit-any
        if ((error.response?.data as any).data.name === 'EXPIRED_TOKEN') {
          this.accessToken = ''
          clearLS()
          return
        }
        if (error.response?.status !== HttpStatusCode.UnprocessableEntity) {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-redundant-type-constituents
          const data: any | undefined = error.response?.data
          // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
          const message = data.message || error.message
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
