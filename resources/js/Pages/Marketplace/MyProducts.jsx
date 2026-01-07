import React from "react";
import AppLayout from '../../Layouts/AppLayout'
import { Link } from "@inertiajs/react";

const MyProducts = ({listings}) => {
    console.log('my products listings: ', listings);
    return (
        <div className="py-8 mx-auto max-w-7xl">
            <div className="flex items-center justify-between mb-8">
                <h1 className="text-3xl font-bold text-gray-900">My Products</h1>
                 <Link href={route('listings.create')} className="px-4 py-2 text-white bg-black rounded">Create Listings</Link>
            </div>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                {listings.data.map(listing => (
                    <div key={listing.id} className="overflow-hidden bg-white border rounded-lg shadow-md">
                        <Link href={`/listings/${listing.id}`} className="block">
                            <div className="h-48 overflow-hidden">
                                <img src={listing.photos.length > 0 ? listing.photos[0].image_url : 'images/no_images.jpg'} 
                                alt={listing.title} className="object-cover w-full h-full" />
                            </div>

                            <div className="p-4">
                                <div className="flex items-start justify-between mb-2">
                                    <h3 className="text-lg font-semibold truncate">{listing.title}</h3>
                                    <span className={`
                                        px-2 py-1 rounded-full text-x font-semibold
                                        ${listing.status === 'available' && 'bg-green-100 text-green-800'}
                                        ${listing.status === 'claimed' && 'bg-yellow-100 text-yellow-800'}
                                        ${listing.status === 'completed' && 'bg-gray-100 text-gray-800'}
                                    `}>{listing.status}</span>
                                </div>

                                <p className="mb-3 text-sm text-gray-600 truncate">{listing.descripiton}</p>

                                <div className="flex justify-between text-sm text-gray-500">
                                    <span>Weight: {listing.estimated_weight}kg</span>
                                    <span>{listing.location}</span>
                                </div>

                                {listing.claim && (
                                    <div className="pt-3 mt-3 border-t">
                                        <p className="text-sm text-gray-600">
                                            Claimed by: <span className="font-semibold">{listing.claim.claimed_by.name}</span>
                                        </p>
                                    </div>
                                )}
                            </div>
                        </Link>
                    </div>
                ))}
            </div>
            {/* Pagination */}
            {listings.last_page > 1 && (
                <div className="flex justify-center gap-2 mt-8">
                    {listings.links.map((link, index) => (
                        <Link
                        key={index}
                        href={link.url || '#'}
                        preserveScroll
                        preserveState
                        className={`
                            px-4 py-2 rounded-md border
                            ${link.activate ? 'bg-black text-white' : 'bg-white text-gray-700 hover:bg-gray-50'}
                            ${!link.url && 'opacity-50 cursor-not-allowed'}
                        `} dangerouslySetInnerHTML={{__html: link.label}}/>
                    ))}
                </div>
            )}            
        </div>
    )
}

MyProducts.layout = page => <AppLayout>{page}</AppLayout>

export default MyProducts