import React from 'react'
import StockInput from '../../Components/StockInput'
import AppLayout from '../../Layouts/AppLayout'

const Show = ({listing}) => {
  const purchaseListing = (e) => {
    e.preventDefault()
  }
  
  const formatPrice = (price) => {
    return price.toLocaleString("id-ID");
  };

  const formatTime = (time) => {
    const date = new Date(time);
    return date.toLocaleString();
  }

  return (
    <>
      <div className='px-4 mx-auto mt-8 max-w-7xl'>
        <div className="flex gap-8">
          {/* image */}
          <div className='w-[380px] h-[380px] overflow-hidden rounded-lg'>
            <div>
              <img src={listing.photos?.length > 0 ? `/storage/${listing.photos[0].image_path}` : 'images/no_image.jpg'} alt="product"  className='border rounded-xl'/>
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
            
            {listing.pricing_type === 'free' ? (
              <span className='text-2xl font-bold'>Free</span>
            ) : (
              <span className='text-3xl font-bold'>{listing.currency} {formatPrice(listing.price)}</span>
            )}
            <table className="w-full mt-6 text-sm">
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
              </tbody>
            </table>
            
            <p className='text-gray-600'>{listing.description}</p>
        
            <p>{formatTime(listing.pickup_window_start)} - {formatTime(listing.pickup_window_end)}</p>
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
                <form onSubmit={purchaseListing}>
                  <button disabled={!listing.can_be_claimed} className='w-full px-4 py-2 text-white bg-black rounded cursor-pointer'>{listing.pricing_type === 'free' ? 'Claim' : 'Buy'}</button>
                </form>
                <button className='w-full px-4 py-2 text-black border border-black rounded cursor-pointer'>Message</button>
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