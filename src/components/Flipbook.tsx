'use client';

import HTMLFlipBook from 'react-pageflip';
import Image from 'next/image';
import { ChangeEvent, SetStateAction, useRef, useState } from 'react';
import type { PageFlip } from "page-flip"
import { getPrevSundayDate, formatDate } from '@/lib/utils';



type FlipbookRef = React.RefObject<typeof HTMLFlipBook | null> & {
  pageFlip: () => PageFlip
}

export interface FlipbookPage {
  id: string;
  imageUrl: string;
  date: string;
  caption?: string;
}

interface FlipbookPageProps {
  page: FlipbookPage
  ref?: React.RefObject<HTMLDivElement>
}

interface FlipbookProps {
  style?: object
  className?: string
  width?: number;
  height?: number;
  children?: React.ReactNode
  ref?: React.RefObject<FlipbookRef | null>
}

interface FlipbookGalleryProps {
  style?: object
  className?: string
  width?: number;
  height?: number;
  pages: FlipbookPage[]
}

interface FlipbookDatePickerProps {
  ref: React.RefObject<FlipbookRef | null>
  selectedDate: string
  setSelectedDate: React.Dispatch<SetStateAction<string>>
  pages: FlipbookPage[]
}

function FlipbookPage({ page, ref }: FlipbookPageProps) {
  return (
    <div id={`page-${page.id}`} ref={ref}>
      <Image
        src={page.imageUrl}
        alt={`notebook-page-${page.id}`}
        fill
        sizes='(max-width-600px)'
      />
    </div>
  )
}

function Flipbook({
  className = "",
  style = {},
  width = 600,
  height = 800,
  children,
  ref
}
  : FlipbookProps) {

  return (
    <HTMLFlipBook
      className={className}
      startPage={0}
      showPageCorners={true}
      disableFlipByClick={false}
      style={style}
      width={width}
      height={height}
      size="stretch"
      drawShadow={true}
      minWidth={300}
      maxWidth={1000}
      minHeight={400}
      maxHeight={1200}
      showCover={true}
      flippingTime={1000}
      usePortrait={true}
      startZIndex={0}
      autoSize={true}
      maxShadowOpacity={0.5}
      mobileScrollSupport={true}
      swipeDistance={30}
      clickEventForward={true}
      useMouseEvents={true}
      ref={ref}
    >
      {children}
    </HTMLFlipBook>
  )
}


export default function FlipbookGallery({ className, style, width, height, pages }: FlipbookGalleryProps) {

  const flipbook = useRef<FlipbookRef>(null)

  const [selectedDate, setSelectedDate] = useState<string>("");

  const datePageCache: { [date: string]: number } = {}

  pages.reduce((acc, page, idx) => {
    if (!acc[page.date]) {
      acc[page.date] = idx;
    }
    return acc;
  }, {} as typeof datePageCache);

  function handleDate(e: ChangeEvent<HTMLInputElement>) {
    const sundayDate = getPrevSundayDate(new Date(e.currentTarget.value));
    const sundayStr = sundayDate.toISOString().split("T")[0].replaceAll("/", "-")
    setSelectedDate(sundayStr);
  }

  function goToDate() {
    if (datePageCache[selectedDate]) {
      flipbook.current?.pageFlip().flip(datePageCache[selectedDate])
    } else {
      let nearestNextSun = "";
      let i = 1;
      const selectedSundayTime = new Date(selectedDate).getTime();
      if (!pages.length) { return }
      while (!nearestNextSun.length || i < pages.length - 1) {
        if (!pages[i]) {
          break;
        }
        const currPage = pages[i]
        const pageSundayTime = new Date(currPage.date).getTime();
        if (pageSundayTime > selectedSundayTime) {
          console.log("next date found");
          console.log(currPage);
          nearestNextSun = currPage.date;
          break;
        }
        i++;
      };
      flipbook.current?.pageFlip().flip(i - 1)
    }
  }



  const FlipbookPages = pages.map((page, idx) => {
    return (
      <FlipbookPage
        key={`flipbook-page-${idx}`}
        page={page}
      />
    )
  })

  return (
    <>
      <Flipbook
        className={className}
        style={style}
        width={width}
        height={height}
        ref={flipbook}>
        {FlipbookPages}
      </Flipbook>

      <div className="container flex justify-between my-3">
        <button className="py-2 px-3 transition-all backdrop-blur-md rounded-md bg-gray-500/50 hover:cursor-pointer hover:bg-gray-700/50" onClick={() => {
          flipbook.current?.pageFlip().flipPrev()
        }}>{`<< Prev`}</button>
        <button className="py-2 px-3 transition-all backdrop-blur-md rounded-md bg-gray-500/50 hover:cursor-pointer hover:bg-gray-700/50" onClick={() => {
          flipbook.current?.pageFlip().flipNext()
        }}>{`Next >>`}</button>
      </div>
      <div className="container flex justify-center my-3">
        <div id="flipbook-date-picker"
          className="card flex flex-col items-center">
          <input
            className="mb-4"
            type="date" onChange={handleDate} />
          <button className="py-2 px-3 transition-all backdrop-blur-md rounded-md bg-gray-500/50 hover:cursor-pointer hover:bg-gray-700/50"
            onClick={goToDate}
          >
            Go to Date
          </button>
        </div>
      </div>

    </>
  )
}