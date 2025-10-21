'use client'

import { CheckCircleIcon, XCircleIcon } from '@heroicons/react/24/outline'
import clsx from 'clsx'
import { formatDateMDY } from '@/lib/utils'

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
    <div className="max-w-full mx-auto py-4 ">
      <div className={clsx(
        'relative overflow-hidden transition-all duration-300'
      )}>
        <div className="relative mx-2 flex items-center">
          <div className="flex grow-1 ml-2 md:ml-0 items-center justify-between">
            <div className="flex items-center space-x-3">
              <h2 className="max-w-32 md:max-w-64 text-sm md:text-lg font-bold">{"Is there open mic this week?"} </h2>
            </div>
          </div>
          <div className="flex grow-2 items-center justify-end">
            <div className="flex-col md:flex ml-1 md:ml-2 my-auto items-start justify-between bg-dark-bg/50 rounded-lg">
              <span className="text-gray-300 text-xs ml-1 md:ml-2 px-1 md:px-2 md:text-lg">{status.active ? "Yes" : "No"}{`, we are`}</span>
              <div className="flex px-1 md:px-2 ">
                <span className={clsx(
                  'font-bold text-xs md:text-lg md:ml-2',
                  status.active ? 'text-green-500' : 'text-red-500'
                )}>
                  {status.active ? 'ON' : 'OFF'}
                </span>
                <span className="ml-1 md:ml-2 text-xs md:text-lg text-gray-300">for</span>
                <span className="text-xs md:text-lg text-irish-gold ml-1 md:ml-2">
                  {status.next_date ? formatDateMDY(status.next_date).replaceAll('-', '/') : dateString}
                </span>
                <span className={clsx(
                  'font-bold text-xs md:text-lg ml-2',
                  status.active ? 'text-green-500' : 'text-red-500'
                )}>
                  {status.active ? (
                    <CheckCircleIcon className="h-4 w-4 md:h-6 md:w-6 text-green-500" />
                  ) : (
                    <XCircleIcon className="h-4 w-4 md:h-6 md:w-6 text-red-500" />
                  )}
                </span>
              </div>
            </div>

          </div>
          {status.message && (
            <div className="flex grow-1 ml-1 md:ml-2 justify-end">
              <div className="bg-irish-green/10 border border-irish-green/30 p-1 rounded-lg">
                <p className="font-bold text-end text-xs md:text-sm text-gray-300">Message: </p>
                <p className="text-xs md:text-sm text-gray-300">{status.message}</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}