'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline'
import { Transition } from '@headlessui/react'
import clsx from 'clsx'

export interface GallerySlide {
  id: string
  content: React.ReactNode
}

interface GalleryProps {
  slides: GallerySlide[]
  mode?: 'auto' | 'manual' | 'both' // auto = timer, manual = user-controlled, both = timer + user control
  interval?: number // milliseconds for auto mode
  showArrows?: boolean
  showIndicators?: boolean
  pauseOnHover?: boolean
  transitionDuration?: number // milliseconds
  className?: string
  slideClassName?: string
  arrowPosition?: 'inside' | 'outside'
  indicatorPosition?: 'bottom' | 'top'
  aspectRatio?: 'video' | 'square' | 'portrait' | 'auto' // 16:9, 1:1, 3:4, auto
}

export default function Gallery({
  slides,
  mode = 'both',
  interval = 5000,
  showArrows = true,
  showIndicators = true,
  pauseOnHover = true,
  transitionDuration = 500,
  className = '',
  arrowPosition = 'inside',
  indicatorPosition = 'bottom',
  aspectRatio = 'auto'
}: GalleryProps) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isPaused, setIsPaused] = useState(false)
  const [isTransitioning, setIsTransitioning] = useState(false)
  const intervalRef = useRef<NodeJS.Timeout | null>(null)
  const lastManualChangeRef = useRef<number>(0)

  // Calculate aspect ratio classes
  const aspectRatioClasses = {
    video: 'aspect-video',
    square: 'aspect-square',
    portrait: 'aspect-[3/4]',
    auto: ''
  }

  // Go to specific slide
  const goToSlide = useCallback((index: number, isManual: boolean = false) => {
    if (isTransitioning || slides.length <= 1) return
    if (isManual) {
      lastManualChangeRef.current = Date.now()
    }
    setIsTransitioning(true)
    setCurrentIndex(index)
    setTimeout(() => {
      setIsTransitioning(false)
    }, transitionDuration)
  }, [isTransitioning, slides.length, transitionDuration])

  // Go to next slide
  const nextSlide = useCallback((isManual: boolean = false) => {
    const next = (currentIndex + 1) % slides.length
    goToSlide(next, isManual)
  }, [currentIndex, slides.length, goToSlide])

  // Go to previous slide
  const prevSlide = useCallback((isManual: boolean = false) => {
    const prev = currentIndex === 0 ? slides.length - 1 : currentIndex - 1
    goToSlide(prev, isManual)
  }, [currentIndex, slides.length, goToSlide])

  // Auto-advance slides
  useEffect(() => {
    if ((mode === 'auto' || mode === 'both') && !isPaused && slides.length > 1) {
      // Don't auto-advance immediately after manual change
      const timeSinceManualChange = Date.now() - lastManualChangeRef.current
      const delay = timeSinceManualChange < interval ? interval - timeSinceManualChange : interval

      intervalRef.current = setTimeout(() => {
        nextSlide(false)
      }, delay)

      return () => {
        if (intervalRef.current) {
          clearTimeout(intervalRef.current)
        }
      }
    }
  }, [currentIndex, isPaused, mode, interval, slides.length, nextSlide])

  // Keyboard navigation
  useEffect(() => {
    if (mode === 'manual' || mode === 'both') {
      const handleKeyDown = (e: KeyboardEvent) => {
        if (e.key === 'ArrowLeft') {
          prevSlide(true)
        } else if (e.key === 'ArrowRight') {
          nextSlide(true)
        }
      }

      window.addEventListener('keydown', handleKeyDown)
      return () => window.removeEventListener('keydown', handleKeyDown)
    }
  }, [mode, prevSlide, nextSlide])

  // Touch/swipe handling
  const touchStartX = useRef<number | null>(null)
  const touchEndX = useRef<number | null>(null)

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX
  }

  const handleTouchMove = (e: React.TouchEvent) => {
    touchEndX.current = e.touches[0].clientX
  }

  const handleTouchEnd = () => {
    if (!touchStartX.current || !touchEndX.current) return

    const diff = touchStartX.current - touchEndX.current
    const threshold = 50

    if (Math.abs(diff) > threshold) {
      if (diff > 0) {
        nextSlide(true)
      } else {
        prevSlide(true)
      }
    }

    touchStartX.current = null
    touchEndX.current = null
  }

  if (slides.length === 0) return null

  return (
    <div id="gallery"
      className={clsx('relative group h-full w-full', className)}
      onMouseEnter={() => pauseOnHover && setIsPaused(true)}
      onMouseLeave={() => pauseOnHover && setIsPaused(false)}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      {/* Slides Container */}
      <div id="slides" className={clsx(
        'relative overflow-hidden w-full h-full rounded-lg',
        aspectRatioClasses[aspectRatio]
      )}>
        {slides.map((slide, index) => {
          return (
            <Transition
              key={slide.id}
              show={currentIndex === index}
              enter="transition-opacity duration-500"
              enterFrom="opacity-0"
              enterTo="opacity-100"
              leave="transition-opacity duration-500"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              {slide.content}
            </Transition>
          )
        })}
      </div>

      {/* Navigation Arrows */}
      {showArrows && (mode === 'manual' || mode === 'both') && slides.length > 1 && (
        <>
          <button
            onClick={() => prevSlide(true)}
            className={clsx(
              'absolute top-1/2 -translate-y-1/2 p-2 rounded-full bg-white/80 text-gray-800 hover:bg-white shadow-lg transition-all opacity-0 group-hover:opacity-100 focus:opacity-100 focus:outline-none focus:ring-2 focus:ring-blue-500',
              arrowPosition === 'inside' ? 'left-4' : '-left-12',
              'disabled:opacity-50 disabled:cursor-not-allowed'
            )}
            disabled={isTransitioning}
            aria-label="Previous slide"
          >
            <ChevronLeftIcon className="h-6 w-6" />
          </button>
          <button
            onClick={() => nextSlide(true)}
            className={clsx(
              'absolute top-1/2 -translate-y-1/2 p-2 rounded-full bg-white/80 text-gray-800 hover:bg-white shadow-lg transition-all opacity-0 group-hover:opacity-100 focus:opacity-100 focus:outline-none focus:ring-2 focus:ring-blue-500',
              arrowPosition === 'inside' ? 'right-4' : '-right-12',
              'disabled:opacity-50 disabled:cursor-not-allowed'
            )}
            disabled={isTransitioning}
            aria-label="Next slide"
          >
            <ChevronRightIcon className="h-6 w-6" />
          </button>
        </>
      )}

      {/* Indicators */}
      {showIndicators && slides.length > 1 && (
        <div className={clsx(
          'absolute left-1/2 -translate-x-1/2 flex space-x-2 z-10',
          indicatorPosition === 'bottom' ? 'bottom-4' : 'top-4'
        )}>
          {slides.map((_, index) => (
            <button
              key={index}
              onClick={() => goToSlide(index, true)}
              className={clsx(
                'transition-all focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2',
                currentIndex === index
                  ? 'w-8 h-2 bg-white rounded-full'
                  : 'w-2 h-2 bg-white/60 rounded-full hover:bg-white/80'
              )}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      )}

      {/* Progress Bar (for auto mode) */}
      {(mode === 'auto' || mode === 'both') && slides.length > 1 && (
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-black/20">
          <div
            className="h-full bg-white/80 transition-all"
            style={{
              width: `${((currentIndex + 1) / slides.length) * 100}%`,
              transitionDuration: isPaused ? '0ms' : `${interval}ms`,
              transitionTimingFunction: 'linear'
            }}
          />
        </div>
      )}

      {/* Accessibility: Screen reader announcements */}
      <div className="sr-only" aria-live="polite" aria-atomic="true">
        Slide {currentIndex + 1} of {slides.length}
      </div>
    </div>
  )
}