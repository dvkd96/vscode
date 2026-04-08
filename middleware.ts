import { NextRequest, NextResponse } from 'next/server';

const protectedRoutes = ['/dashboard', '/marketplace', '/create-listing', '/groups', '/payments', '/request-subscription', '/offer-subscription', '/submissions'];
const authRoutes = ['/login', '/signup'];

export function middleware(request: NextRequest) {
  const token = request.cookies.get('token')?.value;
  const { pathname } = request.nextUrl;

  const isProtected = protectedRoutes.some((route) => pathname.startsWith(route));
  const isAuthRoute = authRoutes.some((route) => pathname.startsWith(route));

  if (isProtected && !token) {
    const url = request.nextUrl.clone();
    url.pathname = '/login';
    url.searchParams.set('next', pathname);
    return NextResponse.redirect(url);
  }

  if (isAuthRoute && token) {
    const url = request.nextUrl.clone();
    url.pathname = '/';
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/dashboard/:path*', '/marketplace/:path*', '/create-listing/:path*', '/groups/:path*', '/payments/:path*', '/request-subscription/:path*', '/offer-subscription/:path*', '/submissions/:path*', '/login', '/signup'],
};
