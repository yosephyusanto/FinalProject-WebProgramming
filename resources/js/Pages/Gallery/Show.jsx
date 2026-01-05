import {useState} from 'react'
import AppLayout from '../../Layouts/AppLayout'

const Show = ({project}) => {
  console.log(project)
  const photos = project.photos || []
  const noImage = { image_path: '../images/no_image.jpg' }
  const [activePhoto, setActivePhoto] = useState(
    photos.length > 0 ? photos[0] : null
  )

  console.log(noImage.image_path)

  return (
     <div className="max-w-6xl px-4 py-8 mx-auto">
      <div className="grid grid-cols-1 gap-8 md:grid-cols-2">

        {/* LEFT: IMAGE GALLERY */}
        <div>
          {activePhoto !== null ? (
            <div className="mb-4 overflow-hidden border rounded-xl bg-base-100">
              <img
                src={activePhoto.image_url}
                className="w-full h-[420px] object-cover"
              />
            </div>
          ) :(
            <div className="mb-4 overflow-hidden border rounded-xl bg-base-100">
              <img
                src={noImage.image_path}
                className="w-full h-[420px] object-cover"
              />
            </div>
          )}

          {/* Thumbnails */}
          <div className="grid grid-cols-4 gap-3">
            {photos.length > 0 && photos.map(photo => (
              <button
                key={photo.id}
                onClick={() => setActivePhoto(photo)}
                className={`rounded-lg overflow-hidden border 
                  ${activePhoto?.id === photo.id
                    ? 'ring-2 ring-primary'
                    : 'opacity-70 hover:opacity-100'
                  }`}
              >
                <img
                  src={photo.image_url ?? noImage.image_path}
                  className="object-cover w-full h-24"
                />
              </button>
            ))}
          </div>
        </div>

        {/* RIGHT: PROJECT INFO */}
        <div className="space-y-6">

          <div>
            <h1 className="text-3xl font-bold">
              {project.title}
            </h1>

            <div className="flex items-center gap-3 mt-2 text-sm text-gray-500">
              <span>By {project.user.name}</span>
              <span>•</span>
              <span>
                {new Date(project.created_at).toLocaleDateString()}
              </span>
            </div>
          </div>

          {/* Description */}
          <div>
            <h2 className="mb-1 font-semibold">Description</h2>
            <p className="text-gray-700 whitespace-pre-line">
              {project.description}
            </p>
          </div>

          {/* Material Reference */}
          {project.material_listing && (
            <div className="p-4 border rounded-xl bg-base-200">
              <h3 className="mb-2 font-semibold">
                Material Used
              </h3>

              <p className="font-medium">
                {project.material_listing.title}
              </p>

              <p className="text-sm text-gray-600">
                {project.material_listing.material_type} •{' '}
                {project.material_listing.color}
              </p>
            </div>
          )}

        </div>
      </div>
    </div>
  )
}

Show.layout = page => <AppLayout>{page}</AppLayout>

export default Show

/*
project = {
  title,
  description,
  photos: [{ image_path, order }],
  material_listing: {...} | null,
  user: { name, avatar_url },
  created_at
}

photos = [
  { image_path, order, image_url }  // image_url supaya tidak perlu /storage/ setiap kali dipanggil
]
*/