'use client'

import { useRouter } from 'next/navigation'
import createClient from '@/lib/clientSupabase'
import ImageUploader from '@/components/ImageUploader'
import StatusUpdater from "./StatusUpdater"
import { User } from '@supabase/supabase-js'

interface AdminDashboardProps {
  user: User
}

export default function AdminDashboard(props: AdminDashboardProps) {

  const supabase = createClient();
  const { user } = props;

  const router = useRouter()

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    router.push('/')
  }

  return (
    <div className="min-h-screen pt-24 pb-12">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-irish-gold">Admin Dashboard</h1>
          <div className="flex items-center space-x-4">
            <span className="text-gray-400 text-sm">
              {user?.email}
            </span>
            <button
              onClick={handleSignOut}
              className="btn-secondary text-sm"
            >
              Sign Out
            </button>
          </div>
        </div>

        <div className="grid gap-8">
          <StatusUpdater />
          <ImageUploader />
        </div>
      </div>
    </div>
  )
}
