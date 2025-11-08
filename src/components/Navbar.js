"use client"
import React, { useEffect, useState, memo } from 'react'
import Link from 'next/link'
import { useDispatch, useSelector } from 'react-redux'
import { logoutUser, setUser } from '../redux/authSlice'
import { useRouter, usePathname } from 'next/navigation'
import { auth } from '../firebase'
import { onAuthStateChanged } from 'firebase/auth'
import Cookies from 'js-cookie'

function Navbar(){
  const user = useSelector(s=>s.auth.user)
  const dispatch = useDispatch()
  const router = useRouter()
  const pathname = usePathname()
  const [token, setToken] = useState(null)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  // Check for token cookie on mount and when user changes
  useEffect(() => {
    const cookieToken = Cookies.get('sky_token')
    setToken(cookieToken || null)

    // Listen to Firebase auth state changes
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      if (firebaseUser) {
        // User is signed in, update Redux state
        dispatch(setUser({ email: firebaseUser.email, uid: firebaseUser.uid }))
        setToken(Cookies.get('sky_token') || null)
      } else {
        // User is signed out
        dispatch(setUser(null))
        setToken(null)
      }
    })

    return () => unsubscribe()
  }, [dispatch])

  // Check if user is logged in (either Redux state or token exists)
  const isLoggedIn = user || token

  console.log("user", user, "token", token)

  const handleLogout = async ()=>{
    await dispatch(logoutUser())
    setToken(null)
    router.push('/login')
    setMobileMenuOpen(false)
  }
  
  // Don't show navbar on login page
  if (!pathname || pathname === '/login') {
    return null
  }

  return (
    <nav className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-[999]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="font-bold text-xl sm:text-2xl text-gray-900 flex-shrink-0">
            ShopStore
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex gap-4 lg:gap-6 items-center">
            <Link href="#" className="text-gray-700 hover:text-gray-900 text-sm lg:text-base transition-colors">
              Home
            </Link>
            <Link href="#" className="text-gray-700 hover:text-gray-900 text-sm lg:text-base transition-colors">
              Blog
            </Link>
            <Link href="#" className="text-gray-700 hover:text-gray-900 text-sm lg:text-base transition-colors">
              Contact
            </Link>
            {isLoggedIn ? (
              <>
                <Link href="/add-product" className="px-3 py-2 sm:px-4 sm:py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 text-sm sm:text-base transition-colors whitespace-nowrap">
                  Add Product
                </Link>
                <button onClick={handleLogout} className="px-3 py-2 sm:px-4 sm:py-2 border border-gray-300 rounded-lg hover:bg-gray-50 text-sm sm:text-base transition-colors whitespace-nowrap">
                  Logout
                </button>
              </>
            ) : (
              <Link href="/login" className="px-3 py-2 sm:px-4 sm:py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 text-sm sm:text-base transition-colors whitespace-nowrap">
                Sign in
              </Link>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-md text-gray-700 hover:text-gray-900 hover:bg-gray-100 focus:outline-none"
            aria-label="Toggle menu"
          >
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              {mobileMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden fixed inset-0 z-[1000]">
            {/* Backdrop */}
            <div 
              className="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
              onClick={() => setMobileMenuOpen(false)}
            />
            
            {/* Slide-out menu */}
            <div className="fixed top-0 right-0 bottom-0 w-64 bg-white dark:bg-gray-800 shadow-lg transform transition-transform duration-300 ease-in-out z-[1001]">
              <div className="flex flex-col h-full p-4">
                <div className="flex justify-between items-center mb-8">
                  <span className="font-bold text-xl text-gray-900 dark:text-white">ShopStore</span>
                  <button
                    onClick={() => setMobileMenuOpen(false)}
                    className="p-2 rounded-md text-gray-700 hover:text-gray-900 hover:bg-gray-100 dark:text-gray-300 dark:hover:text-white dark:hover:bg-gray-700"
                    aria-label="Close menu"
                  >
                    <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
                
                <div className="flex flex-col space-y-4 flex-grow">
                  <Link 
                    href="/" 
                    onClick={() => setMobileMenuOpen(false)}
                    className="text-gray-700 hover:text-gray-900 px-3 py-2 rounded-md hover:bg-gray-50 transition-colors dark:text-gray-300 dark:hover:text-white dark:hover:bg-gray-700"
                  >
                    Home
                  </Link>
                  <Link 
                    href="#" 
                    onClick={() => setMobileMenuOpen(false)}
                    className="text-gray-700 hover:text-gray-900 px-3 py-2 rounded-md hover:bg-gray-50 transition-colors dark:text-gray-300 dark:hover:text-white dark:hover:bg-gray-700"
                  >
                    Blog
                  </Link>
                  <Link 
                    href="#" 
                    onClick={() => setMobileMenuOpen(false)}
                    className="text-gray-700 hover:text-gray-900 px-3 py-2 rounded-md hover:bg-gray-50 transition-colors dark:text-gray-300 dark:hover:text-white dark:hover:bg-gray-700"
                  >
                    Contact
                  </Link>
                  
                  <div className="mt-auto pt-4 border-t border-gray-200 dark:border-gray-700">
                    {isLoggedIn ? (
                      <>
                        <Link 
                          href="/add-product" 
                          onClick={() => setMobileMenuOpen(false)}
                          className="block w-full mb-3 px-3 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 text-center transition-colors dark:bg-purple-700 dark:hover:bg-purple-800"
                        >
                          Add Product
                        </Link>
                        <button 
                          onClick={handleLogout}
                          className="block w-full px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 text-left transition-colors dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:hover:bg-gray-600"
                        >
                          Logout
                        </button>
                      </>
                    ) : (
                      <Link 
                        href="/login" 
                        onClick={() => setMobileMenuOpen(false)}
                        className="block w-full px-3 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 text-center transition-colors dark:bg-purple-700 dark:hover:bg-purple-800"
                      >
                        Sign in Account
                      </Link>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}

export default memo(Navbar)
