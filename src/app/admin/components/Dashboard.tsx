'use client'

import { useRouter } from 'next/navigation'
import createClient from '@/lib/clientSupabase'
import ImageUploader from '@/components/ImageUploader'
import StatusUpdater from "./StatusUpdater"
import { User } from '@supabase/supabase-js'
import { Tables } from '@/lib/database.types'
import { makeAdmin } from '@/lib/serverActions'

type Profile = Tables<"profiles">

const ADMIN_EMAIL = process.env.NEXT_PUBLIC_DRL_EMAIL

interface AdminDashboardProps {
  user: User
  profiles: Profile[]
}

export default function AdminDashboard(props: AdminDashboardProps) {

  const supabase = createClient();
  const { profiles, user } = props;

  const isDrl = ADMIN_EMAIL === user.email

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
          {isDrl &&
            <>
              {profiles.map((profile, idx) => {
                return (
                  <div key={`profile-${idx + 1}`}>
                    <p>{profile.email}</p>
                    <button className="bg-gray-500 rounded-md  p-4 hover:cursor-pointer hover:bg-gray-700"
                      onClick={(e) => {
                        if (!profile.uid) {
                          console.error("no uid detected");
                          return;
                        }
                        makeAdmin(profile.uid);
                      }}>
                      Make Admin
                    </button>
                  </div>
                )
              })}
            </>}
        </div>
      </div>
    </div>
  )
}
