  import React from 'react'
  import AppLayout from "../../../Layouts/AppLayout";
  import { useState } from 'react'
  import { useForm, router } from '@inertiajs/react'
  import { route } from 'ziggy-js';

  const Edit = ({project}) => {
    const [images, setImages] = useState(
      project.photos.map(p => ({
        key: `existing-${p.id}`,
        type: `existing`,
        id: p.id,
        preview: p.image_url,
      }))
    )

    const [deletedIds, setDeletedIds] = useState([])

    const { data, setData, put, transform, processing, errors } = useForm({
      title: project.title,
      description: project.description,
      material_listing_id: project.material_listing_id ?? '',
      existing_photos: [],
      deleted_photo_ids: [],
      new_photos: [],
    })

    const onDragStart = (e, index) => {
      e.dataTransfer.setData('dragIndex', index)
    }

    const onDrop = (e, dropIndex) => {
      const dragIndex = Number(e.dataTransfer.getData('dragIndex'))
      if (dragIndex === dropIndex) return

      const updated = [...images]
      const [moved] = updated.splice(dragIndex, 1)
      updated.splice(dropIndex, 0, moved)

      setImages(updated)
    }
    

    const removeImage = (img) => {
      if (img.type === 'existing') {
        setDeletedIds(prev => [...prev, img.id])
      }
      setImages(prev => prev.filter(i => i.key !== img.key))
    }

    const handleNewPhotos = (e) => {
      const files = Array.from(e.target.files)

      if (files.length + images.length > 4) {
        alert('Max 4 photos allowed')
        e.target.value = null
        return
      }

      const mapped = files.map((file, i) => ({
        key: `new-${Date.now()}-${i}`,
        type: 'new',
        file,
        preview: URL.createObjectURL(file),
      }))

      setImages(prev => [...prev, ...mapped])
    }

    
 const submit = (e) => {
  e.preventDefault()

  const existing_photos = images
    .filter(i => i.type === 'existing')
    .map((img, order) => ({
      id: img.id,
      order,
    }))

  const new_photos = images
    .filter(i => i.type === 'new')
    .map(img => img.file)

  const formData = new FormData()
  
  formData.append('_method', 'PUT')
  formData.append('title', data.title)
  formData.append('description', data.description)
  formData.append('material_listing_id', data.material_listing_id || '')
  
  // Append existing photos
  existing_photos.forEach((photo, index) => {
    formData.append(`existing_photos[${index}][id]`, photo.id)
    formData.append(`existing_photos[${index}][order]`, photo.order)
  })
  
  // Append deleted IDs
  deletedIds.forEach((id, index) => {
    formData.append(`deleted_photo_ids[${index}]`, id)
  })
  
  // Append new photos
  new_photos.forEach((file, index) => {
    formData.append(`new_photos[${index}]`, file)
  })

  router.post(route('my-gallery.update', project.id), formData, {
    forceFormData: true,
  })
}

    return (
      <>
        <div className='py-4 mx-auto max-w-7xl'>
          <h1 className='mb-4 text-2xl font-bold'>Edit Project</h1>
          <form onSubmit={submit} className="space-y-6 ">
            <div>
              <label className='block mb-1 font-medium'>Project Title: </label>
              <input value={data.title} onChange={e => setData('title', e.target.value)} className='w-full p-2 border border-gray-500 rounded'/>
              {errors.title && <div className='mt-1 text-sm text-error'>{errors.title}</div>}
            </div>
            <div>
              <label className='block mb-1 font-medium'>Project Description:</label>
              <textarea value={data.description} onChange={e => setData('description', e.target.value)} className='w-full p-2 border border-gray-500 rounded h-28'/>
              {errors.description && <div className='mt-1 text-sm text-error'>{errors.description}</div>}
            </div>

            {/* EXISTING */}
            <h3 className="font-medium">Project Photos</h3>
            <div className="grid grid-cols-3 gap-4 lg:grid-cols-4">
              {images.map((img, index) => (
                <div 
                  key={img.key} 
                  draggable
                  onDragStart={(e) => onDragStart(e, index)}
                  onDragOver={(e) => e.preventDefault()}
                  onDrop={(e) => onDrop(e, index)}
                  className="relative overflow-hidden bg-gray-100 shadow rounded-xl group"
                >
                  <img src={img.preview} className="object-cover w-full" />
                  <button 
                    type="button"
                    onClick={() => removeImage(img)}
                    className="absolute btn btn-xs btn-error top-2 right-2"
                  >
                    ✕
                  </button>

                  {index === 0 && (
                    <span className='absolute badge badge-primary bottom-2 left-2'>Cover</span>
                  )}

                </div>
              ))}
            </div>

            {/* NEW */}
            <div>
              <label className="block mb-1 font-medium">Upload New Photos <span className='text-error'>({4 - images.length} remain)</span>: </label>
              <input type="file" multiple accept="image/*" onChange={handleNewPhotos} />
            </div>
            {errors.new_photos && <div className='mt-1 text-sm text-error'>{errors.new_photos}</div>}
  
            <div className='flex justify-end'>
              <button type='submit' className="btn btn-primary" disabled={processing}>
                {processing ? 'Updating...' : 'Update Project'}
              </button>
            </div>
            
          </form>
        </div>
      </>
    )
  }

  Edit.layout = page => <AppLayout>{page}</AppLayout>

  export default Edit