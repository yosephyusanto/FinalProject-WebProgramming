import React from 'react'
import { Head } from '@inertiajs/react'
import AppLayout from '@/Layouts/AppLayout'

const About = () => {
  return (
        
    <>
      <Head title="About Us" />

      {/*Main*/}
      <section className="bg-white">
        <div className="max-w-4xl mx-auto px-6 py-16 text-center">
            
            <img src="/images/Logo.png" alt="Re-Source Logo" className="mx-auto mb-8 h-36 w-36"/>

            <h1 className="text-4xl font-bold tracking-tight text-gray-900">
            About Re-Source
            </h1>

            <p className="mt-4 text-lg text-gray-600 leading-relaxed max-w-4xl mx-auto">
            Re-Source is a digital platform that connects unused materials with creative individuals, enabling meaningful reuse and reducing unnecessary waste collaboration.
            </p>

        </div>
      </section>


      {/*1*/}
      <section className="bg-gray-50">
        <div className="max-w-6xl mx-auto px-6 py-24">
          <div className="grid md:grid-cols-2 gap-14 items-center">
            <div>
              <h2 className="text-2xl font-semibold text-gray-900">
                The Problem We Address
              </h2>
              <p className="mt-4 text-gray-600 leading-relaxed">
                Every day, usable materials are discarded simply because they are no longer needed by their owners. At the same time, creators often struggle to find affordable resources for their work. This disconnect results in wasted potential and unnecessary environmental impact.
              </p>
            </div>
            <img src="/images/Section1.png" alt="Re-Source illustration" className="h-72 w-full object-cover rounded-2xl"/>
          </div>
        </div>
      </section>

      {/*2*/}
      <section className="bg-white">
        <div className="max-w-6xl mx-auto px-6 py-24">
            <div className="grid md:grid-cols-2 gap-14 items-center">
            
            <img src="/images/Section2.png" alt="Re-Source illustration" className="h-72 w-full object-cover object-[center_55%] rounded-2xl"/>

            <div className="text-right">
                <h2 className="text-2xl font-semibold text-gray-900">
                How Re-Source Works
                </h2>
                <p className="mt-4 text-gray-600 leading-relaxed">
                Re-Source brings together two key roles. Givers list unused materials that still hold value, while Takers browse, claim, and transform those materials into new creations. Completed works are then shared back with the community, closing the loop of reuse.
                </p>
            </div>

            </div>
        </div>
      </section>

      {/*3*/}
      <section className="bg-gray-50">
        <div className="max-w-6xl mx-auto px-6 py-24">
          <div className="grid md:grid-cols-2 gap-14 items-center">
            <div>
              <h2 className="text-2xl font-semibold text-gray-900">
                Why It Matters
              </h2>
              <p className="mt-4 text-gray-600 leading-relaxed">
                By extending the lifecycle of materials, Re-Source helps reduce waste while empowering creative communities. The platform encourages a shift from disposal to reuse, highlighting how shared resources can create shared value.
              </p>
            </div>

            <img src="/images/Section3.png" alt="Re-Source illustration" className="h-72 w-full object-cover rounded-2xl"/>
          </div>
        </div>
      </section>

      {/*Footer*/}
      <section className="bg-black rounded-2xl">
        <div className="max-w-4xl mx-auto px-6 py-16 text-center">
          <p className="text-lg text-gray-300 leading-relaxed">
            Through Re-Source, we envision a future where unused materials are no longer seen as waste, but as opportunities — opportunities for creativity, collaboration, and positive environmental change.
          </p>
        </div>
      </section>
    </>
  )
}

About.layout = page => <AppLayout>{page}</AppLayout>

export default About
