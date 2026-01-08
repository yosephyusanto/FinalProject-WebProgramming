import React, { useEffect, useState } from 'react'
import AppLayout from '../../Layouts/AppLayout'
import { Link, router } from '@inertiajs/react'
import { route } from 'ziggy-js'

const MessagesIndex = ({ claims: initialClaims, auth }) => {
  const [claims, setClaims] = useState(initialClaims?.data || [])
  const [notifications, setNotifications] = useState([])
  const [pagination, setPagination] = useState(initialClaims || {})

  const authUserId = auth.user.id

  useEffect(() => {
    if (initialClaims) {
      setClaims(initialClaims.data || [])
      setPagination(initialClaims)
    }
  }, [initialClaims])

  // Listen for new claim notifications
  useEffect(() => {
    if (typeof window === 'undefined' || !window.Echo) {
      console.warn('Echo is not available')
      return
    }

    const userId = document.querySelector('meta[name="user-id"]')?.content
    
    if (authUserId) {
      const channel = window.Echo.private(`user.${userId}`)
      
      channel.listen('.NewClaimNotification', (notification) => {
        setNotifications(prev => [notification, ...prev])
        
        // Show browser notification if permitted
        if (Notification.permission === 'granted') {
          new Notification('New Claim!', {
            body: notification.message,
            icon: '/logo.png'
          })
        }
        
        // Refresh claims list
        router.reload({ only: ['claims'], preserveScroll: true })
      })

      return () => {
        channel.stopListening('.NewClaimNotification')
        window.Echo.leave(`user.${userId}`)
      }
    }
  }, [authUserId])

  // Request notification permission
  useEffect(() => {
    if (Notification.permission === 'default') {
      Notification.requestPermission()
    }
  }, [])

  const formatTime = (dateString) => {
    if (!dateString) return ''
    
    try {
      const date = new Date(dateString)
      if (isNaN(date.getTime())) return ''
      
      const now = new Date()
      const diffMs = now - date
      const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))
      
      if (diffDays === 0) {
        return date.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })
      } else if (diffDays === 1) {
        return 'Yesterday'
      } else if (diffDays < 7) {
        return `${diffDays} days ago`
      } else {
        return date.toLocaleDateString('id-ID', { day: '2-digit', month: 'short' })
      }
    } catch (error) {
      console.error('Error formatting date:', error)
      return ''
    }
  }

  const getLastMessage = (claim) => {
    if (!claim.last_message) {
      return 'No messages yet'
    }
    
    const message = claim.last_message.message || ''
    return message.length > 50 ? message.substring(0, 50) + '...' : message
  }

  const getOtherUserName = (claim) => {
    if (!claim || !authUserId) return 'Unknown User'
    
    // Get user ID from meta tag or props
    const userId = document.querySelector('meta[name="user-id"]')?.content

    const currentUserIsClaimant = claim.claimed_by_user_id === authUserId
    
    if (currentUserIsClaimant) {
      return claim.material_listing.user.name || 'Listing Owner'
    }else{
      return claim.claimed_by.name || 'Claimant'
    }
  }

  if (!initialClaims) {
    return (
      <div className="max-w-6xl mx-auto py-8">
        <div className="text-center py-12">
          <p className="text-gray-500">Loading messages...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-6xl mx-auto py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Messages</h1>
        
        {/* Notifications bell */}
        {notifications.length > 0 && (
          <div className="relative">
            <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-6 w-6 flex items-center justify-center">
              {notifications.length}
            </span>
            <button 
              className="p-2 bg-gray-100 rounded-lg"
              onClick={() => setNotifications([])}
            >
              🔔
            </button>
          </div>
        )}
      </div>

      {/* Notifications dropdown */}
      {notifications.length > 0 && (
        <div className="mb-6 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <h3 className="font-semibold text-yellow-800 mb-2">New Notifications</h3>
          {notifications.map((notification, index) => (
            <div key={index} className="mb-2 last:mb-0 p-3 bg-white rounded border">
              <p className="text-sm">{notification.message}</p>
              <Link 
                href={notification.link} 
                className="text-xs text-blue-600 hover:underline mt-1 inline-block"
              >
                View claim →
              </Link>
            </div>
          ))}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left column: Claims list */}
        <div className="lg:col-span-1 bg-white border rounded-xl shadow-sm">
          <div className="p-4 border-b">
            <h2 className="font-semibold text-gray-800">Your Conversations</h2>
          </div>
          
          <div className="divide-y">
            {claims.length === 0 ? (
              <div className="p-6 text-center text-gray-500">
                <p>No conversations yet</p>
                <p className="text-sm mt-2">Claim a listing to start chatting!</p>
                <Link 
                  href={route('marketplace.index')}
                  className="inline-block mt-4 px-4 py-2 bg-black text-white rounded-lg text-sm"
                >
                  Browse Marketplace
                </Link>
              </div>
            ) : (
              claims.map(claim => {
                // FIX 7: Skip invalid claims
                if (!claim || !claim.id) return null
                
                return (
                  <Link 
                    key={claim.id} 
                    href={`/claims/${claim.id}`}
                    className="block p-4 hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-start gap-3">
                      <div className="w-12 h-12 flex-shrink-0 overflow-hidden rounded-lg">
                        <img
                          src={claim?.material_listing?.photos?.[0]?.image_url || '/images/no_image.jpg'}
                          alt={claim?.material_listing?.title || 'Material listing'}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            e.target.src = '/images/no_image.jpg'
                          }}
                        />
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-start">
                          <h3 className="font-semibold truncate">
                            {claim?.material_listing?.title || 'Untitled Listing'}
                          </h3>
                          <span className="text-xs text-gray-500">
                            {claim.last_message ? formatTime(claim.last_message.created_at) : ''}
                          </span>
                        </div>
                        
                        <p className="text-sm text-gray-600 truncate mt-1">
                          {getOtherUserName(claim)}
                        </p>
                        
                        <p className="text-sm text-gray-500 truncate mt-1">
                          {getLastMessage(claim)}
                        </p>
                        
                        <div className="flex items-center gap-2 mt-2">
                          <span className={`
                            px-2 py-0.5 rounded-full text-xs font-semibold
                            ${claim.status === 'pending' ? 'bg-yellow-100 text-yellow-800' : ''}
                            ${claim.status === 'completed' ? 'bg-blue-100 text-blue-800' : ''}
                            ${claim.status === 'cancelled' ? 'bg-green-100 text-green-800' : ''}
                            ${!['pending', 'completed', 'cancelled'].includes(claim.status) ? 'bg-gray-100 text-gray-800' : ''}
                          `}>
                            {claim.status || 'unknown'}
                          </span>
                          <span className="text-xs text-gray-500">
                            {claim.messages_count || 0} messages
                          </span>
                        </div>
                      </div>
                    </div>
                  </Link>
                )
              })
            )}
          </div>
        </div>

        {/* Right column: Chat area (initially empty or with instructions) */}
        <div className="lg:col-span-2">
          {claims.length === 0 ? (
            <div className="bg-white border rounded-xl shadow-sm p-8 text-center h-full flex flex-col items-center justify-center">
              <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-6">
                <span className="text-4xl">💬</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-3">No conversation selected</h3>
              <p className="text-gray-600 max-w-md mx-auto">
                Select a conversation from the list to start chatting with the other party about pickup details.
              </p>
            </div>
          ) : (
            <div className="bg-white border rounded-xl shadow-sm h-full">
              <div className="p-6">
                <p className="text-gray-500 text-center">
                  Select a conversation to start chatting
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
      
      {/* Pagination */}
      {pagination.last_page > 1 && (
        <div className="mt-8 flex justify-center gap-2">
          {pagination.links?.map((link, index) => (
            <Link
              key={index}
              href={link.url || '#'}
              preserveScroll
              preserveState
              className={`
                px-4 py-2 rounded-md border
                ${link.active ? 'bg-black text-white' : 'bg-white text-gray-700 hover:bg-gray-50'}
                ${!link.url && 'opacity-50 cursor-not-allowed'}
              `}
              dangerouslySetInnerHTML={{ __html: link.label }}
            />
          ))}
        </div>
      )}
    </div>
  )
}

MessagesIndex.layout = page => <AppLayout>{page}</AppLayout>

export default MessagesIndex