import './globals.css'
import { ReduxProvider } from '../reduxProvider'
import Navbar from '../components/Navbar'
import { Suspense } from 'react'

export const metadata = { title: 'ShopStore - Skygoal' }

export default function RootLayout({ children }){
  return (
    <html lang="en">
      <body>
        <ReduxProvider>
          <Navbar />
          <main>{children}</main>
        </ReduxProvider>
      </body>
    </html>
  )
}