import { NextRequest, NextResponse } from 'next/server';
import { jwtVerify } from 'jose';

// Define protected routes
const protectedRoutes = ['/dashboard', '/admin'];
const adminRoutes = ['/admin']; // Routes that require admin privileges

// Secret key for JWT verification (should match backend secret)
const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || process.env.SECRET_KEY || 'default_secret_key_change_in_production'
);

export async function middleware(request: NextRequest) {
  // Get the token from cookies or authorization header
  const token = request.cookies.get('accessToken')?.value ||
                request.headers.get('authorization')?.replace('Bearer ', '');

  // Check if the current route is protected
  const isProtectedRoute = protectedRoutes.some(route =>
    request.nextUrl.pathname.startsWith(route)
  );

  // Check if the current route is admin-only
  const isAdminRoute = adminRoutes.some(route =>
    request.nextUrl.pathname.startsWith(route)
  );

  // If accessing a protected route without a valid token
  if (isProtectedRoute) {
    if (!token) {
      // Redirect to login page
      return NextResponse.redirect(new URL('/login', request.url));
    }

    try {
      // Verify the JWT token
      const verified = await jwtVerify(token, JWT_SECRET);

      // If it's an admin route, verify admin privileges
      if (isAdminRoute) {
        // For admin routes, we'll check admin credentials via environment variables
        // Since this is frontend middleware, we'll just allow the request to continue
        // and let the backend handle admin verification
      }
    } catch (error) {
      // Token is invalid or expired
      // Clear the token cookie
      const response = NextResponse.redirect(new URL('/login', request.url));
      response.cookies.delete('accessToken');
      return response;
    }
  }

  // For admin login route, redirect if already authenticated as admin
  if (request.nextUrl.pathname === '/admin-login' && token) {
    try {
      const verified = await jwtVerify(token, JWT_SECRET);
      // Redirect to admin panel if already authenticated
      return NextResponse.redirect(new URL('/admin', request.url));
    } catch (error) {
      // Token is invalid, allow access to admin login
    }
  }

  // Continue with the request
  return NextResponse.next();
}


export const config = {
  matcher: ['/:path*'],
};


// // Define which routes the middleware should run on
// export const config = {
//   matcher: [
//     /*
//      * Match all request paths except for the ones starting with:
//      * - api (API routes handled by backend)
//      * - _next/static (static files)
//      * - _next/image (image optimization files)
//      * - favicon.ico (favicon file)
//      */
//     '/((?!api|_next/static|_next/image|favicon.ico|.*\\.(svg|png|jpg|jpeg|gif|webp)$).*)',
//   ],
// };