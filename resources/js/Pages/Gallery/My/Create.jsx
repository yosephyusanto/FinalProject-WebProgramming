import {useState} from 'react'
import { useForm, usePage } from '@inertiajs/react'
import AppLayout from '../../../Layouts/AppLayout'
import {route} from 'ziggy-js'

const Create = ({userListings}) => {
  const {data, setData, post, processing, errors} = useForm({
    title: '',
    description: '',
    material_listing_id: '',
    photos: [],
  })

  const [images, setImages] = useState([])

  const submit = (e) => {
    e.preventDefault()
    post(route('my-gallery.store'))
  }

  const handlePhotosChange = (e) => {
    const files = Array.from(e.target.files)

    if (files.length > 4) {
      alert('Max 4 photos allowed')
      e.target.value = null
      return
    }

    const newImages = files.map((file, index) => ({
      id: Date.now() + index,
      file,
      preview: URL.createObjectURL(file),
    }))

    setImages(newImages)
    setData('photos', newImages.map(img => img.file))
  }

  const removeImage = (id) => {
    const updated = images.filter(img => img.id !== id)
    setImages(updated)
    setData('photos', updated.map(img => img.file))
  }

  const onDragStart = (e, index) => {
    e.dataTransfer.setData('dragIndex', index)
  }

  const onDrop = (e, dropIndex) => {
    const dragIndex = e.dataTransfer.getData('dragIndex')

    const reordered = [...images]
    const [moved] = reordered.splice(dragIndex, 1)
    reordered.splice(dropIndex, 0, moved)

    setImages(reordered)
    setData('photos', reordered.map(img => img.file))
  }


  return (
    <>
      <div className='max-w-3xl py-8 mx-auto'>
        <h1 className="mb-6 text-2xl font-bold">
          Share Your Project
        </h1>

        <form onSubmit={submit} className='space-y-6'>
          {/* Title */}
          <div>
            <label className="block mb-1 font-medium">
              Project Title
            </label>
            <input
              type="text"
              className="w-full p-2 border border-gray-500 rounded"
              value={data.title}
              onChange={e => setData('title', e.target.value)}
            />
            {errors.title && <p className="text-sm text-red-500">{errors.title}</p>}
          </div>
          
          {/* Description */}
          <div>
            <label className="block mb-1 font-medium">
              Description
            </label>
            <textarea
              className="w-full p-2 border border-gray-500 rounded"
              rows="4"
              value={data.description}
              onChange={e => setData('description', e.target.value)}
            />
            {errors.description && <p className="text-sm text-red-500">{errors.description}</p>}
          </div>

          {/* Material Listing */}
          <div>
            <label className='block mb-1 font-medium'>
              Material used (optional)
            </label>
            <p className='mb-2 text-sm'>
              List of material that you already claim and the status is "completed"
            </p>

          <select
            className="w-full p-2 border border-gray-500 select select-bordered"
            value={data.material_listing_id}
            onChange={e => setData('material_listing_id', e.target.value)}
          >
            <option value="">-- Choose material --</option>
            {userListings.map(listing => (
              <option key={listing.id} value={listing.id}>
                {listing.title} ({listing.material_type})
              </option>
            ))}
          </select>

            {errors.material_listing_id && (
              <p className="text-sm text-red-500">{errors.material_listing_id}</p>
            )}
          </div>

          {/* Photos */}
          <div>
            <label className="block mb-2 font-medium">
              Project Photos
            </label>
            <input
              type="file"
              multiple
              accept="image/*"
              className="w-full file-input file-input-bordered"
              onChange={handlePhotosChange}
            />
            {images.length > 0 && (
              <div className="mt-4">
                <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
                  {images.map((img, index) => (
                    <div
                      key={img.id}
                      draggable
                      onDragStart={(e) => onDragStart(e, index)}
                      onDragOver={(e) => e.preventDefault()}
                      onDrop={(e) => onDrop(e, index)}
                      className="relative overflow-hidden border shadow-sm cursor-move group rounded-xl bg-base-100"
                    >
                      <img
                        src={img.preview}
                        className="object-cover w-full h-48"
                      />

                      {/* Remove button */}
                      <button
                        type="button"
                        onClick={() => removeImage(img.id)}
                        className="absolute transition opacity-0 btn btn-xs btn-circle btn-error top-2 right-2 group-hover:opacity-100"
                      >
                        ✕
                      </button>

                      {/* Order badge */}
                      <span className="absolute badge badge-primary bottom-2 left-2">
                        #{index + 1}
                      </span>
                    </div>
                  ))}
                </div>

                <p className="mt-2 text-sm text-gray-500">
                  Drag to reorder images. First image will be the cover.
                </p>
              </div>
            )}
            {errors.photos && <p className="text-sm text-red-500">{errors.photos}</p>}
          </div>

           <div className="flex justify-end">
            <button type='submit' className='px-4 py-2 text-white bg-black rounded' disabled={processing || data.photos.length === 0}>
              {processing ? 'Uploading...' : 'Share Project'}
            </button>
           </div>
        </form>
      </div>
    </>
  )
}

Create.layout = page => <AppLayout>{page}</AppLayout>

export default Create 