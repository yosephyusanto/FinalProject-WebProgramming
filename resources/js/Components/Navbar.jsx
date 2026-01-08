import {Link, usePage} from '@inertiajs/react';
import { route } from 'ziggy-js';
import { useEffect, useState } from 'react'


const Navbar = () => {
  const {auth} = usePage().props
  const user = auth?.user
  const [notifications, setNotifications] = useState(
    auth?.notifications || []
  )

  useEffect(() => {
    if (!user) return

    window.Echo.private(`App.Models.User.${user.id}`)
      .notification((notification) => {
        setNotifications(prev => [notification, ...prev])
      })

    return () => {
      window.Echo.leave(`private-App.Models.User.${user.id}`)
    }
  }, [user])


  const NavLinks = () => (
    <>
      {!user && (
        <>
          <Link href={route('home')} className={navLinkClass}>Home</Link>
          <Link href={route('marketplace.index')} className={navLinkClass}>Marketplace</Link>
          <Link href={route('gallery.index')} className={navLinkClass}>Gallery</Link>
          <Link href={route('about')} className={navLinkClass}>About Us</Link>
        </>
      )}

      {user?.role === 'giver' && (
        <>
          <Link href={route('home')} className={navLinkClass}>Home</Link>
          <Link href={route('marketplace.index')} className={navLinkClass}>Marketplace</Link>
          <Link href={route('my-products')} className={navLinkClass}>My Products</Link>
          <Link href={route('messages.index')} className={navLinkClass}>Message</Link>
          <Link href={route('gallery.index')} className={navLinkClass}>Gallery</Link>
        </>
      )}

      {user?.role === 'taker' && (
        <>
          <Link href={route('home')} className={navLinkClass}>Home</Link>
          <Link href={route('marketplace.index')} className={navLinkClass}>Marketplace</Link>
          <Link href={route('searches.index')} className={navLinkClass}>Saved Search</Link>
          <Link href={route('my-claims')} className={navLinkClass}>My Claims</Link>
          <Link href={route('messages.index')} className={navLinkClass}>Message</Link>
          <Link href={route('my-gallery.index')} className={navLinkClass}>My Gallery</Link>
          <Link href={route('gallery.index')} className={navLinkClass}>Gallery</Link>
        </>
      )}
    </>
  )

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
                  <Link href={route('home')} className={navLinkClass}>Home</Link>
                  <Link href={route('marketplace.index')} className={navLinkClass}>Marketplace</Link>
                  <Link href={route('gallery.index')} className={navLinkClass}>Gallery</Link>
                </>
              )}

              {user?.role == 'giver' && (
                <>
                  <Link href={route('home')} className={navLinkClass}>Home</Link>
                  <Link href={route('marketplace.index')} className={navLinkClass}>Marketplace</Link>
                  <Link href={route('listings.create')} className={navLinkClass}>Create Listings</Link>
                  <Link href={route('my-products')} className={navLinkClass}>My Listings</Link>
                  <Link href={route('messages.index')} className={navLinkClass}>Messages</Link>
                  <Link href={route('gallery.index')} className={navLinkClass}>Gallery</Link>
                </>
              )}

              {user?.role == 'taker' && (
                <>
                  <Link href={route('home')} className={navLinkClass}>Home</Link>
                  <Link href={route('marketplace.index')} className={navLinkClass}>Marketplace</Link>
                  <Link href={route('searches.index')} className={navLinkClass}>Saved Search</Link>
                  <Link href={route('my-claims')} className={navLinkClass}>My Claims</Link>
                  <Link href={route('messages.index')} className={navLinkClass}>Message</Link>
                  <Link href={route('my-gallery.index')} className={navLinkClass}>My Gallery</Link>
                  <Link href={route('gallery.index')} className={navLinkClass}>Gallery</Link>
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