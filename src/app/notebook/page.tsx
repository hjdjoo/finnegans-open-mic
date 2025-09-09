import { BookOpenIcon } from '@heroicons/react/24/outline'
import createClient from '@/lib/clientSupabase'
import Image from 'next/image'
import FlipbookGallery from "@/components/Flipbook"

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
            FlipbookGallery
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
