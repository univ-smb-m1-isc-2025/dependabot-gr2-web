import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
 
export function middleware(request: NextRequest) {
  // Get the pathname
  const path = request.nextUrl.pathname
  
  // Define paths that don't require authentication
  const isPublicPath = path === '/' || path === '/login'
  
  // Get token from cookies or localStorage (middleware only has access to cookies)
  const token = request.cookies.get('token')?.value || ''
  
  // If no token and trying to access protected route, redirect to login
  if (!isPublicPath && !token) {
    return NextResponse.redirect(new URL('/login', request.url))
  }
  
  // If has token and trying to access login page, redirect to dashboard
  if (path === '/login' && token) {
    return NextResponse.redirect(new URL('/dashboard', request.url))
  }
  
  // No longer redirect from home page, even if authenticated
  
  return NextResponse.next()
}
 
// Specify which routes this middleware applies to
export const config = {
  matcher: ['/', '/login', '/dashboard/:path*']
}