import { Link, usePage } from '@inertiajs/react'
import React, { useState } from 'react'
import { route } from 'ziggy-js'

const Navbar = () => {
  const { auth } = usePage().props
  const user = auth?.user
  const [mobileOpen, setMobileOpen] = useState(false)

  const navLinkClass =
    "block py-2 text-lg font-medium text-gray-700 hover:text-black transition-colors"

  const NavLinks = () => (
    <>
      {!user && (
        <>
          <Link href={route('home')} className={navLinkClass}>Home</Link>
          <Link href={route('marketplace.index')} className={navLinkClass}>Marketplace</Link>
          <Link href={route('gallery.index')} className={navLinkClass}>Gallery</Link>
        </>
      )}

      {user?.role === 'giver' && (
        <>
          <Link href={route('home')} className={navLinkClass}>Home</Link>
          <Link href={route('marketplace.index')} className={navLinkClass}>Marketplace</Link>
          <Link href="#" className={navLinkClass}>My Listings</Link>
          <Link href={route('gallery.index')} className={navLinkClass}>Gallery</Link>
        </>
      )}

      {user?.role === 'taker' && (
        <>
          <Link href={route('home')} className={navLinkClass}>Home</Link>
          <Link href={route('marketplace.index')} className={navLinkClass}>Marketplace</Link>
          <Link href={route('searches.index')} className={navLinkClass}>Saved Search</Link>
          <Link href={route('my-gallery.index')} className={navLinkClass}>My Gallery</Link>
          <Link href={route('gallery.index')} className={navLinkClass}>Gallery</Link>
        </>
      )}
    </>
  )

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 border-b border-gray-200 bg-white/95 backdrop-blur-md">
      <div className="px-6 lg:px-10 xl:px-16">
        <div className="flex items-center justify-between py-3 md:py-4">
          
          {/*Logo*/}
          <Link
            href="/"
            className="flex items-center gap-2 text-xl font-semibold"
          >
            <img
              src="/images/Logo.png"
              alt="Re-Source Logo"
              className="h-12 w-12 object-contain"
            />
            <span>Re-Source</span>
          </Link>

          {/*Desktop Navigation*/}
          <div className="hidden lg:flex items-center space-x-8">
            <NavLinks />
          </div>

          {/*Desktop Auth*/}
          <div className="hidden lg:flex items-center space-x-4">
            {user ? (
              <>
                <span className="text-lg text-gray-600">Hi, {user.name}</span>
                <Link
                  href="/logout"
                  method="post"
                  as="button"
                  className="px-3 py-1 text-lg text-white bg-red-500 rounded"
                >
                  Logout
                </Link>
              </>
            ) : (
              <>
                <Link
                  href="/register"
                  className="px-4 py-2 text-lg border border-black rounded"
                >
                  Sign Up
                </Link>
                <Link
                  href="/login"
                  className="px-4 py-2 text-lg text-white bg-black rounded"
                >
                  Sign In
                </Link>
              </>
            )}
          </div>

          {/*Hamburger Button*/}
          <button
            className="lg:hidden inline-flex items-center justify-center p-2 rounded-md text-gray-700 hover:bg-gray-100"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle menu"
          >
            {mobileOpen ? (
              <span className="text-2xl">✕</span>
            ) : (
              <span className="text-2xl">☰</span>
            )}
          </button>
        </div>
      </div>

      {/*Hamburger Dropdown*/}
      {mobileOpen && (
        <div className="lg:hidden border-t border-gray-200 bg-white">
          <div className="px-6 py-4 space-y-2">
            <NavLinks />

            <div className="pt-4 border-t border-gray-100">
              {user ? (
                <>
                  <p className="mb-2 text-lg text-gray-600">
                    Hi, {user.name}
                  </p>
                  <Link
                    href="/logout"
                    method="post"
                    as="button"
                    className="w-full px-4 py-2 text-lg text-white bg-red-500 rounded"
                  >
                    Logout
                  </Link>
                </>
              ) : (
                <div className="flex flex-col space-y-2">
                  <Link
                    href="/register"
                    className="px-4 py-2 text-lg border border-black rounded text-center"
                  >
                    Sign Up
                  </Link>
                  <Link
                    href="/login"
                    className="px-4 py-2 text-lg text-white bg-black rounded text-center"
                  >
                    Sign In
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  )
}

export default Navbar
