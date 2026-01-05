import { useEffect, useState } from 'react'
import { usePage } from '@inertiajs/react'

const styles = {
  success: 'alert-success',
  error: 'alert-error',
  info: 'alert-info',
}

const Toast = () => {
  const { flash } = usePage().props
  const [message, setMessage] = useState(null)
  const [type, setType] = useState(null)

  useEffect(() => {
    if (flash?.success) {
      setMessage(flash.success)
      setType('success')
    } else if (flash?.error) {
      setMessage(flash.error)
      setType('error')
    } else if (flash?.info) {
      setMessage(flash.info)
      setType('info')
    } else {
      return
    }

    const t = setTimeout(() => {
      setMessage(null)
      setType(null)
    }, 3000)

    return () => clearTimeout(t)
  }, [flash?.success, flash?.error, flash?.info])

  if (!message) return null

  return (
    <div className="z-50 toast toast-bottom toast-end">
      <div className={`alert ${styles[type]}`}>
        <span className='text-white'>{message}</span>
      </div>
    </div>
  ) 
}

export default Toast
