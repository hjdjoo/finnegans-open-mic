import { createServerClient } from '@supabase/ssr';
import { NextRequest, NextResponse } from 'next/server';
import { SUPABASE_COOKIE_OPTIONS, SUPABASE_AUTH_OPTIONS } from './serverSupabase';
import { Database } from './database.types';


function createMiddlewareClient(request: NextRequest, _response: NextResponse) {

  let supabaseResponse = NextResponse.next({request})

  // createServerClient is being flagged as deprecated, but this is likely picking up the "@deprecated" flag in the block comment regarding the get/set methods.
  return createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },        
        setAll(cookiesToSet) {          
          cookiesToSet.forEach(({ name, value }) => {
            request.cookies.set(name, value)
          });
          supabaseResponse = NextResponse.next({
            request,
          });
          cookiesToSet.forEach(({ name, value, options }) => {
            supabaseResponse.cookies.set(name, value, options)
          })
        },
      },
      cookieOptions: SUPABASE_COOKIE_OPTIONS,
      auth: SUPABASE_AUTH_OPTIONS,
    }
  );

}

/**
 * Session refresh using getUser(); makes DB call to verify user.
 */
export async function updateSession(request: NextRequest) {

  const response = NextResponse.next({
    request
  });

  const supabase = createMiddlewareClient(request, response);

  const {data: {user}, error } = await supabase.auth.getUser();

  // console.log("lib/middleware.ts/user: ", user);
  
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