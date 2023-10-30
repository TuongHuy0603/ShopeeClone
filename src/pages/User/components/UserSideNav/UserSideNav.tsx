import classNames from 'classnames'
import { useContext } from 'react'
import { useTranslation } from 'react-i18next'
import { Link, NavLink } from 'react-router-dom'
import path from 'src/constant/path'
import { AppContext } from 'src/contexts/app.context'
import { getAvatarURL } from 'src/utils/utils'

export default function UserSideNav() {
  const { t } = useTranslation('profile')
  const { profile } = useContext(AppContext)
  return (
    <div>
      <div className='flex items-center border-b border-b-gray-200 py-4'>
        <Link to={path.profile} className='h-12 w-12 flex-shrink-0 overflow-hidden rounded-full border-black'>
          <img src={getAvatarURL(profile?.avatar)} alt='' className='h-full w-full object-cover' />
        </Link>
        <div className="flex-grow pl-4">
          <div className="mb-1 truncate font-semibold text-gray-600">
            {profile?.name}
          </div>
          <div className="mb-1 truncate font-semibold text-gray-600">
            <Link to={path.profile} className='flex items-center text-gray-500 capitalize'>
              <svg width={12} height={12} viewBox="0 0 12 12" xmlns="http://www.w3.org/2000/svg" style={{ marginRight: 4 }}><path d="M8.54 0L6.987 1.56l3.46 3.48L12 3.48M0 8.52l.073 3.428L3.46 12l6.21-6.18-3.46-3.48" fill="#9B9B9B" fillRule="evenodd"></path></svg>
              {t("Profile.change profile")}
            </Link>
          </div>
        </div>
      </div>
      <div className="mt-7">
        <NavLink to={path.profile} className={({ isActive }) => classNames('flex items-center transition-colors capitalize', { 'text-orange': isActive, 'text-gray-600': !isActive })}>
          <div className='mr-4 h-[22px] w-[22px]'>
            <img src="https://cf.shopee.vn/file/ba61750a46794d8847c3f463c5e71cc4" alt="" className="h-full w-full" />
          </div>
          {t("Profile.my account")}
        </NavLink>
        <NavLink to={path.changePassword} className={({ isActive }) => classNames('mt-4 flex items-center transition-colors capitalize', { 'text-orange': isActive, 'text-gray-600': !isActive })}>
          <div className='mr-4 h-[22px] w-[22px]'>
            <img src="https://cf.shopee.vn/file/ba61750a46794d8847c3f463c5e71cc4" alt="" className="h-full w-full" />
          </div>
          {t("Profile.changepassword")}
        </NavLink>
        <NavLink to={path.historyPurchase} className={({ isActive }) => classNames('mt-4 flex items-center transition-colors capitalize', { 'text-orange': isActive, 'text-gray-600': !isActive })}>
          <div className='mr-4 h-[22px] w-[22px]'>
            <img src="https://cf.shopee.vn/file/f0049e9df4e536bc3e7f140d071e9078" alt="" className="h-full w-full" />
          </div>
          {t("Profile.my purchase")}
        </NavLink>
      </div>
    </div >
  )
}
