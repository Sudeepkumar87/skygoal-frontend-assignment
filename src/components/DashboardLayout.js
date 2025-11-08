"use client"
import React, { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useDispatch, useSelector } from 'react-redux'
import { logoutUser } from '../redux/authSlice'
import { useRouter } from 'next/navigation'

export default function DashboardLayout({ children }) {
  const pathname = usePathname()
  const user = useSelector(s => s.auth.user)
  const dispatch = useDispatch()
  const router = useRouter()
  const [sidebarOpen, setSidebarOpen] = useState(true)




  return (
    <div className="flex h-screen bg-gray-50">
   

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
    

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto bg-gray-50 p-6">
          {children}
        </main>
      </div>
    </div>
  )
}

