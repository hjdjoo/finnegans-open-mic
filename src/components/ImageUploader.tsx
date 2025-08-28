'use client'

import { useState, useCallback } from 'react'
import { CloudArrowUpIcon, CheckCircleIcon, XMarkIcon } from '@heroicons/react/24/outline'
import createClient from '@/lib/clientSupabase'
import { compressImage, generateStoragePath, getSundayDate } from '@/lib/utils'
import clsx from 'clsx'
import Image from 'next/image'

interface UploadedImage {
  id: string
  file: File
  preview: string
  type: 'open-mic' | 'notebook'
  uploading: boolean
  uploaded: boolean
  error?: string
}

export default function ImageUploader() {

  const supabase = createClient();

  const [selectedDate, setSelectedDate] = useState<Date>(getSundayDate(new Date()))
  const [images, setImages] = useState<UploadedImage[]>([])
  const [imageType, setImageType] = useState<'open-mic' | 'notebook'>('open-mic')
  const [uploading, setUploading] = useState(false)
  const [dragActive, setDragActive] = useState(false)

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true)
    } else if (e.type === 'dragleave') {
      setDragActive(false)
    }
  }, [])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFiles(e.dataTransfer.files)
    }
  }, [])

  const handleFiles = async (files: FileList) => {
    const newImages: UploadedImage[] = []

    for (let i = 0; i < files.length; i++) {
      const file = files[i]
      if (file.type.startsWith('image/')) {
        const compressedFile = await compressImage(file)
        const preview = URL.createObjectURL(compressedFile)
        newImages.push({
          id: `${Date.now()}-${i}`,
          file: compressedFile,
          preview,
          type: imageType,
          uploading: false,
          uploaded: false,
        })
      }
    }

    setImages(prev => [...prev, ...newImages])
  }

  const removeImage = (id: string) => {
    setImages(prev => {
      const image = prev.find(img => img.id === id)
      if (image) {
        URL.revokeObjectURL(image.preview)
      }
      return prev.filter(img => img.id !== id)
    })
  }

  const uploadImages = async () => {
    if (images.length === 0) return

    setUploading(true)
    const sundayDate = getSundayDate(selectedDate)
    const dateString = sundayDate.toISOString().split('T')[0]

    for (const image of images) {
      if (image.uploaded) continue

      setImages(prev => prev.map(img =>
        img.id === image.id ? { ...img, uploading: true } : img
      ))

      try {
        // Upload to storage
        const storagePath = generateStoragePath(image.type, sundayDate, image.file.name)
        const { error: uploadError } = await supabase.storage
          .from(image.type === 'open-mic' ? 'open-mic-images' : 'notebook-images')
          .upload(storagePath, image.file)

        if (uploadError) throw uploadError

        // Get public URL
        const { data: { publicUrl } } = supabase.storage
          .from(image.type === 'open-mic' ? 'open-mic-images' : 'notebook-images')
          .getPublicUrl(storagePath)

        // Save to database
        const { error: dbError } = await supabase
          .from('images')
          .insert({
            url: publicUrl,
            type: image.type,
            date: dateString,
            order_index: images.indexOf(image),
          })

        if (dbError) throw dbError

        setImages(prev => prev.map(img =>
          img.id === image.id
            ? { ...img, uploading: false, uploaded: true }
            : img
        ))
      } catch (error) {
        console.error('Upload error:', error)
        setImages(prev => prev.map(img =>
          img.id === image.id
            ? { ...img, uploading: false, error: 'Upload failed' }
            : img
        ))
      }
    }

    setUploading(false)
  }

  const sundayDate = getSundayDate(selectedDate)
  const dateString = sundayDate.toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  })

  return (
    <div className="card">
      <h2 className="text-xl font-bold mb-6">Upload Images</h2>

      {/* Date Picker */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-400 mb-2">
          Select Sunday Date
        </label>
        <input
          type="date"
          value={selectedDate.toISOString().split('T')[0]}
          onChange={(e) => setSelectedDate(new Date(e.target.value))}
          className="px-4 py-2 bg-dark-bg border border-dark-border rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-irish-gold"
        />
        <p className="mt-2 text-sm text-gray-500">
          Uploading for: {dateString}
        </p>
      </div>

      {/* Image Type Selector */}
      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-400 mb-2">
          Image Type
        </label>
        <div className="flex space-x-4">
          <button
            onClick={() => setImageType('open-mic')}
            className={clsx(
              'px-4 py-2 rounded-lg font-medium transition-all',
              imageType === 'open-mic'
                ? 'bg-irish-green text-white'
                : 'bg-dark-bg border border-dark-border text-gray-400 hover:border-irish-green'
            )}
          >
            Open Mic Photos
          </button>
          <button
            onClick={() => setImageType('notebook')}
            className={clsx(
              'px-4 py-2 rounded-lg font-medium transition-all',
              imageType === 'notebook'
                ? 'bg-irish-green text-white'
                : 'bg-dark-bg border border-dark-border text-gray-400 hover:border-irish-green'
            )}
          >
            Notebook Page
          </button>
        </div>
      </div>

      {/* Drop Zone */}
      <div
        className={clsx(
          'border-2 border-dashed rounded-xl p-8 text-center transition-all',
          dragActive
            ? 'border-irish-gold bg-irish-gold/10'
            : 'border-dark-border hover:border-irish-green/50'
        )}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <input
          type="file"
          id="file-upload"
          multiple
          accept="image/*"
          onChange={(e) => e.target.files && handleFiles(e.target.files)}
          className="hidden"
        />
        <label
          htmlFor="file-upload"
          className="cursor-pointer flex flex-col items-center"
        >
          <CloudArrowUpIcon className="h-12 w-12 text-irish-gold mb-4" />
          <p className="text-lg font-medium mb-2">
            Drop images here or click to upload
          </p>
          <p className="text-sm text-gray-500">
            Support for JPG, PNG, GIF, WebP (auto-converted to WebP)
          </p>
        </label>
      </div>

      {/* Image Preview Grid */}
      {images.length > 0 && (
        <div className="mt-8">
          <h3 className="text-lg font-medium mb-4">
            {images.length} image{images.length !== 1 ? 's' : ''} selected
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {images.map((image) => (
              <div key={image.id} className="relative group">
                <Image
                  src={image.preview}
                  alt="Preview"
                  fill
                  className={clsx(
                    'w-full h-32 object-cover rounded-lg',
                    image.uploaded && 'opacity-50'
                  )}
                />
                {image.uploading && (
                  <div className="absolute inset-0 flex items-center justify-center bg-dark-bg/80 rounded-lg">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-irish-gold"></div>
                  </div>
                )}
                {image.uploaded && (
                  <div className="absolute inset-0 flex items-center justify-center bg-green-900/80 rounded-lg">
                    <CheckCircleIcon className="h-8 w-8 text-green-400" />
                  </div>
                )}
                {!image.uploaded && !image.uploading && (
                  <button
                    onClick={() => removeImage(image.id)}
                    className="absolute top-2 right-2 p-1 bg-red-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <XMarkIcon className="h-4 w-4 text-white" />
                  </button>
                )}
                <span className="absolute bottom-2 left-2 text-xs bg-dark-bg/80 px-2 py-1 rounded">
                  {image.type}
                </span>
              </div>
            ))}
          </div>

          <button
            onClick={uploadImages}
            disabled={uploading || images.every(img => img.uploaded)}
            className="mt-6 btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {uploading ? 'Uploading...' : `Upload ${images.filter(img => !img.uploaded).length} Images`}
          </button>
        </div>
      )}
    </div>
  )
}