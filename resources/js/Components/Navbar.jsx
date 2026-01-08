import {Link, usePage} from '@inertiajs/react';
import { route } from 'ziggy-js';
import { useEffect, useState } from 'react'
import NotificationDropdown from './NotificationDropdown';


const Navbar = () => {
  const { auth } = usePage().props
  const user = auth?.user
  const [mobileOpen, setMobileOpen] = useState(false)

  const [notifications, setNotifications] = useState(
    auth?.notifications || []
  )

useEffect(() => {
    console.log('Initial notifications:', notifications);

    if (!user) return;

    const channelName = `users.${user.id}`;
    console.log('Subscribing to channel:', channelName);

    // Subscribe ke channel
    const channel = window.Echo.private(channelName);
    
    // Check jika berhasil subscribe
    channel.subscribed(() => {
        console.log('Successfully subscribed to:', channelName);
    });

    // Listen ke notification broadcast
    // Format: .Illuminate\\Notifications\\Events\\BroadcastNotificationCreated
    channel.notification((notification) => {
        console.log('Notification received:', notification);
        
        // const newNotification = {
        //   id: notification.id || Date.now(),
        //   data: {
        //     listing_id: notification.listing_id,
        //     title: notification.title,
        //     message: notification.message,
        //     url: notification.url,
        //     search_name: notification.search_name,
        //   },
        //   read_at: null,
        //   created_at: new Date().toISOString(),
        // };
        
        setNotifications(prev => [notification, ...prev]);
    });

    // Atau jika pakai broadcastAs, listen seperti ini:
    channel.listen('.SavedSearchMatched', (data) => {
        console.log('SavedSearchMatched event received:', data);
        
         const normalizedNotification = {
          id: data.id,
          type: data.type ?? 'App\\Notifications\\SavedSearchMatchedNotification',
          data: {
            listing_id: data.listing_id,
            title: data.title,
            message: data.message,
            url: data.url,
            search_name: data.search_name,
          },
          read_at: null,
          created_at: new Date().toISOString(),
        };
        
        setNotifications(prev => [normalizedNotification, ...prev]);
    });

    // Error handling
    channel.error((error) => {
        console.error('Channel error:', error);
    });

    return () => {
      console.log('Leaving channel:', channelName);
      window.Echo.leave(channelName);
    };
  }, [user?.id]);

  const navLinkClass =
    "block py-2 text-lg font-medium text-gray-700 hover:text-black transition-colors"

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
              className="object-contain w-12 h-12"
            />
            <span>Re-Source</span>
          </Link>

          {/*Desktop Navigation*/}
          <div className="items-center hidden space-x-8 lg:flex">
            <NavLinks />
          </div>

          {/*Desktop Auth*/}
          <div className="items-center hidden space-x-4 lg:flex">
            {user?.role == 'taker' && (
              <NotificationDropdown
                notifications={notifications}
                setNotifications={setNotifications}
              />
            )}
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
          <div className='inline-flex items-center justify-center p-2 text-gray-700 rounded-md lg:hidden hover:bg-gray-100'>
            {user?.role == 'taker' && (
              <NotificationDropdown
                notifications={notifications}
                setNotifications={setNotifications}
              />
            )}
            <button
              className="pl-4"
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
      </div>

      {/*Hamburger Dropdown*/}
      {mobileOpen && (
        <div className="bg-white border-t border-gray-200 lg:hidden">
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
                    className="px-4 py-2 text-lg text-center border border-black rounded"
                  >
                    Sign Up
                  </Link>
                  <Link
                    href="/login"
                    className="px-4 py-2 text-lg text-center text-white bg-black rounded"
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
