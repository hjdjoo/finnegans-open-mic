'use client'

import { useState, useEffect } from 'react'
import clsx from 'clsx'
import Link from 'next/link'

interface WelcomeCardProps {
  title: string
  description: string
}

export default function WelcomeCard({ title, description }: WelcomeCardProps) {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 500)
    return () => clearTimeout(timer)
  }, [])

  return (
    <div id="welcome-card" className="absolute inset-0 flex items-center justify-center">
      <div
        className={clsx(
          'max-w-2xl mx-4 p-8 md:p-12 bg-dark-bg/50 backdrop-blur-md border border-irish-green/30 rounded-2xl text-center transition-all duration-1000 transform',
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
        )}
      >
        <h1 className="text-4xl md:text-6xl font-bold mb-4">
          <span className="text-irish-gold">{title}</span>
        </h1>
        <p className="text-lg md:text-xl text-gray-300 leading-relaxed">
          {description}
        </p>
        <div className="mt-8 flex items-center justify-center space-x-2">
          <span className="inline-block w-12 h-0.5 bg-irish-gold/50"></span>
          <span className="inline-block w-3 h-3 rounded-full bg-irish-gold"></span>
          <span className="inline-block w-12 h-0.5 bg-irish-gold/50"></span>
        </div>
        <div className="flex flex-col items-center pt-4 space-y-2 text-sm text-gray-400">
          <p className="flex items-center space-x-2">
            <span className="inline-block w-1.5 h-1.5 bg-irish-gold rounded-full"></span>
            <span>Sign-up 7:00 PM</span>
          </p>
          <p className="flex items-center space-x-2">
            <span className="inline-block w-1.5 h-1.5 bg-irish-gold rounded-full"></span>
            <span>Musical sets only</span>
          </p>
          <Link href="/about">
            <p className="flex items-center space-x-2">
              <span>Learn More</span>
            </p>
          </Link>
        </div>
      </div>
    </div>
  )
}
