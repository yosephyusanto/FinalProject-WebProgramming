import {Link, usePage} from '@inertiajs/react';
import React from 'react'

const Navbar = () => {
  const {auth} = usePage().props
  const user = auth?.user
  const navLinkClass = "text-sm font-medium text-gray-700 hover:text-black transition-colors"

  return (
    <nav className='fixed top-0 left-0 right-0 z-50 w-full h-16 border-b border-gray-200 shadow-sm bg-white/95 backdrop-blur-md'>
      <div className='px-10 mx-auto md:max-w-7xl lg:max-w-screen-2xl sm:px-8 md:px-6 lg:px4 xl:px-0'>
        <div className='flex items-center justify-between h-16'>
          {/* Logo */}
          <div className='flex-shrink-0'>
            <Link href="/">Re-Source</Link>
          </div>
          
          {/* Navigation Links */}
          <div className='hidden lg:block'>
            <ul className='flex items-center space-x-8'>
              {/* Guest */}
              {!user && (
                <>
                  <Link href="/marketplace" className={navLinkClass}>Marketplace</Link>
                </>
              )}

              {user?.role == 'giver' && (
                <>
                  <Link href="/marketplace" className={navLinkClass}>Marketplace</Link>
                  <Link href="/listings/create" className={navLinkClass}>Create Listing</Link>
                  <Link href="/gallery" className={navLinkClass}>Gallery</Link>
                </>
              )}

              {user?.role == 'taker' && (
                <>
                  <Link href="/marketplace" className={navLinkClass}>Marketplace</Link>
                  <Link href="/searches" className={navLinkClass}>Saved Search</Link>
                  <Link href="/gallery/create" className={navLinkClass}>Upload Project</Link>
                  <Link href="/gallery" className={navLinkClass}>Gallery</Link>
                </>
              )}
            </ul>
          </div>
          
          {/* Auth Buttons or User Info */}
          <div className='flex items-center space-x-4'>
            {user ? (
              <>
                <span>Hi, {user.name}</span>
                <Link href="/logout" method="post" as="button" className="px-3 py-1 text-white bg-red-500 rounded">Logout</Link>
              </>
            ) : (
              <>
                <Link href="/register" className="px-4 py-2 text-black bg-white border border-black rounded">Sign Up</Link>
                <Link href="/login" className="px-4 py-2 text-white bg-black rounded">Sign In</Link>
              </>
            )}            
          </div>

          {/* Hamburger Icon */}

          {/* Hamburger Menu Open */}
        </div>
      </div>
    </nav>
  )
}

export default Navbar