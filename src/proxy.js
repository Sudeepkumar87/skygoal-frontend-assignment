import { NextResponse } from 'next/server'


export function proxy(req){
const { pathname } = req.nextUrl
// protect app routes under /product and /add-product
if(pathname.startsWith('/product') || pathname.startsWith('/add-product')){
const token = req.cookies.get('sky_token')
if(!token) return NextResponse.redirect(new URL('/login', req.url))
}
return NextResponse.next()
}


export const config = { matcher: ['/product/:path*','/add-product/:path*'] }