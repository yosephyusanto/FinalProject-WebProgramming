  import {useState} from 'react'
  import AppLayout from '../../Layouts/AppLayout'
  import { Link, router , usePage} from '@inertiajs/react'
  import { route } from 'ziggy-js'

  const Index = ({listings, filters}) => {
    const {auth} = usePage().props
    const user = auth?.user
    
    // console.log(listings)
    const [form, setForm] = useState({
      material_type: filters.material_type || '',
      color: filters.color || '',
      location: filters.location || '',
    })

    const submit = (e) => {
      e.preventDefault()
      router.get(route('marketplace.index'), form, {
        preserveState: true,
        preserveScroll: true,
      })
    }

    const handleSaveSearch = () => {
      const name = prompt('Name this search:')
      if (!name) return

      router.post(route('searches.store'), {
        name,
        material_type: filters.material_type,
        color: filters.color,
        location: filters.location,
      })
    }
    
    return (
      <>
        <div>
          <h1 className='mt-6 mb-6 text-4xl font-bold text-center'>Marketplace</h1>
          <p className='text-center px-36'>Lorem ipsum dolor sit amet consectetur adipisicing elit. Hic iure, repellat dolorem officiis incidunt vel obcaecati similique maxime in aliquid eveniet voluptate esse temporibus molestias delectus enim provident ratione illo?</p>  
        </div>

        {/* Search and Filters */}
        <form onSubmit={submit} className="flex flex-wrap justify-center gap-4 mt-8 mb-8">
          <input
            type="text"
            placeholder="Material type"
            className="w-48 input input-bordered"
            value={form.material_type}
            onChange={e => setForm({ ...form, material_type: e.target.value })}
          />

          <input
            type="text"
            placeholder="Color"
            className="w-48 input input-bordered"
            value={form.color}
            onChange={e => setForm({ ...form, color: e.target.value })}
          />

          <input
            type="text"
            placeholder="Location"
            className="w-48 input input-bordered"
            value={form.location}
            onChange={e => setForm({ ...form, location: e.target.value })}
          />

          <button className="btn btn-primary">
            Search
          </button>

          {(filters.material_type || filters.color || filters.location) && (
            <button
              type="button"
              className="btn btn-outline"
              onClick={() => router.get(route('marketplace.index'))}
            >
              Reset
            </button>
          )}
        </form>
        
        {/* Save Search Button */}
        {(filters.material_type || filters.color || filters.location) &&  user?.role === 'taker' && (
          <div className='flex justify-center'>
            <button
              type="button"
              className="btn btn-outline btn-success"
              onClick={handleSaveSearch}
            >
              Save this search
            </button>
          </div>
        )}

        <div className='grid grid-cols-1 gap-6 mx-auto mt-8 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 max-w-7xl'>
          {listings.data.map(listing => (
            <div key={listing.id} className='w-full overflow-hidden transition-shadow bg-white border rounded-lg shadow-md hover:shadow-lg'>
              <Link href={`/listings/${listing.id}`} className="flex flex-col h-full">
                {/* image */}
                <div className='relative w-full h-64'>
                  <img src={listing.photos.length > 0 ? listing.photos[0].image_url : 'images/no_image.jpg'} alt="product" className='object-cover w-full h-full'/>
                  {/* Status */}
                  <div className='absolute top-2 left-2'>
                    <span className={`
                      px-2 py-1 rounded-full text-xs font-semibold
                      ${listing.stats === 'available' && 'bg-green-100 text-green-800'}
                      ${listing.stats === 'claimed' && 'bg-yellow-100 text-yellow-800'}
                      ${listing.stats === 'completed' && 'bg-green-100 text-green-8600'}
                    `}>{listing.status.toUpperCase()}</span>
                  </div>
                </div>
                {/* content */}
                <div className='flex flex-col justify-between h-full p-4'>
                  <div>
                    <h3 className='font-semibold'>{listing.title}</h3>
                    <p className='text-sm text-gray-400 line-clamp-2'>{listing.description}</p>
                  </div>
                  
                  <div className='flex justify-between text-sm text-gray-500'>
                    <span>{listing.material_type}</span>
                    <span>{listing.location}</span>
                  </div>
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