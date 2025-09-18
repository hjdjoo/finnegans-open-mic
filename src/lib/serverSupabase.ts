import { CookieMethodsServer, createServerClient} from '@supabase/ssr';
import { cookies } from 'next/headers';
import type { Database } from './database.types';
import { SerializeOptions } from 'cookie';
import type { RequestCookies } from 'next/dist/server/web/spec-extension/cookies';
import {cache} from 'react';

// Extend CookieMethodsServer to include getAll and setAll
export interface CookieHandler extends CookieMethodsServer {
  getAll: () => { name: string; value: string; options?: SerializeOptions }[];
  setAll: (cookiesToSet: { name: string; value: string; options?: SerializeOptions }[]) => void;  
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