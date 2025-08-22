import { CookieMethods, createServerClient} from '@supabase/ssr';
import { cookies } from 'next/headers';
import type { Database } from './database.types';
import { CookieSerializeOptions } from 'cookie';

// Extend CookieMethods to include getAll and setAll
export interface CookieHandler extends CookieMethods {
  getAll: () => { name: string; value: string; options?: CookieSerializeOptions }[];
  setAll: (cookiesToSet: { name: string; value: string; options?: CookieSerializeOptions }[]) => void;  
}

async function createClient() {
  const cookieStore = await cookies();

  const cookieHandler: CookieHandler = {
        get(name) {
          const cookie = cookieStore.get(name);
          return cookie?.value ?? null
        },
        set(name, value, options) {
          try {
            cookieStore.set(name, value, options);
          } catch {
            // The `set` method was called from a Server Component.
            // This can be ignored if you have middleware refreshing
            // user sessions.
          }
        },
        remove(name, options) {
          try {
            cookieStore.set(name, '', { ...options, maxAge: 0 });
          } catch (error) {
            console.error('Error removing cookie:', error);
            if (process.env.NODE_ENV === 'development') {
              console.log(`[Server Component] Cookie remove attempted: ${name}`);
            }
          }
        },
        getAll() {
          return cookieStore.getAll()
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            )
          } catch {
            // The `setAll` method was called from a Server Component.
            // This can be ignored if you have middleware refreshing
            // user sessions.
          }
        },
      }

  return createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
    {
      cookies: cookieHandler as CookieHandler,
    }
  )
}

export default createClient