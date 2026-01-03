  import React from 'react'
  import AppLayout from '../../Layouts/AppLayout'
  import { Link } from '@inertiajs/react'

  const Index = ({listings, filters}) => {
    return (
      <>
        <div>
          <h1 className='mt-6 mb-6 text-4xl font-bold text-center'>Marketplace</h1>
          <p className='text-center px-36'>Lorem ipsum dolor sit amet consectetur adipisicing elit. Hic iure, repellat dolorem officiis incidunt vel obcaecati similique maxime in aliquid eveniet voluptate esse temporibus molestias delectus enim provident ratione illo?</p>  
        </div>
        <div className='grid grid-cols-1 gap-6 mt-8 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'>
          {listings.data.map(listing => (
            <div id={listing.id} className='w-full overflow-hidden bg-white rounded shadow-md cursor-pointer' >
              <Link href={`/listings/${listing.id}`} className="block">
                {/* image */}
                <div className='relative w-full h-64'>
                  <img src={listing.photos.length > 0 ? `/storage/${listing.photos[0].image_path}` : 'images/no_image.jpg'} alt="product" className='object-cover w-full h-full rounded-t'/>
                </div>
                {/* content */}
                <div className='p-4'>
                  <p className='font-semibold'>{listing.title}</p>
                  <p className='text-gray-400'>{listing.description}</p>
                  <p>Type: {listing.material_type}</p>
                  <p>Color: {listing.color}</p>
                </div>
              </Link>
            </div>
          ))}
        </div>
      </>
    )
  }

  Index.layout = page => <AppLayout>{page}</AppLayout>

  export default Index

  /*
  listings = {
    data: [...],
    links: [...],
    meta: {...}
  }
  */