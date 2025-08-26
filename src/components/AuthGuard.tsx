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
        const { data: { user } } = await supabase.auth.getUser();
        setUser(user);
        setLoading(false);
      } catch (error) {
        console.error('Error checking auth state:', error);
        setLoading(false);
        router.push('/');
      }
    };

    checkAuth();

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      switch (event) {
        case 'SIGNED_IN':
          setUser(session?.user || null);
          break;
        case 'SIGNED_OUT':
          setUser(null);
          if (requireAuth) {
            router.push('/login');
          }
          break;
        default:
          break;
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
