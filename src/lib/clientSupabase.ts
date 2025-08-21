import { createBrowserClient } from '@supabase/ssr'
import { Database } from './database.types';

const SUPABASE_URL=process.env.NEXT_PUBLIC_SUPABASE_URL!
const SUPABASE_KEY=process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!

function createClient() { 
   return createBrowserClient<Database>(SUPABASE_URL, SUPABASE_KEY);
  }

export  { createClient };