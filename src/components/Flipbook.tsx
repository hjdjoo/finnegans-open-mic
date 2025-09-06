'use client';

import HTMLFlipBook from 'react-pageflip';
import Image from 'next/image';
import { useRef } from 'react';
import { type PageFlip } from "page-flip"



type FlipbookRef = React.RefObject<typeof HTMLFlipBook | null> & {
  pageFlip: () => PageFlip
}

interface FlipbookPage {
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
  width = 800,
  height = 600,
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
      size="fixed"
      drawShadow={true}
      minWidth={300}
      maxWidth={1000}
      minHeight={400}
      maxHeight={1200}
      showCover={true}
      flippingTime={1000}
      usePortrait={false}
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
      <button onClick={() => {
        flipbook.current?.pageFlip().flipNext()
      }}>
        Next
      </button>
    </>
  )
}