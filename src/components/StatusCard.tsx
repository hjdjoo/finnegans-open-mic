'use client'

import { CalendarDaysIcon, CheckCircleIcon, XCircleIcon } from '@heroicons/react/24/outline'
import clsx from 'clsx'

interface StatusCardProps {
  status: {
    active: boolean
    next_date: string | null
    message: string
  }
}

export default function StatusCard({ status }: StatusCardProps) {
  const nextSunday = new Date()
  const day = nextSunday.getDay()
  const daysUntilSunday = day === 0 ? 0 : 7 - day
  nextSunday.setDate(nextSunday.getDate() + daysUntilSunday)

  const dateString = nextSunday.toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
  })

  return (
    <div className="max-w-2xl mx-auto">
      <div className={clsx(
        'card relative overflow-hidden transition-all duration-300',
        status.active ? 'border-green-500/30 glow-irish' : 'border-red-500/30'
      )}>
        {/* Background decoration */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-irish-green/5 rounded-full blur-3xl" />

        <div className="relative">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-3">
              <CalendarDaysIcon className="h-8 w-8 text-irish-gold" />
              <h2 className="text-2xl font-bold">Open Mic This Week</h2>
            </div>
            {status.active ? (
              <CheckCircleIcon className="h-8 w-8 text-green-500" />
            ) : (
              <XCircleIcon className="h-8 w-8 text-red-500" />
            )}
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-dark-bg/50 rounded-lg">
              <span className="text-gray-400">Status</span>
              <span className={clsx(
                'font-bold text-lg',
                status.active ? 'text-green-500' : 'text-red-500'
              )}>
                {status.active ? 'ON' : 'OFF'}
              </span>
            </div>

            <div className="flex items-center justify-between p-4 bg-dark-bg/50 rounded-lg">
              <span className="text-gray-400">Date</span>
              <span className="font-medium text-irish-gold">
                {status.next_date || dateString}
              </span>
            </div>

            {status.message && (
              <div className="p-4 bg-irish-green/10 border border-irish-green/30 rounded-lg">
                <p className="text-sm text-gray-300">{status.message}</p>
              </div>
            )}

            <div className="pt-4 space-y-2 text-sm text-gray-400">
              <p className="flex items-center space-x-2">
                <span className="inline-block w-1.5 h-1.5 bg-irish-gold rounded-full"></span>
                <span>Sign-ups start at 7:00 PM</span>
              </p>
              <p className="flex items-center space-x-2">
                <span className="inline-block w-1.5 h-1.5 bg-irish-gold rounded-full"></span>
                <span>Show begins at 7:30 PM</span>
              </p>
              <p className="flex items-center space-x-2">
                <span className="inline-block w-1.5 h-1.5 bg-irish-gold rounded-full"></span>
                <span>All performers welcome!</span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}