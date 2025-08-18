import React from 'react'
import NavBar from './nav/NavBar'
import MobileNavBar from './nav/MobileNavBar'

type Props = React.PropsWithChildren<{}>

const SidebarAni = ({ children }: Props) => {
  return (
    <div className='h-full w-full p-4 flex flex-col lg:flex-row gap-4'>
      <MobileNavBar />
      <NavBar />
      <main className='h-[calc(100%-80px)] lg:h-full w-full flex gap-4'>
        {children}
      </main>
    </div>
  )
}

export default SidebarAni
