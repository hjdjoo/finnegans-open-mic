import Link from 'next/link'
import { CalendarDaysIcon, PhotoIcon, BookOpenIcon } from '@heroicons/react/24/outline'
import createClient from '@/lib/clientSupabase'

type PastMicData = {
  date: string
  openMicCount: number
  hasNotebook: boolean
}

export const revalidate = 60 * 60;

async function getPastMics() {

  const supabase = createClient();

  const { data, error } = await supabase
    .from('images')
    .select('date, type')
    .order('date', { ascending: false })

  if (error) {
    console.error('Error fetching past mics:', error)
    return []
  }

  type MicDataReducer = {
    [date: string]: PastMicData
  }

  // Group by date and count images
  const micsByDate = data?.reduce((acc: MicDataReducer, img) => {
    if (!acc[img.date]) {
      acc[img.date] = {
        date: img.date,
        openMicCount: 0,
        hasNotebook: false
      }
    }
    if (img.type === 'open-mic') {
      acc[img.date].openMicCount++
    } else if (img.type === 'notebook') {
      acc[img.date].hasNotebook = true
    }
    return acc
  }, {})

  return Object.values(micsByDate || {}) as Array<{
    date: string
    openMicCount: number
    hasNotebook: boolean
  }>
}

export default async function PastMicsPage() {
  const pastMics = await getPastMics()

  return (
    <div className="min-h-screen pt-24 pb-12">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl md:text-4xl font-bold mb-2">Past Open Mics</h1>
        <p className="text-xl text-gray-400 mb-8">
          Browse photos from previous Sunday nights
        </p>

        {pastMics.length === 0 ? (
          <div className="card text-center py-12">
            <CalendarDaysIcon className="h-12 w-12 text-irish-gold mx-auto mb-4" />
            <p className="text-gray-400">No past mics available yet.</p>
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {pastMics.filter((mic) => {
              return mic.openMicCount > 0
            }).map((mic) => {
              const date = new Date(mic.date + 'T00:00:00')
              const dateString = date.toLocaleDateString('en-US', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })

              return (
                <Link
                  key={mic.date}
                  href={`/past/${mic.date}`}
                  className="card group hover:border-irish-green/50 transition-all"
                >
                  <div className="flex items-start justify-between mb-4">
                    <CalendarDaysIcon className="h-6 w-6 text-irish-gold" />
                    <div className="flex items-center space-x-4 text-sm text-gray-500">
                      {mic.openMicCount > 0 && (
                        <span className="flex items-center space-x-1">
                          <PhotoIcon className="h-4 w-4" />
                          <span>{mic.openMicCount}</span>
                        </span>
                      )}
                      {mic.hasNotebook && (
                        <span className="flex items-center space-x-1">
                          <BookOpenIcon className="h-4 w-4" />
                        </span>
                      )}
                    </div>
                  </div>
                  <h3 className="font-semibold text-lg mb-1 group-hover:text-irish-gold transition-colors">
                    {dateString}
                  </h3>
                  <p className="text-sm text-gray-500">
                    View gallery →
                  </p>
                </Link>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}