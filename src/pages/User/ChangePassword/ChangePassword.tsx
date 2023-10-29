import { yupResolver } from "@hookform/resolvers/yup";
import { useMutation } from "@tanstack/react-query";
import { omit } from "lodash";

import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import userApi from "src/apis/user.api";
import Button from "src/components/Button";
import Input from "src/components/Input";
import { ErrorResponse } from "src/types/utils.type";
import { UserSchema, userSchema } from "src/utils/rule";
import { isAxiosUnprocessableEntityError } from "src/utils/utils";


type FormData = Pick<UserSchema, 'password' | 'confirm_password' | 'new_password'>
const passwordSchema = userSchema.pick(['password', 'confirm_password', 'new_password'])

export default function ChangePassword() {
  const updateProfileMutation = useMutation(userApi.updateProfile)
  const { register, formState: { errors }, reset, setError, handleSubmit } = useForm<FormData>({
    defaultValues: {
      password: '',
      new_password: '',
      confirm_password: ''
    }, resolver: yupResolver(passwordSchema)
  })
  const onSubmit = handleSubmit(async (data) => {
    try {
      const res = await updateProfileMutation.mutateAsync((omit(data, ['confirm_password'])))
      toast.success(res.data.message)
      reset()
    } catch (error) {
      if (isAxiosUnprocessableEntityError<ErrorResponse<FormData>>(error)) {
        const formError = error.response?.data.data
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
  return (
    <div className='rounded-sm bg-white px-2 pb-10 md:px-7 md:pb-20 shadow'>
      <div className="border-b border-b-gray-200 py-6">
        <h1 className="text-lg font-medium capitalize text-gray-900">
          Đổi mật khẩu
        </h1>
        <div className="mt-1 text-sm text-gray-700">
          Quản lý thông tin hồ sơ để bảo mật tài khoản
        </div>
        <form className="mt-8 mr-auto max-w-2xl" onSubmit={onSubmit}>
          <div className=" mt-6 flex-grow md:mt-0 md:pr-12">
            <div className="mt-2 flex-col flex flex-wrap sm:flex-row">
              <div className='sm:w-[30%] truncate pt-3 sm:text-right capitalize'>Mật khẩu cũ</div>
              <div className="sm:pl-5 sm:w-[70%]">
                <Input register={register} name='password' type="password" placeholder='Mật khẩu cũ' errorMessage={errors.password?.message} classNameInput='w-full rounded-sm border border-gray-300 px-3 py-2 outline-none focus:border-gray-500 focus:shadow-sm' />
              </div>
            </div>
            <div className="mt-2 flex-col flex flex-wrap sm:flex-row">
              <div className='sm:w-[30%] truncate pt-3 sm:text-right capitalize'>Mật khẩu mới</div>
              <div className="sm:pl-5 sm:w-[70%]">
                <Input name='new_password' type="password" register={register} placeholder='Mật khẩu mới' errorMessage={errors.new_password?.message} classNameInput='w-full rounded-sm border border-gray-300 px-3 py-2 outline-none focus:border-gray-500 focus:shadow-sm' />
              </div>
            </div>
            <div className="mt-2 flex-col flex flex-wrap sm:flex-row">
              <div className='sm:w-[30%] pt-3 sm:text-right capitalize'>Nhập lại mật khẩu </div>
              <div className="sm:pl-5 sm:w-[70%]">
                <Input name='confirm_password' type="password" register={register} placeholder='Nhập lại mật khẩu' errorMessage={errors.confirm_password?.message} classNameInput='w-full rounded-sm border border-gray-300 px-3 py-2 outline-none focus:border-gray-500 focus:shadow-sm' />
              </div>
            </div>
            <div className="mt-2 flex flex-col flex-wrap sm:flex-row">
              <div className='w-[30%] truncate pt-3 sm:text-right capitalize'>

              </div>
              <div className="sm:pl-5 sm:w-[70%]">
                <Button type='submit' className='flex rounded-sm items-center h-9 bg-orange  px-5 text-center text-white text-sm hover:bg-orange/80'>
                  Lưu
                </Button>
              </div>
            </div>
          </div>

        </form>
      </div>
    </div>
  )
}
