// import { Suspense } from 'react'
import Gallery from '@/components/Gallery'
import WelcomeCard from '@/components/WelcomeCard'
import StatusCard from '@/components/StatusCard'
import createClient from '@/lib/clientSupabase'
// import { getLastSunday } from '@/lib/utils'
import Image from 'next/image'

import { Json } from '@/lib/database.types';
import type { WelcomeText, OpenMicStatus } from '@/lib/types'

async function getLatestGalleryImages() {
  const supabase = createClient();

  const { data, error } = await supabase
    .from('images')
    .select('*')
  // .eq('type', 'open-mic')
  // .eq('date', dateString)
  // .order('order_index', { ascending: true })
  // .limit(10)

  if (error) {
    console.error('Error fetching gallery images:', error)
    return []
  }

  return data || []
}

async function getSiteSettings() {
  const supabase = createClient();

  // const supabase = await createClient()r

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
      title: 'Welcome to Open Mic Night',
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
  const slides = images.map((img, index) => ({
    id: img.id,
    content: (
      <Image
        src={img.url}
        alt={img.caption || `Open Mic ${index + 1}`}
        fill
        className="w-full h-full object-cover"
      />
    ),
    backgroundImage: img.url,
  }))

  return (
    <div className="min-h-screen">
      {/* Hero Section with Gallery Banner */}
      <section className="relative h-screen">
        {slides.length > 0 ? (
          <>
            <Gallery
              slides={slides}
              mode="both"
              interval={5000}
              showArrows={true}
              showIndicators={true}
              pauseOnHover={true}
              className="absolute inset-0"
              aspectRatio="auto"
              arrowPosition="inside"
            />
            <div className="absolute inset-0 bg-gradient-to-b from-dark-bg/50 via-transparent to-dark-bg/90">
              <WelcomeCard
                title={settings.welcomeText.title}
                description={settings.welcomeText.description}
              />
            </div>
          </>
        ) : (
          <div className="h-full flex items-center justify-center bg-dark-surface">
            <div className="absolute inset-0 bg-gradient-to-b from-dark-bg/50 via-transparent to-dark-bg/90">
              <WelcomeCard
                title={settings.welcomeText.title}
                description={settings.welcomeText.description}
              />
            </div>
            <div className="text-center">
              <h1 className="text-4xl font-bold text-irish-gold mb-4">
                Open Mic Night
              </h1>
              <p className="text-gray-400">Gallery coming soon...</p>
            </div>
          </div>
        )}
      </section>

      {/* Status Section */}
      <section className="container mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <StatusCard status={settings.openMicStatus} />
      </section>
    </div>
  )
}