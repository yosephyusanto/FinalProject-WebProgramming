import {Link, usePage} from '@inertiajs/react';
import { route } from 'ziggy-js';
import { useEffect, useState } from 'react'
import NotificationDropdown from './NotificationDropdown';


const Navbar = () => {
  const {auth} = usePage().props
  const user = auth?.user
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
        
        // const newNotification = {
        //   id: Date.now(),
        //   data: {
        //     listing_id: data.listing_id,
        //     title: data.title,
        //     message: data.message,
        //     url: data.url,
        //     search_name: data.search_name,
        //   },
        //   read_at: null,
        //   created_at: new Date().toISOString(),
        // };
        
        setNotifications(prev => [notification, ...prev]);
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
                  <Link href={route('home')} className={navLinkClass}>Home</Link>
                  <Link href={route('marketplace.index')} className={navLinkClass}>Marketplace</Link>
                  <Link href={route('gallery.index')} className={navLinkClass}>Gallery</Link>
                </>
              )}

              {user?.role == 'giver' && (
                <>
                  <Link href={route('home')} className={navLinkClass}>Home</Link>
                  <Link href={route('marketplace.index')} className={navLinkClass}>Marketplace</Link>
                  <Link href='' className={navLinkClass}>My Listings</Link>
                  <Link href={route('gallery.index')} className={navLinkClass}>Gallery</Link>
                </>
              )}

              {user?.role == 'taker' && (
                <>
                  <Link href={route('home')} className={navLinkClass}>Home</Link>
                  <Link href={route('marketplace.index')} className={navLinkClass}>Marketplace</Link>
                  <Link href={route('searches.index')} className={navLinkClass}>Saved Search</Link>
                  <Link href={route('my-gallery.index')} className={navLinkClass}>My Gallery</Link>
                  <Link href={route('gallery.index')} className={navLinkClass}>Gallery</Link>
                </>
              )}
            </ul>
          </div>
          
          {/* Auth Buttons or User Info */}
          <div className='flex items-center space-x-4'>
            {user && (
              <NotificationDropdown
                notifications={notifications}
                setNotifications={setNotifications}
              />
            )}
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