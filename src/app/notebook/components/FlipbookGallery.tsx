"use client"

import { ChangeEvent, useEffect, useRef, useState } from 'react';
import { getPrevSundayDate } from '@/lib/utils';
import Flipbook, { FlipbookPage, FlipbookRef } from "@/components/Flipbook";

interface FlipbookGalleryProps {
  style?: object
  className?: string
  width?: number
  height?: number
  pages: FlipbookPage[]
  covers: FlipbookPage[]
}

/**
 * 
 * @param {FlipbookGalleryProps}
 * @returns 
 * 
 * Optimized to only render 3 weeks at a time (6 images) plus covers.
 * 
 */
export default function FlipbookGallery({ className, style, width, height, pages, covers }: FlipbookGalleryProps) {

  const flipbook = useRef<FlipbookRef>(null)

  const orientation = useRef<"portrait" | "landscape">("landscape");
  const dateRange = useRef<number[]>([]);

  // idx of RENDERED pages
  const viewingPage = useRef<number>(0);
  const [selectedDate, setSelectedDate] = useState<string>("");

  const [pagesToRender, setPagesToRender] = useState<FlipbookPage[]>([]);

  useEffect(() => {
    setPagesToRender(pages.slice(viewingPage.current, viewingPage.current + 6));
  }, [])

  // cache of *all* page dates and their indices;
  const dateIdxCache: { [date: string]: number } = pages.reduce((acc, page, idx) => {
    if (!acc[page.date]) {
      acc[page.date] = idx;
    }
    return acc;
  }, {} as typeof dateIdxCache);


  function handleDate(e: ChangeEvent<HTMLInputElement>) {
    const sundayDate = getPrevSundayDate(new Date(e.currentTarget.value));
    const sundayStr = sundayDate.toISOString().split("T")[0].replaceAll("/", "-")
    setSelectedDate(sundayStr);
  }



  function goToDate() {
    if (!flipbook) return;

    if (dateIdxCache[selectedDate]) {

      flipbook.current?.pageFlip().flip(dateIdxCache[selectedDate]);

    }

    else {
      let nearestNextSun = "";
      let i = 1; // skip covers
      const selectedSundayTime = new Date(selectedDate).getTime();
      if (!pages.length) { return }

      while (!nearestNextSun.length || i < pages.length - 1) {
        if (!pages[i]) {
          break;
        }
        const currPage = pages[i]
        const pageSundayTime = new Date(currPage.date).getTime();
        if (pageSundayTime > selectedSundayTime) {

          setPagesToRender(pages.slice(i, i + 6));
          nearestNextSun = currPage.date;
          break;
        }
        i++;
      };

      flipbook.current?.pageFlip().flip(i - 1)
    }


  }

  function handleFlip(data: number) {
    console.log(data);
    viewingPage.current = data;

    switch (orientation.current) {
      case "landscape":

        if (data >= pagesToRender.length - 1) {

          const newPagesToRender = []

        }

        break;
      case "portrait":
    }

  }

  function handleOrientation(orientationChange: "portrait" | "landscape") {
    orientation.current = orientationChange;
  }

  // notebook pages only;
  const FlipbookPages = pagesToRender.map((page, idx) => {
    return (
      <FlipbookPage
        key={`flipbook-rendered-page-${idx}`}
        page={page}
      />
    )
  })

  return (
    <>
      <Flipbook
        startPage={viewingPage.current}
        handleOrientation={handleOrientation}
        handleFlip={handleFlip}
        className={className}
        style={style}
        width={width}
        height={height}
        ref={flipbook}>
        <FlipbookPage page={covers[0]} />
        {FlipbookPages}
        <FlipbookPage page={covers[1]} />
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