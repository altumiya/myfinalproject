'use client'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import axios from 'axios'
import { setToken } from '@/redux/userSlice'
import { useDispatch } from 'react-redux'
import 'izitoast/dist/css/iziToast.min.css'
import Cookies from 'js-cookie';
let iziToast;
if (typeof window !== 'undefined') {
  iziToast = require('izitoast');
}

export default function LoginForm() {
  const router = useRouter()
  const apiBaseUrl = process.env.NEXT_PUBLIC_APIBASEURL || 'http://localhost:8000/api/'
  const dispatch = useDispatch()

  const showToast = ({ type, title, message }) => {
    // 2. FIX: Check if iziToast is loaded
    if (!iziToast) return;

    const options = {
      title,
      // 3. FIX: Fallback to prevent the '.length' undefined crash
      message: message || "An unexpected error occurred.",
      position: 'topRight',
    }

    if (type === 'success') {
      iziToast.success(options)
    } else {
      iziToast.error(options)
    }
  }

  const handleLogin = async (e) => {
    e.preventDefault()
    const obj = {
      email: e.target.email.value,
      password: e.target.password.value,
    }

 
      try {
      const response = await axios.post(`${apiBaseUrl}web/auth/login`, obj)
      const data = response.data
      
      // ADD THIS LOG: Let's see exactly what the backend returned
      console.log("BACKEND RESPONSE DATA:", data);

      if (data.status === 1 || data.status === "1" || data.status === 200 || data.success === true) {
        
        // FIX: Check multiple paths just in case your backend nests the token
        const realToken = data.token || (data.data && data.data.token);

        // If we still can't find the token, stop and alert!
        if (!realToken) {
            showToast({ type: 'error', title: 'Error', message: 'API Login Success, but no token received!' });
            return;
        }

        showToast({
          type: 'success',
          title: 'Success',
          message: 'Login Successfully',
        })
        
        // Dispatch the guaranteed real token
        dispatch(setToken({ token: realToken }))
        Cookies.set('token', realToken, { expires: 7 })
        
        router.push('/dashboard')
      } else {
        showToast({
          type: 'error',
          title: 'Error',
          message: data.msg || data.message || "Invalid credentials.", 
        })
      }
    } catch (error) {
      console.error(error)
      showToast({
        type: 'error',
        title: 'Error',
        message: error.response?.data?.message || error.response?.data?.msg || 'Login failed. Please try again.',
      })
    }
  }

  return (
    <div className="flex flex-1 items-center justify-center p-8 sm:p-10 lg:p-10">
      <div className="w-full max-w-md">
        <div className="mb-5">
          <h2 className="font-playfair text-3xl font-semibold text-[#1f1f1f]">Login</h2>
          <p className="mt-2 text-sm text-dark-gray">Enter your credentials to continue</p>
        </div>

        <form className="space-y-5" onSubmit={handleLogin}>
          <div>
            <label htmlFor="email" className="mb-2 block text-sm font-medium text-[#1f1f1f]">
              Email address
            </label>
            <input
              id="email"
              type="email"
              name="email"
              placeholder="you@example.com"
              className="w-full rounded-xl border border-orange-100 bg-white px-4 py-3 text-sm outline-none transition focus:border-orange-dim focus:ring-2 focus:ring-orange-dim/20"
            />
          </div>

          <div>
            <label htmlFor="password" className="mb-2 block text-sm font-medium text-[#1f1f1f]">
              Password
            </label>
            <input
              id="password"
              type="password"
              name="password"
              placeholder="Enter your password"
              className="w-full rounded-xl border border-orange-100 bg-white px-4 py-3 text-sm outline-none transition focus:border-orange-dim focus:ring-2 focus:ring-orange-dim/20"
            />
          </div>

          <div className="flex items-center justify-between text-sm">
            <label className="flex items-center gap-2 text-dark-gray">
              <input type="checkbox" className="h-4 w-4 rounded border-orange-100 text-orange-dim focus:ring-orange-dim" />
              Remember me
            </label>
            <Link href="/forgot-password" className="font-medium text-orange-dim hover:text-orange-dim">
              Forgot password?
            </Link>
          </div>

          <button
            type="submit"
            className="w-full rounded-xl bg-orange-dim px-4 py-3 text-sm font-semibold text-white transition hover:bg-orange-dim"
          >
            Login
          </button>
        </form>

        <div className="mt-4 flex items-center gap-3 text-sm text-dark-gray">
          <div className="h-px flex-1 bg-orange-100" />
          <span>or</span>
          <div className="h-px flex-1 bg-orange-100" />
        </div>

        <div className="mt-4 text-center text-sm text-dark-gray">
          Don't have an account?{' '}
          <Link href="/register" className="font-semibold text-orange-dim hover:text-orange-dim">
            Register
          </Link>
        </div>
      </div>
    </div>
  )
}