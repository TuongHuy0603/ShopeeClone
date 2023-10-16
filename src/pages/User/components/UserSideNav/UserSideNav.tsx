import React from 'react'
import { Link } from 'react-router-dom'
import path from 'src/constant/path'

export default function UserSideNav() {
  return (
    <div>
      <div className='flex items-center border-b border-b-gray-200 py-4'>
        <Link to={path.profile} className='h-12 w-12 flex-shrink-0 overflow-hidden rounded-full border-black'>
          <img src='https://scontent.fsgn2-9.fna.fbcdn.net/v/t39.30808-6/382970708_843852937751046_9010989098792344335_n.jpg?_nc_cat=103&ccb=1-7&_nc_sid=5f2048&_nc_ohc=VC72dpSSDAMAX_f4R49&_nc_ht=scontent.fsgn2-9.fna&oh=00_AfDrSy87wY4jVeX2fqxSoXtX0XIIc50yRf4jiGMZU32RUA&oe=6530B650' alt='' className='h-full w-full object-cover' />
        </Link>
        <div className="flex-grow pl-4">
          <div className="mb-1 truncate font-semibold text-gray-600">
            <Link to={path.profile} className='flex items-center text-gray-500 capitalize'>
              <svg width={12} height={12} viewBox="0 0 12 12" xmlns="http://www.w3.org/2000/svg" style={{ marginRight: 4 }}><path d="M8.54 0L6.987 1.56l3.46 3.48L12 3.48M0 8.52l.073 3.428L3.46 12l6.21-6.18-3.46-3.48" fill="#9B9B9B" fill-rule="evenodd"></path></svg>
              Sửa hồ sơ
            </Link>
          </div>
        </div>
      </div>
      <div className="mt-7">
        <Link to={path.profile} className='flex items-center text-orange transition-colors capitalize'>
          <div className='mr-4 h-[22px] w-[22px]'>
            <img src="https://cf.shopee.vn/file/ba61750a46794d8847c3f463c5e71cc4" alt="" className="h-full w-full" />
          </div>
          Tài khoản của tôi
        </Link>
        <Link to={path.changePassword} className='flex mt-4 items-center text-gray-600 transition-colors capitalize'>
          <div className='mr-4 h-[22px] w-[22px]'>
            <img src="https://cf.shopee.vn/file/ba61750a46794d8847c3f463c5e71cc4" alt="" className="h-full w-full" />
          </div>
          Đổi mật khẩu
        </Link>
        <Link to={path.historyPurchase} className='flex mt-4  items-center text-orange transition-colors capitalize'>
          <div className='mr-4 h-[22px] w-[22px]'>
            <img src="https://cf.shopee.vn/file/f0049e9df4e536bc3e7f140d071e9078" alt="" className="h-full w-full" />
          </div>
          Đơn mua
        </Link>
      </div>
    </div>
  )
}
