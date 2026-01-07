import React from 'react'
import Navbar from '@/Components/Navbar'
import Toast from '../Components/Toast'

const AppLayout = ({children}) => {
  return (
    <div className='min-h-screen font-sans antialiased bg-base-100 text-base-content'>
      <Navbar />
      <main className='p-4 pt-20'>
        <Toast />
        {children}
      </main>
    </div>
  )
}

export default AppLayout