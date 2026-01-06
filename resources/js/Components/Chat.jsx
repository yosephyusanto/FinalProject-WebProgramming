import { useForm, router } from '@inertiajs/react'
import { useEffect, useRef, useState } from 'react'
import  {route} from 'ziggy-js'

const Chat = ({ claimId, messages, authUserId }) => {
  const bottomRef = useRef(null)
  const [messageList, setMessagesList] = useState(messages || [])
  
  const { data, setData, post, reset, processing } = useForm({
    message: '',
  })

  // Auto scroll ke bawah
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messageList])

  // Polling tiap 1 detik
  useEffect(() => {
    if(!window.Echo){
      console.error('Echo not initialized')
      return
    }

    const channel = window.Echo.private(`claims.${claimId}`)

    channel.listen('.newMessage', (event) => {
      console.log('New message receieved: ', event)

      const messageExist = messageList.some(msg => msg.id === event.id)
      if(!messageExist){
        setMessagesList(prev => [...prev, {
        id: event.id,
        claim_id: event.claim_id,
        sender_id: event.sender_id,
        message: event.message,
        created_at: event.created_at,
        sender: event.sender || {id:event.sender_id, name: 'User'}
      }])
      }
    })

    return () => {
      channel.stopListening('.NewMessage')
      window.Echo.leave(`claims.${claimId}`)
    }
  }, [claimId, messageList])

  useEffect(() => {
    if(messages && messages.length > 0){
      setMessagesList(messages)
    }
  }, [messages])

  const submit = (e) => {
    e.preventDefault()

    post(route('messages.store', claimId), {
      preserveScroll: true,
      onSuccess: () => reset('message'),
      onFinish: () => {},
    })
  }

  const formatTime = (dateString) => {
    return new Date(dateString).toLocaleTimeString('id-ID', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false
    })
  }

  return (
    <div className='flex flex-col h-[500px] border rounded-lg bg-white'>
      {/* Messages */}
      <div className="flex-1 p-4 space-y-4 overflow-y-auto">
        {messageList.length === 0 ? (
          <div className="text-center text-gray-500 py-8">
            No messages yet. Start the conversation!
          </div>
        ) : (
          messageList.map((msg) => (
            <div
              key={msg.id}
              className={`flex ${
                msg.sender_id === authUserId ? 'justify-end' : 'justify-start'
              }`}
            >
              <div className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                msg.sender_id === authUserId 
                  ? 'bg-blue-500 text-white' 
                  : 'bg-gray-100 text-gray-800'
              }`}>
                <p>{msg.message}</p>
                <p className={`text-xs mt-1 ${
                  msg.sender_id === authUserId 
                    ? 'text-blue-100' 
                    : 'text-gray-500'
                }`}>
                  {formatTime(msg.created_at)}
                </p>
              </div>
            </div>
          ))
        )}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <form onSubmit={submit} className="flex gap-2 p-3 border-t">
        <input
          type="text"
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder="Type a message…"
          value={data.message}
          onChange={(e) => setData('message', e.target.value)}
          disabled={processing}
        />
        <button
          type="submit"
          className="px-4 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          disabled={processing || !data.message.trim()}
        >
          {processing ? 'Sending...' : 'Send'}
        </button>
      </form>
    </div>
  )
}

export default Chat