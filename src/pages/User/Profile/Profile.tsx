import { yupResolver } from '@hookform/resolvers/yup'
import { useMutation, useQuery } from '@tanstack/react-query'
import { useContext, useEffect, useMemo, useRef, useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import userApi from 'src/apis/user.api'
import Button from 'src/components/Button'
import Input from 'src/components/Input'
import InputNumber from 'src/components/InputNumber'
import { UserSchema, userSchema } from 'src/utils/rule'
import DateSelect from '../components/DateSelect'
import { toast } from 'react-toastify'
import { AppContext } from 'src/contexts/app.context'
import { getAvatarURL, isAxiosUnprocessableEntityError } from 'src/utils/utils'
import { setProfileToLS } from 'src/utils/auth'

import { ErrorResponse } from 'src/types/utils.type'
import config from 'src/constant/config'
type FormData = Pick<UserSchema, 'name' | 'address' | 'avatar' | "date_of_birth" | 'phone'>
type FormDataError = Omit<FormData, 'date_of_birth'> & {
  date_of_birth?: string
}

const profileSchema = userSchema.pick(['name', 'address', 'avatar', 'date_of_birth', 'phone'])
export default function Profile() {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const { setProfile } = useContext(AppContext)
  const [file, setFile] = useState<File>()

  const previewImage = useMemo(() => {

    return file ? URL.createObjectURL(file) : ''

  }, [file])
  const { register, control, formState: { errors }, watch, setError, handleSubmit, setValue } = useForm<FormData>({
    defaultValues: {
      name: '',
      phone: '',
      address: "",
      date_of_birth: new Date(1990, 0, 1),
      avatar: ""
    }, resolver: yupResolver(profileSchema)
  })
  const avatar = watch('avatar')
  const updateProfileMutation = useMutation(userApi.updateProfile)
  const uploadAvatarMutation = useMutation(userApi.uploadAvatar)
  const { data: profileData, refetch } = useQuery({
    queryKey: ['profile'],
    queryFn: () => userApi.getProfile()
  })
  const profile = profileData?.data.data
  useEffect(() => {
    if (profile) {
      setValue('name', profile.name)
      setValue('phone', profile.phone)
      setValue('address', profile.address)
      setValue('avatar', profile.avatar)
      setValue('date_of_birth', profile.date_of_birth ? new Date(profile.date_of_birth) : new Date(1990, 0, 1))
    }
  }, [profile])

  const onSubmit = handleSubmit(async (data) => {
    try {
      let avatarName = avatar
      if (file) {
        const form = new FormData()
        form.append('image', file)
        const uploadRes = await uploadAvatarMutation.mutateAsync(form)
        avatarName = uploadRes.data.data
        setValue('avatar', avatarName)
      }

      const res = await updateProfileMutation.mutateAsync({
        ...data, avatar: avatarName, date_of_birth: String(data.date_of_birth?.toISOString()),
      })
      setProfile(res.data.data)
      setProfileToLS(res.data.data)
      refetch()
      toast.success(res.data.message)

    } catch (error) {
      if (isAxiosUnprocessableEntityError<ErrorResponse<FormDataError>>(error)) {
        const formError = error.response?.data.data
        if (formError) {
          Object.keys(formError).forEach((key) => {
            setError(key as keyof FormDataError, {
              message: formError[key as keyof FormDataError],
              type: "Server"
            })
          })
        }
      }
    }
  })

  const handleUpload = () => {
    fileInputRef.current?.click()

  }
  const onFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const fileFromLocal = event.target.files?.[0]
    if (fileFromLocal && fileFromLocal.size >= config.maxSizeUploadAvatar || !fileFromLocal?.type.includes("image")) {
      toast.error('Dung lượng tối đa 1MB & định dạng là .JPEG,.PNG')
    }
    setFile(fileFromLocal)
  }
  return (
    <div className='rounded-sm bg-white px-2 pb-10 md:px-7 md:pb-20 shadow'>
      <div className="border-b border-b-gray-200 py-6">
        <h1 className="text-lg font-medium capitalize text-gray-900">
          Hồ sơ của tôi
        </h1>
        <div className="mt-1 text-sm text-gray-700">
          Quản lý thông tin hồ sơ để bảo mật tài khoản
        </div>
        <form className="mt-8 flex flex-col reverse md:flex-row md:items-star" onSubmit={onSubmit}>
          <div className="md:w-[70%] mt-6 flex-grow md:mt-0 md:pr-12">
            <div className="flex flex-col flex-wrap sm:flex-row">
              <div className='sm:w-[20%] truncate pt-3 sm:text-right capitalize'>Email</div>
              <div className="sm:pl-5 sm:w-[80%]">
                <div className="pt-3 text-gray-700">
                  {profile?.email}
                </div>
              </div>
            </div>
            <div className="mt-6 flex flex-col flex-wrap sm:flex-row">
              <div className='sm:w-[20%] truncate pt-3 sm:text-right capitalize'>Tên</div>
              <div className="sm:pl-5 sm:w-[80%]">
                <Input register={register} name='name' placeholder='Tên' errorMessage={errors.name?.message} classNameInput='w-full rounded-sm border border-gray-300 px-3 py-2 outline-none focus:border-gray-500 focus:shadow-sm' />
              </div>
            </div>
            <div className="mt-2 flex-col flex flex-wrap sm:flex-row">
              <div className='sm:w-[20%] truncate pt-3 sm:text-right capitalize'>Số điện thoại</div>
              <div className="sm:pl-5 sm:w-[80%]">
                <Controller control={control} name='phone' render={
                  ({ field }) => (
                    <InputNumber classNameInput='w-full rounded-sm border border-gray-300 px-3 py-2 outline-none focus:border-gray-500 focus:shadow-sm' placeholder='Số điện thoại' errorMessage={errors.phone?.message} {...field} onChange={field.onChange} />
                  )
                } />
              </div>
            </div>
            <div className="mt-2 flex-col flex flex-wrap sm:flex-row">
              <div className='sm:w-[20%] truncate pt-3 sm:text-right capitalize'>Địa chỉ</div>
              <div className="sm:pl-5 sm:w-[80%]">
                <Input register={register} name='address' placeholder='Địa chỉ' errorMessage={errors.address?.message} classNameInput='w-full rounded-sm border border-gray-300 px-3 py-2 outline-none focus:border-gray-500 focus:shadow-sm' />
              </div>
            </div>
            <Controller control={control} name='date_of_birth' render={({ field }) => {
              return <DateSelect errorMessage={errors.date_of_birth?.message} value={field.value} onChange={field.onChange} />

            }} />
            <div className="mt-2 flex flex-col flex-wrap sm:flex-row">
              <div className='w-[20%] truncate pt-3 sm:text-right capitalize'>

              </div>
              <div className="sm:pl-5 sm:w-[80%]">
                <Button type='submit' className='flex rounded-sm items-center h-9 bg-orange  px-5 text-center text-white text-sm hover:bg-orange/80'>
                  Lưu
                </Button>
              </div>
            </div>
          </div>
          <div className="md:w-[30%]  flex justify-center md:border-l md:border-l-gray-200">
            <div className="flex flex-col items-center">
              <div className="my-5 h-24 w-24">
                <img src={previewImage || getAvatarURL(avatar)} alt='' className='w-full h-full rounded-full object-cover' />
              </div>
              <input ref={fileInputRef} className='hidden' type='file' accept='.jpg,.jpeg,.png' onChange={onFileChange} onClick={(e) => {
                (e.target as any).value = null

              }} />
              <button type='button' className="flex h-10 items-center justify-end rounded-sm border bg-white px-6 text-sm text-gray-600 shadow-sm" onClick={handleUpload}>
                Chọn ảnh
              </button>
              <div className="mt-3 text-gray-400">
                <div>Dung lượng tối đa 1MB</div>
                <div>Định dạng:.JPEG,.PNG</div>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}
