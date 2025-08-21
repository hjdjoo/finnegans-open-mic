// import { createClient } from "@/lib/serverSupabase";
import { getUserWithDBCall } from "@/lib/serverActions";
import { redirect } from 'next/navigation';

export default async function AdminPage() {
  // Only make the database call when we actually need user data
  const { user, error } = await getUserWithDBCall();

  if (error || !user) {
    redirect('/login');
  }

  // Now we have verified user data
  // const supabase = await createClient();

  // const { data: images } = await supabase
  //   .from('images')
  //   .select('*')
  //   .order('created_at', { ascending: false });

  return (
    <div>
      <h1>Welcome, {user.email}</h1>
      {/* Admin content */}
    </div>
  );
}
