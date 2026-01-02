import React from 'react'
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
    'pickup_window_start': '',
    'pickup_window_end': '',
    'photos' : []
  })

  const submit = (e) => {
    e.preventDefault()
    post('/listings', {
      forceFormData: true
    })
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
        <div>
          <input type="text" placeholder='estimated weight' value={data.estimated_weight} onChange={e => setData('estimated_weight', e.target.value)} className='w-full p-2 border'/>
          {errors.estimated_weight && <div className='text-red-600'>{errors.estimated_weight}</div>}
        </div>
        <div>
          <input type="text" placeholder='estimated volume' value={data.estimated_volume} onChange={e => setData('estimated_volume', e.target.value)} className='w-full p-2 border'/>
          {errors.estimated_volume && <div className='text-red-600'>{errors.estimated_volume}</div>}
        </div>
        <div>
          <input type="text" placeholder='condition' value={data.condition} onChange={e => setData('condition', e.target.value)} className='w-full p-2 border'/>
          {errors.condition && <div className='text-red-600'>{errors.condition}</div>}
        </div>
        <div>
          <input type="text" placeholder='location' value={data.location} onChange={e => setData('location', e.target.value)} className='w-full p-2 border'/>
          {errors.location && <div className='text-red-600'>{errors.location}</div>}
        </div>
        <div className='flex gap-x-8'>
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
          <label>Upload Photos</label>
          <input type="file" multiple accept='image/*' onChange={e => setData('photos', e.target.files)}/>
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