import React from 'react'
import Stock from '../../Components/Stock'
import AppLayout from '../../Layouts/AppLayout'

const Show = ({listing}) => {
  const purchaseListing = (e) => {
    e.preventDefault()
  }

  
  return (
    <>
      <div className='grid grid-cols-4 gap-6 mt-8'>
        {/* image */}
        <div className='col-span-1'>
          <div>
            <img src={listing.photos?.length > 0 ? `/storage/${listing.photos[0].image_path}` : 'images/no_image.jpg'} alt="product" />
          </div>
        </div>
        {/* content */}
        <div className='col-span-2'>
          <h1>{listing.title}</h1>
          <p>{listing.description}</p>
        </div>
        {/* purchase */}
        <div className='col-span-1'>
          <div className='p-6 border border-gray-400 rounded-2xl'>
            <h2>Purchase</h2>
            <Stock max_stock={listing.stock} />
            <form onSubmit={purchaseListing}>
              <button className=''>Buy</button>
            </form>
          </div>
        </div>
      </div>
    </>
  )
}

Show.layout = page => <AppLayout>{page}</AppLayout>

export default Show