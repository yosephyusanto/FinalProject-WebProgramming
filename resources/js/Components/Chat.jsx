import { useForm, router } from '@inertiajs/react'
import { useEffect, useRef } from 'react'
import  {route} from 'ziggy-js'

const Chat = ({ claimId, messages, authUserId }) => {
  const bottomRef = useRef(null)

  const { data, setData, post, reset, processing } = useForm({
    message: '',
  })

  // Auto scroll ke bawah
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  // Polling tiap 1 detik
  useEffect(() => {
    const interval = setInterval(() => {
      router.reload({
        only: ['messages'],
        preserveScroll: true,
        preserveState: true,
      })
    }, 1000)

    return () => clearInterval(interval)
  }, [])

  const submit = (e) => {
    e.preventDefault()

    post(route('messages.store', claimId), {
      preserveScroll: true,
      onSuccess: () => reset('message'),
    })
  }

  return (
    <div className='flex flex-col h-[500px] border rouned-lg'>
       {/* Messages */}
      <div className="flex-1 p-4 space-y-4 overflow-y-auto bg-base-200">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`chat ${
              msg.sender_id === authUserId ? 'chat-end' : 'chat-start'
            }`}
          >
            <div className="chat-bubble">
              {msg.message}
            </div>
          </div>
        ))}
        <div ref={bottomRef} />
      </div>

       {/* Input */}
      <form onSubmit={submit} className="flex gap-2 p-3 border-t">
        <input
          type="text"
          className="w-full input input-bordered"
          placeholder="Type a message…"
          value={data.message}
          onChange={(e) => setData('message', e.target.value)}
        />
        <button
          type="submit"
          className="btn btn-primary"
          disabled={processing || !data.message}
        >
          Send
        </button>
      </form>
    </div>
  )
}

export default Chat