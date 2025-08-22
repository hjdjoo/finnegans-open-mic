'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from "@/lib/clientSupabase";
import type { User } from '@supabase/supabase-js';

interface AuthGuardProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
  requireAuth?: boolean;
}

/**
 * Client-side auth guard that handles the actual user verification
 * This is more efficient than doing it in middleware
 */
export default function AuthGuard({
  children,
  fallback = <div>Loading...</div>,
  requireAuth = true
}: AuthGuardProps) {

  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    // Check current auth state
    const checkAuth = async () => {
      try {
        // This only checks the session, not the database
        const { data: { session } } = await supabase.auth.getSession();

        if (session?.user) {
          setUser(session.user);
        } else if (requireAuth) {
          router.push('/login');
        }
      } catch (error) {
        console.error('Auth check failed:', error);
        if (requireAuth) {
          router.push('/login');
        }
      } finally {
        setLoading(false);
      }
    };

    checkAuth();

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (session?.user) {
        setUser(session.user);
      } else {
        setUser(null);
        if (requireAuth) {
          router.push('/login');
        }
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [router, requireAuth]);

  if (loading) {
    return <>{fallback}</>;
  }

  if (requireAuth && !user) {
    return null;
  }

  return <>{children}</>;
}
