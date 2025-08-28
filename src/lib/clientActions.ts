// import createServerClient from './serverSupabase';
// import createClient from './clientSupabase';
import { User } from "@supabase/supabase-js";

export async function checkAdmin (user?: User | null) {

  // const supabase = createClient();

  if (!user || !user?.email) {
    return false;
  }
  // having problems with RLS policies; just going to use user metadata for now while this gets debugged.
  return user.user_metadata["role"] === "admin"

}