import { createBrowserClient} from '@supabase/ssr';
import type { Database } from './database.types';
import {cache} from 'react';

console.log(process.env.SUPABASE_SECRET_KEY)

const createServiceClient = cache(async () => {

  return createBrowserClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SECRET_KEY!,
  )
})

export default createServiceClient