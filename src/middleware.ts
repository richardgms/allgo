import { NextRequest, NextResponse } from 'next/server'
import { getAuthUser, validateRestaurantAccess } from '@/lib/auth'

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  
  // Skip middleware for static files, API routes (except admin), and auth pages
  if (
    pathname.startsWith('/_next/') ||
    pathname.startsWith('/api/auth') ||
    pathname.startsWith('/login') ||
    pathname.startsWith('/favicon.ico') ||
    pathname.match(/\.(png|jpg|jpeg|gif|webp|svg|ico)$/)
  ) {
    return NextResponse.next()
  }

  // Handle admin API routes only (not /admin pages)
  if (pathname.startsWith('/api/admin')) {
    const authUser = await getAuthUser(request)
    
    if (!authUser) {
      return NextResponse.json(
        { error: 'Acesso negado', code: 'UNAUTHORIZED' },
        { status: 401 }
      )
    }

    return NextResponse.next()
  }

  // Handle restaurant slug routes: /[slug] and /[slug]/admin
  const slugMatch = pathname.match(/^\/([^\/]+)(?:\/(.+))?$/)
  
  if (slugMatch) {
    const [, slug, subPath] = slugMatch
    
    // Skip if this is actually a static route like /login, /register, etc.
    const staticRoutes = ['login', 'register', 'about', 'contact']
    if (staticRoutes.includes(slug)) {
      return NextResponse.next()
    }

    // Note: Authentication validation for admin pages is handled in the React components
    // not in middleware, because tokens are stored in localStorage (client-side)

    // Add restaurant slug to headers for easier access in components
    const response = NextResponse.next()
    response.headers.set('x-restaurant-slug', slug)
    return response
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
}