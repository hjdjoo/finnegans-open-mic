import { CookieMethods, createServerClient} from '@supabase/ssr';
import { cookies } from 'next/headers';
import type { Database } from './database.types';
import { CookieSerializeOptions } from 'cookie';
import type { RequestCookies } from 'next/dist/server/web/spec-extension/cookies';
import {cache} from 'react';

// Extend CookieMethods to include getAll and setAll
export interface CookieHandler extends CookieMethods {
  getAll: () => { name: string; value: string; options?: CookieSerializeOptions }[];
  setAll: (cookiesToSet: { name: string; value: string; options?: CookieSerializeOptions }[]) => void;  
}

export const SUPABASE_COOKIE_OPTIONS = {
  lifetime: 60 * 60 * 8,         
  domain: undefined,              
  path: '/',                      
  sameSite: 'lax' as const,      
  secure: process.env.NODE_ENV === 'production', 
} as const;

export const SUPABASE_AUTH_OPTIONS = {
  autoRefreshToken: true,        
  persistSession: true,          
  detectSessionInUrl: true,      
  flowType: 'pkce' as const,
} as const;


function createCookieHandler(
  cookieStore: Awaited<ReturnType<typeof cookies>> | RequestCookies,
): CookieHandler {

  return {
    get(name) {
      const cookie = cookieStore.get(name);
      return cookie?.value ?? null;
    },
    
    set(name, value, cookieOptions) {
      try {
        cookieStore.set(name, value, cookieOptions);
        // Also update response if we're in middleware context
      } catch {
        // Server Component context - safe to ignore
        if (process.env.NODE_ENV === 'development') {
          console.log(`[Server Component] Cookie set attempted: ${name}`);
        }
      }
    },
    
    remove(name, cookieOptions) {
      try {
        cookieStore.set(name, '', { ...cookieOptions, maxAge: 0 });

      } catch {
        // Server Component context
      }
    },
    
    getAll() {
      return cookieStore.getAll() as { name: string; value: string }[];
    },
    
    setAll(cookiesToSet) {
      try {
        cookiesToSet.forEach(({ name, value, options: cookieOptions }) => {
          cookieStore.set(name, value, cookieOptions);

        });
      } catch {
        // Server Component context
      }
    },
  };
}

const createClient = cache(async () => {
  const cookieStore = await cookies();

  const cookieHandler: CookieHandler = createCookieHandler(cookieStore)

  return createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
    {
      cookies: cookieHandler,
      cookieOptions: SUPABASE_COOKIE_OPTIONS,
      auth: SUPABASE_AUTH_OPTIONS,
    }
  )
})

export default createClient