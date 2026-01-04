  import React from 'react'
  import AppLayout from '../../Layouts/AppLayout'
  import { Link } from '@inertiajs/react'

  const Index = ({listings, filters}) => {
    console.log(listings)
    return (
      <>
        <div>
          <h1 className='mt-6 mb-6 text-4xl font-bold text-center'>Marketplace</h1>
          <p className='text-center px-36'>Lorem ipsum dolor sit amet consectetur adipisicing elit. Hic iure, repellat dolorem officiis incidunt vel obcaecati similique maxime in aliquid eveniet voluptate esse temporibus molestias delectus enim provident ratione illo?</p>  
        </div>
        <div className='grid grid-cols-1 gap-6 mx-auto mt-8 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 max-w-7xl'>
          {listings.data.map(listing => (
            <div key={listing.id} className='w-full overflow-hidden bg-white rounded shadow-md cursor-pointer' >
              <Link href={`/listings/${listing.id}`} className="block">
                {/* image */}
                <div className='relative w-full h-64'>
                  <img src={listing.photos.length > 0 ? listing.photos[0].image_url : 'images/no_image.jpg'} alt="product" className='object-cover w-full h-full rounded-t'/>
                </div>
                {/* content */}
                <div className='p-4'>
                  <p className='font-semibold'>{listing.title}</p>
                  <p className='text-sm text-gray-400'>{listing.description}</p>
                </div>
              </Link>
            </div>
          ))}
        </div>
        
        {/* Pagination */}
        {listings.last_page > 1 && (
          <div className='flex justify-center gap-1 mt-8'>
            {listings.links.map((link, index) => (
              <Link
                key={index}
                href={link.url || ''}
                preserveScroll
                preserveState
                className={`
                  px-3 py-2 border rounded
                  ${link.active ? 'bg-black text-white' : 'bg-white'}
                  ${!link.url ? 'opacity-50 cursor-not-allowed' : ''}
                `}
                dangerouslySetInnerHTML={{ __html: link.label }}
              />
            ))}
          </div>
        )}
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

  Each listing = {
    id,
    user_id,
    title,
    description,
    photos: [
      { image_path, order, image_url },
    ]
    ...
  }

  Each photo = {
    created_at, id, image_path, image_url, material_listing_id, order
  }
  */