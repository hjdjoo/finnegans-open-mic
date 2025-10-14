"use server"

import createServiceClient from "./serviceSupabase";

export async function makeAdmin (userId: string) {
  "use server"

  const supabase = await createServiceClient();

  const {data, error} = await supabase.auth.admin.updateUserById(userId, {
    user_metadata: {
      role: "admin"
    }
  })

  if (error) {
    throw error;
  }

  return data;

}