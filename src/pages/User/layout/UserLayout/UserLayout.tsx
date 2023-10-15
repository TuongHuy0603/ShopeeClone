import React from 'react'
import UserSideNav from '../../components/UserSideNav'
interface Props {
  children?: React.ReactNode
}
export default function UserLayout({ children }: Props) {
  return (
    <div>
      <UserSideNav />
      {children}
    </div>
  )
}
