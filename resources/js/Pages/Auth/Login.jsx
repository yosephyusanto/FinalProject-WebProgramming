import React from 'react'
import {useForm, Link} from '@inertiajs/react'

const Login = () => {
  const {data, setData, post, processing, errors} = useForm({
    email : '',
    password: '',
    remember: false,
  })

  const submit = (e) => {
    e.preventDefault()
    post('/login')
  }

  return (
    <div className='flex items-center justify-center min-h-screen px-4 bg-gray-100'>
      <div className='flex flex-col w-full max-w-md p-6 bg-white border rounded-lg shadow-lg'>
        <h1 className="mb-4 text-2xl text-center">Login</h1>
        <form onSubmit={submit} className='flex flex-col gap-4'>
          <div>
            <input type="email" value={data.email} onChange={e => setData('email', e.target.value)} placeholder='Email' className='w-full p-2 border'/>
            {errors.email && <div className='mt-1 text-sm text-red-600'>{errors.email}</div>}
          </div>

          <div>
            <input type="password" value={data.password} onChange={e => setData('password', e.target.value)} placeholder='Password' className='w-full p-2 border'/>
            {errors.password && <div className='mt-1 text-sm text-red-600'>{errors.password}</div>}
          </div>

          <label className='flex items-center gap-2'>
            <input type="checkbox" checked={data.remember} onChange={e => setData('remember', e.target.checked)} className='w-4 h-4 cursor-pointer'/>
            Remember me
          </label>

          <button type='submit' disabled={processing} className='px-4 py-2 text-white bg-black rounded'>
            {processing ? 'Logging in...' : 'Login'}
          </button>
        </form>
        <p className='mt-4 text-center'>Don't have an account? <Link href="/register" className="text-blue-600 hover:underline">Register</Link></p>
      </div>
    </div>
  )
}

export default Login