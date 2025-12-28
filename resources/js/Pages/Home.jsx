import React from 'react'
import { Head } from '@inertiajs/react';
import AppLayout from '../Layouts/AppLayout';

const Home = ({stats}) => {
  return (
    <>
      <Head title="Home" />

        {/* STATS CARDS */}
        <div className="grid grid-cols-3 gap-6">
            <div className="p-6 bg-white shadow rounded-xl">
                <h3 className="text-sm text-gray-500">Available Listings</h3>
                <p className="text-3xl font-bold">{stats.listings}</p>
            </div>

            <div className="p-6 bg-white shadow rounded-xl">
                <h3 className="text-sm text-gray-500">Gallery Projects</h3>
                <p className="text-3xl font-bold">{stats.projects}</p>
            </div>

            <div className="p-6 bg-white shadow rounded-xl">
                <h3 className="text-sm text-gray-500">Environmental Impact (kg)</h3>
                <p className="text-3xl font-bold">
                    {Number(stats.impact).toFixed(2)}
                </p>
            </div>
        </div>
    </>
  )
}

Home.layout = page => <AppLayout>{page}</AppLayout>

export default Home

