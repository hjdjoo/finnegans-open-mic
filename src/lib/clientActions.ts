// import createServerClient from './serverSupabase';
import createServiceClient from './serviceSupabase';
import createClient from './clientSupabase';
import { User } from "@supabase/supabase-js";


export async function checkAdmin (user?: User | null) {

  // const supabase = createClient();

  if (!user) {
    console.log("no user detected")
    return false;
  }
  
  // const {data, error} = await supabase.from("profiles")
  //   .select("is_admin")
  //   .eq("uid", user.id)
  //   .single();

  // if (error) {
  //   console.log("couldn't retrieve data from profiles: ", error.message)
  // }

  // if (!data) {
  //   return false;
  // }
  // console.log(data);

  // having problems with RLS policies; just going to use user metadata for now while this gets debugged.
  return user.user_metadata.role === "admin"

}