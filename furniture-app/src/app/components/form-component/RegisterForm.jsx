'use client'
import Link from 'next/link'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import axios from 'axios'
import 'izitoast/dist/css/iziToast.min.css' 
let iziToast;
if (typeof window !== 'undefined') {
  iziToast = require('izitoast');
}
export default function RegisterForm() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    address: '',
  })
  const [showOtp, setShowOtp] = useState(false)
  const [otp, setOtp] = useState(['', '', '', '', '', ''])
  const [message, setMessage] = useState('')

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const showToast = ({ type, title, message }) => {
    if (!iziToast) return

    const options = {
      title,
      message,
      position: 'topRight',
    }

    if (type === 'success') {
      iziToast.success(options)
    } else {
      iziToast.error(options)
    }
  }

  const apiBaseUrl = process.env.NEXT_PUBLIC_APIBASEURL || 'http://localhost:8000/api/'
  
  const handleRegisterSubmit = async (e) => {
    e.preventDefault()

    try {
      const response = await axios.post(`${apiBaseUrl}web/auth/register`, formData)
      const data = response.data

      if (data.status === 1) {
        showToast({
          type: 'success',
          title: 'Success',
          message: data.msg,
        })
        setFormData({
          name: '',
          email: '',
          phone: '',
          password: '',
          address: '',
        })
        router.push('/login')
      } else {
        showToast({
          type: 'error',
          title: 'Error',
          message: data.msg,
        })
      }
    } catch (error) {
      console.error(error)
      showToast({
        type: 'error',
        title: 'Error',
        message: 'Registration failed. Please try again.',
      })
    }
  }

  return (
    <div className="flex flex-1 items-center justify-center p-8 sm:p-10 lg:p-14">
      <div className="w-full max-w-lg">
        <div className="mb-6">
          <h2 className="font-playfair text-3xl font-semibold text-[#1f1f1f]">
            {showOtp ? 'Verify OTP' : 'Register'}
          </h2>
          <p className="mt-2 text-sm text-dark-gray">
            {showOtp ? 'Enter the OTP sent to your contact details.' : 'Fill in your details to get started.'}
          </p>
        </div>

        {message ? (
          <div className="mb-4 rounded-xl border px-4 py-3 text-sm text-orange-dim">
            {message}
          </div>
        ) : null}

        {!showOtp ? (
          <form onSubmit={handleRegisterSubmit} className="space-y-4">
            <div>
              <label htmlFor="name" className="mb-2 block text-sm font-medium text-[#1f1f1f]">
                Full name
              </label>
              <input
                id="name"
                name="name"
                type="text"
                value={formData.name}
                onChange={handleChange}
                required
                placeholder="Enter your full name"
                className="w-full rounded-xl border border-orange-100 bg-white px-4 py-3 text-sm outline-none transition focus:border-orange-dim focus:ring-2 focus:ring-orange-dim/20"
              />
            </div>
            <div>
              <label htmlFor="email" className="mb-2 block text-sm font-medium text-[#1f1f1f]">
                Email address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                required
                placeholder="Enter your email"
                className="w-full rounded-xl border border-orange-100 bg-white px-4 py-3 text-sm outline-none transition focus:border-orange-dim focus:ring-2 focus:ring-orange-dim/20"
              />
            </div>
            <div>
              <label htmlFor="phone" className="mb-2 block text-sm font-medium text-[#1f1f1f]">
                Phone number
              </label>
              <input
                id="phone"
                name="phone"
                type="text"
                value={formData.phone}
                onChange={handleChange}
                required
                placeholder="Enter your phone number"
                className="w-full rounded-xl border border-orange-100 bg-white px-4 py-3 text-sm outline-none transition focus:border-orange-dim focus:ring-2 focus:ring-orange-dim/20"
              />
            </div>
            <div>
              <label htmlFor="password" className="mb-2 block text-sm font-medium text-[#1f1f1f]">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                value={formData.password}
                onChange={handleChange}
                required
                placeholder="Create a password"
                className="w-full rounded-xl border border-orange-100 bg-white px-4 py-3 text-sm outline-none transition focus:border-orange-dim focus:ring-2 focus:ring-orange-dim/20"
              />
            </div>
            <div>
              <label htmlFor="address" className="mb-2 block text-sm font-medium text-[#1f1f1f]">
                Address
              </label>
              <textarea
                id="address"
                name="address"
                value={formData.address}
                onChange={handleChange}
                required
                placeholder="Enter your address"
                className="w-full rounded-xl border border-orange-100 bg-white px-4 py-3 text-sm outline-none transition focus:border-orange-dim focus:ring-2 focus:ring-orange-dim/20"
              />
            </div>
            <button
              type="submit"
              className="w-full rounded-xl bg-orange-dim px-4 py-3 text-sm font-semibold text-white transition hover:bg-orange-dim"
            >
              Create Account
            </button>
          </form>
        ) : null}

        <div className="mt-4 text-center text-sm text-dark-gray">
          Already have an account?{' '}
          <Link href="/login" className="font-semibold text-orange-dim hover:text-orange-dim">
            Login
          </Link>
        </div>
      </div>
    </div>
  )
}