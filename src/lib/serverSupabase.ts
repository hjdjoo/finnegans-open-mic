import { cache } from 'react';
import { CookieMethods, CookieOptions, createServerClient} from '@supabase/ssr';
import { cookies } from 'next/headers';
import type { Database } from './database.types';
import { CookieSerializeOptions } from 'cookie';

// Extend CookieMethods to include getAll and setAll
interface CookieHandler extends CookieMethods {
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
} as const;


function createCookieHandler(
  cookieStore: Awaited<ReturnType<typeof cookies>>,
  options?: {
    responseModifer?: (name: string, value: string, options?: CookieOptions) => void
  }
): CookieHandler {
  return {
    get(name) {
      const cookie = cookieStore.get(name);
      return cookie?.value ?? null;
    },
    set(name, value, cookieOptions) {
      try {
        cookieStore.set(name, value, cookieOptions);
        options?.responseModifer?.(name, value, cookieOptions);
      } catch (error) {
        console.error('Error setting cookie:', error);
        if (process.env.NODE_ENV === 'development') {
          console.log(`[Server Component] Cookie set attempted: ${name}`);
        }
      }
    },
    remove(name, cookieOptions) {
      try {
        cookieStore.set(name, '', { ...cookieOptions, maxAge: 0 });
      } catch (error) {
        console.error('Error removing cookie:', error);
      }
    },
    getAll() {
      return cookieStore.getAll();
    },
    setAll(cookiesToSet) {
      try {
        cookiesToSet.forEach(({ name, value, options }) => {
          cookieStore.set(name, value, options ?? {});
        });
      } catch (e) {
        console.error('Error setting all cookies:', e);
        if (process.env.NODE_ENV === 'development') {
          console.log(`[Server Component] Cookie setAll attempted`);
        }
      }
    },
  };

}

export const createClient = cache(async () => {
  const cookieStore = await cookies();
  
  return createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: createCookieHandler(cookieStore),
      cookieOptions: SUPABASE_COOKIE_OPTIONS,
      auth: SUPABASE_AUTH_OPTIONS,
    }
  );
});

export default createClient