import React from 'react'
import AppLayout from "../../../Layouts/AppLayout";
import { Link , router} from '@inertiajs/react';
import { route } from 'ziggy-js';

const Index = ({projects}) => {
  const handleDelete = (project) => {
    if (confirm('Delete this project?')) {
      router.delete(route('my-gallery.destroy', project.id))
    }
  }
  return (
    <>
      <div className="px-4 py-10 mx-auto max-w-7xl">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-4xl font-bold">My Gallery</h1>
          <p className="text-gray-500">
            Your creative projects
          </p>
        </div>

        <Link
          href={route('my-gallery.create')}
          className="px-4 py-2 text-white bg-black rounded"
        >
          + Share Project
        </Link>
      </div>

      {projects.data.length === 0 && (
        <div className="flex items-center justify-center min-h-[500px]">
          <p className='text-gray-500'>You have not shared any projects yet.</p>
        </div>
      )}


      <div className="gap-5 columns-1 sm:columns-2 md:columns-3">
        {projects.data.length > 0 && projects.data.map(project => (
          <div
            key={project.id}
            className="relative mb-5 overflow-hidden transition shadow-md cursor-pointer break-inside-avoid group rounded-xl hover:shadow-xl"
          >
            {/* Image */}
            <img
              src={project.photos?.[0]?.image_url}
              className="object-cover w-full"
              alt={project.title}
            />

            {/* Overlay */}
            <div className="absolute inset-0 flex flex-col justify-between p-4 transition-opacity opacity-0 bg-black/40 group-hover:opacity-100">
              <h3 className="text-lg font-semibold text-white">
                {project.title}
              </h3>

              <div className="flex self-end gap-2">
                <Link
                  href={route('my-gallery.edit', project.id)}
                  className="btn btn-xs btn-warning"
                >
                  Edit
                </Link>

                <Link
                  onClick={() => handleDelete(project)}
                  className="btn btn-xs btn-secondary"
                >
                  Delete
                </Link>
              </div>
            </div>
            
          </div>
        ))}
      </div>
    </div>

    </>
  )
}

Index.layout = page => <AppLayout>{page}</AppLayout>

export default Index