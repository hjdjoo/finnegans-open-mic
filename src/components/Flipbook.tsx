'use client';

import HTMLFlipBook from 'react-pageflip';
import Image from 'next/image';
import { useRef } from 'react';
import type { PageFlip } from "page-flip"



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
  pages: FlipbookPage[]
}

function FlipbookPage({ page, ref }: FlipbookPageProps) {
  return (
    <div id={`page-${page.id}`} ref={ref}>
      <Image
        src={page.imageUrl}
        alt={`notebook-page-${page.id}`}
        fill />
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


export default function FlipbookGallery({ pages }: FlipbookGalleryProps) {

  const flipbook = useRef<FlipbookRef>(null)

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
        ref={flipbook}>
        {FlipbookPages}
      </Flipbook>
      <div className="container flex justify-between my-3">
        <button className="py-2 px-3 transition-all bg-gray-500 hover:cursor-pointer hover:bg-gray-700" onClick={() => {
          flipbook.current?.pageFlip().flipPrev()
        }}>{`<< Prev`}</button>
        <button className="py-2 px-3 transition-all bg-gray-500 hover:cursor-pointer hover:bg-gray-700" onClick={() => {
          flipbook.current?.pageFlip().flipNext()
        }}>{`Next >>`}</button>
      </div>
    </>
  )
}