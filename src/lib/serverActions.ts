import createServerClient from './serverSupabase';
// import createClient from './clientSupabase';
import { User } from "@supabase/supabase-js";

export async function checkAdmin (user?: User | null) {

  const supabase = await createServerClient();

  if (!user || !user?.email) {
    return false;
  }
  const {data, error} = await supabase.from("profiles")
    .select("is_admin")
    .eq("uid", user.id)
    .single();

  if (error) {
    console.log("couldn't retrieve data from profiles: ", error.message)
  }

  if (!data) {
    return false;
  }
  // console.log(data);

  // having problems with RLS policies; just going to use user metadata for now while this gets debugged.
  return data.is_admin

}

// export async function makeAdmin (user: User) {

//   const supabase = createClient();

//   const {data, error} = await supabase.auth.updateUser({
//     data: {
//       role: "admin"
//     }
//   })

//   if (error) {
//     throw error;
//   }

//   return data;

// }