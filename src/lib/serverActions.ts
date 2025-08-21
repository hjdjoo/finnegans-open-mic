import createClient from "./serverSupabase";

/**
 * @returns the session without making a DB call
 */
export async function getSessionWithoutDBCall() {
  const supabase = await createClient();
  
  const { data: { session }, error } = await supabase.auth.getSession();
  
  return { session, error };
}

/**
 * @returns the user with a DB call
 */
export async function getUserWithDBCall() {
  const supabase = await createClient();
  
  const { data: { user }, error } = await supabase.auth.getUser();
  
  return { user, error };
}