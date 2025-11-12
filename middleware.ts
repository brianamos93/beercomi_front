import { NextRequest, NextResponse } from 'next/server'
import { getBeer } from './app/utils/requests/beerRequests'
import { getLoggedInUsersData } from './app/utils/requests/userRequests'
 
// 1. Specify protected and public routes
const protectedRoutePatterns = [
  /^\/beers\/new$/,
  /^\/breweries\/new$/,
  /^\/stores\/new$/,
  /^\/beers\/[^\/]+\/edit$/,
  /^\/beers\/[^\/]+\/review\/[^\/]+\/edit$/,
  /^\/users\/profile$/
];

const publicRoutes = ['/users/login', '/users/signup', '/', '/beers', '/breweries', '/stores']
 
export default async function middleware(req: NextRequest) {
  // 2. Check if the current route is protected or public
  const path = req.nextUrl.pathname
  const isProtectedRoute = protectedRoutePatterns.some(pattern => pattern.test(path))
  const isPublicRoute = publicRoutes.includes(path)
 
  // 3. Get the token
  const token = req.cookies.get('token')?.value
  let user = null
  if (token) {
    user = await getLoggedInUsersData(token)
  }
  
  // 4. Redirect to /login if the user is not authenticated
  if (isProtectedRoute && !token) {
    return NextResponse.redirect(new URL('/users/login', req.nextUrl))
  }

  const match = req.nextUrl.pathname.match(/^\/beers\/([^\/]+)\/edit$/)
  if (match && token) {
    const beerId = match[1]

    try {
      const beer = await getBeer(beerId)
      if (beer.author_id !== user.id) {
        return NextResponse.redirect(new URL('/unauthorized', req.nextUrl)) // Or show 403 page
      }
    } catch (error) {
      return NextResponse.redirect(new URL('/404', req.nextUrl)) // Beer not found
    }
  }
 
  return NextResponse.next()
}
 
// Routes Middleware should not run on
export const config = {
  matcher: ['/((?!api|_next/static|_next/image|.*\\.png$).*)'],
}