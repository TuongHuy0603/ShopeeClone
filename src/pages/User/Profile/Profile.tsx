import React from 'react'
import Input from 'src/components/Input'

export default function Profile() {
  return (
    <div className='rounded-sm bg-white px-2 pb-10 md:px-7 md:pb-20 shadow'>
      <div className="border-b border-b-gray-200 py-6">
        <h1 className="text-lg font-medium capitalize text-gray-900">
          Hồ sơ của tôi
        </h1>
        <div className="mt-1 text-sm text-gray-700">
          Quản lý thông tin hồ sơ để bảo mật tài khoản
        </div>
        <div className="mt-8 flex flex-col reverse md:flex-row md:items-star">
          <form className="mt-6 flex-grow md:mt-0 md:pr-12">
            <div className="flex-col flex-wrapsm:flex-row">
              <div className='sm:w-[20%] truncate pt-3 sm:text-right capitalize'>Email</div>
              <div className="sm:pl-5 sm:w-[80%]">
                <div className="pt-3 text-gray-700">
                  ere*******@gmail.com
                </div>
              </div>
            </div>
            <div className="mt-6 flex-col flex-wrap sm:flex-row">
              <div className='sm:w-[20%] truncate pt-3 sm:text-right capitalize'>Tên</div>
              <div className="sm:pl-5 sm:w-[80%]">
                <Input classNameInput='w-full rounded-sm border border-gray-300 px-3 py-2 outline-none focus:border-gray-500 focus:shadow-sm' />
              </div>
            </div>
            <div className="mt-2 flex-col flex-wrap sm:flex-row">
              <div className='sm:w-[20%] truncate pt-3 sm:text-right capitalize'>Số điện thoại</div>
              <div className="sm:pl-5 sm:w-[80%]">
                <Input classNameInput='w-full rounded-sm border border-gray-300 px-3 py-2 outline-none focus:border-gray-500 focus:shadow-sm' />
              </div>
            </div>
            <div className="mt-2 flex-col flex-wrap sm:flex-row">
              <div className='sm:w-[20%] truncate pt-3 sm:text-right capitalize'>Địa chỉ</div>
              <div className="sm:pl-5 sm:w-[80%]">
                <Input classNameInput='w-full rounded-sm border border-gray-300 px-3 py-2 outline-none focus:border-gray-500 focus:shadow-sm' />
              </div>
            </div>
            <div className="mt-2 flex-col flex-wrap sm:flex-row">
              <div className='w-[32%] truncate pt-3 sm:text-right capitalize'>Ngày sinh</div>
              <div className="sm:pl-5 sm:w-[80%]">
                <div className="flex justify-between">
                  <select className="h-10 w-[32%] rounded-sm border border-black/10 px-3">
                    <option disabled>Ngày</option>
                  </select>
                  <select className="h-10 w-[32%] rounded-sm border border-black/10 px-3">
                    <option disabled>Tháng</option>
                  </select>
                  <select className="h-10 w-[32%] rounded-sm border border-black/10 px-3">
                    <option disabled>Năm</option>
                  </select>
                </div>
              </div>
            </div>
          </form>
          <div className="flex justify-center md:72 md:border-l md:border-l-gray-200">
            <div className="flex flex-col items-center">
              <div className="my-5 h-24 w-24">
                <img src="https://i.ex-cdn.com/mgn.vn/files/content/2023/06/16/lmht-my-nu-ahri-don-tim-game-thu-qua-loat-art-hong-canh-sen-cuc-dep_5-1958.jpg" alt='' className='w-full h-full rounded-full object-cover' />
              </div>
              <input className='hidden' type='file' accept='.jpg,.jpeg,.png' />
              <button className="flex h-10 items-center justify-end rounded-sm border bg-white px-6 text-sm text-gray-600 shadow-sm">
                Chọn ảnh
              </button>
              <div className="mt-3 text-gray-400">
                <div>Dung lượng tối đa 1MB</div>
                <div>Định dạng:.JPEG,.PNG</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
