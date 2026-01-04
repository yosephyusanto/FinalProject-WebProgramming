import React from 'react'
import AppLayout from '../../Layouts/AppLayout'
import { Link, usePage } from '@inertiajs/react'

const Index = ({projects, totalImpact}) => {
  return (
    <>
      <div className='px-4 mx-auto max-w-7xl py-7'>
        
        <h1 className='mt-6 mb-6 text-4xl font-bold text-center'>Community Gallery</h1>
        <p className='mt-2 text-center text-gray-600'> Creative works made from reused materials</p>
        
        <div className='grid grid-cols-1 gap-6 mx-auto mt-8 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'>
          {projects.data.map(project => {
            const cover = project.photos.length > 0 ? project.photos[0].image_url : 'images/no_image.jpg'
            
            return (
              <Link key={project.id} href={`/gallery/${project.id}`} className="block overflow-hidden transition border shadow-sm group rounded-xl bg-base-100 hover:shadow-lg">
                {/* Image */}
                <div className="h-56 overflow-hidden">
                  <img
                    src={cover}
                    className="object-cover w-full h-full transition group-hover:scale-105"
                  />
                </div>

                {/* Content */}
                <div className="p-4 space-y-2">
                  <h3 className="font-semibold line-clamp-2">
                    {project.title}
                  </h3>

                  {/* Author */}
                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <span>By {project.user.name}</span>
                  </div>
                </div>
              </Link>
            )

          })}
        </div>


        {/* Pagination */}
             {projects.links.length > 3 && (
        <div className="flex justify-center mt-10">
          <div className="join">

            {projects.links.map((link, index) => (
              <Link
                key={index}
                href={link.url || '#'}
                className={`join-item btn btn-sm
                  ${link.active ? 'btn-primary' : 'btn-outline'}
                  ${!link.url && 'btn-disabled'}
                `}
                dangerouslySetInnerHTML={{ __html: link.label }}
              />
            ))}

          </div>
        </div>
      )}
      </div>
    </>
  )
}

Index.layout = page => <AppLayout>{page}</AppLayout>

export default Index