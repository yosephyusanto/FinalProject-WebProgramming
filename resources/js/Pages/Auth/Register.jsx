import { useForm, Link } from "@inertiajs/react";
import {FaEye, FaEyeSlash} from 'react-icons/fa';
import {useState} from "react";

const register = () => {
  const {data, setData, post, processing, errors} = useForm({
    name: '',
    email : '',
    password: '',
    password_confirmation: '',
    role: 'giver',
    location: '',
  })
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const submit = (e) => {
    e.preventDefault()
    console.log(data)
    post('/register')
  }

  return (
    <div className="flex items-center justify-center min-h-screen px-4 bg-gray-100">
      <div className="flex flex-col w-full max-w-md p-6 bg-white border rounded-lg shadow-lg">
        <h1 className="mb-4 text-2xl text-center">Register</h1> 
         <form onSubmit={submit} className="flex flex-col space-y-4">
          <div>
            <input type="text" value={data.name} onChange={e => setData('name', e.target.value)} placeholder="Name" className="w-full p-2 border"/>
            {errors.name && <div className="mt-1 text-sm text-red-600">{errors.name}</div>}
          </div>
          <div>
            <input type="email" value={data.email} onChange={e => setData('email', e.target.value)} placeholder="Email" className="w-full p-2 border"/>
            {errors.email && <div className="mt-1 text-sm text-red-600">{errors.email}</div>}
          </div>

        <div>
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              value={data.password}
              onChange={e => setData('password', e.target.value)}
              placeholder="Password"
              className="w-full p-2 pr-10 border"
            />
            <button
              type="button"
              className="absolute inset-y-0 flex items-center text-gray-500 right-2"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <FaEye /> : <FaEyeSlash />}
            </button>
          </div>
        </div>

        <div>
          <div className="relative">
            <input
              type={showConfirmPassword ? "text" : "password"}
              value={data.password_confirmation}
              onChange={e => setData('password_confirmation', e.target.value)}
              placeholder="Confirm Password"
              className="w-full p-2 pr-10 border"
            />
            <button
              type="button"
              className="absolute inset-y-0 flex items-center text-gray-500 right-2"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            >
              {showConfirmPassword ? <FaEye /> : <FaEyeSlash />}
            </button>
          </div>
          {errors.password && (
            <div className="mt-1 text-sm text-red-600">
              {errors.password}
            </div>
          )}
        </div>

          <div>
            <select name="role" className="w-full p-2 border" value={data.role} onChange={e => setData('role', e.target.value)}>
              <option value="giver">Giver</option>
              <option value="taker">Taker</option>
            </select>
          </div>
          <div>
            <input type="text" name="location" value={data.location} onChange={e => setData('location', e.target.value)} placeholder="Location" className="w-full p-2 border"/>
            {errors.location && <div className="mt-1 text-sm text-red-600">{errors.location}</div>} 
          </div>
          <button type="submit" disabled={processing} className="px-4 py-2 text-white bg-black rounded">
            {processing ? 'Registering...' : 'Register'}
          </button>
        </form>
        <p className="mt-4 text-center">Already have an account? <Link href="/login" className="text-blue-600 hover:underline">Login</Link></p>
      </div>
    </div>
  )
}

export default register