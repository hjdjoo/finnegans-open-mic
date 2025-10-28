import { notFound } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { unstable_cache } from 'next/cache'
import { ArrowLeftIcon, BookOpenIcon } from '@heroicons/react/24/outline'
import createClient from '@/lib/clientSupabase'
import Gallery from '@/components/Gallery'


export async function generateStaticParams() {

  const supabase = createClient();

  const { data, error } = await supabase.rpc("get_distinct_dates");
  if (error) {
    throw error;
  }
  return data.map((date) => ({ date: date }))
}

async function getGalleryImages(date: string) {

  const supabase = createClient();
  // Validate date format
  const dateRegex = /^\d{4}-\d{2}-\d{2}$/
  if (!dateRegex.test(date)) {
    return null
  }

  const { data: openMicImages, error: openMicError } = await supabase
    .from('images')
    .select('*')
    .eq('type', 'open-mic')
    .eq('date', date)
    .order('order_index', { ascending: true })

  const { data: notebookImages, error: notebookError } = await supabase
    .from('images')
    .select('*')
    .eq('type', 'notebook')
    .eq('date', date)
    .order('order_index', { ascending: true })

  if (openMicError && openMicError.code !== 'PGRST116') {
    console.error('Error fetching images:', openMicError)
  }

  if (notebookError && notebookError.code !== 'PGRST116') {
    console.error('Error fetching notebook image:', notebookError)
  }

  return {
    openMicImages: openMicImages || [],
    notebookImages: notebookImages || null,
  }
}

export default async function PastMicPage({ params }: {
  params: Promise<{ date: string }>
}) {

  const { date } = await params;

  const getCachedImages = unstable_cache(async (date: string) => {
    return await getGalleryImages(date);
  }, [], {
    revalidate: 60 * 60 * 24
  })

  const images = await getCachedImages(date);

  if (!images || (images.openMicImages.length === 0 && !images.notebookImages)) {
    notFound()
  }

  // Convert to display date
  const displayDate = new Date(date + 'T00:00:00')
  const dateString = displayDate.toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })

  // Convert images to Gallery slides
  const slides = images.openMicImages.map((img, index) => ({
    id: img.id,
    content: (
      <div key={`${img.id}-${index + 1}`}
        className="relative w-full h-full object-contain">
        <Image
          src={img.url}
          fill
          alt={img.caption || `Open Mic ${index + 1}`}
          className="w-full h-full object-contain bg-dark-bg"
        />
      </div>
    ),
  }))

  return (
    <div className="min-h-screen pt-24 pb-12">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <Link
            href="/past"
            className="inline-flex items-center space-x-2 text-irish-gold hover:text-irish-gold-light transition-colors mb-4"
          >
            <ArrowLeftIcon className="h-4 w-4" />
            <span>Back to Past Mics</span>
          </Link>
          <h1 className="text-3xl md:text-4xl font-bold mb-2">
            Open Mic Night
          </h1>
          <p className="text-xl text-gray-400">{dateString}</p>
        </div>

        {/* Gallery */}
        {slides.length > 0 && (
          <div className="mb-12">
            <Gallery
              slides={slides}
              mode="manual"
              showArrows={true}
              showIndicators={true}
              className="max-w-6xl mx-auto"
              aspectRatio="video"
              arrowPosition="outside"
            />
          </div>
        )}

        {/* Notebook Section */}
        {
          images.notebookImages && <div className="flex items-center space-x-3 mb-6">
            <BookOpenIcon className="h-6 w-6 text-irish-gold" />
            <h2 className="text-2xl font-bold">The Notebook</h2>
            {(images.notebookImages.map((image, idx) => {
              if (image) return (
                <div key={`${date}-notebook-page-${idx}`}
                  className="mt-16">
                  <div className="card max-w-4xl mx-auto">
                    <Image
                      src={image.url}
                      width={800}
                      height={600}
                      alt="Notebook page"
                      className="w-full rounded-lg"
                    />
                    {image.caption && (
                      <p className="mt-4 text-center text-gray-400">
                        {image.caption}
                      </p>
                    )}
                  </div>
                </div>
              )
            }))}
          </div>
        }
      </div>
    </div>
  )
}