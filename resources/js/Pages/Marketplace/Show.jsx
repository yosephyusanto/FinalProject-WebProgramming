import React from 'react'
import AppLayout from '../../Layouts/AppLayout'
import {route} from 'ziggy-js'
import { Link, router } from '@inertiajs/react'

const Show = ({listing, auth, flash}) => {
  console.log('=== DEBUG ===');
  console.log('Auth from props:', auth);
  console.log('User from auth:', auth?.user);
  console.log('User role:', auth?.user?.role);
  console.log('Is taker?', auth?.user?.role === 'taker');
  console.log('Flash messages:', flash);
  console.log('=== END DEBUG ===');
  console.log(listing);

  const formatTime = (dateString) => {
    return new Intl.DateTimeFormat('id-ID', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      timeZone: 'Asia/Jakarta',
    }).format(new Date(dateString))
  }

  const handleClaim = () => {
    router.post(route('claims.store', {listing: listing.id}), {}, {
      onSuccess: (page) => {
        console.log('=== onSuccess triggered ===');
        console.log('Page:', page);
        console.log('Current URL:', window.location.href);
        
        // If not redirected, manually check if we should go to messages
        if (window.location.pathname !== '/messages') {
          console.log('Not redirected to messages, checking why...');
          // Try to visit messages page
          router.visit('/messages');
        }
      },
      onError: (errors) => {
        console.error('=== onError triggered ===');
        console.error('Errors:', errors);
      },
      onFinish: () => {
        console.log('=== Request finished ===');
      }
    })

    // router.post(route('claims.store', {listing: listing.id}), {}, {
    //   onSuccess: () => {
    //     // Success will be redirected in the backend
    //   },
    //   onError: (errors) => {
    //     console.error('claim failed:', errors)
    //     if(errors.message){
    //       alert(errors.message)
    //     }
    //   }
    // })
  }


  return (
    <>
      <div className='px-4 mx-auto mt-8 max-w-7xl'>
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
          {/* Left: Image + Claim Button*/}
          <div className='space-y-6'>
            <div className='w-full overflow-hidden border h-96 rounded-xl'>
              {/* Image */}
              <img src={listing.photos?.length > 0 ? listing.photos[0].image_url : 'images/no_image.jpg'} alt="product"  className='object-cover w-full h-full'/>
            </div>

            {/* Claim Section */}
            <div className='p-6 space-y-6 bg-white border shadow-sm rounded-2xl'>
              <h2 className='text-xl font-semibold'>Claim This Item</h2>

              <div className='space-y-4'>
                <div className='p-4 rounded-lg bg-gray-50'>
                  <p className='mb-2 text-sm text-gray-600'>
                    By claiming this item, you will be able to:
                  </p>
                  <ul className='space-y-1 text-sm text-gray-600'>
                    <li>Start a chat with the giver</li>
                    <li>Coordinate pickup details</li>
                    <li>Get the exact location</li>
                    <li>Arrange the pickup time</li>
                  </ul>
                </div>
                {listing.status === 'available' ? (<button onClick={handleClaim} className='w-full px-6 py-3 font-semibold text-white transition-colors bg-black rounded-lg hover:bg-gray-800'>Claim</button>) : listing.status === 'claimed' ? (<button disabled className='w-full px-6 py-3 font-semibold text-white bg-yellow-500 rounded-lg cursor-not-allowed'>Already Claimed</button>) : (<button disabled className='w-full px-6 py-3 font-semibold text-white bg-gray-500 rounded-lg cursor-not-allowed'>Transaction Completed</button>)}

                <p className='text-sm text-center text-gray-600'>
                  {listing.status === 'available' && 'Click to claim this item and start coordinating pickup.'}
                  {listing.status === 'claimed' && 'This item has been claimed by someone.'}
                  {listing.status === 'completed' && 'This transaction has been completed.'}
                </p>
              </div>
            </div>
          </div>
          
          {/* Right: Details */}
          <div className='space-y-6'>
            {/* Status Badge */}
            <span className={`
              inline-block px-4 py-2 rounded-full text-sm font-semibold
              ${listing.stats === 'available' && 'bg-green-100 text-green-700'}
              ${listing.stats === 'claimed' && 'bg-yellow-100 text-yellow-700'}
              ${listing.stats === 'completed' && 'bg-green-100 text-green-700'}
            `}>Status: {listing.status.toUpperCase()}</span>
            
            {/* Title and Owner */}
            <div>
              <h1 className='text-3xl font-bold'>{listing.title}</h1>
              <p className='mt-2 text-gray-600'>Offered by <span className='font-semibold'>{listing.user.name}</span></p>
            </div>

            {/* Description */}
            <div className='pt-6 border-t'>
              <h2 className='mb-3 text-xl font-semibold'>Description</h2>
              <p className='text-gray-700 whitespace-pre-line'>{listing.description}</p>
            </div>

            {/* Details */}
            <div className='pt-6 border-t'>
              <h2 className='mb-4 text-xl font-semibold'>Material Details</h2>
              <div className='grid grid-cols-1 gap-4 md:grid-cols-2'>
                <div>
                  <p className='text-sm text-gray-500'>Material Type</p>
                  <p className='font-medium'>{listing.material_type}</p>
                </div>
                <div>
                  <p className='text-sm text-gray-500'>Condition</p>
                  <p className='font-medium'>{listing.condition}</p>
                </div>
                <div>
                  <p className='text-sm text-gray-500'>Weight</p>
                  <p className='font-medium'>{listing.estimated_weight}</p>
                </div>
                <div>
                  <p className='text-sm text-gray-500'>Location</p>
                  <p className='font-medium'>{listing.location}</p>
                </div>
                <div>
                  <p className='text-sm text-gray-500'>Pickup Start</p>
                  <p className='font-medium'>{formatTime(listing.pickup_window_start)}</p>
                </div>
                <div>
                  <p className='text-sm text-gray-500'>Pickup End</p>
                  <p className='font-medium'>{formatTime(listing.pickup_window_end)}</p>
                </div>
              </div>
            </div>

            {/* Add. Info */}
            <div className='p-6 border border-blue-100 bg-blue-50 rounded-xl'>
              <h3 className='mb-2 font-semibold text-blue-800'>Pickup Information</h3>
              <p className='text-sm text-blue-700'>
                Please coordinate the exact pickup time and loation with the giver through the chat after claiming.
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

Show.layout = page => <AppLayout>{page}</AppLayout>

export default Show