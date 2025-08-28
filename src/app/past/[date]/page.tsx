import { notFound } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { ArrowLeftIcon, BookOpenIcon } from '@heroicons/react/24/outline'
import createClient from '@/lib/clientSupabase'
import Gallery from '@/components/Gallery'

interface PageProps {
  params: {
    date: string
  }
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

  const { data: notebookImage, error: notebookError } = await supabase
    .from('images')
    .select('*')
    .eq('type', 'notebook')
    .eq('date', date)
    .single()

  if (openMicError && openMicError.code !== 'PGRST116') {
    console.error('Error fetching images:', openMicError)
  }

  if (notebookError && notebookError.code !== 'PGRST116') {
    console.error('Error fetching notebook image:', notebookError)
  }

  return {
    openMicImages: openMicImages || [],
    notebookImage: notebookImage || null,
  }
}

export default async function PastMicPage({ params }: PageProps) {
  const images = await getGalleryImages(params.date)

  if (!images || (images.openMicImages.length === 0 && !images.notebookImage)) {
    notFound()
  }

  // Convert to display date
  const displayDate = new Date(params.date + 'T00:00:00')
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
      <Image
        key={`${img.id}-${index + 1}`}
        src={img.url}
        alt={img.caption || `Open Mic ${index + 1}`}
        className="w-full h-full object-contain bg-dark-bg"
      />
    ),
  }))

  return (
    <div className="min-h-screen pt-24 pb-12">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
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
        {images.notebookImage && (
          <div className="mt-16">
            <div className="flex items-center space-x-3 mb-6">
              <BookOpenIcon className="h-6 w-6 text-irish-gold" />
              <h2 className="text-2xl font-bold">The Notebook</h2>
            </div>
            <div className="card max-w-4xl mx-auto">
              <Image
                src={images.notebookImage.url}
                width={800}
                height={600}
                alt="Notebook page"
                className="w-full rounded-lg"
              />
              {images.notebookImage.caption && (
                <p className="mt-4 text-center text-gray-400">
                  {images.notebookImage.caption}
                </p>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}