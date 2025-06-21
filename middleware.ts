import { NextRequest, NextResponse } from 'next/server'
import { decrypt } from './app/utils/requests/userRequests'
import { getBeer } from './app/utils/requests/beerRequests'
 
// 1. Specify protected and public routes
const protectedRoutePatterns = [
  /^\/beers\/new$/,
  /^\/breweries\/new$/,
  /^\/stores\/new$/,
  /^\/beers\/[^\/]+\/edit$/
]
const publicRoutes = ['/users/login', '/users/signup', '/', '/beers', '/breweries', '/stores']
 
export default async function middleware(req: NextRequest) {
  // 2. Check if the current route is protected or public
  const path = req.nextUrl.pathname
  const isProtectedRoute = protectedRoutePatterns.some(pattern => pattern.test(path))
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

  const match = req.nextUrl.pathname.match(/^\/beers\/([^\/]+)\/edit$/)
  if (match && session) {
    const beerId = match[1]

    try {
      const beer = await getBeer(beerId)
      console.log(session.userID)
      console.log(beer.author)
      if (beer.author !== session.userID) {
        return NextResponse.redirect(new URL('/unauthorized', req.nextUrl)) // Or show 403 page
      }
    } catch (error) {
      return NextResponse.redirect(new URL('/404', req.nextUrl)) // Beer not found
    }
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