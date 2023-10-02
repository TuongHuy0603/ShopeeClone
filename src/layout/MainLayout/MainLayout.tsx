import React from 'react'
import Footer from 'src/components/Footer'
import Headers from 'src/components/Headers'
interface Props {
  children?: React.ReactNode
}
export default function MainLayout({ children }: Props) {
  return (
    <>
      <Headers />
      {children}
      <Footer />
    </>
  )
}
