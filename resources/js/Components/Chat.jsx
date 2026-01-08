import { useForm, router } from '@inertiajs/react'
import { useEffect, useRef, useState } from 'react'
import  {route} from 'ziggy-js'

const Chat = ({ claimId, initialMessages, authUserId, isChatDisabled}) => {
  const bottomRef = useRef(null)
  const [messageList, setMessageList] = useState(() => {
    if(!initialMessages) return []

    if(initialMessages.data && Array.isArray(initialMessages.data)){
      return initialMessages.data
    }

    if(Array.isArray(initialMessages)){
      return initialMessages
    }

      return []
  })
  
  const { data, setData, post, reset, processing } = useForm({
    message: '',
  })

  // sinkro untuk perubahan page
  useEffect(() => {
    if(!initialMessages) return

    let newMessages = []

    if(initialMessages.data && Array.isArray(initialMessages.data)){
      newMessages = initialMessages.data
    }else if(Array.isArray(initialMessages)){
      newMessages = initialMessages
    }

    console.log('Syncing...', newMessages.length)
    setMessageList(newMessages)
  }, [initialMessages])

  // Auto scroll ke bawah
  useEffect(() => {
    bottomRef.current.scrollIntoView({ behavior: 'smooth' })
  }, [messageList])

  useEffect(() => {
    if(!window.Echo){
      console.error('Echo not initialized')
      return
    }
  
  if(isChatDisabled){
    console.log('Chat is disabled.')
    return
  }

    const channel = window.Echo.private(`claims.${claimId}`)

    channel.listen('.newMessage', (event) => {
      setMessageList(prev => {
        const messageExists = prev.some(msg=> msg.id === event.id)
        if(messageExists){
          return prev
        }

        return [...prev, {
          id: event.id,
          claim_id: event.claim_id,
          sender_id: event.sender_id,
          message: event.message,
          created_at: event.created_at,
          sender: event.sender || {id:event.sender_id, name: 'User'}
          }]
      })
    })

    return () => {
      channel.stopListening('.newMessage')
      window.Echo.leave(`claims.${claimId}`)
    }
  }, [claimId, isChatDisabled])

  const submit = (e) => {
    e.preventDefault()

    if(isChatDisabled){
      alert('Chat is disabled. Cannot send messages in a completed or cancelled claim.')
      return
    }
    
    post(route('messages.store', claimId), {
      preserveScroll: true,
      onSuccess: () => reset('message'),
      onFinish: () => {},
      onError: (errors) => {
        console.error('Error in sending message:', errors)
      }
    })
  }

  const formatTime = (dateString) => {
    return new Date(dateString).toLocaleTimeString('id-ID', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false
    })
  }

  const isSystemMassage = (msg) => {
    return msg.is_system_message || !msg.sender_id
  }

  return (
    <div className='flex flex-col h-[500px] border rounded-lg bg-white'>
      {/* Chat Header */}
      <div className='flex items-center justify-between px-4 py-3 border-b bg-gray-50'>
        <h3 className='font-semibold text-gray-800'>Chat</h3>
        {isChatDisabled && (
          <span className='px-2 py-1 text-xs font -semibold text-red-700 bg-red-100 rounded-full'>
            Read Only
          </span>
        )}
      </div>
      
      {/* Messages */}
      <div className="flex-1 p-4 space-y-4 overflow-y-auto">
        {messageList.length === 0 ? (
          <div className="text-center text-gray-500 py-8">
            <p>No messages yet. Start the conversation!</p>
            {isChatDisabled && (
              <p className='text-xs text-gray-400 mt-2'>
                Chat is disabled for this claim.
              </p>
            )}
          </div>
        ) : (
          messageList.map((msg) => {
            const isSystem = isSystemMassage(msg)
            const isOwnMessage = msg.sender_id === authUserId

            return (
              <div
                key={msg.id}
                className={`flex ${isSystem ? 'justify-center' : isOwnMessage ? 'justify-end' : 'justify-start'}`}
              >
                <div className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                  isSystem ? 'bg-gray-100 text-gray-600 italic border border-gray-200' :
                  isOwnMessage ? 'bg-blue-500 text-white' : 'bg-gray-100 text-gray-800'
                }`}>
                    {isSystem ? (
                      <div className='text-center'>
                        <p className='text-sm'>{msg.message}</p>
                        <p className='text-xs text-gray-500 mt-1'>
                          {formatTime(msg.created_at)}
                        </p>
                      </div>
                    ) : (
                      <>
                        <div className='flex items-center gap-2 mb-1'>
                          <span className='text-xs font-medium'>
                            {msg.sender.name || (isOwnMessage ? 'You' : 'User')}
                          </span>
                        </div>
                        <p className='break-words'>{msg.message}</p>
                        <p className={`text-xs mt-1 ${isOwnMessage ? 'text-blue=100' : 'text-gray-500'}`}>
                          {formatTime(msg.created_at)}
                        </p>
                      </>
                    )}
                </div>
              </div>
            )
          })
        )}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <form onSubmit={submit} className="flex gap-2 p-3 border-t">
        <input
          type="text"
          className={`w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none ${
            isChatDisabled ? 'bg-gray-100 border-gray-300 cursor-not-allowed' : 'border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent'
          }`}
          placeholder={isChatDisabled ? 'Chat is disabled for completed/cancelled claims.' : 'Type a message...'}
          value={data.message}
          onChange={(e) => !isChatDisabled && setData('message', e.target.value)}
          disabled={processing || isChatDisabled}
          readOnly={isChatDisabled}
        />
        <button
          type="submit"
          className={`px-4 py-2 text-white transition-colors ${
            isChatDisabled ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed' 
          }`}
          disabled={processing || !data.message.trim() || isChatDisabled}
        >
          {processing ? 'Sending...' : 'Send'}
        </button>
      </form>
    </div>
  )
}

export default Chat