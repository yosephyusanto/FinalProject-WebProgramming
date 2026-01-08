import React from 'react'
import { Head, Link, usePage } from '@inertiajs/react'
import AppLayout from '../Layouts/AppLayout'
import { route } from 'ziggy-js';

export default function Home({ stats, featuredProjects }) {
  const { auth } = usePage().props
  const user = auth?.user
  
  return (
    <>
      <Head title="Home" />

      {/*Hero section*/}
      <section className="flex items-center min-h-screen bg-gray-50">
        <div className="grid items-center gap-12 px-6 mx-auto max-w-7xl md:grid-cols-2">
          <div>
            <h1 className="text-5xl font-bold leading-tight text-gray-900">
              Turn Unused Materials <br /> Into Meaningful Creations
            </h1>
            <p className="mt-6 text-lg text-gray-600">
              Re-Source connects unused materials with creative minds to reduce waste and create real environmental impact.
            </p>

            <div className="flex gap-4 mt-8">
              {!user && (
                <Link
                  href="/register"
                  className="px-6 py-3 font-medium text-white transition bg-black rounded-lg hover:bg-gray-800"
                >
                  Get Started
                </Link>
              )}

              {user?.role === 'giver' && (
                <Link
                  href={route('my-products')}
                  className="px-6 py-3 font-medium text-white transition bg-black rounded-lg hover:bg-gray-800"
                >
                  Start Giving
                </Link>
              )}

              {user?.role === 'taker' && (
                <Link
                  href={route('my-claims')}
                  className="px-6 py-3 font-medium text-white transition bg-black rounded-lg hover:bg-gray-800"
                >
                  Manage Claims
                </Link>
              )}
  
              <Link
                href="/marketplace"
                className="px-6 py-3 font-medium text-gray-700 transition border border-gray-300 rounded-lg hover:bg-gray-100"
              >
                Explore Marketplace
              </Link>
            </div>
          </div>

          <div className="relative hidden md:block">
            <img
              src="/images/hero-image.png"
              alt="Turning unused materials into creative works"
              className="object-cover w-full aspect-square rounded-2xl"
            />
            <div className="absolute inset-0 rounded-2xl bg-black/10" />
          </div>

        </div>
      </section>

      {/*Problem/Impact*/}
      <section className="py-12 text-white bg-black rounded-xl">
        <div className="grid items-center gap-20 px-6 mx-auto max-w-7xl md:grid-cols-2">

          {/*Left*/}
          <div className="text-left">
            <p className="text-sm tracking-widest text-gray-400 uppercase">
              The Problem
            </p>
            <h2 className="mt-4 text-4xl font-bold leading-tight">
              Usable materials <br /> are wasted every day
            </h2>
            <p className="max-w-md mt-6 leading-relaxed text-gray-300">
              Every day, usable materials end up as waste while creators struggle to find affordable resources. This disconnect leads to unnecessary environmental loss.
            </p>
          </div>

          {/*Right*/}
          <div className="ml-auto text-right">
            <p className="text-sm tracking-widest text-gray-400 uppercase">
              Our Impact
            </p>
            <h2 className="mt-4 text-4xl font-bold leading-tight">
              Turning waste <br /> into shared value
            </h2>
            <p className="max-w-md mt-6 ml-auto leading-relaxed text-gray-300">
              Re-Source enables meaningful reuse through collaboration. By connecting people and materials, waste gains new purpose and value.
            </p>
          </div>
        </div>
      </section>

      {/*How*/}
      <section className="py-20 bg-white">
        <div className="px-6 mx-auto max-w-7xl">
          <h2 className="text-3xl font-bold text-center text-gray-900">
            How Re-Source Works
          </h2>

          <div className="grid gap-10 mt-12 text-center md:grid-cols-3">
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
        <div className="px-6 mx-auto max-w-7xl">
          <h2 className="text-3xl font-bold text-center text-gray-900">
            Our Impact So Far
          </h2>

          <div className="grid gap-6 mt-12 md:grid-cols-3">
            <div className="p-6 text-center bg-white shadow rounded-xl">
              <p className="text-sm text-gray-500">Available Listings</p>
              <p className="mt-2 text-4xl font-bold">{stats.listings}</p>
            </div>

            <div className="p-6 text-center bg-white shadow rounded-xl">
              <p className="text-sm text-gray-500">Gallery Projects</p>
              <p className="mt-2 text-4xl font-bold">{stats.projects}</p>
            </div>

            <div className="p-6 text-center bg-white shadow rounded-xl">
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
          <div className="px-6 mx-auto max-w-7xl">
            <h2 className="text-3xl font-bold text-center text-gray-900">
              Community Creations
            </h2>

            <div className="grid gap-6 mt-12 md:grid-cols-3">
              {featuredProjects.map(project => (
                <div
                  key={project.id}
                  className="overflow-hidden shadow bg-gray-50 rounded-xl"
                >
                  {project.image && (
                    <img
                      src={project.image}
                      alt={project.title}
                      className="object-cover w-full h-48"
                    />
                  )}
                  <div className="p-5">
                    <h3 className="text-lg font-semibold">
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
      <section className="mt-24 text-gray-300 bg-black rounded-2xl">
        <div className="pt-12 pb-6 mx-auto max-w-7xl">
          <div className="grid gap-24 md:grid-cols-3">

            {/*CTA*/}
            <div>
              <h3 className="text-2xl font-semibold leading-snug text-white">
                Be Part of the <br /> Re-Source Community
              </h3>
              <p className="max-w-sm mt-3 text-sm text-gray-400">
                Turn unused materials into value.<br></br>
                Create impact together.
              </p>

              <Link
                href="/register"
                className="inline-block px-6 py-3 mt-5 text-sm font-medium text-black transition bg-white rounded-lg hover:bg-gray-200"
              >
                Join Re-Source
              </Link>
            </div>


            {/*Platform*/}
            <div className="grid grid-cols-2 gap-20 mt-8">
              <div>
                <h4 className="text-sm font-semibold tracking-wide text-white">
                  Platform
                </h4>
                <ul className="mt-3 space-y-2 text-sm">
                  <li>
                    <Link href="/marketplace" className="transition hover:text-white">
                      Marketplace
                    </Link>
                  </li>
                  <li>
                    <Link href="/gallery" className="transition hover:text-white">
                      Community Gallery
                    </Link>
                  </li>
                  <li>
                    <Link href="/about" className="transition hover:text-white">
                      About Us
                    </Link>
                  </li>
                </ul>
              </div>

              <div>
                <h4 className="text-sm font-semibold tracking-wide text-white">
                  Legal
                </h4>
                <ul className="mt-4 space-y-3 text-sm">
                  <li>
                    <a href="#" className="transition hover:text-white">
                      Privacy Policy
                    </a>
                  </li>
                  <li>
                    <a href="#" className="transition hover:text-white">
                      Terms & Conditions
                    </a>
                  </li>
                </ul>
              </div>
            </div>

            {/*Social media*/}
            <div className="mt-8">
              <h4 className="text-sm font-semibold tracking-wide text-white">
                Follow Us
              </h4>
              <div className="flex gap-4 mt-4">
                <a
                  href="https://www.instagram.com/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center w-12 h-12 transition border border-gray-700 rounded-full hover:border-white hover:text-white"
                >
                  <img src="/images/Instagram.png" alt="Instagram" className="w-12 h-12"/>
                </a>
                <a
                  href="https://www.tiktok.com/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center w-12 h-12 transition border border-gray-700 rounded-full hover:border-white hover:text-white"
                >
                  <img src="/images/Tiktok.png" alt="Tiktok" className="w-12 h-12"/>
                </a>
                <a
                  href="https://x.com/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center w-12 h-12 transition border border-gray-700 rounded-full hover:border-white hover:text-white"
                >
                  <img src="/images/X.png" alt="X" className="w-12 h-12"/>
                </a>
              </div>
            </div>

          </div>

          {/* BOTTOM */}
          <div className="pt-6 mt-8 text-sm text-center text-gray-500 border-t border-gray-800">
            © 2026 Re-Source. All rights reserved.
          </div>
        </div>
      </section>

    </>
  )
}

Home.layout = page => <AppLayout>{page}</AppLayout>
