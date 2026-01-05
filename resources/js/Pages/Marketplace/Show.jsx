import React from 'react'
import StockInput from '../../Components/StockInput'
import AppLayout from '../../Layouts/AppLayout'
import {route} from 'ziggy-js'
import { Link } from '@inertiajs/react'

const Show = ({listing}) => {
  console.log(listing);
  const handleClaim = (e) => {
    e.preventDefault()
  }
  
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


  return (
    <>
      <div className='px-4 mx-auto mt-8 max-w-7xl'>
        <div className="flex gap-8">
          {/* image carousel*/}
          <div className='w-[380px] h-[380px] overflow-hidden rounded-lg'>
            <div>
              <img src={listing.photos?.length > 0 ? listing.photos[0].image_url : 'images/no_image.jpg'} alt="product"  className='border rounded-xl'/>
            </div>
          </div>
          
          {/* content */}
          <div className='flex-1 space-y-4'>
            <span className={`
                px-3 py-1 rounded-full text-sm font-semibold
              ${listing.status === 'available' && 'bg-green-100 text-green-700'}
              ${listing.status === 'reserved' && 'bg-yellow-100 text-yellow-700'}
              ${listing.status === 'sold' && 'bg-gray-200 text-gray-600'}
            `}>
              {listing.status}
            </span>
            <h1 className='text-2xl font-bold'>{listing.title}</h1>
            
            <p className='text-gray-600'>Offered by {listing.user.name}</p>

            <table className="w-full mt-6 text-sm border-separate border-spacing-x-4">
              <tbody>
                <tr>
                  <td className="py-2 text-gray-500">Material Type</td>
                  <td>{listing.material_type}</td>
                </tr>
                <tr>
                  <td className="py-2 text-gray-500">Condition</td>
                  <td>{listing.condition}</td>
                </tr>
                <tr>
                  <td className="py-2 text-gray-500">Weight</td>
                  <td>{listing.estimated_weight} kg</td>
                </tr>
                <tr>
                  <td className="py-2 text-gray-500">Location</td>
                  <td>{listing.location}</td>
                </tr>
                <tr>
                  <td className='py-2 text-gray-500'>Pickup Start Date</td>
                  <td>{formatTime(listing.pickup_window_start)}</td>
                </tr>
                <tr>
                  <td className='py-2 text-gray-500'>Pickup End Date</td>
                  <td>{formatTime(listing.pickup_window_end)}</td>
                </tr>
              </tbody>
            </table>
            
            <div>
              <h2 className='mb-2 font-semibold'>Description</h2>
              <p className='text-gray-700 whitespace-pre-line'>{listing.description}</p>              
            </div>

          </div>
          {/* purchase */}
          <div className='w-[320px]'>
            <div className='p-6 space-y-6 border shadow-sm rounded-2xl'>
              <h2 className='font-semibold '>Purchase</h2>
              <div className='flex items-center gap-4'>
                <StockInput max_stock={listing.stock} />
                <p className='inline-flex items-center gap-1'>Stock: <span className='font-semibold'>{listing.stock}</span></p>
              </div>
              <div className='space-y-2'>
                <button 
                  disabled={!listing.can_be_claimed} 
                  className='w-full px-4 py-2 text-white bg-black rounded cursor-pointer'
                  onClick={handleClaim}
                >
                  Claim
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

Show.layout = page => <AppLayout>{page}</AppLayout>

export default Show