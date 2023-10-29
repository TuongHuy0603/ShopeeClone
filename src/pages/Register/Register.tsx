/* eslint-disable @typescript-eslint/no-misused-promises */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { Link, useNavigate } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { Schema, schema } from 'src/utils/rule'
import { yupResolver } from '@hookform/resolvers/yup'
import Input from 'src/components/Input'
import { useMutation } from '@tanstack/react-query'
import authApi from 'src/apis/auth.api'
import { pick } from 'lodash'
import { isAxiosUnprocessableEntityError } from 'src/utils/utils'
import { ErrorResponse } from 'src/types/utils.type'
import { useContext } from 'react'
import { AppContext } from 'src/contexts/app.context'
import Button from 'src/components/Button'
type FormData = Schema
export default function Register() {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  const { setIsAuthenticated, setProfile } = useContext(AppContext)
  const navigate = useNavigate()
  const { register, handleSubmit, setError, formState: { errors } } = useForm<FormData>({ resolver: yupResolver(schema) })
  const registerAccountMutation = useMutation({
    mutationFn: (body: Pick<FormData, 'email' | 'password' | 'confirm_password'>) => authApi.registerAccount(body)
  })
  const onSubmit = handleSubmit(data => {
    const body = pick(data, ['email', 'password', 'confirm_password'])
    registerAccountMutation.mutate(body, {
      onSuccess: (data) => {
        setIsAuthenticated(true)
        navigate('/')
        setProfile(data.data.data.user)
      },
      onError: (error) => {
        if (isAxiosUnprocessableEntityError<ErrorResponse<Omit<FormData, 'confirm_password'>>>(error)) {
          const formError = error.response?.data.data
          if (formError) {
            Object.keys(formError).forEach((key) => {
              setError(key as keyof FormData, {
                message: formError[key as keyof Omit<FormData, "confirm_password">],
                type: "Server"
              })
            })
          }
        }
      }
    })

  })
  return (
    <div className='bg-orange'>
      <div className="max-w-7xl mx-auto px-4">
        <div className='grid grid-cols-1 lg:grid-cols-5 py-12 lg:py-32 lg:pr-10'>
          <div className="lg:col-span-2 lg:col-start-4">
            <form className=' p-10 rounded bg-white shadow-sm' onSubmit={onSubmit} noValidate>
              <div className="text-2xl">Đăng ký</div>

              <Input name='email' register={register} type='email' placeholder='email' className='mt-8' errorMessage={errors.email?.message} />
              <Input name='password' register={register} type='password' placeholder='password' className='mt-2' errorMessage={errors.password?.message} />
              <Input name='confirm_password' register={register} type='password' placeholder='confirm password' className='mt-2' errorMessage={errors.confirm_password?.message} />
              <div className='mt-3'>
                <Button isLoading={registerAccountMutation.isLoading}
                  disabled={registerAccountMutation.isLoading} className="w-full text-center py-4 px-2 uppercase bg-red-500 text-white text-sm hover:bg-red-600 flex justify-center items-center "> Đăng Ký</Button>
              </div>
              <div className="mt-8 text-center ">
                <div className="flex items-center justify-center">
                  <span className='text-gray-300'>
                    Bạn đã có tài khoản?
                  </span>
                  <Link to='/login' className="ml-1 text-red-400">
                    Đăng nhập
                  </Link>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div >
  )
}
