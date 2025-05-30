import { NextRequest, NextResponse } from 'next/server'
import { decrypt } from './app/utils/userRequests'
import { cookies } from 'next/headers'
 
// 1. Specify protected and public routes
const protectedRoutes = ['/beers/new', '/breweries/new', '/stores/new']
const publicRoutes = ['/users/login', '/users/signup', '/', '/beers', '/breweries', '/stores']
 
export default async function middleware(req: NextRequest) {
  // 2. Check if the current route is protected or public
  const path = req.nextUrl.pathname
  const isProtectedRoute = protectedRoutes.includes(path)
  const isPublicRoute = publicRoutes.includes(path)
 
  // 3. Decrypt the session from the cookie
  let session = null
  const cookie = req.cookies.get('session')?.value
  if (cookie) {
    session = await decrypt(cookie)
  }
 
  // 4. Redirect to /login if the user is not authenticated
  if (isProtectedRoute && !session) {
    return NextResponse.redirect(new URL('/users/login', req.nextUrl))
  }
 
  // 5. Redirect to /dashboard if the user is authenticated
  if (
    isPublicRoute &&
    session?.userId &&
    !req.nextUrl.pathname.startsWith('/feed')
  ) {
    return NextResponse.redirect(new URL('/feed', req.nextUrl))
  }
 
  return NextResponse.next()
}
 
// Routes Middleware should not run on
export const config = {
  matcher: ['/((?!api|_next/static|_next/image|.*\\.png$).*)'],
}