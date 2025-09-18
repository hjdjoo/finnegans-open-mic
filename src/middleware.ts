import { NextRequest } from "next/server";
import { updateSession} from "./lib/middleware";
// import 

export async function middleware(request: NextRequest) {
  
  // simple middleware - currently, only run for /admin routes; rest of site is public.
  const {pathname} = request.nextUrl;

  // Protect admin routes
  if (pathname.startsWith('/admin')) {
    console.log('Middleware admin route detected');
    return await updateSession(request);
  }
  
} 

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};