'use client';

import { useEffect, useState, createContext } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import createClient from "@/lib/clientSupabase";
import type { User } from '@supabase/supabase-js';
// import Forbidden from '@/components/Forbidden';
import { checkAdmin } from '@/lib/clientActions';
import Spinner from '@/components/Spinner';

interface AuthGuardProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
  requireAuth?: boolean;
}

type AuthContext = {
  user?: User | null;
  setUser: (user: User) => void,
  loading: boolean;
}

export const AuthContext = createContext<AuthContext>({
  user: undefined,
  setUser: () => { },
  loading: true,
});


/**
 * Client-side auth guard that handles the actual user verification
 * This is more efficient than doing it in middleware
 */
export default function AuthGuard({
  children,
  fallback = <Spinner />,
  requireAuth = true
}: AuthGuardProps) {

  const supabase = createClient()
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const searchParams = useSearchParams();

  const code = searchParams.get('code');
  const pkceError = searchParams.get('error');

  // Supabase auth state change listeners;
  useEffect(() => {
    // Check current auth state
    setLoading(true);
    // User is passed in from parent component; use with checkAdmin utility func to verify admin status
    const checkAuth = async () => {

      const isAdmin = await checkAdmin(user);

      if (requireAuth && (!user || !isAdmin)) {
        console.log("AuthGuard/checkAuth/", "user: ", user, "isAdmin: ", isAdmin)
        router.push('/login');
      };
      if (user && code) {
        console.log("user and access code detected, getting session...");

        const { error: sessionError } = await supabase.auth.getSession();
        if (sessionError) {
          setUser(null);
          router.push('/login');
        }
        setUser(user || null);
      }
      setLoading(false);
    };

    checkAuth();

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      switch (event) {
        case "INITIAL_SESSION":
        case "TOKEN_REFRESHED":
        case 'SIGNED_IN':
          console.log("AuthGuard/authChange/session: ", session)
          const isAdmin = await checkAdmin(session?.user);
          if (!isAdmin) {
            router.push('/');
          }
          break;
        case 'SIGNED_OUT':
          setUser(null);
          router.push('/');
          break;
        default:
          break;
      }
    });
    return () => {
      subscription.unsubscribe();
    };
  }, [user, router, requireAuth, supabase, code, pkceError]);

  if (loading) {
    return <>{fallback}</>;
  }

  return (
    <AuthContext.Provider value={{ user, setUser, loading }}>
      {children}
    </AuthContext.Provider>);
}
