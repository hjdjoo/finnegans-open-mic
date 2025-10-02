// import { Suspense } from 'react'
import Gallery from '@/components/Gallery'
import WelcomeCard from '@/components/WelcomeCard'
import StatusBar from '@/components/StatusBar'
import createClient from '@/lib/clientSupabase'
// import { getLastSunday } from '@/lib/utils'
import Image from 'next/image'

import { Json } from '@/lib/database.types';
import type { WelcomeText, OpenMicStatus } from '@/lib/types'
import clsx from 'clsx'

export const revalidate = 3600;

async function getLatestGalleryImages() {
  const supabase = createClient();

  const { data, error } = await supabase
    .from('images')
    .select('*')
    .eq('type', 'open-mic')
    .order('order_index', { ascending: true })
    .limit(10)

  if (error) {
    console.error('Error fetching gallery images:', error)
    return []
  }

  return data || []
}

async function getSiteSettings() {
  const supabase = createClient();

  // const supabase = await createClient()

  const { data, error } = await supabase
    .from('site_settings')
    .select('*')
    .in('key', ['open_mic_status', 'welcome_text'])

  if (error) {
    console.error('Error fetching site settings:', error)
    return {
      openMicStatus: { active: true, next_date: null, message: '' },
      welcomeText: {
        title: 'Welcome to Open Mic Night',
        description: `Every Sunday at Finnegan's Pub in Hoboken. Sign-ups at 7PM, show starts at 7:30PM.`
      } as WelcomeText
    }
  }

  const settings = data?.reduce((acc, item) => {
    acc[item.key] = item.value
    return acc
  }, {} as Record<string, Json>)

  return {
    openMicStatus: (settings?.open_mic_status || { active: true, next_date: null, message: '' }) as OpenMicStatus,
    welcomeText: (settings?.welcome_text || {
      title: 'Welcome to the Open Mic Night at Finnegan\'s',
      description: `Every Sunday at Finnegan's, Hoboken NJ`
    }) as WelcomeText
  }
}

export default async function HomePage() {
  const [images, settings] = await Promise.all([
    getLatestGalleryImages(),
    getSiteSettings()
  ])

  // Convert images to Gallery slides format
  const slides = images.map((img, idx) => {
    const slidePriority = idx === 0 ? "priority" : ""
    return {
      id: img.id,
      content: (
        <Image
          src={img.url}
          alt={img.caption || `Open Mic ${idx + 1}`}
          fill
          className={clsx("w-full h-full object-cover", slidePriority)}
        />
      ),
    }
  }
  )

  return (
    <div className="min-h-screen">
      {/* Status Section */}
      <section className="relative container mx-auto sm:px-6 lg:px-8 pt-20 bg-gradient-to-b from-dark-bg/90 via-transparent to-dark-bg/50">
        <StatusBar status={settings.openMicStatus} />
      </section>
      {/* Hero Section with Gallery Banner */}
      <section className="relative h-screen">
        <div className="absolute z-10 inset-0 bg-gradient-to-b from-dark-bg/50 via-transparent to-dark-bg/90">
          <WelcomeCard
            title={settings.welcomeText.title}
            description={settings.welcomeText.description}
          />
        </div>
        {slides.length > 0 ? (
          <>
            <Gallery
              slides={slides}
              mode="both"
              interval={5000}
              showArrows={true}
              showIndicators={true}
              pauseOnHover={true}
              aspectRatio="auto"
              arrowPosition="inside"
            />
          </>
        ) : (
          <div className="h-full z-0 flex items-center justify-center bg-dark-surface">
            <div className="text-center">
              <h1 className="text-4xl font-bold text-irish-gold mb-4">
                Open Mic Night
              </h1>
              <p className="text-gray-400">Gallery coming soon...</p>
            </div>
          </div>
        )}
      </section>
    </div>
  )
}