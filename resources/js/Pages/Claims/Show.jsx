import React from 'react'
import AppLayout from '../../Layouts/AppLayout'
import Chat from '../../Components/Chat'
import { router } from '@inertiajs/react'

const Show = ({ claim, listing, messages, authUserId, otherUser }) => {
  const handleComplete = () => {
    if (confirm('Are you sure you want to mark this as completed? This action cannot be undone.')) {
      router.post(`/claims/${claim.id}/complete`, {}, {
        onSuccess: () => {
          router.reload()
        },
        onError: (errors) => {
          console.error(errors)
        }
      })
    }
  }

  return (
    <div className='max-w-6xl mx-auto py-8'>
      {/* Header with back button */}
      <div className="mb-6">
        <button 
          onClick={() => window.history.back()}
          className="flex items-center text-gray-600 hover:text-black mb-4"
        >
          ← Back to Messages
        </button>
        
        <div className="bg-white border rounded-xl shadow-sm p-6">
          <div className="flex justify-between items-start">
            <div>
              <h1 className='text-2xl font-bold'>{listing.title}</h1>
              <p className='text-gray-600 mt-1'> 
                Chat with <strong>{otherUser.name}</strong>
              </p>
              
              <div className="flex items-center gap-3 mt-3">
                <span className={`
                  px-3 py-1 rounded-full text-sm font-semibold
                  ${claim.status === 'pending' && 'bg-yellow-100 text-yellow-700'}
                  ${claim.status === 'confirmed' && 'bg-blue-100 text-blue-700'}
                  ${claim.status === 'completed' && 'bg-green-100 text-green-700'}
                `}>
                  Claim Status: {claim.status}
                </span>
                <span className={`
                  px-3 py-1 rounded-full text-sm font-semibold
                  ${listing.status === 'available' && 'bg-green-100 text-green-700'}
                  ${listing.status === 'claimed' && 'bg-yellow-100 text-yellow-700'}
                  ${listing.status === 'completed' && 'bg-gray-100 text-gray-700'}
                `}>
                  Listing Status: {listing.status}
                </span>
              </div>
            </div>
            
            {/* Complete button - only show to giver and if not already completed */}
            {authUserId === listing.user_id && claim.status !== 'completed' && (
              <button
                onClick={handleComplete}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              >
                Mark as Completed
              </button>
            )}
          </div>
          
          {/* Listing details summary */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6 pt-6 border-t">
            <div>
              <p className="text-sm text-gray-500">Material</p>
              <p className="font-medium">{listing.material_type}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Location</p>
              <p className="font-medium">{listing.location}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Weight</p>
              <p className="font-medium">{listing.estimated_weight} kg</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Pickup Window</p>
              <p className="font-medium text-sm">
                {new Date(listing.pickup_window_start).toLocaleDateString()} - {new Date(listing.pickup_window_end).toLocaleDateString()}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Chat and details side by side */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Chat - takes 2 columns */}
        <div className="lg:col-span-2">
          <Chat 
            claimId={claim.id} 
            initialMessages={messages} 
            authUserId={authUserId} 
          />
        </div>

        {/* Listing details sidebar */}
        <div className="space-y-4">
          <div className="bg-white border rounded-xl shadow-sm p-6">
            <h3 className="font-semibold mb-4 text-gray-800">Listing Details</h3>
            <div className="space-y-3">
              <div>
                <p className="text-sm text-gray-500">Description</p>
                <p className="text-gray-700 mt-1">{listing.description}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Condition</p>
                <p className="text-gray-700 mt-1">{listing.condition}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Pickup Details</p>
                <p className="text-gray-700 mt-1 text-sm">
                  Please coordinate exact time and location with {listing.user_id === authUserId ? 'the taker' : 'the giver'}.
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white border rounded-xl shadow-sm p-6">
            <h3 className="font-semibold mb-4 text-gray-800">Contact Information</h3>
            <div className="space-y-3">
              <div>
                <p className="text-sm text-gray-500">You're chatting with</p>
                <p className="font-medium">{otherUser.name}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Role</p>
                <p className="text-gray-700 mt-1">
                  {otherUser.id === listing.user_id ? 'Giver (Listing Owner)' : 'Taker'}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

Show.layout = page => <AppLayout>{page}</AppLayout>

export default Show