import imageCompression from 'browser-image-compression'

export function formatDate(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date
  return d.toLocaleDateString('en-US', { 
    year: 'numeric', 
    month: '2-digit', 
    day: '2-digit' 
  }).replace(/\//g, '-')
}

export function getPrevSundayDate(date: Date): Date {
  const d = new Date(date);
  const day = d.getDay();
  d.setDate(d.getDate() - day);
  d.setHours(0, 0, 0, 0);
  return d;
}

export function getNextSundayDate(date: Date): Date {
  const d = new Date(date)
  const day = d.getDay()
  const diff = day === 0 ? 0 : 7 - day
  d.setDate(d.getDate() + diff)
  d.setHours(0, 0, 0, 0)
  return d
}

export function getLastSunday(): Date {
  const today = new Date()
  const day = today.getDay()
  const diff = day === 0 ? 0 : day
  const lastSunday = new Date(today)
  lastSunday.setDate(today.getDate() - diff)
  lastSunday.setHours(0, 0, 0, 0)
  return lastSunday
}

export async function compressImage(file: File): Promise<File> {
  const options = {
    maxSizeMB: 1,
    maxWidthOrHeight: 1920,
    useWebWorker: true,
    fileType: 'image/webp' as const,
  }
  
  try {
    const compressedFile = await imageCompression(file, options)
    return new File([compressedFile], file.name.replace(/\.[^/.]+$/, '.webp'), {
      type: 'image/webp',
    })
  } catch (error) {
    console.error('Error compressing image:', error)
    return file
  }
}

export function generateStoragePath(type: 'open-mic' | 'notebook', date: Date, fileName: string): string {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  const folder = type === 'open-mic' ? 'open-mic-images' : 'notebook-images'
  const timestamp = Date.now()
  const cleanFileName = fileName.replace(/[^a-zA-Z0-9.-]/g, '_')
  
  return `${folder}/${year}/${month}/${day}/${timestamp}-${cleanFileName}`
}