import React from "react";
import AppLayout from '../../Layouts/AppLayout'
import { Link } from "@inertiajs/react";

const MyClaims = ({claims}) => {
    console.log('claims: ', claims);
    return (
        <div className="py-8 mx-auto max-w-7xl">
            <h1 className="mb-6 text-3xl font-bold text-gray-900">My Claims</h1>
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
                {claims.data.map(claim => (
                    <div key={claim.id} className="overflow-hidden bg-white border rounded-lg shadow-md">
                        <Link href={`/claims/${claim.id}`} className="block">
                            <div className="h-48 overflow-hidden">
                                <img src={claim.material_listing.photos.length > 0 ? claim.material_listing.photos[0].image_url : 'images/no_images.jpg'} 
                                alt={claim.material_listing.title} className="object-cover w-full h-full" />
                            </div>

                            <div className="p-4">
                                <div className="flex items-start justify-between mb-2">
                                    <h3 className="text-lg font-semibold truncate">{claim.material_listing.title}</h3>
                                    <span className={`
                                        px-2 py-1 rounded-full text-x font-semibold
                                        ${claims.status === 'pending' && 'bg-green-100 text-yellow-800'}
                                        ${claims.status === 'completed' && 'bg-yellow-100 text-blue-800'}
                                        ${claims.status === 'cancelled' && 'bg-gray-100 text-green-800'}
                                    `}>{claim.status}</span>
                                </div>

                                <p className="mb-3 text-sm text-gray-600 truncate">{claim.material_listing.descripiton}</p>

                                <div className="flex justify-between text-sm text-gray-500">
                                    <span>Owner: {claim.material_listing.user.name}</span>
                                    <span>{claim.material_listing.location}</span>
                                </div>

                                <div className="pt-3 mt-3 border-t">
                                    <p className="text-sm text-gray-600">
                                        Listing Status: <span className="font-semibold">{claim.material_listing.status}</span>
                                    </p>
                                </div>
                            </div>
                        </Link>
                    </div>
                ))}
            </div>
            {/* Pagination */}
            {claims.last_page > 1 && (
                <div className="flex justify-center gap-2 mt-8">
                    {claims.links.map((link, index) => (
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

MyClaims.layout = page => <AppLayout>{page}</AppLayout>

export default MyClaims