'use server'

import createClient from '@/lib/serverSupabase'

import { redirect } from 'next/navigation'
// import Forbidden from '@/components/Forbidden'
import AdminDashboard from './components/Dashboard'
// import { useEffect, useContext } from 'react'
// import { User } from '@supabase/supabase-js'
import Spinner from '@/components/Spinner'
import { checkAdmin } from '@/lib/clientActions'


export default async function AdminPage() {

  const supabase = await createClient();
  const { data: { user }, error: userError } = await supabase.auth.getUser();

  if (userError) {
    console.error("AdminPage/userError: ", userError);
    redirect('/login')
  }

  if (!user) {
    return (
      <Spinner />
    );
  }
  else {
    const isAdmin = await checkAdmin(user);

    if (!isAdmin) {
      console.log("No admin access, redirecting...");
      redirect('/login');
    };

    return (
      <AdminDashboard user={user} />
    )
  }
}
