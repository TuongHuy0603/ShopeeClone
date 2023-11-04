/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-misused-promises */
import { yupResolver } from '@hookform/resolvers/yup'
import { useMutation } from '@tanstack/react-query'
import { useContext } from 'react'
import { useForm } from 'react-hook-form'
import { Link, useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import authApi from 'src/apis/auth.api'
import Button from 'src/components/Button'
import Input from 'src/components/Input'
import { AppContext } from 'src/contexts/app.context'
import { ErrorResponse } from 'src/types/utils.type'
import { Helmet } from 'react-helmet-async'
import { schema, Schema } from 'src/utils/rule'
import { isAxiosUnprocessableEntityError } from 'src/utils/utils'
type FormData = Pick<Schema, "email" | "password">
export default function Login() {
  const { setIsAuthenticated, setProfile } = useContext(AppContext)
  const navigate = useNavigate()
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  const loginSchema = schema.pick(["email", "password"])
  const { register, handleSubmit, setError, formState: { errors } } = useForm<FormData>({ resolver: yupResolver(loginSchema) })
  const loginMutation = useMutation({
    mutationFn: (body: Omit<FormData, 'confirm_password'>) => authApi.login(body)
  })
  const onSubmit = handleSubmit(data => {
    loginMutation.mutate(data, {
      onSuccess: (data) => {
        setIsAuthenticated(true)
        navigate('/')
        setProfile(data.data.data.user)
      },
      onError: (error) => {
        if (isAxiosUnprocessableEntityError<ErrorResponse<FormData>>(error)) {
          const formError = error.response?.data.data
          toast.error(formError?.password)
          if (formError) {
            Object.keys(formError).forEach((key) => {
              setError(key as keyof FormData, {
                message: formError[key as keyof FormData],
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
      <Helmet>
        <title> Đăng nhập | Shopee Clone</title>
        <meta name='description' content='Đăng nhập vào dự án shopee clone' />
      </Helmet>
      <div className="container">
        <div className='grid grid-cols-1 lg:grid-cols-5 py-12 lg:py-32 lg:pr-10'>
          <div className="lg:col-span-2 lg:col-start-4">
            <form className=' p-10 rounded bg-white shadow-sm' onSubmit={onSubmit}>
              <div className="text-2xl">Đăng Nhập</div>
              <Input name='email' register={register} type='email' placeholder='email' className='mt-8' errorMessage={errors.email?.message} />
              <Input name='password' register={register} type='password' placeholder='password' className='mt-2' errorMessage={errors.email?.message} />
              <div className='mt-3'>
                <Button isLoading={loginMutation.isLoading}
                  disabled={loginMutation.isLoading} type='submit' className="w-full text-center py-4 px-2 uppercase bg-red-500 text-white text-sm hover:bg-red-600 justify-center items-center flex"> Đăng Nhập</Button>
              </div>
              <div className="mt-8 text-center ">
                <div className="flex items-center justify-center">
                  <span className='text-gray-300'>
                    Bạn đã chưa tài khoản?
                  </span>
                  <Link to='/register' className="ml-1 text-red-400">
                    Đăng ký
                  </Link>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}
