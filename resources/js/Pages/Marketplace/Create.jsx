import {useState} from 'react'
import AppLayout from '../../Layouts/AppLayout'
import { useForm} from '@inertiajs/react'

const Create = () => {
  const {data, setData, post, processing, errors} = useForm({
    'title': '',
    'description': '',
    'material_type': '',
    'color': '',
    'estimated_weight': '',
    'estimated_volume': '',
    'condition': '',
    'location': '',
    'pricing_type': 'fixed',
    'price': '',
    'currency': 'IDR',
    'stock': '',
    'pickup_window_start': '',
    'pickup_window_end': '',
    'photos' : []
  })
  const [images, setImages] = useState([])
  
  const submit = (e) => {
    e.preventDefault()
    post('/listings', {
      forceFormData: true
    })
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
    <div>
      <h1 className='mt-4 mb-4 text-xl font-bold text-center'>Create New Material</h1>
      <form onSubmit={submit} className='space-y-4 px-72'>
        <div>
          <input type="text" placeholder='title' value={data.title} onChange={e => setData('title', e.target.value)} className='w-full p-2 border'/>
          {errors.title && <div className='text-red-600'>{errors.title}</div>}
        </div>
        <div>
          <textarea placeholder='description' value={data.description} onChange={e => setData('description', e.target.value)} className='w-full p-2 border'/>
          {errors.description && <div className='text-red-600'>{errors.description}</div>}
        </div>
        <div>
          <input type="text" placeholder='material type' value={data.material_type} onChange={e => setData('material_type', e.target.value)} className='w-full p-2 border'/>
          {errors.material_type && <div className='text-red-600'>{errors.material_type}</div>}
        </div>
        <div>
          <input type="text" placeholder='color' value={data.color} onChange={e => setData('color', e.target.value)} className='w-full p-2 border'/>
          {errors.color && <div className='text-red-600'>{errors.color}</div>}
        </div>
        <div className='flex gap-x-8'>
          <div className='flex-1'>
            <input type="number" placeholder='estimated weight in kg (number only)' value={data.estimated_weight} onChange={e => setData('estimated_weight', e.target.value)} className='w-full p-2 border'/>
            {errors.estimated_weight && <div className='text-red-600'>{errors.estimated_weight}</div>}
          </div>
          <div  className='flex-1'>
            <input type="text" placeholder='estimated volume (ex: 2 m³)' value={data.estimated_volume} onChange={e => setData('estimated_volume', e.target.value)} className='w-full p-2 border'/>
            {errors.estimated_volume && <div className='text-red-600'>{errors.estimated_volume}</div>}
          </div>
        </div>
        <div>
          <input type="text" placeholder='condition' value={data.condition} onChange={e => setData('condition', e.target.value)} className='w-full p-2 border'/>
          {errors.condition && <div className='text-red-600'>{errors.condition}</div>}
        </div>
        <div>
          <input type="text" placeholder='location' value={data.location} onChange={e => setData('location', e.target.value)} className='w-full p-2 border'/>
          {errors.location && <div className='text-red-600'>{errors.location}</div>}
        </div>
        
        <div className='flex-col md:flex md:flex-row gap-x-8'>
          <div className='flex-1 space-y-2'>
            <label>Pickup Window Start</label>
            <input type="datetime-local" value={data.pickup_window_start} onChange={e => setData('pickup_window_start', e.target.value)} className='w-full p-2 border'/>
            {errors.pickup_window_start && <div className='text-red-600'>{errors.pickup_window_start}</div>}
          </div>
          <div className='flex-1 space-y-2'>
            <label>Pickup Window End</label>
            <input type="datetime-local" value={data.pickup_window_end} onChange={e => setData('pickup_window_end', e.target.value)} className='w-full p-2 border'/>
            {errors.pickup_window_end && <div className='text-red-600'>{errors.pickup_window_end}</div>}
          </div>
        </div>
        <div className='flex flex-col space-y-2'>
          <label>Upload Material Photos</label>
          <input 
            type="file" 
            multiple accept='image/*' 
            onChange={handlePhotosChange} 
            className='w-full file-input file-input-bordered'
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
          {errors.photos && <div className='text-red-600'>{errors.photos}</div>}
        </div>

        <button type='submit' disabled={processing}  className="w-full px-4 py-2 text-white bg-black rounded disabled:opacity-50">
          {processing ? 'Creating...' : 'Create Listing'}
        </button>
      </form>
    </div>
  )
}

Create.layout = page => <AppLayout>{page}</AppLayout>

export default Create