'use client'
import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { useRouter } from 'next/navigation'
import { useDispatch, useSelector } from 'react-redux'
import { loginUser, signupUser } from '../../redux/authSlice'
import Link from 'next/link'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
export default function Login(){
  const { register, handleSubmit } = useForm()
  const dispatch = useDispatch()
  const router = useRouter()
  const auth = useSelector(s=>s.auth)
  const [activeTab, setActiveTab] = useState('login')
  const [userType, setUserType] = useState('customer')

  const onLogin = async data => {
    dispatch(loginUser(data))
      .unwrap()
      .then(response => {
        toast.success("Login successful!");
        router.push('/product');
      })
      .catch(error => {
        toast.error(error || "Login failed. Please check your credentials.");
        // Error is handled by the auth slice, so we don't need to do anything here
      });
  };

  const onSignup = async data => {
    dispatch(signupUser(data))
      .unwrap()
      .then(response => {
        toast.success("Registration successful! Welcome to ShopStore!");
        router.push('/product');
      })
      .catch(error => {
        toast.error(error || "Registration failed. Please try again.");

      });
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">ShopStore</h1>
          <p className="text-gray-600">Welcome back! Please login to your account.</p>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="flex border-b border-gray-200">
            <button
              onClick={() => setActiveTab('login')}
              className={`flex-1 py-4 px-6 text-center font-medium transition-colors ${
                activeTab === 'login'
                  ? 'text-purple-600 border-b-2 border-purple-600'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Login
            </button>
            <button
              onClick={() => setActiveTab('register')}
              className={`flex-1 py-4 px-6 text-center font-medium transition-colors ${
                activeTab === 'register'
                  ? 'text-purple-600 border-b-2 border-purple-600'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Register
            </button>
          </div>

          <div className="p-6">
            {activeTab === 'login' ? (
              <form onSubmit={handleSubmit(onLogin)} className="space-y-4">
                <div>
                  <p className="text-sm text-gray-600 mb-4">
                   Please Login with your Email and Password
                  </p>
                  
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Username or email address <span className="text-red-500">*</span>
                      </label>
                      <input
                        {...register('email', { required: true })}
                        type="email"
                        placeholder="Username or email address"
                        className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Password <span className="text-red-500">*</span>
                      </label>
                      <input
                        {...register('password', { required: true })}
                        type="password"
                        placeholder="Password"
                        className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          className="w-4 h-4 text-purple-600 border-gray-300 rounded focus:ring-purple-500"
                        />
                        <span className="ml-2 text-sm text-gray-600">Remember me</span>
                      </label>
                  
                    </div>

                    <button
                      type="submit"
                      disabled={auth.loading}
                      className="w-full bg-purple-600 text-white py-3 rounded-lg font-medium hover:bg-purple-700 transition-colors disabled:opacity-50"
                    >
                      {auth.loading ? 'Loading...' : 'Log in'}
                    </button>
                  </div>
                </div>
              
              </form>
            ) : (
              <form onSubmit={handleSubmit(onSignup)} className="space-y-4">
                <div>
                  <p className="text-sm text-gray-600 mb-4">
                   Please register to Continue
                  </p>
                  
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Username <span className="text-red-500">*</span>
                      </label>
                      <input
                        {...register('username', { required: true })}
                        placeholder="Username"
                        className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Email address <span className="text-red-500">*</span>
                      </label>
                      <input
                        {...register('email', { required: true })}
                        type="email"
                        placeholder="Email address"
                        className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Password <span className="text-red-500">*</span>
                      </label>
                      <input
                        {...register('password', { required: true })}
                        type="password"
                        placeholder="Password"
                        className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      />
                    </div>

              

                  

                    <button
                      type="submit"
                      disabled={auth.loading}
                      className="w-full bg-purple-600 text-white py-3 rounded-lg font-medium hover:bg-purple-700 transition-colors disabled:opacity-50"
                    >
                      {auth.loading ? 'Loading...' : 'Register'}
                    </button>
                  </div>
                </div>
                {auth.error && (
                  <div className="text-red-600 text-sm bg-red-50 p-3 rounded-lg">
                    {auth.error}
                  </div>
                )}
      </form>
            )}
          </div>
        </div>

        {/* Footer Links */}
      
      </div>
        <ToastContainer 
          position="top-right"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="light"
        />
    </div>
  )
}
