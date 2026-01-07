import React from 'react'
import { Head, Link } from '@inertiajs/react'
import AppLayout from '../Layouts/AppLayout'

export default function Home({ stats, featuredProjects }) {
  return (
    <>
      <Head title="Home" />

      {/*Hero section*/}
      <section className="min-h-screen flex items-center bg-gray-50">
        <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-2 gap-12 items-center">
          <div>
            <h1 className="text-5xl font-bold leading-tight text-gray-900">
              Turn Unused Materials <br /> Into Meaningful Creations
            </h1>
            <p className="mt-6 text-lg text-gray-600">
              Re-Source connects unused materials with creative minds to reduce waste
              and create real environmental impact.
            </p>

            <div className="mt-8 flex gap-4">
              <Link
                href="/register"
                className="px-6 py-3 bg-black text-white rounded-lg font-medium hover:bg-gray-800 transition"
              >
                Get Started
              </Link>
              <Link
                href="/marketplace"
                className="px-6 py-3 border border-gray-300 rounded-lg font-medium text-gray-700 hover:bg-gray-100 transition"
              >
                Explore Marketplace
              </Link>
            </div>
          </div>

          <div className="hidden md:block relative">
            <img
              src="/images/hero-image.png"
              alt="Turning unused materials into creative works"
              className="aspect-square w-full rounded-2xl object-cover"
            />
            <div className="absolute inset-0 rounded-2xl bg-black/10" />
          </div>

        </div>
      </section>

      {/*Problem/Impact*/}
      <section className="py-12 bg-black text-white rounded-xl">
        <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-2 gap-20 items-center">

          {/*Left*/}
          <div className="text-left">
            <p className="text-sm uppercase tracking-widest text-gray-400">
              The Problem
            </p>
            <h2 className="mt-4 text-4xl font-bold leading-tight">
              Usable materials <br /> are wasted every day
            </h2>
            <p className="mt-6 text-gray-300 max-w-md leading-relaxed">
              Every day, usable materials end up as waste while creators struggle
              to find affordable resources. This disconnect leads to unnecessary
              environmental loss.
            </p>
          </div>

          {/*Right*/}
          <div className="text-right ml-auto">
            <p className="text-sm uppercase tracking-widest text-gray-400">
              Our Impact
            </p>
            <h2 className="mt-4 text-4xl font-bold leading-tight">
              Turning waste <br /> into shared value
            </h2>
            <p className="mt-6 text-gray-300 max-w-md ml-auto leading-relaxed">
              Re-Source enables meaningful reuse through collaboration. By connecting
              people and materials, waste gains new purpose and value.
            </p>
          </div>
        </div>
      </section>

      {/*How*/}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-3xl font-bold text-center text-gray-900">
            How Re-Source Works
          </h2>

          <div className="mt-12 grid md:grid-cols-3 gap-10 text-center">
            <div>
              <h3 className="text-xl font-semibold">Share Materials</h3>
              <p className="mt-3 text-gray-600">
                Givers upload unused materials that still have value.
              </p>
            </div>

            <div>
              <h3 className="text-xl font-semibold">Claim & Create</h3>
              <p className="mt-3 text-gray-600">
                Takers claim materials and transform them into new creations.
              </p>
            </div>

            <div>
              <h3 className="text-xl font-semibold">Create Impact</h3>
              <p className="mt-3 text-gray-600">
                Finished projects are shared to inspire the community.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/*Impact stats*/}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-3xl font-bold text-center text-gray-900">
            Our Impact So Far
          </h2>

          <div className="mt-12 grid md:grid-cols-3 gap-6">
            <div className="p-6 bg-white shadow rounded-xl text-center">
              <p className="text-sm text-gray-500">Available Listings</p>
              <p className="mt-2 text-4xl font-bold">{stats.listings}</p>
            </div>

            <div className="p-6 bg-white shadow rounded-xl text-center">
              <p className="text-sm text-gray-500">Gallery Projects</p>
              <p className="mt-2 text-4xl font-bold">{stats.projects}</p>
            </div>

            <div className="p-6 bg-white shadow rounded-xl text-center">
              <p className="text-sm text-gray-500">Material Saved (kg)</p>
              <p className="mt-2 text-4xl font-bold">
                {Number(stats.impact).toFixed(2)}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/*Featured gallery*/}
      {featuredProjects.length > 0 && (
        <section className="py-20 bg-white">
          <div className="max-w-7xl mx-auto px-6">
            <h2 className="text-3xl font-bold text-center text-gray-900">
              Community Creations
            </h2>

            <div className="mt-12 grid md:grid-cols-3 gap-6">
              {featuredProjects.map(project => (
                <div
                  key={project.id}
                  className="bg-gray-50 rounded-xl overflow-hidden shadow"
                >
                  {project.image && (
                    <img
                      src={project.image}
                      alt={project.title}
                      className="w-full h-48 object-cover"
                    />
                  )}
                  <div className="p-5">
                    <h3 className="font-semibold text-lg">
                      {project.title}
                    </h3>
                    <p className="mt-2 text-sm text-gray-600 line-clamp-3">
                      {project.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/*footer*/}
      <section className="py-24 bg-black text-white text-center rounded-3xl">
        <h2 className="text-3xl font-bold">
          Be Part of the Re-Source Community
        </h2>
        <p className="mt-4 text-gray-300">
          Turn waste into value. Create impact together.
        </p>

        <Link
          href="/register"
          className="inline-block mt-8 px-8 py-4 bg-white text-black rounded-lg font-medium hover:bg-gray-200 transition"
        >
          Join Re-Source
        </Link>
      </section>
    </>
  )
}

Home.layout = page => <AppLayout>{page}</AppLayout>
