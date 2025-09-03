import FlipbookGallery from "@/components/Flipbook";
import { getLatestGalleryImages } from "../page";

export default async function FlipbookPage() {

  const images = await getLatestGalleryImages();

  const pages = images.map((image, idx) => {
    return {
      id: `flipbook-page-${idx}`,
      imageUrl: image.url,
      date: image.date,
    }
  })

  return (
    <FlipbookGallery pages={pages} />
  )

}