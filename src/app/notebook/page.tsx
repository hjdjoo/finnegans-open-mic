import { BookOpenIcon } from '@heroicons/react/24/outline'
import createClient from '@/lib/clientSupabase'
import Image from 'next/image'

async function getNotebookImages() {

  const supabase = createClient();

  const { data, error } = await supabase
    .from('images')
    .select('*')
    .eq('type', 'notebook')
    .order('date', { ascending: false })

  if (error) {
    console.error('Error fetching notebook images:', error)
    return []
  }

  return data || []
}

export default async function NotebookPage() {
  const notebookImages = await getNotebookImages()

  return (
    <div className="min-h-screen pt-24 pb-12">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center space-x-3 mb-2">
          <BookOpenIcon className="h-8 w-8 text-irish-gold" />
          <h1 className="text-3xl md:text-4xl font-bold">The Notebook</h1>
        </div>
        <p className="text-xl text-gray-400 mb-8">
          A collection of doodles and memories from every open mic night
        </p>

        {notebookImages.length === 0 ? (
          <div className="card text-center py-12">
            <BookOpenIcon className="h-12 w-12 text-irish-gold mx-auto mb-4" />
            <p className="text-gray-400">No notebook pages available yet.</p>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {notebookImages.map((image) => {
              const date = new Date(image.date + 'T00:00:00')
              const dateString = date.toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
                year: 'numeric',
              })

              return (
                <div key={image.id} className="card group">
                  <div className="relative overflow-hidden rounded-lg mb-4">
                    <Image
                      src={image.url}
                      width={600}
                      height={400}
                      alt={`Notebook page from ${dateString}`}
                      className="w-full h-64 object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-dark-bg/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                  <p className="text-sm text-irish-gold font-medium">
                    {dateString}
                  </p>
                  {image.caption && (
                    <p className="text-sm text-gray-400 mt-1">
                      {image.caption}
                    </p>
                  )}
                </div>
              )
            })}
          </div>
        )}

        <div className="mt-12 text-center text-gray-500">
          <p className="text-sm">
            Each week, performers and audience members contribute to our community notebook.
            <br />
            These pages capture the spirit and creativity of our open mic nights.
          </p>
        </div>
      </div>
    </div>
  )
}
