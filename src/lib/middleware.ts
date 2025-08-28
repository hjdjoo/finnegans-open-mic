import { createServerClient, type CookieOptions } from '@supabase/ssr';
import { NextRequest, NextResponse } from 'next/server';
import { SUPABASE_COOKIE_OPTIONS, SUPABASE_AUTH_OPTIONS } from './serverSupabase';
import { Database } from './database.types';


function createMiddlewareClient(request: NextRequest, response: NextResponse) {

  return createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
    {
      cookies: {
        get(name: string) {
          return request.cookies.get(name)?.value;
        },
        set(name: string, value: string, options: CookieOptions) {
          request.cookies.set({
            name,
            value,
            ...options,
          });
          response = NextResponse.next({
            request: {
              headers: request.headers,
            },
          });
          response.cookies.set({
            name,
            value,
            ...options,
          });
        },
        remove(name: string, options: CookieOptions) {
          request.cookies.set({
            name,
            value: '',
            ...options,
          });
          response = NextResponse.next({
            request: {
              headers: request.headers,
            },
          });
          response.cookies.set({
            name,
            value: '',
            ...options,
          });
        },
      },
      cookieOptions: SUPABASE_COOKIE_OPTIONS,
      auth: SUPABASE_AUTH_OPTIONS,
    }
  );

}

/**
 * Session refresh from cookies, no DB call - user verification recommended at page level
 */
export async function updateSession(request: NextRequest) {

  const response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  });

  const supabase = createMiddlewareClient(request, response);

  // const {data: { session }, error } = await supabase.auth.getSession();

  const {data: {user}, error } = await supabase.auth.getUser();

  console.log("lib/middleware.ts/user: ", user);
  
  if (error || !user) {
    // if no session, redirect to login
    console.log("no user detected; redirecting to login...");
    const redirectUrl = request.nextUrl.clone();
    redirectUrl.pathname = '/login';
    redirectUrl.searchParams.set('redirectedFrom', request.nextUrl.pathname);
    response.headers.set("x-user-type", "public")
    return NextResponse.redirect(redirectUrl);
  }

  return response;
};