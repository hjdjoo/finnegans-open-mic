import imageCompression from 'browser-image-compression'

/**
 * 
 * @param date 
 * @returns MM-DD-YYYY
 */
export function formatDateMDY(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date+"T00:00:00") : date
  return d.toLocaleDateString('en-US', { 
    year: 'numeric', 
    month: '2-digit', 
    day: '2-digit' 
  }).replace(/\//g, '-')
}

export function formatDateYMD(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date;

  const mdyArr = d.toLocaleDateString('en-US', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  }).split("/");

  const ymdStr = mdyArr[2] + `-${mdyArr[0]}` + `-${mdyArr[1]}`

  return ymdStr;

}

export function getPrevSundayDate(date: Date): Date {
  const d = new Date(date);
  const day = d.getDay(); // 0-6 : Sunday-Sat
  if (day === 0) {
    return d;
  }
  d.setDate(d.getDate() - day);
  d.setHours(0, 0, 0, 0);

  if (d.getDay() !== 0) {
    getPrevSundayDate(d);
  }

  return d;
}

export function getNextSundayDate(date: Date): Date {
  const d = new Date(date);
  const day = d.getDay()
  const diff = day === 0 ? 0 : 7 - day
  d.setDate(d.getDate() + diff)
  d.setHours(0, 0, 0, 0)
  return d
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

export function generateStoragePath(type: 'open-mic' | 'notebook' | 'notebook-front' | 'notebook-back', date: Date, fileName: string): string {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  const folder = type === 'open-mic' ? 'open-mic-images' : 'notebook-images'
  const cleanFileName = fileName.replace(/[^a-zA-Z0-9.-]/g, '_')
  
  return `${folder}/${year}/${month}/${day}/${cleanFileName}`
}

/**
 * Corrects Monday dates to Sunday dates in the database
 * This function would process all entries with Monday dates and convert them to Sunday dates
 */
export const correctMonToSun = async (): Promise<void> => {
  // In a real implementation, this would:
  // 1. Connect to database and pull all distinct dates from public.images table
  // 2. Filter for dates that are not Sundays  
  // 3. Pull image data from DB
  // 4. Create updated entries with corrected Sunday dates
  // 5. Remove original entries from DB
  
  console.log("Processing date correction from Monday to Sunday");
  
  // This is a placeholder - real implementation would use database connection
  return Promise.resolve();
};